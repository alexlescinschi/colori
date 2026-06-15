import urllib.request, json, time

BASE = "http://127.0.0.1:1337"

def api(method, path, token, data=None):
    url = f"{BASE}{path}"
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    body = json.dumps(data).encode() if data else None
    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    resp = urllib.request.urlopen(req)
    return json.loads(resp.read())

# Get token
login = api("POST", "/admin/login", None, {"email": "alex.lescinschi@gmail.com", "password": "Mariuta1"})
token = login["data"]["token"]
print("Logged in:", token[:20])

# 1. Add Italian locale
try:
    api("POST", "/i18n/locales", token, {"name": "Italian (it)", "code": "it"})
    print("Added Italian locale")
except Exception as e:
    print("Locale may already exist:", e)

# 2. Create categories
cats_ro = ["Manichiură", "Pedichiură", "Geluri & Lacuri", "Instrumente", "Decorațiuni & Nail Art", "Îngrijire & Tratamente", "Fara categorie"]
cats_it = ["Manicure", "Pedicure", "Gel & Smalti", "Strumenti", "Decorazioni & Nail Art", "Cura & Trattamenti", "Senza categoria"]
cats_it_slug = ["manichiura", "pedichiura", "geluri-lacuri", "instrumente", "decoratiuni-nail-art", "ingrijire-tratamente", "fara-categorie"]

cat_ids = {}
for i, name in enumerate(cats_ro):
    r = api("POST", "/content-manager/collection-types/api::category.category", token, {"title": name, "slug": cats_it_slug[i]})
    cat_ids[name] = r["data"]["id"]
    print(f"Cat RO: {name} (id={cat_ids[name]})")

# 3. Create products
products = [
    ("Gel UV Color Roșu Pasiune 15ml", "Gel UV Color Rosso Passione 15ml", 180, 25, "geluri-lacuri", True),
    ("Gel UV Color Nude Elegance 15ml", "Gel UV Color Nude Eleganza 15ml", 180, 30, "geluri-lacuri", True),
    ("Top Coat Strălucitor 15ml", "Top Coat Brillante 15ml", 150, 50, "geluri-lacuri", True),
    ("Base Coat Rubber 15ml", "Base Coat Rubber 15ml", 160, 45, "geluri-lacuri", False),
    ("Lampă UV/LED 48W Pro", "Lampada UV/LED 48W Pro", 850, 12, "instrumente", True),
    ("Lampă UV/LED 36W Standard", "Lampada UV/LED 36W Standard", 550, 18, "instrumente", False),
    ("Set Capete Freză (10 buc)", "Set Punte Fresa (10 pz)", 220, 35, "instrumente", False),
    ("Cleaner Profesional 250ml", "Cleaner Professionale 250ml", 65, 60, "ingrijire-tratamente", False),
    ("Acetonă Pură 500ml", "Acetone Pura 500ml", 75, 55, "ingrijire-tratamente", False),
    ("Tipsuri Almond 240 buc", "Tips Almond 240 pz", 120, 40, "decoratiuni-nail-art", False),
    ("Tipsuri Coffin 240 buc", "Tips Coffin 240 pz", 120, 38, "decoratiuni-nail-art", False),
    ("Gel Constructor Clear 30ml", "Gel Costruttore Clear 30ml", 250, 28, "geluri-lacuri", True),
    ("Pilă Profesională 100/180", "Lima Professionale 100/180", 35, 200, "instrumente", False),
    ("Set Pile Buffer (5 buc)", "Set Lime Buffer (5 pz)", 80, 80, "instrumente", False),
    ("Freză Electrică 35000 RPM", "Fresa Elettrica 35000 RPM", 1450, 8, "instrumente", True),
    ("Gel Constructor Cover Pink 30ml", "Gel Costruttore Cover Pink 30ml", 270, 22, "geluri-lacuri", False),
    ("Glitter Holografic 10g", "Glitter Olografico 10g", 45, 90, "decoratiuni-nail-art", False),
    ("Foiță Transfer Aurie", "Foglia Transfer Oro", 25, 150, "decoratiuni-nail-art", False),
    ("Stickere Nail Art (10 coli)", "Adesivi Nail Art (10 fogli)", 55, 70, "decoratiuni-nail-art", False),
    ("Set Pensule Nail Art (5 buc)", "Set Pennelli Nail Art (5 pz)", 180, 32, "decoratiuni-nail-art", True),
    ("Cremă Cuticule Hidratantă 50ml", "Crema Cuticole Idratante 50ml", 95, 65, "ingrijire-tratamente", False),
    ("Ulei Cuticule Cu Vitamina E 15ml", "Olio Cuticole Con Vitamina E 15ml", 70, 85, "ingrijire-tratamente", False),
]

# Map category name to ID
cat_slug_to_name = {cats_it_slug[i]: cats_ro[i] for i in range(len(cats_ro))}

for ro_title, it_title, price, stock, cat_slug, featured in products:
    cat_name = cat_slug_to_name.get(cat_slug)
    cat_id = cat_ids.get(cat_name)
    data = {
        "title": ro_title, "price": price, "stockQuantity": stock,
        "featured": featured, "category": cat_id
    }
    r = api("POST", "/content-manager/collection-types/api::product.product", token, data)
    prod_id = r["data"]["id"]
    doc_id = r["data"]["documentId"]
    print(f"  RO: {ro_title[:30]} (id={prod_id})")

    # Now create IT translation linked to same document_id
    it_data = {
        "title": it_title, "price": price, "stockQuantity": stock,
        "featured": featured, "category": cat_id, "locale": "it"
    }
    try:
        it_r = api("PUT", f"/content-manager/collection-types/api::product.product/{doc_id}?locale=it", token, it_data)
        print(f"    IT: {it_title[:30]}")
    except Exception as e:
        print(f"    IT FAILED: {e}")

print("\nDONE!")
