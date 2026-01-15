# FELSÖKNING - KNAPPAR FUNGERAR INTE

## 🔴 PROBLEM: Inga knappar fungerar på första sidan

### SYMPTOM
- Du öppnar systemet
- Ser dashboard med 4 stora knappar
- Men när du klickar händer ingenting
- Eventuellt felmeddelande i Console (F12)

---

## ✅ LÖSNING

Detta beror på att JavaScript-funktionerna inte var globalt tillgängliga.

### Steg 1: Uppdatera filer

Ladda ner och ersätt dessa filer med de nya versionerna:

1. **app_v3.js** - Fixad version med globala funktioner
2. **offertsystem_v3.html** - Fixad version med rätt script-ordning

### Steg 2: Starta om

1. Stoppa servern (Ctrl+C)
2. Starta igen: `python server_v3.py`
3. Öppna: http://localhost:5000
4. Tryck Ctrl+F5 (hård reload)

### Steg 3: Verifiera

1. Tryck F12 → Console
2. Du ska se: `✅ All functions exposed globally`
3. Om du SER detta: Knappar ska fungera nu!

---

## 🔍 DEBUGGING

### Kontrollera i Console (F12)

**BRA TECKEN:**
```
✅ Product database loaded from product_database.js
✅ All functions exposed globally
```

**DÅLIGA TECKEN:**
```
❌ Uncaught ReferenceError: showView is not defined
❌ Uncaught ReferenceError: createNewQuote is not defined
```

Om du ser dessa fel betyder det att app_v3.js inte är uppdaterad.

---

## 🧪 TESTA FUNKTIONER MANUELLT

I Console (F12), testa att köra:

```javascript
// Testa navigation
showView('customers');
showView('dashboard');

// Testa skapa offert
createNewQuote();
```

Om dessa fungerar är JavaScript OK!

---

## 📁 KONTROLLERA FILERNA

### Kolla att app_v3.js innehåller detta i slutet:

```javascript
// ==================== EXPOSE FUNCTIONS GLOBALLY ====================
window.showView = showView;
window.createNewQuote = createNewQuote;
// ... etc
console.log('✅ All functions exposed globally');
```

Öppna `app_v3.js` i textredigerare och scrolla till ALLRA sist.

Om du INTE ser detta → Filen är inte uppdaterad!

---

## 🔄 ALTERNATIV LÖSNING: Manuell fix

Om du inte kan ladda ner nya filen, gör så här:

1. Öppna `app_v3.js` i textredigerare
2. Gå till ALLRA sist i filen
3. Lägg till detta EFTER `document.head.appendChild(style);`:

```javascript
// Make functions globally accessible
window.showView = showView;
window.createNewQuote = createNewQuote;
window.goToQuoteStep = goToQuoteStep;
window.openCustomerModal = openCustomerModal;
window.closeCustomerModal = closeCustomerModal;
window.saveCustomer = saveCustomer;
window.deleteCustomer = deleteCustomer;
window.filterCustomers = filterCustomers;
window.searchCustomers = searchCustomers;
window.selectCustomer = selectCustomer;
window.openProductModal = openProductModal;
window.closeProductModal = closeProductModal;
window.saveProduct = saveProduct;
window.deleteProduct = deleteProduct;
window.filterProducts = filterProducts;
window.toggleCategory = toggleCategory;
window.toggleProductSelection = toggleProductSelection;
window.updateProductQuantity = updateProductQuantity;
window.updateProductDiscount = updateProductDiscount;
window.removeSelectedProduct = removeSelectedProduct;
window.filterQuoteProducts = filterQuoteProducts;
window.calculateServiceTotals = calculateServiceTotals;
window.saveQuote = saveQuote;
window.generateQuotePDF = generateQuotePDF;
window.filterQuotes = filterQuotes;
window.viewQuote = viewQuote;
window.editQuote = editQuote;
window.deleteQuote = deleteQuote;

console.log('✅ All functions exposed globally');
```

4. Spara filen
5. Starta om servern

---

## 📞 FORTFARANDE PROBLEM?

Skicka:
1. Skärmdump av Console (F12)
2. Första 10 rader av app_v3.js
3. Sista 20 rader av app_v3.js

---

**Nu ska allt fungera! 🎉**
