import sqlite3
import json

conn = sqlite3.connect("./data.db")
cursor = conn.cursor()

# 1. Adăugăm locale Italian
cursor.execute("""
    INSERT INTO i18n_locale (name, code, created_at, updated_at, published_at)
    VALUES ('Italian (it)', 'it', datetime('now'), datetime('now'), datetime('now'))
""")
print("✅ Locale Italian adăugat")

# 2. Setăm default locale la EN
cursor.execute("""
    UPDATE strapi_core_store_settings
    SET value = ?
    WHERE key = 'plugin_i18n_default_locale'
""", (json.dumps("en"),))
print("✅ Default locale setat la EN")

conn.commit()
conn.close()
