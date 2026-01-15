# Tre förbättringar att implementera

## 1. AUTO-SPARA VID PDF-GENERERING
**Problem:** Risk att tappa offert om man glömmer spara innan PDF
**Lösning:** Auto-spara offerten när man klickar "Generera PDF"

## 2. SPARA KUND VID OFFERTSPARA
**Problem:** Kunden sparas inte när offerten sparas
**Lösning:** 
- Kolla om kunden redan finns (org.nr)
- Om ny kund -> spara automatiskt
- Om befintlig kund -> uppdatera info om ändrad

## 3. AFFÄRSAVTAL/ORDERBEKRÄFTELSE
**Inspiration från dina dokument:**

### Lantmännen-avtalet (NLM 19):
- Formellt köpavtal
- Betalningsplan (30%, 30%, 40%)
- Tekniska krav & specifikationer
- Tidplan med milstolpar
- Garanti & serviceavtal
- Juridisk grund (svensk lag, skiljedom)

### Wiretronic-avtalet:
- Enklare "Avtal/Offert" format
- Tydlig prissammanfattning
- Servicenivåer (Grund/Full)
- Garanti (5 år)
- Projektmöten inkluderade
- Checkboxar för serviceval

**Förslag för Tretec:**
Skapa en hybrid som är:
- Proffsig men inte överdrivet juridisk
- Tydlig betalningsplan
- Servicevalsalternativ
- Enkel att generera från befintlig offert
- Signeringsyta för båda parter

