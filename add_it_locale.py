import sqlite3

db = sqlite3.connect("./data.db")
c = db.cursor()
c.execute("INSERT INTO i18n_locale (name, code, created_at, updated_at, published_at, document_id) VALUES (?, ?, 1781550000000, 1781550000000, 1781550000000, ?)",
          ("Italian (it)", "it", "it_locale_doc_001"))
db.commit()
print("Added Italian locale")
c.execute("SELECT * FROM i18n_locale")
for r in c.fetchall():
    print(f"  id={r[0]} name={r[2]} code={r[3]}")
db.close()
