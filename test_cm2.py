import urllib.request, json

# Login
req = urllib.request.Request(
    "http://127.0.0.1:1337/admin/login",
    data=b'{"email":"alex.lescinschi@gmail.com","password":"Mariuta1"}',
    headers={"Content-Type": "application/json"}
)
resp = urllib.request.urlopen(req)
token = json.loads(resp.read())["data"]["token"]

# Test WITHOUT locale
req = urllib.request.Request(
    "http://127.0.0.1:1337/content-manager/collection-types/api::product.product?page=1&pageSize=3",
    headers={"Authorization": f"Bearer {token}"}
)
resp = urllib.request.urlopen(req)
raw = resp.read()
print(f"Status: {resp.status}")
print(f"Content-Type: {resp.headers.get('Content-Type', '?')}")
print(f"First 500 chars:")
print(raw[:500].decode())
