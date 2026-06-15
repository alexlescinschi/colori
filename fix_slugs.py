import sqlite3

db = sqlite3.connect("./data.db")
c = db.cursor()

slugs = {
    "Gel UV Color Roșu Pasiune 15ml": "gel-uv-rosu-pasiune",
    "Gel UV Color Nude Elegance 15ml": "gel-uv-nude-elegance",
    "Top Coat Strălucitor 15ml": "top-coat-stralucitor",
    "Base Coat Rubber 15ml": "base-coat-rubber",
    "Lampă UV/LED 48W Pro": "lampa-uv-led-48w-pro",
    "Lampă UV/LED 36W Standard": "lampa-uv-led-36w-standard",
    "Set Capete Freză (10 buc)": "set-capete-freza",
    "Cleaner Profesional 250ml": "cleaner-profesional-250ml",
    "Acetonă Pură 500ml": "acetona-pura-500ml",
    "Tipsuri Almond 240 buc": "tipsuri-almond-240buc",
    "Tipsuri Coffin 240 buc": "tipsuri-coffin-240buc",
    "Gel Constructor Clear 30ml": "gel-constructor-clear",
    "Pilă Profesională 100/180": "pila-profesionala-100-180",
    "Set Pile Buffer (5 buc)": "set-pile-buffer",
    "Freză Electrică 35000 RPM": "freza-electrica-35000-rpm",
    "Gel Constructor Cover Pink 30ml": "gel-constructor-cover-pink",
    "Glitter Holografic 10g": "glitter-holografic",
    "Foiță Transfer Aurie": "foita-transfer-aurie",
    "Stickere Nail Art (10 coli)": "stickere-nail-art",
    "Set Pensule Nail Art (5 buc)": "set-pensule-nail-art",
    "Cremă Cuticule Hidratantă 50ml": "crema-cuticule-hidratanta",
    "Ulei Cuticule Cu Vitamina E 15ml": "ulei-cuticule-vitamina-e",
}

for title, slug in slugs.items():
    c.execute("UPDATE products SET slug=? WHERE title=? AND locale=?", (slug, title, "en"))
    if c.rowcount:
        print(f"Fixed EN: {slug}")

# Fix IT slugs: same slugs for same products (IT titles can be matched differently)
# Just generate from title for any that are still NULL
c.execute("SELECT id, title FROM products WHERE slug IS NULL")
still_null = c.fetchall()
for pid, title in still_null:
    generated = title.lower().replace(" ", "-").replace("ă","a").replace("ț","t").replace("ș","s").replace("î","i").replace("â","a")[:50]
    c.execute("UPDATE products SET slug=? WHERE id=?", (generated, pid))
    print(f"Generated IT slug: {generated}")

db.commit()

# Verify
c.execute("SELECT COUNT(*) FROM products WHERE slug IS NULL")
remaining = c.fetchone()[0]
print(f"\nStill NULL slugs: {remaining}")
db.close()
