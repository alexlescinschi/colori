import urllib.request, json

# Login
req = urllib.request.Request(
    "http://127.0.0.1:1337/admin/login",
    data=b'{"email":"alex.lescinschi@gmail.com","password":"Mariuta1"}',
    headers={"Content-Type": "application/json"}
)
resp = urllib.request.urlopen(req)
token = json.loads(resp.read())["data"]["token"]

# Try with page=1, pageSize=100, no filter
for url in [
    "/content-manager/collection-types/api::product.product?page=1&pageSize=100",
    "/content-manager/collection-types/api::product.product?page=1&pageSize=100&locale=en",
    "/content-manager/init",
    "/content-manager/content-types/api::product.product/configuration",
]:
    req = urllib.request.Request(
        f"http://127.0.0.1:1337{url}",
        headers={"Authorization": f"Bearer {token}"}
    )
    try:
        resp = urllib.request.urlopen(req)
        raw = resp.read().decode()
        print(f"\n{url}:")
        print(raw[:300])
    except Exception as e:
        print(f"\n{url}: ERROR {e}")
