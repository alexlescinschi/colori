import urllib.request, json, http.cookiejar

# Login
login_data = json.dumps({"email": "alex.lescinschi@gmail.com", "password": "Mariuta1"}).encode()
req = urllib.request.Request(
    "http://127.0.0.1:1337/admin/login",
    data=login_data,
    headers={"Content-Type": "application/json"}
)
resp = urllib.request.urlopen(req)
login_json = json.loads(resp.read())
print("Login: OK")

# Extract the refresh cookie value
cookie_header = resp.headers.get("Set-Cookie", "")
for line in resp.headers.get_all("Set-Cookie") if hasattr(resp.headers, "get_all") else []:
    if "strapi_admin_refresh=" in line:
        print("Cookie found, length:", len(line))
        
# Build a proper cookie
cj = http.cookiejar.CookieJar()
opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj))

# Login again to get cookies in the jar
req2 = urllib.request.Request(
    "http://127.0.0.1:1337/admin/login",
    data=login_data,
    headers={"Content-Type": "application/json"}
)
resp2 = opener.open(req2)
print("Login2: OK")

# Now make the content-manager request with cookies
cm_url = "http://127.0.0.1:1337/admin/content-manager/collection-types/api::product.product?page=1&pageSize=5"
cm_req = urllib.request.Request(cm_url)
cm_resp = opener.open(cm_req)

# Read response
body = cm_resp.read()
print(f"Content-Manager Status: {cm_resp.status}")
print(f"Content-Type: {cm_resp.headers.get('Content-Type', '?')}")

try:
    data = json.loads(body)
    print("JSON keys:", list(data.keys()))
    if "results" in data:
        print(f"Products: {len(data['results'])}")
        for p in data['results'][:3]:
            print(f"  - {p['title']}")
    elif "data" in data and isinstance(data["data"], list):
        print(f"Products: {len(data['data'])}")
    else:
        print("Unknown format:", str(data)[:300])
except:
    print("Not JSON, first 200 chars:", body[:200].decode())
