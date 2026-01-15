# TRETEC LARM AB - OFFERTSYSTEM MED PDF-GENERERING
## Komplett Guide

---

## 🚀 SNABBSTART

### Windows:
1. Dubbelklicka på `START_SERVER.bat`
2. Vänta tills "Server startar..." visas
3. Öppna webbläsaren: http://localhost:5000

### Mac/Linux:
1. Öppna Terminal
2. Navigera till mappen med filerna
3. Kör: `./START_SERVER.sh`
4. Öppna webbläsaren: http://localhost:5000

---

## 📋 HUR SYSTEMET FUNGERAR

### STEG 1: KUNDINFO
- Fyll i kundnamn (obligatoriskt)
- Lägg till kontaktuppgifter
- Ange eventuell rabatt% (större kund = högre rabatt)
- Lägg till projektbeskrivning

### STEG 2: PRODUKTER
**Läsare:**
- A76 och A45i visas först (vanligaste)
- Klicka på kategorirubriken för att öppna listan
- Sök efter produktnamn eller artikelnummer
- Klicka på en produkt för att lägga till
- Ändra antal på valda produkter

**Dörrcentraler:**
- B18, B28, B60 visas först (vanligaste)
- Samma sökfunktion som läsare

**Tillbehör:**
- Alla övriga produkter (batterier, taggar, kablar, etc.)
- Över 300 produkter sökbara

**Ellås:**
- Förberedd kategori (aktiveras när du lägger till produkter)

### STEG 3: TJÄNSTER & VILLKOR
**Standardtjänster (ange belopp):**
- Kabeldragning
- Resor, Installation/montering, programmering, driftsättning
- Övrigt installationsmaterial
- Projektering, driftsättning, utbildning, dokumentation

**Villkor:**
- Lägg till projektspecifika villkor (valfritt)
- Välj säkerhetsrådgivare (Marcus eller Pekka)
- Välj om serviceavtal ska visas i offerten

### STEG 4: SAMMANFATTNING & PDF
- Granska all information
- Klicka "Generera PDF-Offert"
- PDF laddas ner automatiskt med ert företags grafiska profil

---

## 📄 PDF-OFFERTEN INNEHÅLLER

✅ **Tretec Larm-logotyp** i header
✅ **Kunduppgifter** och datum
✅ **Företagspresentation**
✅ **Produkter** grupperade per kategori med beskrivningar
✅ **Tjänster** med belopp
✅ **Prissammanfattning** med rabattberäkning
✅ **Villkor** (både standard och projektspecifika)
✅ **Serviceavtal** (om valt)
✅ **Signaturrad** med vald säkerhetsrådgivare
✅ **Professionell layout** i guld/svart med er grafiska profil

---

## 🔧 UPPDATERA PRODUKTER

### Manual uppdatering:
1. Öppna `product_database.js` i textredigerare
2. Hitta rätt kategori (lasare, centralapparater, tillbehor, ellas)
3. Lägg till produkt i JSON-format:
```javascript
{
  "artikelnummer": "2-XXXX",
  "e_nummer": "1234567",
  "benamning": "Produktnamn",
  "rabattgrupp": "V",
  "pris": 5990
}
```
4. Spara och starta om servern

### Automatisk uppdatering (när du får ny prislista):
1. Ersätt Excel-filen
2. Kontakta Claude för att regenerera databasen

---

## 🔒 LÄGGA TILL ELLÅS-PRODUKTER

När du får ellås-prislistan:
1. Öppna `product_database.js`
2. Hitta kategorin `"ellas": []`
3. Lägg till produkter mellan hakparenteserna
4. Spara filen
5. Ellås-kategorin aktiveras automatiskt

---

## 💾 SPARA OFFERTER (KOMMANDE FUNKTION)

I nästa version kommer du att kunna:
- Spara offerter och återanvända dem
- Exportera till Excel
- Skicka offert direkt via e-post
- Integrera med fakturasystem

---

## 📁 FILER I SYSTEMET

**Huvudfiler:**
- `offertsystem.html` - Användargränssnittet
- `app.js` - Programlogik
- `product_database.js` - Produktdatabas (322 produkter från Axema)
- `server.py` - Python-server för PDF-generering
- `generate_pdf.py` - PDF-generator med er grafiska profil
- `Treteclogo.jpg` - Er logotyp

**Startfiler:**
- `START_SERVER.bat` - Windows
- `START_SERVER.sh` - Mac/Linux

**Data:**
- `Prislista-2025_07_01.xlsx` - Original prislista från Axema

---

## 🛠️ TEKNISKA KRAV

**Nödvändigt:**
- Python 3.7 eller senare
- Webbläsare (Chrome, Firefox, Edge, Safari)

**Installeras automatiskt:**
- Flask (webbserver)
- Flask-CORS (säkerhet)
- ReportLab (PDF-generering)

---

## ❓ FELSÖKNING

**Problem: Servern startar inte**
- Kontrollera att Python är installerat: `python --version`
- Installera Python från: https://www.python.org/downloads/
- Kör startskriptet igen

**Problem: PDF genereras inte**
- Kontrollera att alla filer ligger i samma mapp
- Se till att `Treteclogo.jpg` finns i mappen
- Starta om servern

**Problem: Produkter visas inte**
- Kontrollera att `product_database.js` finns
- Ladda om sidan (F5)
- Kontrollera webbläsarens konsol (F12) för felmeddelanden

---

## 🆘 SUPPORT

Kontakta Claude för:
- Uppdatering av produktdatabas
- Nya funktioner
- Anpassningar
- Buggfixar
- Integration med andra system

---

## 📈 KOMMANDE FUNKTIONER

**Nästa uppdatering:**
- Spara/ladda offerter
- Export till Excel
- Automatisk e-post till kund
- Historik över tidigare offerter

**Framtida:**
- Integration med Visma/Fortnox
- Automatisk lagersynkning
- Mobil app
- CRM-integration

---

## 🎉 FÖRDELAR MED SYSTEMET

✨ **Snabbt** - Skapa offerter på minuter istället för timmar
✨ **Professionellt** - PDF:er med er grafiska profil
✨ **Flexibelt** - Anpassa villkor per projekt
✨ **Sökbart** - Hitta produkter blixtsnabbt
✨ **Felfritt** - Automatiska beräkningar
✨ **Skalbart** - Enkelt att lägga till fler produkter/kategorier

---

**Version 2.0 med PDF** - Januari 2026
Utvecklad för Tretec Larm AB

För frågor eller support, kontakta systemutvecklaren.
