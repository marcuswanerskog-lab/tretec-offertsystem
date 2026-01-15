import requests
from bs4 import BeautifulSoup
import json
import time
import re

def scrape_lasgiganten_page(page_num):
    """Scrapa en sida från Låsgiganten"""
    url = f"https://lasgiganten.se/collections/las-och-nycklar?filter.p.product_type=Elektrisk+l%C3%A5sning&filter.p.tag=Elektrisk+l%C3%A5sning&page={page_num}&sort_by=title-ascending"
    
    print(f"Hämtar sida {page_num}...")
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
    
    try:
        response = requests.get(url, headers=headers, timeout=30)
        response.raise_for_status()
        
        html_content = response.text
        
        # Hitta JavaScript-objektet med produktdata
        # Leta efter: var meta = {"products":[...]};
        pattern = r'var meta = (\{[^;]+\});'
        match = re.search(pattern, html_content)
        
        if not match:
            print(f"  Kunde inte hitta produktdata i JavaScript på sida {page_num}")
            return []
        
        # Parsa JSON-data
        meta_json = match.group(1)
        meta_data = json.loads(meta_json)
        
        products = []
        
        if 'products' not in meta_data:
            print(f"  Ingen 'products' key i meta-data på sida {page_num}")
            return []
        
        for prod in meta_data['products']:
            try:
                # Produktnamn från första varianten
                variant = prod['variants'][0] if prod['variants'] else {}
                product_name = variant.get('name', 'Okänt namn')
                
                # Pris i ÖRE -> konvertera till kronor
                price_ore = variant.get('price', 0)
                price = price_ore / 100  # Dela på 100 för att få kronor
                
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
                print(f"  Fel vid parsning av produkt: {e}")
                continue
        
        print(f"  Hittade {len(products)} produkter på sida {page_num}")
        return products
        
    except Exception as e:
        print(f"  Fel vid hämtning av sida {page_num}: {e}")
        return []

def scrape_all_pages(total_pages=13):
    """Scrapa alla sidor"""
    all_products = []
    
    for page in range(1, total_pages + 1):
        products = scrape_lasgiganten_page(page)
        all_products.extend(products)
        
        # Vänta lite mellan requests för att vara snäll mot servern
        if page < total_pages:
            time.sleep(2)
    
    return all_products

if __name__ == "__main__":
    print("Startar scraping av alla ellås-produkter från Låsgiganten...")
    print("=" * 60)
    
    products = scrape_all_pages(13)
    
    print("=" * 60)
    print(f"\nTotalt antal produkter hämtade: {len(products)}")
    
    # Spara till JSON (i aktuell katalog)
    output_file = 'lasgiganten_ellas_all.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(products, f, ensure_ascii=False, indent=2)
    
    print(f"Produkter sparade till: {output_file}")
    
    # Visa lite statistik
    prices = [p['price'] for p in products if p['price'] is not None]
    if prices:
        print(f"\nPrisstatistik:")
        print(f"  Lägsta pris: {min(prices):.2f} kr")
        print(f"  Högsta pris: {max(prices):.2f} kr")
        print(f"  Medelpris: {sum(prices)/len(prices):.2f} kr")
    
    # Visa första 3 produkter som exempel
    print(f"\nExempel på produkter:")
    for i, prod in enumerate(products[:3], 1):
        print(f"\n{i}. {prod['name']}")
        print(f"   Pris: {prod['price']} kr")
        print(f"   URL: {prod['url']}")
