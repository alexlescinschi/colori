import sqlite3
import json
import uuid
from datetime import datetime

conn = sqlite3.connect("./data.db")
cursor = conn.cursor()

# Dicționar traduceri pentru categorii
category_translations = {
    "Manichiură": "Manicure",
    "Pedichiură": "Pedicure",
    "Geluri & Lacuri": "Gel & Smalti",
    "Instrumente": "Strumenti",
    "Decorațiuni & Nail Art": "Decorazioni & Nail Art",
    "Îngrijire & Tratamente": "Cura & Trattamenti",
    "Fara categorie": "Senza categoria"
}

# Dicționar traduceri pentru produse
product_translations = {
    "Gel UV Color Roșu Pasiune 15ml": "Gel UV Color Rosso Passione 15ml",
    "Gel UV Color Nude Elegance 15ml": "Gel UV Color Nude Eleganza 15ml",
    "Top Coat Strălucitor 15ml": "Top Coat Brillante 15ml",
    "Base Coat Rubber 15ml": "Base Coat Rubber 15ml",
    "Lampă UV/LED 48W Pro": "Lampada UV/LED 48W Pro",
    "Lampă UV/LED 36W Standard": "Lampada UV/LED 36W Standard",
    "Set Capete Freză (10 buc)": "Set Punte Fresa (10 pz)",
    "Cleaner Profesional 250ml": "Cleaner Professionale 250ml",
    "Acetonă Pură 500ml": "Acetone Pura 500ml",
    "Tipsuri Almond 240 buc": "Tips Almond 240 pz",
    "Tipsuri Coffin 240 buc": "Tips Coffin 240 pz",
    "Gel Constructor Clear 30ml": "Gel Costruttore Clear 30ml",
    "Pilă Profesională 100/180": "Lima Professionale 100/180",
    "Set Pile Buffer (5 buc)": "Set Lime Buffer (5 pz)",
    "Freză Electrică 35000 RPM": "Fresa Elettrica 35000 RPM",
    "Gel Constructor Cover Pink 30ml": "Gel Costruttore Cover Pink 30ml",
    "Glitter Holografic 10g": "Glitter Olografico 10g",
    "Foiță Transfer Aurie": "Foglia Transfer Oro",
    "Stickere Nail Art (10 coli)": "Adesivi Nail Art (10 fogli)",
    "Set Pensule Nail Art (5 buc)": "Set Pennelli Nail Art (5 pz)",
    "Cremă Cuticule Hidratantă 50ml": "Crema Cuticole Idratante 50ml",
    "Ulei Cuticule Cu Vitamina E 15ml": "Olio Cuticole Con Vitamina E 15ml"
}

print("🔄 Creăm traduceri pentru categorii...")
cursor.execute("SELECT id, title, slug, document_id, created_at, updated_at FROM categories WHERE locale = 'en'")
categories = cursor.fetchall()

categories_created = 0
for cat in categories:
    cat_id, title, slug, document_id, created_at, updated_at = cat
    
    # Verificăm dacă deja există traducere IT
    cursor.execute("SELECT id FROM categories WHERE document_id = ? AND locale = 'it'", (document_id,))
    if cursor.fetchone():
        print(f"  ⏭️  {title} - deja există")
        continue
    
    # Traducem titlul
    it_title = category_translations.get(title, title)
    
    # Creăm versiunea IT
    cursor.execute("""
        INSERT INTO categories (title, slug, document_id, locale, created_at, updated_at, published_at)
        VALUES (?, ?, ?, 'it', ?, ?, ?)
    """, (it_title, slug, document_id, created_at, updated_at, updated_at))
    
    categories_created += 1
    print(f"  ✅ {title} → {it_title}")

print(f"\n🔄 Creăm traduceri pentru produse...")
cursor.execute("SELECT id, title, slug, document_id, price, stock_quantity, featured, category_id, created_at, updated_at FROM products WHERE locale = 'en'")
products = cursor.fetchall()

products_created = 0
for prod in products:
    prod_id, title, slug, document_id, price, stock_quantity, featured, category_id, created_at, updated_at = prod
    
    # Verificăm dacă deja există traducere IT
    cursor.execute("SELECT id FROM products WHERE document_id = ? AND locale = 'it'", (document_id,))
    if cursor.fetchone():
        print(f"  ⏭️  {title} - deja există")
        continue
    
    # Traducem titlul
    it_title = product_translations.get(title, title)
    
    # Creăm versiunea IT
    cursor.execute("""
        INSERT INTO products (title, slug, document_id, locale, price, stock_quantity, featured, category_id, created_at, updated_at, published_at)
        VALUES (?, ?, ?, 'it', ?, ?, ?, ?, ?, ?, ?)
    """, (it_title, slug, document_id, price, stock_quantity, featured, category_id, created_at, updated_at, updated_at))
    
    products_created += 1
    print(f"  ✅ {title} → {it_title}")

conn.commit()
conn.close()

print(f"\n✅ GATA!")
print(f"   - {categories_created} categorii traduse")
print(f"   - {products_created} produse traduse")
