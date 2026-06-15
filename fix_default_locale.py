import sqlite3

db = sqlite3.connect("./data.db")
c = db.cursor()

# Check if key exists
c.execute("SELECT id FROM strapi_core_store_settings WHERE key=?", ("plugin_i18n_default_locale",))
existing = c.fetchone()

if existing:
    c.execute("UPDATE strapi_core_store_settings SET value=?, type='string' WHERE key=?",
              ('"en"', "plugin_i18n_default_locale"))
    print("Updated default locale to en")
else:
    c.execute("INSERT INTO strapi_core_store_settings (key, value, type) VALUES (?, ?, ?)",
              ("plugin_i18n_default_locale", '"en"', "string"))
    print("Inserted default locale: en")

# Verify
c.execute("SELECT key, value FROM strapi_core_store_settings WHERE key=?", ("plugin_i18n_default_locale",))
row = c.fetchone()
print("Verify:", row)

db.commit()
db.close()
