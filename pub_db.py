import sqlite3

db = sqlite3.connect("./data.db")
c = db.cursor()

# Publish ALL products (both EN and IT)
c.execute("UPDATE products SET published_at='2026-06-15T16:00:00.000Z' WHERE published_at IS NULL")
print(f"Published products: {c.rowcount}")

# Publish ALL categories
c.execute("UPDATE categories SET published_at='2026-06-15T16:00:00.000Z' WHERE published_at IS NULL")
print(f"Published categories: {c.rowcount}")

# Verify
c.execute("SELECT locale, COUNT(*) FROM products WHERE published_at IS NULL GROUP BY locale")
remaining = c.fetchall()
if remaining:
    for r in remaining:
        print(f"Still draft: {r[0]}={r[1]}")
else:
    print("All products published!")

db.commit()
db.close()
