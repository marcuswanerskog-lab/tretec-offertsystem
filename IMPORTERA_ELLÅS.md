# IMPORTERA ELLÅS-PRODUKTER 📦

## 🎯 VAD DETTA GÖR

Du har **200 ellås-produkter** från Låsgiganten i filen `lasgiganten_ellas_all.json`.

Detta script importerar dessa produkter automatiskt till din `product_database.js`!

---

## 🚀 SNABBSTART

### Alternativ 1: Använd färdig product_database.js (Enklast!)

Jag har redan skapat en **färdig product_database.js** med alla 200 ellås-produkter!

1. **Ladda ner:** `product_database.js` (från outputs)
2. **Kopiera** till din offertsystem-mapp
3. **Ersätt** din gamla product_database.js
4. **Starta om servern**
5. **KLART!** 🎉

### Alternativ 2: Kör import-scriptet själv

Om du vill köra scriptet själv (t.ex. om du redan har produkter i product_database.js):

1. **Kopiera dessa filer** till din offertsystem-mapp:
   - `lasgiganten_ellas_all.json`
   - `import_ellas_auto.py`

2. **Kör scriptet:**
   ```bash
   python import_ellas_auto.py
   ```

3. **Scriptet kommer att:**
   - Läsa din befintliga product_database.js
   - Skapa en backup
   - Uppdatera ellås-kategorin med alla 200 produkter
   - Behålla alla dina övriga produkter (läsare, centralapparater, tillbehör)

4. **Starta om servern**

---

## 📊 VADDÅ 200 PRODUKTER?

Ja, du har skrapat **200 ellås-produkter** från Låsgiganten med dessa detaljer:

- **Lägsta pris:** 6.35 kr
- **Högsta pris:** 25,039.91 kr
- **Medelpris:** 6,005 kr

**Exempel på produkter:**
1. Anslutningskabel 6m, för Exma Protector - 529 kr
2. Anslutningskabel EA220 10m - 1,117 kr
3. Motorlås STEP 352 - 14,000+ kr
4. Abloy Eltryckeslås - 7,665 kr
5. ...och 196 fler!

---

## ⚙️ VAD SCRIPTET GÖR

```
1. Läser lasgiganten_ellas_all.json (200 produkter)
2. Konverterar till Tretec-format:
   {
     "artikelnummer": "SKU från Låsgiganten",
     "benamning": "Produktnamn",
     "pris": 1234.56,
     "supplier": "Låsgiganten",
     "url": "länk till produkten",
     ...
   }
3. Kollar om product_database.js finns
   - JA: Läser befintlig, skapar backup, uppdaterar endast ellås
   - NEJ: Skapar ny product_database.js
4. Sparar den uppdaterade filen
```

---

## 🔍 EFTER IMPORTEN

### I systemet (http://localhost:5000):

1. Gå till **Produkter**-vyn
2. Välj filter: **Kategori → Ellås**
3. **Se alla 200 produkter!**

### I en offert:

1. Skapa ny offert
2. Steg 2: Produkter
3. Klicka på **Ellås**-kategorin
4. Välj de produkter du vill ha!

---

## 🛠️ TEKNISKA DETALJER

### Format i product_database.js:

```javascript
const PRODUCT_DB = {
  "lasare": [...],
  "centralapparater": [...],
  "tillbehor": [...],
  "ellas": [
    {
      "artikelnummer": "50460140",
      "e_nummer": "",
      "benamning": "Anslutningskabel 6m, för Exma Protector",
      "lagsta_orderantal": null,
      "rabattgrupp": "E",
      "pris": 529.4,
      "supplier": "Låsgiganten",
      "url": "https://lasgiganten.se/products/..."
    },
    // ... 199 fler produkter
  ]
};
```

---

## 🔄 OM DU VILL UPPDATERA SENARE

Om Låsgiganten ändrar priser eller lägger till produkter:

1. Kör scrape-scriptet igen: `python scrape_all_lasgiganten.py`
2. Kör import-scriptet: `python import_ellas_auto.py`
3. Starta om servern

Scriptet kommer alltid att:
- Skapa backup av gamla product_database.js
- Ersätta ellås-kategorin med nya data
- Behålla alla andra kategorier intakta

---

## ❓ VANLIGA FRÅGOR

**Q: Kommer mina befintliga produkter att försvinna?**
A: NEJ! Scriptet uppdaterar bara ellås-kategorin. Läsare, Centralapparater och Tillbehör påverkas inte.

**Q: Vad händer om jag kör scriptet flera gånger?**
A: Det skapar en ny backup varje gång och uppdaterar ellås-kategorin. Inga problem!

**Q: Kan jag redigera priserna efter import?**
A: JA! Gå till Produkter-vyn i systemet och klicka "Redigera" på vilken produkt som helst.

**Q: Jag vill bara ha vissa ellås-produkter, inte alla 200?**
A: Importera alla först, sen ta bort de du inte vill ha via Produkter-vyn.

---

## 📞 BEHÖVER HJÄLP?

Skicka:
1. Felmeddelande från scriptet
2. Din befintliga product_database.js (första 50 rader)
3. Output från scriptet

---

**Lycka till! 🎉**

Nu har du tillgång till hela Låsgigantens ellås-sortiment direkt i ditt offertsystem!
