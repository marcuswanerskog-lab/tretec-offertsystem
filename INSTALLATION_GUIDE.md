# 🎉 TRETEC OFFERTSYSTEM - KOMPLETT UPPDATERING

## 📦 Fyra filer att installera:

### 1. **app_v3_COMPLETE.js** → `app_v3.js`
**Nya funktioner:**
- ✅ Auto-spara offert innan PDF/Avtal-generering
- ✅ Auto-spara kund när offert sparas
- ✅ Snabbknappar (A76, A45i, B18, B28, PoE, Taggar, Batterier)
- ✅ Sökfält i varje produktkategori
- ✅ Generera PDF-offert
- ✅ **NY: Generera affärsavtal**

### 2. **server_v3_FINAL.py** → `server_v3.py`
**Nya endpoints:**
- `/generate-pdf` - Genererar PDF-offert
- `/generate-contract` - **NY: Genererar affärsavtal**
- Data-transformation för korrekt format

### 3. **generate_pdf_CLEAN.py** → `generate_pdf.py`
**Förbättringar:**
- Tjänster utan timmar/priser synliga
- Hanterar både 'benamning' och 'name'
- Renare PDF-layout
- Inga HTML-taggar synliga

### 4. **generate_contract.py** → **NY FIL**
**Affärsavtals-generator:**
- Grunduppgifter (kund, leverantör, datum)
- Betalningsplan (30%, 30%, 40%)
- Tidplan med milstolpar
- 5 projektmöten inkluderade
- 5 års garanti
- Val av servicenivå (checkboxar)
- Signeringsyta för båda parter

---

## 🔧 Installation:

```bash
cd "C:\Users\marcu\Tretec Dropbox\Teammapp som tillhör Tretec\- Offerter\Skapa offert"

# Stoppa servern (Ctrl+C i terminalen)

# Backup av gamla filer
copy app_v3.js app_v3_BACKUP_20260115.js
copy server_v3.py server_v3_BACKUP_20260115.py
copy generate_pdf.py generate_pdf_BACKUP_20260115.py

# Ersätt med nya filer (ladda ner från Claude-chatten)
# 1. app_v3_COMPLETE.js → Döp om till app_v3.js
# 2. server_v3_FINAL.py → Döp om till server_v3.py
# 3. generate_pdf_CLEAN.py → Döp om till generate_pdf.py
# 4. generate_contract.py → Lägg till som ny fil (behåll namnet)

# Starta servern igen
python server_v3.py
```

---

## 🆕 Lägg till Avtalsknapp i HTML:

Öppna `offertsystem_v3.html` och hitta där det står:

```html
<button onclick="generatePDF()" class="generate-btn">
    📄 Generera PDF-Offert
</button>
```

Lägg till direkt under:

```html
<button onclick="generateContract()" class="generate-btn" style="background: #2196F3;">
    📋 Generera Affärsavtal
</button>
```

Spara och ladda om sidan!

---

## ✨ Nya funktioner i praktiken:

### Auto-spara:
1. Fyll i offert
2. Klicka "Generera PDF" eller "Generera Affärsavtal"
3. Offerten sparas automatiskt FÖRST
4. Kunden sparas automatiskt (eller uppdateras om redan finns)
5. PDF/Avtal genereras

### Snabbknappar:
1. Gå till "Välj produkter"
2. Se guldiga snabbknappar högst upp
3. Klicka "A76 läsare" → Kategorin öppnas, söker "a76", scrollar dit
4. Välj produkt direkt!

### Sökfält:
1. Öppna en kategori (t.ex. "Läsare")
2. Se sökfältet under kategorin
3. Skriv "76" → Filtrerar produkter direkt!
4. Räknaren uppdateras: "3 av 52 produkter"

### Affärsavtal:
1. Skapa offert som vanligt
2. Klicka "📋 Generera Affärsavtal"
3. Får en proffsig avtals-PDF med:
   - Betalningsplan
   - Tidplan
   - Servicevalsalternativ (checkboxar)
   - Signeringsyta
   - Baserat på offertdata!

---

## 📊 Vad händer nu:

### Innan PDF/Avtal:
```
1. Auto-sparar offert → genererar offertnummer om saknas
2. Kollar om kund finns (org.nr / namn)
3. Uppdaterar befintlig ELLER skapar ny kund
4. Validerar data (kund, produkter)
5. Genererar PDF/Avtal
```

### När offerten sparas:
```
1. Sparar kunden FÖRST
2. Genererar offertnummer (2026-0001, 2026-0002...)
3. Sparar offerten
4. Uppdaterar kundlistan
```

---

## 🎯 Testa direkt:

1. Starta: `python server_v3.py`
2. Öppna: `http://localhost:5000`
3. Skapa ny offert
4. Fyll i kunduppgifter
5. Lägg till produkter via snabbknappar
6. Klicka "Generera PDF-Offert" → ✅ Allt sparas automatiskt!
7. Klicka "Generera Affärsavtal" → ✅ Proffsigt avtal!

---

## 🐛 Felsökning:

### PDF/Avtal genereras inte:
```bash
pip install reportlab --break-system-packages
```

### "Module not found: generate_contract":
→ Kontrollera att `generate_contract.py` finns i samma mapp som `server_v3.py`

### Knappen "Generera Affärsavtal" syns inte:
→ Kontrollera att du lagt till knappen i `offertsystem_v3.html` (se ovan)

### Kunder sparas inte:
→ Kolla konsolen i webbläsaren (F12) för felmeddelanden

---

## 📞 Support:

Om något inte fungerar, kolla:
1. Terminalen där servern körs (detaljerade felmeddelanden)
2. Webbläsarens konsol (F12 → Console)
3. Finns alla 4 filerna på rätt plats?

---

**🎊 Grattis! Nu har du ett komplett offertsystem med automatisk sparning, snabbval och avtalsgenereringning!**
