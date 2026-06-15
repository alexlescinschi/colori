import urllib.request, json

BASE = "http://127.0.0.1:1337"

def api(method, path, token, data=None):
    url = f"{BASE}{path}"
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    body = json.dumps(data).encode() if data else None
    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    resp = urllib.request.urlopen(req)
    return json.loads(resp.read())

login = api("POST", "/admin/login", None, {"email": "alex.lescinschi@gmail.com", "password": "Mariuta1"})
token = login["data"]["token"]

it_titles = {
    "Gel UV Color Roșu Pasiune 15ml": "Gel UV Color Rosso Passione 15ml",
    "Gel UV Color Nude Elegance 15ml": "Gel UV Color Nude Eleganza 15ml",
    "Top Coat Strălucitor 15ml": "Top Coat Brillante 15ml",
    "Base Coat Rubber 15ml": "Base Coat Rubber 15ml",
    "Lampă UV/LED 48W Pro": "Lampada UV/LED 48W Pro",
    "Lampă UV/LED 36W Standard": "Lampada UV/LED 36W Standard",
    "Set Capete Freză (10 buc)": "Set Punte Fresa (10 pz)",
    "Cleaner Profesional 250ml": "Cleaner Professionale 250ml",
    "Acetonă Pură 500ml": "Acetone Pura 500ml",
    "Tipsuri Almond 240 buc": "Tips Almond 240 pz",
    "Tipsuri Coffin 240 buc": "Tips Coffin 240 pz",
    "Gel Constructor Clear 30ml": "Gel Costruttore Clear 30ml",
    "Pilă Profesională 100/180": "Lima Professionale 100/180",
    "Set Pile Buffer (5 buc)": "Set Lime Buffer (5 pz)",
    "Freză Electrică 35000 RPM": "Fresa Elettrica 35000 RPM",
    "Gel Constructor Cover Pink 30ml": "Gel Costruttore Cover Pink 30ml",
    "Glitter Holografic 10g": "Glitter Olografico 10g",
    "Foiță Transfer Aurie": "Foglia Transfer Oro",
    "Stickere Nail Art (10 coli)": "Adesivi Nail Art (10 fogli)",
    "Set Pensule Nail Art (5 buc)": "Set Pennelli Nail Art (5 pz)",
    "Cremă Cuticule Hidratantă 50ml": "Crema Cuticole Idratante 50ml",
    "Ulei Cuticule Cu Vitamina E 15ml": "Olio Cuticole Con Vitamina E 15ml",
}

# Get all EN products
r = api("GET", "/content-manager/collection-types/api::product.product?page=1&pageSize=100&locale=en", token)
products = r["results"]
print(f"Found {len(products)} EN products")

count = 0
for p in products:
    ro_title = p["title"]
    it_title = it_titles.get(ro_title)
    if not it_title:
        continue
    
    doc_id = p["documentId"]
    
    # Create IT version linked to EN via the same document ID
    data = {
        "title": it_title,
        "price": p["price"],
        "stockQuantity": p["stockQuantity"],
        "featured": p.get("featured", False),
        "category": p.get("category", {}).get("id") if p.get("category") else None,
        "documentId": doc_id,  # KEY: same document ID for localization
        "locale": "it"
    }
    
    try:
        r2 = api("POST", "/content-manager/collection-types/api::product.product", token, data)
        count += 1
        print(f"  OK [{count}]: {it_title[:30]}")
    except Exception as e:
        err = str(e)[:80]
        print(f"  FAIL: {it_title[:30]} - {err}")

print(f"\nCreated {count} IT translations")
