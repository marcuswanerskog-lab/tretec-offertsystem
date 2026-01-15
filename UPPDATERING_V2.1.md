# UPPDATERING TILL VERSION 2.1 🎉

## 🚀 NYA FUNKTIONER

### ✅ **1. ELLÅS-KATEGORIN AKTIVERAD!**

**19 nya produkter:**
- Abloy Eltryckeslås EL580 - 7,665 kr
- Motorlås STEP 352 Höger ink kabel 10m - 14,381 kr
- Karmöverföring Roca 5408R (modell EA281) - 0 kr (ej prissatt än)
- Styrenhet ST300C - 0 kr (ej prissatt än)
- Låscylindrar, dubbel rund - 5,000 kr
- Behör till cylinder - 1,000 kr
- Nycklar - 350 kr
- ... och 12 andra ellås-produkter

**Priserna är era nettopriser (exkl. moms)**
- Priser tagna direkt från Låsgiganten
- Moms tillkommer för kunden (+ 25%)

---

### ✅ **2. PRODUKTSPECIFIKA RABATTER!**

Nu kan du sätta rabatt% på **varje enskild produkt**!

**Exempel:**
```
┌────────────────────────────────────────────┐
│ 2x A76 Läsare        6,290 kr              │
│    Antal: [2]  Rabatt%: [10]               │
│    -10% = 5,661 kr/st → 11,322 kr totalt   │
│                                            │
│ 1x Batteri            480 kr               │
│    Antal: [1]  Rabatt%: [  ]               │
│    480 kr totalt                           │
└────────────────────────────────────────────┘
```

**Användningsfall:**
- Kampanj på A76: 10% rabatt
- Volymrabatt på taggar: 40% rabatt
- Tillfällig rabatt på specifika produkter

---

### ✅ **3. BUGFIXAR**

**Fixat:**
- "Nästa: Granska"-knappen fungerar nu korrekt
- Ellås-kategorin är aktiv och sökbar
- Produktrabatter beräknas korrekt i alla steg

---

## 📦 HUR DU UPPDATERAR

### **Steg 1: Stoppa servern**
Tryck `Ctrl+C` i Command Prompt-fönstret

### **Steg 2: Ersätt filer**
Ersätt dessa 3 filer i din Dropbox-mapp:
- ✅ **offertsystem.html** (uppdaterad)
- ✅ **app.js** (uppdaterad)
- ✅ **product_database.js** (uppdaterad med ellås)

### **Steg 3: Starta om servern**
Dubbelklicka på `START_SERVER.bat`

### **Steg 4: Ladda om webbläsaren**
Tryck `Ctrl+F5` (hård omladdning)

---

## 🎯 VAD DU SKA SE

### **Steg 2: Produkter**

**NY kategori:**
```
🔒 Ellås
   19 produkter
   [Sök ellås...]
```

Klicka för att öppna och se alla ellås-produkter!

**I valda produkter:**
```
┌────────────────────────────────────────┐
│ Produkt    Pris   Antal  Rabatt%  Total│
│ A76 Läsare 6290kr  [2]    [10]   11322kr│
│                    ↑      ↑             │
│                 Ändra  Kampanj-         │
│                 antal  rabatt!          │
└────────────────────────────────────────┘
```

---

## 💡 HUR MAN ANVÄNDER PRODUKTRABATTER

### **Scenario 1: Kampanj på läsare**
1. Välj A76 Läsare
2. I "Valda Produkter", fyll i "10" i Rabatt%-fältet
3. Priset uppdateras automatiskt: 6,290 kr → 5,661 kr
4. I sammanfattningen visas: "6,290 kr (-10% = 5,661 kr)"

### **Scenario 2: Volymrabatt på taggar**
1. Välj 50 st taggar á 49 kr
2. Sätt rabatt% till 40
3. Nytt pris: 49 kr → 29,40 kr/st
4. Total: 1,470 kr (istället för 2,450 kr)

### **Scenario 3: Kombination med kundrabatt**
1. Produktrabatt: A76 får 10% (kampanj)
2. Total produkter efter produktrabatt: 50,000 kr
3. Kundrabatt: 5% på allt (större kund)
4. Extra rabatt: -500 kr (fritext)
5. **Slutpris:** 47,000 kr

---

## 📊 BERÄKNINGSORDNING

```
1. PRODUKTPRIS × ANTAL = Summa per produkt
2. PRODUKTRABATT% appliceras per produkt
3. Alla produkter summeras → Delsumma produkter
4. Tjänster läggs till → Summa före rabatt
5. KUNDRABATT% appliceras på allt
6. EXTRA RABATT dras av
7. = TOTALPRIS
```

---

## 🔧 LÄGGA TILL FLER ELLÅS-PRODUKTER

### **Alternativ 1: Manuellt**
1. Öppna `product_database.js` i textredigerare
2. Hitta `"ellas": [` (rad ~XXX)
3. Lägg till produkt:
```javascript
{
  "artikelnummer": "ELLAS-020",
  "e_nummer": "",
  "benamning": "Motorlås STEP 353",
  "lagsta_orderantal": null,
  "rabattgrupp": "E",
  "pris": 15500.0
}
```
4. Spara och starta om servern

### **Alternativ 2: Skicka lista till Claude**
Skicka mig en lista med produkter + priser, jag lägger till dem!

---

## ❓ FELSÖKNING

**Problem: Ellås-kategorin syns inte**
→ Tryck Ctrl+F5 för hård omladdning
→ Kontrollera att `product_database.js` är uppdaterad

**Problem: Rabatt%-fält fungerar inte**
→ Kontrollera att både `offertsystem.html` OCH `app.js` är uppdaterade
→ Starta om servern

**Problem: Beräkningar stämmer inte**
→ Kontrollera att alla tre filer är ersatta
→ Ladda om sidan helt (Ctrl+F5)

---

## 📈 STATISTIK

**Version 2.1:**
- 342 produkter totalt (+19 nya)
- 4 kategorier (Läsare, Dörrcentraler, Tillbehör, **Ellås**)
- Ny funktion: Produktspecifika rabatter
- 3 bugfixar

---

## 🎉 TESTA!

1. **Skapa ny offert**
2. **Öppna Ellås-kategorin** - se alla 19 produkter
3. **Välj några produkter**
4. **Sätt rabatt%** på en produkt (t.ex. 10%)
5. **Se priset uppdateras** direkt
6. **Gå till sammanfattning** - rabatterna visas tydligt
7. **Generera PDF** - allt ska vara med!

---

## 🚀 NÄSTA STEG (Version 2.2)

Om du vill ha:
- ✅ Hämta ALLA produkter från Låsgiganten (200+ ellås-produkter)
- ✅ "Lägg till egen produkt"-knapp
- ✅ Spara egen produkt till databasen
- ✅ Prisuppdateringsverktyg (GUI)
- ✅ Smart checklista

**Säg bara till!** 😊

---

**Version 2.1** - 11 januari 2026  
Tretec Larm AB Offertsystem

**Ändringar:**
- ✅ Ellås-kategorin aktiverad (19 produkter)
- ✅ Produktspecifika rabatter
- ✅ Bugfixar (Nästa-knappen)
- ✅ Förbättrade beräkningar
