# COLORI — Plan Implementare (Strapi + Next.js)

## Arhitectura
```
Utilizator -> Nginx (80/443)
  |-- / -> Next.js frontend (port 3000)
  +-- /strapi/* -> Strapi API (port 1337)

Strapi -> PostgreSQL (localhost:5432)
Next.js -> Strapi API (REST)
```

---

## PASUL 1: Curatare proiect vechi
- [ ] Oprire PM2 colori
- [ ] Stergere /var/www/colori
- [ ] Creare structura noua

## PASUL 2: Instalare Strapi
- [ ] npx create-strapi-app@latest
- [ ] Config DB (PostgreSQL, DB colori, user colori)
- [ ] Pornire Strapi (port 1337)
- [ ] Creare primul admin

## PASUL 3: Content Types in Strapi
### Category
  - title (text, required)
  - slug (uid, required)
  - description (richtext)
  - image (media, single)
  - parent (relation -> Category)
  - order (integer)

### Product
  - title (text, required)
  - slug (uid, required)
  - description (richtext)
  - price (decimal, required)
  - oldPrice (decimal)
  - stockQuantity (integer, default 0, min 0)
  - images (media, multiple)
  - category (relation -> Category, many-to-many)
  - sku (text, unique)
  - featured (boolean, default false)
  - metaTitle (text)
  - metaDescription (text)

> **Nota stock**: Statusul (`in_stock` / `low_stock` / `out_of_stock`) se calculeaza automat in Strapi lifecycle hook (`beforeFind`) in functie de `stockQuantity`. La plasare comanda, se decrementeaza stock-ul prin custom controller / service (`afterCreate` pe Order).

### OrderItem
  - product (relation -> Product)
  - order (relation -> Order)
  - quantity (integer, required, min 1)
  - unitPrice (decimal, required)  // pret la momentul comenzii
  - titleSnapshot (text)           // denumire produs la momentul comenzii
  - skuSnapshot (text)

### Order
  - orderNumber (text, unique, required)
  - status (enumeration: pending, processing, shipped, delivered, cancelled)
  - items (relation -> OrderItem, 1:N)
  - customerName (text, required)
  - customerEmail (email, required)
  - customerPhone (text, required)
  - customerAddress (text, required)
  - customerCity (text, required)
  - total (decimal, required)
  - user (relation -> User)
  - notes (text)
  - paymentMethod (enumeration: cash, card_offline, transfer)
  - paymentStatus (enumeration: pending, paid, failed, refunded, default pending)

### AppUser (extinde User-ul Strapi)
  - user (relation -> User, 1:1)
  - phone (text)
  - addresses (json)  // array de adrese: [{label, street, city, zip}]
  - favorites (relation -> Product, many-to-many)

### CartItem (pentru useri logati)
  - user (relation -> User)
  - product (relation -> Product)
  - quantity (integer, required, min 1)

## PASUL 4: Permisiuni API + Securitate
- [ ] Products: find, findOne = public
- [ ] Categories: find, findOne = public
- [ ] Orders: create = public (guest checkout), read = owner
- [ ] Upload: find, findOne = public (pentru imagini)
- [ ] Rate limiting pe `/api/orders` (Strapi middleware custom sau Nginx `limit_req`) — anti-spam comenzi false
- [ ] Validare email + telefon la checkout (regex + verificare format)
- [ ] ReCaptcha v3 pe formularul de checkout (optional dar recomandat)

## PASUL 5: Next.js Frontend
- [ ] create-next-app in /var/www/colori
- [ ] Tailwind + culoare #5e000e
- [ ] Config `next/image` cu domeniul Strapi (`images.domains` sau `remotePatterns`)
- [ ] Layout (Header + Footer + cos + search bar)
- [ ] Pagina Home (hero + categorii + produse recomandate)
- [ ] Pagina /category/[slug]
- [ ] Pagina /product/[slug] (SEO dinamic: `title`, `metaDescription`, Open Graph, JSON-LD Product)
- [ ] Pagina /search?q= (cautare globala produse: filtreaza dupa titlu, categorie, descriere)
- [ ] Component `ProductCard` cu badge-uri (reducere, stock, featured)
- [ ] Sitemap (`next-sitemap`) pentru produse si categorii

## PASUL 6: Cos + Checkout (Atomic)

### Stocare cos
- **Guest**: `localStorage` (array de `{productId, quantity, titleSnapshot, priceSnapshot}`)
- **User logat**: `CartItem` in DB Strapi + `localStorage` ca cache offline
- **Sync**: la login, merge `localStorage` in DB; la logout, clear `localStorage`

