import sqlite3

db = sqlite3.connect("./data.db")
c = db.cursor()

titles = {
    "gel-uv-rosu-pasiune": "Gel UV Color Roșu Pasiune 15ml",
    "gel-uv-nude-elegance": "Gel UV Color Nude Elegance 15ml",
    "top-coat-stralucitor": "Top Coat Strălucitor 15ml",
    "base-coat-rubber": "Base Coat Rubber 15ml",
    "lampa-uv-led-48w-pro": "Lampă UV/LED 48W Pro",
    "lampa-uv-led-36w-standard": "Lampă UV/LED 36W Standard",
    "set-capete-freza": "Set Capete Freză (10 buc)",
    "cleaner-profesional-250ml": "Cleaner Profesional 250ml",
    "acetona-pura-500ml": "Acetonă Pură 500ml",
    "tipsuri-almond-240buc": "Tipsuri Almond 240 buc",
    "tipsuri-coffin-240buc": "Tipsuri Coffin 240 buc",
    "gel-constructor-clear": "Gel Constructor Clear 30ml",
    "pila-profesionala-100-180": "Pilă Profesională 100/180",
    "set-pile-buffer": "Set Pile Buffer (5 buc)",
    "freza-electrica-35000-rpm": "Freză Electrică 35000 RPM",
    "gel-constructor-cover-pink": "Gel Constructor Cover Pink 30ml",
    "glitter-holografic": "Glitter Holografic 10g",
    "foita-transfer-aurie": "Foiță Transfer Aurie",
    "stickere-nail-art": "Stickere Nail Art (10 coli)",
    "set-pensule-nail-art": "Set Pensule Nail Art (5 buc)",
    "crema-cuticule-hidratanta": "Cremă Cuticule Hidratantă 50ml",
    "ulei-cuticule-vitamina-e": "Ulei Cuticule Cu Vitamina E 15ml"
}

for slug, title in titles.items():
    c.execute("UPDATE products SET title=? WHERE slug=? AND locale=?", (title, slug, "en"))
    if c.rowcount:
        print(f"Fixed: {title[:30]}")

db.commit()
c.execute("SELECT title, locale FROM products ORDER BY locale, id LIMIT 4")
for r in c.fetchall():
    print(f"  {r[1]}: {r[0][:30]}")

db.close()
