import urllib.request, json

# Step 1: Login to get session cookie
login_data = json.dumps({"email": "alex.lescinschi@gmail.com", "password": "Mariuta1"}).encode()

req = urllib.request.Request(
    "http://127.0.0.1:1337/admin/login",
    data=login_data,
    headers={"Content-Type": "application/json"}
)

resp = urllib.request.urlopen(req)
login_json = json.loads(resp.read())
token = login_json["data"]["token"]
print("Token obtained:", token[:20])

# Step 2: Get the session cookie from login response
cookies = resp.headers.get_all("Set-Cookie") if hasattr(resp.headers, "get_all") else [resp.headers.get("Set-Cookie", "")]
print("Cookies:", cookies)

# Step 3: Call content-manager API with the token
cm_url = "http://127.0.0.1:1337/admin/content-manager/collection-types/api::product.product?page=1&pageSize=5"

try:
    # Use session cookie instead of Bearer token
    cookie_str = "; ".join([c.split(";")[0] for c in cookies if c])
    
    cm_req = urllib.request.Request(
        cm_url,
        headers={"Cookie": cookie_str}
    )
    cm_resp = urllib.request.urlopen(cm_req)
    cm_data = json.loads(cm_resp.read())
    
    print("\nResponse keys:", list(cm_data.keys()))
    
    if "results" in cm_data:
        products = cm_data["results"]
        print(f"Products found: {len(products)}")
        for p in products[:3]:
            print(f"  - {p['title']} (locale: {p.get('locale', 'N/A')})")
    elif "data" in cm_data:
        items = cm_data["data"]
        if isinstance(items, list):
            print(f"Products found: {len(items)}")
            for p in items[:3]:
                print(f"  - {p.get('title', '?')} (locale: {p.get('locale', 'N/A')})")
        else:
            print("Data type:", type(items))
            print("Data sample:", str(items)[:200])
    else:
        print("Unknown response structure")
        print(str(cm_data)[:500])
        
except urllib.error.HTTPError as e:
    print(f"HTTP Error: {e.code}")
    body = e.read().decode()
    print("Error body:", body[:300])
except Exception as e:
    print(f"Error: {e}")