### Server Actions (Next.js)
- [ ] `addToCart`, `removeFromCart`, `updateQuantity`, `getCart`, `clearCart`
- [ ] `validateCartStock`: query Strapi pentru `stockQuantity` curent si respinge/update cantitati depasite

### Pagini
- [ ] `/cart` — afisare cos, edit cantitati, calcul total, validare stock live
- [ ] `/checkout` — formular date client (pre-umplut din `AppUser` daca e logat), alegere adresa salvata, sumar comanda
- [ ] `/order-confirmation?order=[orderNumber]` — confirmare dupa plasare

### Plasare comanda (Atomic Transaction)
> **NU facem 2-3 requesturi separate** (POST Order + POST OrderItems + PATCH stock). Asta poate duce la comenzi incomplete daca pica un pas.

**Solutie**: Custom controller in Strapi (`src/api/order/controllers/order.ts`) — endpoint `POST /api/order/place`

Payload primit de la frontend (intr-un singur POST):
```json
{
  "customerName", "customerEmail", "customerPhone",
  "customerAddress", "customerCity", "paymentMethod",
  "items": [{ "productId", "quantity", "unitPrice" }]
}
```

Flow atomic in Strapi (`strapi.db.transaction`):
1. **Lock & validate stock**: pentru fiecare produs, verifica `stockQuantity >= quantity`. Daca nu e suficient → eroare 400, **zero date salvate**.
2. **Genereaza orderNumber** (ex: `COL-20250624-XXXX`).
3. **Creeaza Order** in tranzactie.
4. **Creeaza OrderItems** in tranzactie (cu `titleSnapshot`, `skuSnapshot` din Product la momentul comenzii).
5. **Decrementeaza stockQuantity** la fiecare Product in tranzactie.
6. **Daca user logat**: sterge `CartItem`-urile userului in aceeasi tranzactie.
7. **Commit**. Daca pica orice pas de mai sus → **rollback automat**, baza de date ramane neschimbata.

Frontend primeste `201` cu `orderNumber` si redirecteaza la `/order-confirmation`.

### Plata
- [ ] Momentan doar **la livrare** (`cash`, `transfer`).
- [ ] Daca vrei plata online cu card, adauga **PAS 10 — Integrare Stripe / EuPlatesc** (gateway redirection dupa pasul 6, inainte de confirmare).

## PASUL 7: Autentificare
- [ ] /account/login (Strapi JWT)
- [ ] /account/register (Strapi register + creare `AppUser` asociat cu telefon/adresa)
- [ ] /account (dashboard + date personale + adrese + istoric comenzi)
- [ ] Middleware protectie rute (redirect daca nu e logat pe /account)
- [ ] Cos persistent pentru useri logati (salvare in DB `CartItem` per user, nu doar localStorage)

## PASUL 8: i18n (romana + italiana)
- [ ] Strapi i18n plugin
- [ ] Next.js i18n routing
- [ ] Traduceri pagini

## PASUL 9: Deploy + DevOps
- [ ] Nginx reverse proxy (Next.js + Strapi)
- [ ] PM2 pentru ambele aplicatii
- [ ] SSL (cand e gata DNS) via Certbot
- [ ] Script backup automat PostgreSQL (pg_dump zilnic in `/var/backups/colori/`)
- [ ] Log rotation (PM2 + Nginx)
- [ ] Testare finala (flow complet: cautare -> produs -> cos -> checkout -> confirmare)

---

## Comenzi utile
```bash
# Restart Strapi
pm2 restart strapi-colori

# Restart Next.js
pm2 restart colori

# Loguri
pm2 logs

# DB PostgreSQL
sudo -u postgres psql -d colori
```

## Config DB
> **ATENTIE**: Parola si credentialele NU se tin in fisiere tracked (Git). Se pun exclusiv in `.env` pe server.

Variabile necesare in `.env` (Strapi si Next.js):
```
DATABASE_NAME=colori
DATABASE_USERNAME=colori
DATABASE_PASSWORD=<parola_puternica_generata>
DATABASE_HOST=localhost
DATABASE_PORT=5432

STRAPI_URL=http://localhost:1337
NEXT_PUBLIC_STRAPI_URL=https://colori.md/strapi
JWT_SECRET=<random_secret>
ADMIN_JWT_SECRET=<random_secret>
```

## Porturi
- Next.js: 3000
- Strapi: 1337
