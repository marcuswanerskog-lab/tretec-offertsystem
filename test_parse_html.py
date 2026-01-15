import json
import re
import sys

# Läs HTML-filen
if len(sys.argv) > 1:
    html_file = sys.argv[1]
else:
    html_file = 'lasgiganten_page1.html'  # Default

print(f"Läser HTML från: {html_file}")

try:
    with open(html_file, 'r', encoding='utf-8') as f:
        html_content = f.read()
except FileNotFoundError:
    print(f"Fel: Filen '{html_file}' hittades inte!")
    print("\nAnvänd: python test_parse_html.py <filnamn.html>")
    sys.exit(1)

# Hitta JavaScript-objektet med produktdata
pattern = r'var meta = (\{[^;]+\});'
match = re.search(pattern, html_content)

if not match:
    print("Kunde inte hitta 'var meta = {...};' i HTML-filen")
    sys.exit(1)

# Parsa JSON-data
meta_json = match.group(1)
meta_data = json.loads(meta_json)

if 'products' not in meta_data:
    print("Ingen 'products' key hittades i meta-data")
    sys.exit(1)

products = []

for prod in meta_data['products']:
    try:
        # Produktnamn från första varianten
        variant = prod['variants'][0] if prod['variants'] else {}
        product_name = variant.get('name', 'Okänt namn')
        
        # Pris i ÖRE -> konvertera till kronor
        price_ore = variant.get('price', 0)
        price = price_ore / 100
        
        # URL
        product_handle = prod.get('handle', '')
        product_url = f"https://lasgiganten.se/products/{product_handle}"
        
        # SKU
        sku = variant.get('sku', '')
        
        product = {
            'name': product_name,
            'price': price,
            'url': product_url,
            'sku': sku,
            'supplier': 'Låsgiganten',
            'category': 'Elektriska lås'
        }
        
        products.append(product)
        
    except Exception as e:
        print(f"Fel vid parsning av produkt: {e}")
        continue

print(f"\nHittade {len(products)} produkter!")
print("\nFörsta 3 produkter:")
for i, p in enumerate(products[:3], 1):
    print(f"\n{i}. {p['name']}")
    print(f"   Pris: {p['price']:.2f} kr")
    print(f"   SKU: {p['sku']}")
    print(f"   URL: {p['url']}")

# Spara till JSON
output_file = 'produkter_test.json'
with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(products, f, ensure_ascii=False, indent=2)

print(f"\n✓ Alla produkter sparade till: {output_file}")
