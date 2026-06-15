import sqlite3

db = sqlite3.connect("./data.db")
c = db.cursor()

# Delete IT duplicates
c.execute("DELETE FROM products WHERE id NOT IN (SELECT MIN(id) FROM products WHERE locale='it' GROUP BY title) AND locale='it'")
print(f"Deleted {c.rowcount} duplicate IT products")

c.execute("SELECT locale, COUNT(*) FROM products GROUP BY locale")
for r in c.fetchall():
    print(f"  {r[0]}: {r[1]} products")

db.commit()
db.close()
print("Done")
