# TRETEC LARM - OFFERTSYSTEM V3.0 🎉

## 🚀 NYTT I VERSION 3.0

Detta är en **komplett ombyggnad** av offertsystemet med fokus på:

### ✨ HUVUDFUNKTIONER

1. **KUNDHANTERING (CRM)**
   - Lägg till, redigera och ta bort kunder
   - Automatisk kundnummergenerering (smart upplägg: 1001, 1002, 1003...)
   - Sök kunder på organisationsnummer eller namn
   - Full fakturahantering med separata fakturauppgifter

2. **PRODUKTHANTERING**
   - Lägg till nya produkter direkt i systemet
   - Redigera befintliga produkter (namn, pris, kategori, leverantör)
   - Ta bort produkter
   - Filtrera och sök i produktdatabasen
   - Stöd för alla kategorier (Läsare, Centralapparater, Tillbehör, Ellås)

3. **OFFERTHANTERING**
   - Skapa nya offerter med 5-stegs-process
   - Spara offerter för framtida redigering
   - Visa alla skapade offerter med status
   - Redigera befintliga offerter
   - Ta bort offerter

4. **KOMPLETT OFFERTPROCESS**
   - **Steg 1:** Kunduppgifter (sök befintlig eller lägg till ny)
   - **Steg 2:** Produktval med kategorier och sökfunktion
   - **Steg 3:** Tjänster (timmar × á-pris med auto-beräkning)
   - **Steg 4:** Villkor och serviceavtal
   - **Steg 5:** Sammanfattning med full översikt

5. **DASHBOARD**
   - Översikt över alla offerter, kunder och produkter
   - Snabbknappar för att skapa nya offerter
   - Statistik i realtid

---

## 📁 FILER I SYSTEMET

**NYA FILER (V3.0):**
- **offertsystem_v3.html** - Nya huvudfilen
- **app_v3.js** - Nya JavaScript-logiken
- **server_v3.py** - Uppdaterad Python-server

**BEFINTLIGA FILER (från ditt gamla system):**
- **product_database.js** - Din produktdatabas (fungerar direkt!)
- **generate_pdf.py** - PDF-generator (behöver ev. uppdateras)
- **Treteclogo.jpg** - Er logotyp

**GAMLA FILER (kan sparas som backup):**
- **offertsystem.html** - Gamla systemet
- **app.js** - Gammal logik
- **server.py** - Gammal server

---

## 🛠️ INSTALLATION & ANVÄNDNING

### **1. Kopiera filer**

Kopiera de NYA filerna till din offertsystem-mapp:
```
offertsystem_v3.html   (NYA huvudfilen)
app_v3.js             (NYA JavaScript-filen)
server_v3.py          (NYA servern)
```

Behåll dessa filer från ditt gamla system:
```
product_database.js   (Din produktdatabas - fungerar direkt!)
generate_pdf.py       (PDF-generator)
Treteclogo.jpg        (Er logotyp)
```

**REKOMMENDATION:** Flytta dina gamla filer till en backup-mapp först:
```
mkdir backup_v2
move offertsystem.html backup_v2/
move app.js backup_v2/
move server.py backup_v2/
```

### **2. Starta servern**

**Windows:**
```
python server_v3.py
```

**Mac/Linux:**
```
python3 server_v3.py
```

**ALTERNATIVT:** Om du vill använda din gamla server.py:
- Byt namn på `server_v3.py` till `server.py`
- Eller kör: `python server_v3.py`

### **3. Öppna systemet**

Gå till: **http://localhost:5000**

Systemet laddar automatiskt `offertsystem_v3.html`!

---

## 🎯 HUR DU ANVÄNDER SYSTEMET

### **DASHBOARD (Startsida)**

När du öppnar systemet ser du 4 stora knappar:
1. ✨ **Skapa ny offert** - Starta en ny offertprocess
2. 📋 **Visa offerter** - Se alla skapade offerter
3. 👥 **Kundregister** - Hantera kunduppgifter
4. 📦 **Produktdatabas** - Lägg till/redigera produkter

---

### **SKAPA NY OFFERT**

**Steg 1: Kunduppgifter**
- Sök befintlig kund (börja skriva org.nr eller namn)
- ELLER fyll i manuellt
- Kundnummer genereras automatiskt
- Fyll i fakturauppgifter om de skiljer sig från kundens adress

**Steg 2: Välj Produkter**
- Klicka på kategorier för att öppna dem
- Sök produkter
- Klicka på produkter för att välja dem
- Justera antal och produktspecifik rabatt% för varje produkt

**Steg 3: Tjänster**
- Fyll i timmar för:
  - Kabeldragning (förinställt: 8 tim × 695 kr)
  - Installation/montering (förinställt: 0 tim × 895 kr)
  - Projektering/utbildning (förinställt: 0 tim × 995 kr)
- Summan beräknas automatiskt

**Steg 4: Villkor**
- Skriv projektspecifika villkor
- Ange kundrabatt% (gäller på allt)
- Lägg till extra rabatt (t.ex. "40% på taggar: 500 kr")
- Välj säkerhetsrådgivare (Marcus eller Pekka)
- Välj om serviceavtal ska visas

**Steg 5: Sammanfattning**
- Granska allt
- **💾 Spara offert** - Sparar offerten för framtida redigering
- **📄 Generera PDF** - Skapar en PDF-offert

---

### **HANTERA KUNDER**

Klicka på **"Kunder"** i toppmenyn.

**Lägg till ny kund:**
1. Klicka **"+ Lägg till kund"**
2. Fyll i företagsnamn och org.nr (obligatoriskt)
3. Fyll i kontaktuppgifter
4. Klicka **"💾 Spara kund"**

