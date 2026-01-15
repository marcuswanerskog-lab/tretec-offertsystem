# SNABB INSTALLATION - OFFERTSYSTEM V3.0

## 🚀 STEG-FÖR-STEG

### 1. BACKUP (VIKTIGT!)

Skapa en backup av ditt nuvarande system först:

**Windows:**
```cmd
mkdir backup_v2
copy offertsystem.html backup_v2\
copy app.js backup_v2\
copy server.py backup_v2\
```

**Mac/Linux:**
```bash
mkdir backup_v2
cp offertsystem.html backup_v2/
cp app.js backup_v2/
cp server.py backup_v2/
```

---

### 2. KOPIERA NYA FILER

Lägg de här 3 NYA filerna i din offertsystem-mapp:

✅ `offertsystem_v3.html`
✅ `app_v3.js`
✅ `server_v3.py`

**BEHÅLL** dessa filer (de fungerar direkt):

✅ `product_database.js`
✅ `generate_pdf.py`
✅ `Treteclogo.jpg`

---

### 3. STARTA SERVERN

**Alternativ A (rekommenderat):**
```
python server_v3.py
```

**Alternativ B (om du vill ersätta gamla servern):**
```
del server.py          (eller: rm server.py på Mac/Linux)
ren server_v3.py server.py    (eller: mv server_v3.py server.py)
python server.py
```

---

### 4. ÖPPNA SYSTEMET

Gå till: **http://localhost:5000**

✅ Systemet laddar automatiskt den nya versionen!

---

## 🎯 SNABBTEST

1. Klicka på **"Kunder"** → Lägg till en testkund
2. Klicka på **"Produkter"** → Kolla att dina produkter finns
3. Klicka på **"Skapa ny offert"** → Skapa en testoffert

---

## ❓ PROBLEM?

**"Produkter visas inte"**
→ Kontrollera att `product_database.js` finns i mappen

**"Systemet hittar inte app_v3.js"**
→ Kontrollera att alla 3 filer ligger i samma mapp

**"Server startar inte"**
→ Kör: `pip install flask flask-cors reportlab`

---

## 📞 BEHÖVER HJÄLP?

Kontakta Claude med:
- Skärmdump av problemet
- Felmeddelande från konsolen (F12 i webbläsaren)
- Vilket steg du är på

---

**Lycka till! 🎉**
