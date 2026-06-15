import sqlite3, uuid, datetime

db = sqlite3.connect("/tmp/strapi-db.db")
c = db.cursor()

c.execute("UPDATE products SET locale='en' WHERE locale IS NULL OR locale=''")
c.execute("UPDATE categories SET locale='en' WHERE locale IS NULL OR locale=''")
print("Locale set to en")

now = datetime.datetime.utcnow().isoformat() + "Z"

def tr(t):
    m = {
        "Rosu Pasiune": "Rosso Passione", "Stralucitor": "Brillante",
        "Acetona Pura": "Acetone Pura", "Profesional": "Professionale",
        "Crema Cuticule Hidratanta": "Crema Cuticole Idratante",
        "Ulei Cuticule Cu Vitamina E": "Olio Cuticole Con Vitamina E",
        "Freza Electrica": "Fresa Elettrica", "Lampa UV/LED": "Lampada UV/LED",
        "Foita Transfer Aurie": "Foglia Transfer Oro",
        "Glitter Holografic": "Glitter Olografico", "Pila": "Lima",
        "Pensule": "Pennelli", "Stickere": "Stickers",
        "Gel Constructor": "Gel Costruttore"
    }
    for ro, it in m.items(): t = t.replace(ro, it)
    return t

for p in c.execute("SELECT id, title, slug, price, stock_quantity, category_id FROM products WHERE locale='en'").fetchall():
    pid, title, slug, price, stock, cat_id = p
    it_slug = slug + "-it"
    if c.execute("SELECT id FROM products WHERE slug=? AND locale='it'", (it_slug,)).fetchone():
        continue
    doc = str(uuid.uuid4()).replace("-", "")[:16]
    c.execute("INSERT INTO products (title, slug, price, stock_quantity, featured, document_id, created_at, updated_at, published_at, locale, category_id) VALUES (?, ?, ?, ?, 0, ?, ?, ?, ?, 'it', ?)",
              (tr(title), it_slug, price, stock, doc, now, now, now, cat_id))

for cat in c.execute("SELECT id, title, slug FROM categories WHERE locale='en'").fetchall():
    cid, ct, cs = cat
    it_slug = cs + "-it"
    if c.execute("SELECT id FROM categories WHERE slug=? AND locale='it'", (it_slug,)).fetchone():
        continue
    it_t = ct
    for ro, it2 in {"Manichiura": "Manicure", "Pedichiura": "Pedicure", "Geluri & Lacuri": "Gel & Lacche", "Instrumente": "Strumenti", "Decoratiuni & Nail Art": "Decorazioni & Nail Art", "Ingrijire & Tratamente": "Cura & Trattamenti"}.items():
        it_t = it_t.replace(ro, it2)
    doc = str(uuid.uuid4()).replace("-", "")[:16]
    c.execute("INSERT INTO categories (title, slug, document_id, created_at, updated_at, published_at, locale) VALUES (?, ?, ?, ?, ?, ?, 'it')",
              (it_t, it_slug, doc, now, now, now))

db.commit()
pc = c.execute("SELECT COUNT(*) FROM products WHERE locale='it'").fetchone()[0]
cc = c.execute("SELECT COUNT(*) FROM categories WHERE locale='it'").fetchone()[0]
print("DONE: {} products IT, {} categories IT".format(pc, cc))
db.close()
