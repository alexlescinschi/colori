#!/usr/bin/env python3
"""Diagnostic: check Strapi state, DB content, API responses"""
import urllib.request, json, sqlite3, os, subprocess

print("=" * 60)
print("1. DATABASE STATE")
print("=" * 60)

db_path = "/tmp/db-check.db"
# Copy DB from container if needed
os.system("docker cp colori-md-strapi-1:/app/.tmp/data.db " + db_path + " 2>/dev/null")

db = sqlite3.connect(db_path)
c = db.cursor()

# Products
for r in c.execute("SELECT locale, COUNT(*) FROM products GROUP BY locale").fetchall():
    print(f"  Products {r[0]}: {r[1]}")
for r in c.execute("SELECT locale, COUNT(*) FROM categories GROUP BY locale").fetchall():
    print(f"  Categories {r[0]}: {r[1]}")

# Samples
print("\n  Sample products:")
for r in c.execute("SELECT title, locale, published_at FROM products LIMIT 4").fetchall():
    print(f"    {r[0][:30]} [{r[1]}] published={r[2][:19] if r[2] else 'null'}")

# Locales
print("\n  Locales:")
for r in c.execute("SELECT code, name FROM i18n_locale").fetchall():
    print(f"    {r[0]}: {r[1]}")

# Schema pluginOptions
c.execute("SELECT value FROM strapi_core_store_settings WHERE key='strapi_content_types_schema'")
schema = json.loads(c.fetchone()[0])
prod = schema.get("api::product.product", {})
print(f"\n  Product pluginOptions: {json.dumps(prod.get('pluginOptions', '{}'))}")
print(f"  Product has localizations: {'localizations' in prod.get('attributes', {})}")

db.close()

print("\n" + "=" * 60)
print("2. CONTENT-MANAGER API TEST")
print("=" * 60)

# Login
req = urllib.request.Request(
    "http://127.0.0.1:1337/admin/login",
    data=b'{"email":"alex.lescinschi@gmail.com","password":"Mariuta1"}',
    headers={"Content-Type": "application/json"}
)
resp = urllib.request.urlopen(req)
token = json.loads(resp.read())["data"]["token"]
print(f"  Login OK, token: {token[:20]}...")

# Save session cookies
cookie_str = ""
for hdr in resp.headers.get_all("Set-Cookie") if hasattr(resp.headers, "get_all") else []:
    if "strapi_admin_refresh=" in hdr:
        cookie_str += hdr.split(";")[0] + "; "
print(f"  Cookies: {cookie_str[:60]}...")

# Test EN
req = urllib.request.Request(
    "http://127.0.0.1:1337/content-manager/collection-types/api::product.product?locale=en&page=1&pageSize=3",
    headers={"Authorization": f"Bearer {token}"}
)
resp = urllib.request.urlopen(req)
data = json.loads(resp.read())
results = data.get("results", [])
print(f"  EN products: {len(results)} results")
for p in results[:2]:
    print(f"    - {p['title']} [locale={p.get('locale', '?')}]")

# Test IT
req = urllib.request.Request(
    "http://127.0.0.1:1337/content-manager/collection-types/api::product.product?locale=it&page=1&pageSize=3",
    headers={"Authorization": f"Bearer {token}"}
)
resp = urllib.request.urlopen(req)
data = json.loads(resp.read())
results = data.get("results", [])
print(f"  IT products: {len(results)} results")
for p in results[:2]:
    print(f"    - {p['title']} [locale={p.get('locale', '?')}]")

print("\n" + "=" * 60)
print("3. PUBLIC API TEST")
print("=" * 60)

for locale in ["en", "it"]:
    req = urllib.request.Request(f"http://127.0.0.1:1337/api/products?locale={locale}&pagination[limit]=3")
    resp = urllib.request.urlopen(req)
    data = json.loads(resp.read())
    items = data.get("data", [])
    print(f"  {locale}: {len(items)} products")
    for p in items[:2]:
        print(f"    - {p['title']}")

print("\n" + "=" * 60)
print("4. NGINX CONFIG CHECK")
print("=" * 60)

import subprocess
result = subprocess.run(["nginx", "-t"], capture_output=True, text=True)
print(f"  Nginx test: {'OK' if 'successful' in result.stdout else 'FAIL'}")

result = subprocess.run(["docker", "ps", "--format", "{{.Names}} {{.Status}}"], capture_output=True, text=True)
print(f"  Containers:\n    {result.stdout.strip()}")

print("\n" + "=" * 60)
print("DIAGNOSTIC DONE")
print("=" * 60)
