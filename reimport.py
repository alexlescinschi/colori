import urllib.request, json

BASE = "http://127.0.0.1:1337"

def api(method, path, token, data=None):
    url = f"{BASE}{path}"
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    body = json.dumps(data).encode() if data else None
    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    resp = urllib.request.urlopen(req)
    return json.loads(resp.read())

# Login
login = api("POST", "/admin/login", None, {"email": "alex.lescinschi@gmail.com", "password": "Mariuta1"})
token = login["data"]["token"]

# Delete all existing products
existing = api("GET", "/content-manager/collection-types/api::product.product?page=1&pageSize=100", token)
for p in existing["results"]:
    api("DELETE", f"/content-manager/collection-types/api::product.product/{p['documentId']}", token)
    print(f"Deleting: {p['id']}")

# Create categories (if needed)
cats = [
    {"title": "Manichiură", "slug": "manichiura"},
    {"title": "Pedichiură", "slug": "pedichiura"},
    {"title": "Geluri & Lacuri", "slug": "geluri-lacuri"},
    {"title": "Instrumente", "slug": "instrumente"},
    {"title": "Decorațiuni & Nail Art", "slug": "decoratiuni-nail-art"},
    {"title": "Îngrijire & Tratamente", "slug": "ingrijire-tratamente"},
    {"title": "Fara categorie", "slug": "fara-categorie"},
]

cat_ids = {}
existing_cats = api("GET", "/content-manager/collection-types/api::category.category?page=1&pageSize=20", token)
for c in existing_cats["results"]:
    cat_ids[c["title"]] = c["id"]

for cat in cats:
    if cat["title"] not in cat_ids:
        r = api("POST", "/content-manager/collection-types/api::category.category", token, cat)
        cat_ids[cat["title"]] = r["data"]["id"]

print(f"\nCategories: {len(cat_ids)}")

# Products EN + IT
products = [
    ("Gel UV Color Roșu Pasiune 15ml", "Gel UV Color Rosso Passione 15ml", 180, 25, "Geluri & Lacuri", True),
    ("Gel UV Color Nude Elegance 15ml", "Gel UV Color Nude Eleganza 15ml", 180, 30, "Geluri & Lacuri", True),
    ("Top Coat Strălucitor 15ml", "Top Coat Brillante 15ml", 150, 50, "Geluri & Lacuri", True),
    ("Base Coat Rubber 15ml", "Base Coat Rubber 15ml", 160, 45, "Geluri & Lacuri", False),
    ("Lampă UV/LED 48W Pro", "Lampada UV/LED 48W Pro", 850, 12, "Instrumente", True),
    ("Lampă UV/LED 36W Standard", "Lampada UV/LED 36W Standard", 550, 18, "Instrumente", False),
    ("Set Capete Freză (10 buc)", "Set Punte Fresa (10 pz)", 220, 35, "Instrumente", False),
    ("Cleaner Profesional 250ml", "Cleaner Professionale 250ml", 65, 60, "Îngrijire & Tratamente", False),
    ("Acetonă Pură 500ml", "Acetone Pura 500ml", 75, 55, "Îngrijire & Tratamente", False),
    ("Tipsuri Almond 240 buc", "Tips Almond 240 pz", 120, 40, "Decorațiuni & Nail Art", False),
    ("Tipsuri Coffin 240 buc", "Tips Coffin 240 pz", 120, 38, "Decorațiuni & Nail Art", False),
    ("Gel Constructor Clear 30ml", "Gel Costruttore Clear 30ml", 250, 28, "Geluri & Lacuri", True),
    ("Pilă Profesională 100/180", "Lima Professionale 100/180", 35, 200, "Instrumente", False),
    ("Set Pile Buffer (5 buc)", "Set Lime Buffer (5 pz)", 80, 80, "Instrumente", False),
    ("Freză Electrică 35000 RPM", "Fresa Elettrica 35000 RPM", 1450, 8, "Instrumente", True),
    ("Gel Constructor Cover Pink 30ml", "Gel Costruttore Cover Pink 30ml", 270, 22, "Geluri & Lacuri", False),
    ("Glitter Holografic 10g", "Glitter Olografico 10g", 45, 90, "Decorațiuni & Nail Art", False),
    ("Foiță Transfer Aurie", "Foglia Transfer Oro", 25, 150, "Decorațiuni & Nail Art", False),
    ("Stickere Nail Art (10 coli)", "Adesivi Nail Art (10 fogli)", 55, 70, "Decorațiuni & Nail Art", False),
    ("Set Pensule Nail Art (5 buc)", "Set Pennelli Nail Art (5 pz)", 180, 32, "Decorațiuni & Nail Art", True),
    ("Cremă Cuticule Hidratantă 50ml", "Crema Cuticole Idratante 50ml", 95, 65, "Îngrijire & Tratamente", False),
    ("Ulei Cuticule Cu Vitamina E 15ml", "Olio Cuticole Con Vitamina E 15ml", 70, 85, "Îngrijire & Tratamente", False),
]

en_count = 0
it_count = 0

for ro_title, it_title, price, stock, cat, featured in products:
    cat_id = cat_ids.get(cat)
    
    # Create EN version
    r = api("POST", "/content-manager/collection-types/api::product.product", token, {
        "title": ro_title, "price": price, "stockQuantity": stock,
        "featured": featured, "category": cat_id
    })
    en_id = r["data"]["documentId"]
    en_count += 1
    
    # Create IT version (separate entry, NOT linked via document_id)
    r = api("POST", "/content-manager/collection-types/api::product.product?locale=it", token, {
        "title": it_title, "price": price, "stockQuantity": stock,
        "featured": featured, "category": cat_id
    })
    it_count += 1
    print(f"  [{en_count}/{it_count}] {ro_title[:25]} | {it_title[:25]}")

print(f"\nDONE: {en_count} EN, {it_count} IT products")
