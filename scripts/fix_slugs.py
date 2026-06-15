import sqlite3
import sys

db_path = sys.argv[1] if len(sys.argv) > 1 else "/tmp/strapi-db.db"
db = sqlite3.connect(db_path)
c = db.cursor()

c.execute("SELECT id, slug, title FROM products WHERE locale='it' AND slug LIKE '%-it'")
bad = c.fetchall()
print("Products with wrong slugs: " + str(len(bad)))
for pid, slug, title in bad:
    orig = slug.replace("-it", "")
    c.execute("UPDATE products SET slug=? WHERE id=?", (orig, pid))
    print("  Fixed: " + slug + " -> " + orig)

c.execute("SELECT id, slug, title FROM categories WHERE locale='it' AND slug LIKE '%-it'")
bad = c.fetchall()
print("Categories with wrong slugs: " + str(len(bad)))
for cid, slug, title in bad:
    orig = slug.replace("-it", "")
    c.execute("UPDATE categories SET slug=? WHERE id=?", (orig, cid))
    print("  Fixed: " + slug + " -> " + orig)

c.execute("SELECT COUNT(*) FROM products WHERE locale='it'")
pc = c.fetchone()[0]
c.execute("SELECT COUNT(*) FROM categories WHERE locale='it'")
cc = c.fetchone()[0]
print("Total: " + str(pc) + " Italian products, " + str(cc) + " Italian categories")

db.commit()
db.close()
