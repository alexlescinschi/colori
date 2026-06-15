import urllib.request, json, http.cookiejar

# Login and get proper session
login_data = json.dumps({"email": "alex.lescinschi@gmail.com", "password": "Mariuta1"}).encode()

# Use cookie jar for proper session handling
cj = http.cookiejar.CookieJar()
opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj))

# Login
req = urllib.request.Request(
    "http://127.0.0.1:1337/admin/login",
    data=login_data,
    headers={"Content-Type": "application/json"}
)
resp = opener.open(req)
login_json = json.loads(resp.read())
print("Logged in as:", login_json["data"]["user"]["email"])

# Now make the content-manager API request with proper Accept header
cm_url = "http://127.0.0.1:1337/admin/content-manager/collection-types/api::product.product?page=1&pageSize=10"
cm_req = urllib.request.Request(
    cm_url,
    headers={
        "Accept": "application/json",
        "X-Requested-With": "XMLHttpRequest"
    }
)
cm_resp = opener.open(cm_req)

body = cm_resp.read()
print(f"\nContent-Manager Status: {cm_resp.status}")
print(f"Content-Type: {cm_resp.headers.get('Content-Type', '?')}")

try:
    data = json.loads(body)
    if "results" in data:
        print(f"Products: {len(data['results'])}")
        for p in data["results"]:
            print(f"  ID={p['id']} {p['title'][:30]} [locale={p.get('locale','?')}] published={p.get('publishedAt','?')[:10] if p.get('publishedAt') else 'null'}")
    elif "data" in data:
        print("Keys:", list(data.keys()))
        items = data["data"]
        if isinstance(items, list):
            print(f"Products: {len(items)}")
            for p in items[:3]:
                print(f"  - {p.get('title', '?')}")
        else:
            print("Data type:", type(items))
    elif "error" in data:
        print(f"Error: {data['error']}")
    else:
        print("Response:", str(data)[:500])
except json.JSONDecodeError:
    print("Not JSON, first 100 chars:", body[:100].decode())
except Exception as e:
    print(f"Parse error: {e}")
