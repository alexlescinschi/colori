import urllib.request, json

# Login
req = urllib.request.Request(
    "http://127.0.0.1:1337/admin/login",
    data=b'{"email":"alex.lescinschi@gmail.com","password":"Mariuta1"}',
    headers={"Content-Type": "application/json"}
)
resp = urllib.request.urlopen(req)
token = json.loads(resp.read())["data"]["token"]

# Test EN
req = urllib.request.Request(
    "http://127.0.0.1:1337/content-manager/collection-types/api::product.product?locale=en&page=1&pageSize=3",
    headers={"Authorization": f"Bearer {token}"}
)
resp = urllib.request.urlopen(req)
data = json.loads(resp.read())
r = data.get("results", [])
print(f"EN: {len(r)} products")
for p in r:
    print(f"  - {p['title']}")

# Test IT
req = urllib.request.Request(
    "http://127.0.0.1:1337/content-manager/collection-types/api::product.product?locale=it&page=1&pageSize=3",
    headers={"Authorization": f"Bearer {token}"}
)
resp = urllib.request.urlopen(req)
data = json.loads(resp.read())
r = data.get("results", [])
print(f"\nIT: {len(r)} products")
for p in r:
    print(f"  - {p['title']}")