**Redigera kund:**
1. Klicka **"✏️ Redigera"** på kunden
2. Ändra uppgifter
3. Klicka **"💾 Spara kund"**

**Ta bort kund:**
1. Klicka **"🗑️ Ta bort"**
2. Bekräfta

**Sök kunder:**
- Använd sökfältet överst
- Sök på namn, org.nr eller kundnummer

---

### **HANTERA PRODUKTER**

Klicka på **"Produkter"** i toppmenyn.

**Lägg till ny produkt:**
1. Klicka **"+ Lägg till produkt"**
2. Fyll i:
   - Artikelnummer/SKU
   - Benämning
   - Kategori (Läsare, Centralapparater, Tillbehör, Ellås)
   - Pris (kr)
   - Leverantör (valfritt)
   - Rabattgrupp (valfritt)
3. Klicka **"💾 Spara produkt"**

**Redigera produkt:**
1. Klicka **"✏️ Redigera"** på produkten
2. Ändra uppgifter
3. Om du byter kategori flyttas produkten automatiskt
4. Klicka **"💾 Spara produkt"**

**Ta bort produkt:**
1. Klicka **"🗑️ Ta bort"**
2. Bekräfta

**Sök och filtrera:**
- Använd sökfältet
- Välj kategori i dropdownen

---

### **HANTERA OFFERTER**

Klicka på **"Offerter"** i toppmenyn.

**Visa alla offerter:**
- Se offertnummer, datum, kund, belopp och status

**Redigera offert:**
1. Klicka **"✏️ Redigera"**
2. Systemet laddar all data från offerten
3. Ändra vad du vill
4. Spara igen

**Ta bort offert:**
1. Klicka **"🗑️ Ta bort"**
2. Bekräfta

---

## 💡 SMARTA FUNKTIONER

### **Kundnummergenerering**

Systemet genererar automatiskt kundnummer:
- Första kunden: 1001
- Andra kunden: 1002
- Tredje kunden: 1003
- osv.

### **Offertnummergenerering**

Offerter får automatiska nummer:
- Format: `ÅÅÅÅ-XXXX`
- Exempel: `2026-0001`, `2026-0002`, osv.

### **Produktspecifika rabatter**

Du kan sätta olika rabatt% på varje produkt:
- Produkt A: 10% rabatt
- Produkt B: 0% rabatt
- Produkt C: 40% rabatt

### **Automatiska beräkningar**

- Produkttotaler beräknas direkt
- Tjänster: timmar × á-pris = total
- Kundrabatt appliceras på allt
- Extra rabatt dras av sist

---

## 📊 DATA SPARAS I WEBBLÄSAREN

All data (kunder, offerter, produkter) sparas i **localStorage** i din webbläsare.

**Detta betyder:**
- ✅ Data finns kvar när du stänger och öppnar igen
- ✅ Ingen databas behövs
- ❗ Data försvinner om du rensar webbläsarens cache/data
- ❗ Data finns bara på DEN datorn

**Framtida version:**
- Vi kan lägga till export/import-funktion
- Vi kan lägga till databas för delad åtkomst

---

## 🔄 MIGRATION FRÅN GAMLA SYSTEMET

### **Produkter**

Ditt gamla `product_database.js` fungerar direkt!
Systemet läser automatiskt från den filen.

Om filen inte hittas används localStorage istället.

### **Kunder & Offerter**

Gamla systemet hade ingen kundhantering, så här börjar du från scratch.

Men det går snabbt att lägga till kunder - ta gamla offerter och lägg in kunderna manuellt (tar ~1 min per kund).

---

## 🐛 KÄNDA BEGRÄNSNINGAR

1. **PDF-generering kräver server**
   - Du måste ha Python-servern igång
   - PDF-generatorn (`generate_pdf.py`) måste uppdateras för nya formatet

2. **Ingen avtalsgenerering än**
   - Kommer i nästa version
   - Kommer skapa professionella avtal baserat på dina uppladdade mallar

3. **Ingen export/import**
   - Kommer i nästa version

---

## 🚀 KOMMANDE FUNKTIONER (V3.1)

### **Högt prioriterade:**

1. **Avtalsgenerering**
   - När kund tackar ja till offert
   - Skapa "Tack för beställningen"-avtal
   - Baserat på Lantmännen- eller Wiretronic-mallen
   - Med alla detaljer från offerten

2. **Export/Import**
   - Exportera alla kunder till Excel/CSV
   - Importera kunder från Excel/CSV
   - Backup och återställning

3. **Förbättrad PDF**
   - Uppdatera `generate_pdf.py` för nya formatet
   - Inkludera alla nya fält
   - Snygga tabeller för produkter

4. **Status-hantering**
   - Ändra status på offerter: Utkast → Skickad → Accepterad → Avtal skapat
   - Visuella indikatorer

### **Medel prioritet:**

5. **E-post-integration**
   - Skicka offert direkt till kund via e-post

6. **Mallar**
   - Spara offerter som mallar
   - Återanvänd för liknande projekt

7. **Sökförbättringar**
   - Sök på mer fält
   - Avancerade filter

---

## 📞 SUPPORT & FEEDBACK

Har du frågor, hittat buggar eller vill ha nya funktioner?

**Kontakta Claude!** 😊

---

## ✅ CHECKLISTA FÖR ATT KOMMA IGÅNG

- [ ] Kopiera alla filer till samma mapp
- [ ] Starta Python-servern (`python server.py`)
- [ ] Öppna http://localhost:5000
- [ ] Lägg till några testkunder
- [ ] Lägg till några testprodukter (eller använd befintliga)
- [ ] Skapa en testoffert
- [ ] Spara och testa redigering

---

**Version 3.0** - 15 januari 2026
Tretec Larm AB Offertsystem

🎉 **Grattis till ditt nya system!** 🎉
