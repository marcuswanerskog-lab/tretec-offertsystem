// ==================== FIXES FOR AUTO-SAVE ====================

// FIX 1: Auto-save quote before generating PDF
async function generatePDF() {
    console.log('📄 Starting PDF generation...');
    
    // FIRST: Auto-save the quote
    console.log('💾 Auto-saving quote before PDF generation...');
    const saveResult = await saveQuote();
    
    if (!saveResult) {
        showNotification('Kunde inte spara offerten innan PDF-generering', 'error');
        return;
    }
    
    console.log('✅ Quote auto-saved successfully');
    
    // THEN: Validate quote data
    const quoteData = gatherQuoteData();
    
    if (!quoteData.customer.name || !quoteData.customer.orgNumber) {
        showNotification('Fyll i kunduppgifter först', 'error');
        return;
    }
    
    if (selectedProducts.length === 0) {
        showNotification('Lägg till minst en produkt', 'error');
        return;
    }
    
    // FINALLY: Generate PDF
    try {
        const response = await fetch('/generate-pdf', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(quoteData)
        });
        
        if (!response.ok) throw new Error('PDF generation failed');
        
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Offert_${quoteData.customer.name.replace(/ /g, '_')}_${quoteData.date}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        showNotification('✅ PDF genererad och sparad!', 'success');
        
    } catch (error) {
        console.error('PDF generation error:', error);
        showNotification('Kunde inte generera PDF: ' + error.message, 'error');
    }
}


// FIX 2: Save customer when saving quote
async function saveQuote() {
    console.log('💾 Saving quote...');
    
    const quoteData = gatherQuoteData();
    
    // Validate
    if (!quoteData.customer.name) {
        showNotification('Kundnamn krävs', 'error');
        return false;
    }
    
    // FIRST: Save or update customer
    const customerSaved = await saveCustomerIfNeeded(quoteData.customer);
    if (!customerSaved) {
        showNotification('Kunde inte spara kund', 'error');
        return false;
    }
    
    // THEN: Save quote
    try {
        let quotes = JSON.parse(localStorage.getItem('quotes') || '[]');
        
        // Generate quote number if new
        if (!quoteData.quoteNumber) {
            const year = new Date().getFullYear();
            const lastQuote = quotes.filter(q => q.quoteNumber?.startsWith(`${year}-`))
                                    .sort((a, b) => b.quoteNumber.localeCompare(a.quoteNumber))[0];
            
            const nextNum = lastQuote 
                ? parseInt(lastQuote.quoteNumber.split('-')[1]) + 1 
                : 1;
            
            quoteData.quoteNumber = `${year}-${String(nextNum).padStart(4, '0')}`;
        }
        
        // Find and update or add new
        const existingIndex = quotes.findIndex(q => q.quoteNumber === quoteData.quoteNumber);
        
        if (existingIndex >= 0) {
            quotes[existingIndex] = quoteData;
            console.log('📝 Updated existing quote:', quoteData.quoteNumber);
        } else {
            quotes.push(quoteData);
            console.log('✨ Created new quote:', quoteData.quoteNumber);
        }
        
        localStorage.setItem('quotes', JSON.stringify(quotes));
        
        // Update current quote number display
        document.getElementById('quoteNumber').value = quoteData.quoteNumber;
        
        showNotification(`✅ Offert ${quoteData.quoteNumber} sparad!`, 'success');
        return true;
        
    } catch (error) {
        console.error('Error saving quote:', error);
        showNotification('Kunde inte spara offert: ' + error.message, 'error');
        return false;
    }
}


// FIX 3: New function to save customer if needed
async function saveCustomerIfNeeded(customerData) {
    console.log('👤 Checking if customer needs to be saved...', customerData);
    
    if (!customerData.orgNumber && !customerData.name) {
        console.log('⚠️ No customer data to save');
        return true; // Not an error, just nothing to save
    }
    
    try {
        let customers = JSON.parse(localStorage.getItem('customers') || '[]');
        
        // Find existing customer by org number or name
        const existingIndex = customers.findIndex(c => 
            (customerData.orgNumber && c.orgNumber === customerData.orgNumber) ||
            (c.name === customerData.name)
        );
        
        if (existingIndex >= 0) {
            // Update existing customer
            customers[existingIndex] = {
                ...customers[existingIndex],
                ...customerData,
                updatedAt: new Date().toISOString()
            };
            console.log('📝 Updated existing customer:', customerData.name);
        } else {
            // Add new customer
            const newCustomer = {
                ...customerData,
                id: Date.now(),
                createdAt: new Date().toISOString()
            };
            customers.push(newCustomer);
            console.log('✨ Created new customer:', customerData.name);
        }
        
        localStorage.setItem('customers', JSON.stringify(customers));
        
        // Refresh customer list if on that view
        if (typeof loadCustomers === 'function') {
            loadCustomers();
        }
        
        return true;
        
    } catch (error) {
        console.error('Error saving customer:', error);
        return false;
    }
}

