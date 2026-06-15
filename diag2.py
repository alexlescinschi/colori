import sqlite3, json

db = sqlite3.connect("/tmp/db-check.db")
c = db.cursor()

print("=== DOCUMENT IDS ===")
# Check if EN and IT products share document_id
c.execute("SELECT slug, locale, document_id FROM products ORDER BY slug, locale LIMIT 10")
for r in c.fetchall():
    doc = r[2][:12] if r[2] else "NULL"
    print(f"  {r[0][:25]:25s} {r[1]:3s} doc={doc}")

print("\n=== NULL DOCUMENT IDS ===")
c.execute("SELECT COUNT(*) FROM products WHERE document_id IS NULL")
print(f"  Products: {c.fetchone()[0]}")

c.execute("SELECT COUNT(*) FROM products WHERE published_at IS NULL")
print(f"  Not published: {c.fetchone()[0]}")

print("\n=== SAME DOC_ID COUNT ===")
c.execute("SELECT p1.slug, p1.locale, p2.locale FROM products p1 JOIN products p2 ON p1.document_id = p2.document_id AND p1.slug = p2.slug AND p1.locale != p2.locale LIMIT 5")
for r in c.fetchall():
    print(f"  {r[0][:20]:20s} {r[1]} <-> {r[2]}")

print("\n=== CONTENT-MANAGER CONFIG ===")
c.execute("SELECT value FROM strapi_core_store_settings WHERE key='plugin_content_manager_configuration_content_types::api::product.product'")
row = c.fetchone()
if row:
    cm = json.loads(row[0])
    print(json.dumps(cm["settings"], indent=2))

print("\n=== STRAPI CONTENT TYPES (i18n field in DB) ===")
c.execute("SELECT value FROM strapi_core_store_settings WHERE key='strapi_content_types_schema'")
schema = json.loads(c.fetchone()[0])
prod = schema["api::product.product"]
# Check localizations field details  
loc = prod["attributes"].get("localizations", {})
print(f"  localizations type: {loc.get('type', 'MISSING')}")
print(f"  localizations target: {loc.get('target', 'MISSING')}")
print(f"  localizations mappedBy: {loc.get('mappedBy', 'MISSING')}")
print(f"  localizations relation: {loc.get('relation', 'MISSING')}")
print(f"  pluginOptions: {json.dumps(prod.get('pluginOptions', {}))}")

# Check category too
cat = schema["api::category.category"]
cat_loc = cat["attributes"].get("localizations", {})
print(f"\n  Category mappedBy: {cat_loc.get('mappedBy', 'MISSING')}")
print(f"  Category pluginOptions: {json.dumps(cat.get('pluginOptions', {}))}")

db.close()
