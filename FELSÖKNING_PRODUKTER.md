# FELSÖKNING - PRODUKTER VISAS INTE

## 🔍 PROBLEM: Inga produkter syns i Steg 2

### LÖSNING 1: Kontrollera att product_database.js finns

1. Öppna din offertsystem-mapp
2. Leta efter filen `product_database.js`
3. Om den INTE finns:
   - Kopiera den från ditt gamla system
   - Eller ladda ner från din backup

### LÖSNING 2: Kontrollera webbläsarens konsol

1. Öppna systemet i webbläsaren (http://localhost:5000)
2. Tryck **F12** för att öppna Developer Tools
3. Klicka på fliken **Console**
4. Gå till Steg 2 (Välj produkter)
5. Titta efter dessa meddelanden:

**BRA TECKEN (produkter laddade):**
```
✅ Product database loaded from product_database.js
🔍 Rendering product categories...
✅ Rendering category 'lasare' with 150 products
✅ Rendering category 'centralapparater' with 80 products
```

**DÅLIGA TECKEN (produkter saknas):**
```
⚠️ Product database not found in product_database.js
⚠️ No products found. Initializing empty database.
⚠️ Category 'lasare' is empty, skipping...
```

### LÖSNING 3: Lägg till testprodukter manuellt

Om `product_database.js` saknas kan du lägga till produkter direkt i systemet:

1. Gå till **Produkter**-vyn
2. Klicka **"+ Lägg till produkt"**
3. Fyll i:
   - Artikelnummer: `TEST-001`
   - Benämning: `Testprodukt 1`
   - Kategori: `Läsare`
   - Pris: `1000`
4. Spara
5. Upprepa för några fler produkter

Nu ska produkterna synas i Steg 2!

### LÖSNING 4: Kontrollera filstrukturen

Din mapp ska se ut så här:

```
Din mapp/
├── offertsystem_v3.html     ✅ MÅSTE FINNAS
├── app_v3.js                ✅ MÅSTE FINNAS
├── product_database.js      ✅ MÅSTE FINNAS <-- VIKTIGT!
├── server_v3.py            ✅ MÅSTE FINNAS
├── generate_pdf.py         ✅ 
└── Treteclogo.jpg          ✅
```

### LÖSNING 5: Starta om helt

1. Stoppa servern (Ctrl+C)
2. Ladda om sidan (Ctrl+F5)
3. Starta servern igen: `python server_v3.py`
4. Öppna: http://localhost:5000

### LÖSNING 6: Importera produkter från gamla systemet

Om du har produkter sparade i localStorage från gamla systemet:

1. Öppna **Produkter**-vyn
2. Öppna Developer Console (F12)
3. Kör detta kommando:

```javascript
// Exportera från gamla systemet
const oldProducts = localStorage.getItem('tretec_products');
console.log('Gamla produkter:', oldProducts);

// Om det finns något, spara till fil och skicka till Claude
```

### LÖSNING 7: Skapa en ny product_database.js

Om filen saknas helt, skapa en ny:

1. Skapa en ny fil: `product_database.js`
2. Lägg till detta innehåll:

```javascript
// Product Database - Updated 2026-01-15
const PRODUCT_DB = {
    "lasare": [
        {
            "artikelnummer": "2-0001",
            "e_nummer": "123456",
            "benamning": "Läsare VAKA A76",
            "lagsta_orderantal": null,
            "rabattgrupp": "V",
            "pris": 6290
        }
    ],
    "centralapparater": [
        {
            "artikelnummer": "2-0100",
            "e_nummer": "234567",
            "benamning": "Dörrcentral VAKA B28",
            "lagsta_orderantal": null,
            "rabattgrupp": "V",
            "pris": 10490
        }
    ],
    "tillbehor": [
        {
            "artikelnummer": "2-0200",
            "e_nummer": "345678",
            "benamning": "Batteri 12V 7,2Ah",
            "lagsta_orderantal": null,
            "rabattgrupp": "T",
            "pris": 480
        }
    ],
    "ellas": [
        {
            "artikelnummer": "ELLAS-001",
            "e_nummer": "",
            "benamning": "Abloy Eltryckeslås EL580",
            "lagsta_orderantal": null,
            "rabattgrupp": "E",
            "pris": 7665
        }
    ]
};
```

3. Spara filen
4. Starta om servern

---

## 📞 FORTFARANDE PROBLEM?

Skicka dessa saker till Claude:

1. **Skärmdump** av Steg 2 (produktvyn)
2. **Console-loggen** (från F12 → Console)
3. **Fillista** från din mapp (kör: `dir` eller `ls -la`)
4. **Innehållet** av product_database.js (första 20 raderna)

---

**Lycka till! 🔧**
