import urllib.request, json

req = urllib.request.Request(
    "http://127.0.0.1:1337/admin/login",
    data=b'{"email":"alex.lescinschi@gmail.com","password":"Mariuta1"}',
    headers={"Content-Type": "application/json"}
)
resp = urllib.request.urlopen(req)
token = json.loads(resp.read())["data"]["token"]

# Try different filters
tests = [
    "/content-manager/collection-types/api::product.product",
    "/content-manager/collection-types/api::product.product?_q=Gel",
    "/content-manager/collection-types/api::product.product?filters[$and][0][title][$notNulli]=true",
    "/content-manager/collection-types/api::product.product?publicationState=preview",
]

for url in tests:
    req = urllib.request.Request(
        f"http://127.0.0.1:1337{url}",
        headers={"Authorization": f"Bearer {token}"}
    )
    resp = urllib.request.urlopen(req)
    raw = resp.read().decode()
    total = json.loads(raw).get("pagination", {}).get("total", "?")
    print(f"{url}: total={total}")
