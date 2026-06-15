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

# Get ALL products
r = api("GET", "/content-manager/collection-types/api::product.product?page=1&pageSize=100", token)
products = r["results"]
print(f"Found {len(products)} products")

# Publish each product
for p in products:
    doc_id = p["documentId"]
    # Publish via content-manager
    api("PUT", f"/content-manager/collection-types/api::product.product/{doc_id}", token, {
        "title": p["title"],
        "price": p["price"],
        "stockQuantity": p["stockQuantity"],
        "featured": p.get("featured", False),
        "category": p.get("category", {}).get("id") if p.get("category") else None,
        "publishedAt": p["publishedAt"] or "2026-06-15T16:00:00.000Z"
    })
    locale = p.get("locale", "en")
    print(f"  Published [{locale}]: {p['title'][:30]}")

# Publish categories too
cats = api("GET", "/content-manager/collection-types/api::category.category?page=1&pageSize=20", token)
for c in cats["results"]:
    api("PUT", f"/content-manager/collection-types/api::category.category/{c['documentId']}", token, {
        "title": c["title"],
        "publishedAt": "2026-06-15T16:00:00.000Z"
    })
    print(f"  Published cat: {c['title']}")

print("\nDONE - All published!")
