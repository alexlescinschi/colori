import urllib.request, json

req = urllib.request.Request(
    "http://127.0.0.1:1337/admin/login",
    data=b'{"email":"alex.lescinschi@gmail.com","password":"Mariuta1"}',
    headers={"Content-Type": "application/json"}
)
resp = urllib.request.urlopen(req)
token = json.loads(resp.read())["data"]["token"]

# List ALL products without locale filter
req = urllib.request.Request(
    "http://127.0.0.1:1337/content-manager/collection-types/api::product.product?page=1&pageSize=10&sort=id:ASC",
    headers={"Authorization": f"Bearer {token}"}
)
resp = urllib.request.urlopen(req)
raw = resp.read().decode()
print("ALL products:", raw[:500])

# Also check the configuration
req = urllib.request.Request(
    "http://127.0.0.1:1337/content-manager/content-types/api::product.product/configuration",
    headers={"Authorization": f"Bearer {token}"}
)
resp = urllib.request.urlopen(req)
cfg = json.loads(resp.read())
print("\n\nConfiguration i18n:", json.dumps(cfg.get("data", {}).get("contentType", {}).get("settings", {}).get("i18n", {})))
