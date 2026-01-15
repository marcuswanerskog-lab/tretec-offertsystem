# UPPDATERING TILL VERSION 2.0 🎉

## 🚀 NYA FUNKTIONER

### ✅ **1. SMARTA TJÄNSTEBERÄKNINGAR**
**Kabeldragning:**
- Timmar: 8 (förinställt, editerbart)
- á-pris: 695 kr (förinställt, editerbart)  
- Summa: Beräknas automatiskt (8 × 695 = 5,560 kr)

**Resor/Installation:**
- Timmar: (tomt, fyll i)
- á-pris: 895 kr (förinställt, editerbart)
- Summa: Beräknas automatiskt

**Projektering:**
- Timmar: (tomt, fyll i)
- á-pris: 995 kr (förinställt, editerbart)
- Summa: Beräknas automatiskt

**Övrigt material:**
- Fritextbelopp (som tidigare)

---

### ✅ **2. UPPDATERADE PRODUKTER**

**Nya produkter:**
- Batteri 12V 7,2Ah - 480 kr (längst upp i Tillbehör)

**Prisjusteringar:**
- ALLA Tag/Passerbrickor → 49 kr (78 produkter uppdaterade!)
- Inkluderar: PROX TAG, Passerbricka EM, MF, DESFire, etc.

---

### ✅ **3. EXTRA RABATTER**

**Fritext rabattrad:**
- Beskrivning: T.ex. "40% rabatt på taggar"
- Belopp: Minusbelopp som dras från totalen
- Visas separat i sammanfattningen

**Exempel:**
```
Summa före rabatt: 50,000 kr
Kundrabatt (5%): -2,500 kr
40% rabatt på taggar: -500 kr
TOTALT: 47,000 kr
```

---

### ✅ **4. FÖRBÄTTRAD PDF-GENERERING**

PDF:en innehåller nu:
- Tim-baserade tjänster med uträkning (8 tim × 695 kr = 5,560 kr)
- Extra rabattrad med fritext
- Uppdaterade produktpriser

---

## 📦 HUR DU UPPDATERAR

### **Steg 1: Stoppa servern**
I Command Prompt-fönstret där servern körs:
- Tryck `Ctrl+C`

### **Steg 2: Ersätt filer**
Ersätt dessa filer i din mapp:
- ✅ offertsystem.html
- ✅ app.js
- ✅ product_database.js
- ✅ generate_pdf.py

Behåll som de är:
- server.py (oförändrad)
- Treteclogo.jpg (oförändrad)
- START_SERVER.bat (oförändrad)

### **Steg 3: Starta om servern**
Dubbelklicka på `START_SERVER.bat` eller kör:
```
python server.py
```

### **Steg 4: Ladda om webbläsaren**
- Tryck `Ctrl+F5` (hård omladdning) i webbläsaren
- Eller stäng och öppna http://localhost:5000 igen

---

## 🎯 VAD DU SKA SE

### **Steg 3: Tjänster & Installation**

**Före:**
```
Kabeldragning: [_____] kr
```

**Efter:**
```
Kabeldragning: [8] timmar × [695] kr/tim = [5560] kr (auto)
```

**Nya sektionen under tjänster:**
```
EXTRA RABATTER
Fritext rabatt: [40% rabatt på taggar]
Rabattbelopp: [500] kr
```

---

## 🔍 TESTA ATT ALLT FUNGERAR

1. **Skapa ny offert**
2. **Välj några produkter** - kolla att Batteri finns och Tag-produkter kostar 49 kr
3. **Steg 3:** Fyll i 8 timmar kabeldragning - summan ska bli 5,560 kr automatiskt
4. **Steg 3:** Lägg till extra rabatt - t.ex. "40% på taggar: 500 kr"
5. **Steg 4:** Granska sammanfattning - alla rabatter ska visas
6. **Generera PDF** - kolla att allt ser bra ut

---

## ❓ FELSÖKNING

**Problem: Nya funktioner visas inte**
→ Tryck `Ctrl+F5` för hård omladdning i webbläsaren

**Problem: Priser inte uppdaterade**
→ Kontrollera att du ersatt `product_database.js`

**Problem: Summa beräknas inte automatiskt**
→ Kontrollera att du ersatt både `offertsystem.html` OCH `app.js`

**Problem: PDF genereras inte**
→ Starta om servern

---

## 📊 STATISTIK

**Version 2.0:**
- 323 produkter (1 ny)
- 78 produkter prisjusterade
- 4 nya funktioner
- 3 förbättrade beräkningar

---

## 🎉 KLART!

Systemet är nu uppgraderat med alla funktioner du efterfrågade!

**Nästa steg du önskade:**
- ✅ Tim-baserade tjänster
- ✅ Batteri 480 kr
- ✅ Tag-produkter 49 kr
- ✅ Extra rabattrad
- ⏳ Smart checklista (kommer i v2.1)
- ⏳ Prisuppdateringsverktyg (kommer i v2.1)

**Frågor? Feedback?** Testa systemet och säg till! 😊

---

**Version 2.0** - 11 januari 2026
Tretec Larm AB Offertsystem
