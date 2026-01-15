// ==================== KOMPATIBEL VERSION AV generateContract ====================
// Denna version fungerar med befintlig saveQuote() från din app_v3.js

async function generateContract() {
    console.log('📄 Starting contract generation...');
    
    try {
        // Samla quote-data
        const quoteData = gatherQuoteData();
        
        // Validera
        if (!quoteData.customer || !quoteData.customer.name) {
            showNotification('Fyll i kundnamn först', 'error');
            return;
        }
        
        if (!quoteData.customer.orgNumber) {
            showNotification('Fyll i organisationsnummer först', 'error');
            return;
        }
        
        if (!quoteData.selectedProducts || quoteData.selectedProducts.length === 0) {
            showNotification('Lägg till minst en produkt', 'error');
            return;
        }
        
        // Spara offert först (använd den befintliga saveQuote om den finns)
        if (typeof saveQuote === 'function') {
            console.log('💾 Saving quote first...');
            try {
                await saveQuote();
            } catch (e) {
                console.log('⚠️ Could not save quote, continuing anyway...', e);
            }
        }
        
        // Generera avtalet
        console.log('📋 Generating contract PDF...');
        showNotification('Genererar affärsavtal...', 'info');
        
        const response = await fetch('/generate-contract', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(quoteData)
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Server error: ${response.status} - ${errorText}`);
        }
        
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Avtal_${quoteData.customer.name.replace(/ /g, '_')}_${quoteData.date || new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        showNotification('✅ Affärsavtal genererat!', 'success');
        
    } catch (error) {
        console.error('❌ Contract generation error:', error);
        showNotification('Kunde inte generera avtal: ' + error.message, 'error');
    }
}

// Exponera funktionen
window.generateContract = generateContract;
