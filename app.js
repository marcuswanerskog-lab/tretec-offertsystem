// Application State
let currentStep = 1;
let selectedProducts = [];
let quoteData = {
    customer: {},
    products: [],
    services: [],
    discount: 0
};

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    setupEventListeners();
});

function setupEventListeners() {
    // Calculate service totals on page load
    setTimeout(() => {
        calculateServiceTotal(1);
        calculateServiceTotal(2);
        calculateServiceTotal(4);
    }, 100);
}

function calculateServiceTotal(serviceNum) {
    const hours = parseFloat(document.getElementById(`service${serviceNum}_hours`)?.value) || 0;
    const rate = parseFloat(document.getElementById(`service${serviceNum}_rate`)?.value) || 0;
    const total = hours * rate;
    
    const totalInput = document.getElementById(`service${serviceNum}_total`);
    if (totalInput) {
        totalInput.value = total > 0 ? total : '';
    }
    
    // Only update summary if we're on step 4
    if (currentStep === 4 && typeof updateSummary === 'function') {
        updateSummary();
    }
}

// Load products into lists
function loadProducts() {
    ['lasare', 'centralapparater', 'tillbehor', 'ellas'].forEach(category => {
        const container = document.getElementById(category + 'List');
        if (!container) return; // Skip if category doesn't exist in HTML yet
        
        const products = PRODUCT_DB[category];
        
        products.forEach(product => {
            const item = createProductItem(product, category);
            container.appendChild(item);
        });
    });
}

function createProductItem(product, category) {
    const div = document.createElement('div');
    div.className = 'product-item';
    div.onclick = () => addProduct(product, category);
    
    div.innerHTML = `
        <div class="product-info">
            <div class="product-name">${product.benamning}</div>
            <div class="product-meta">
                Art.nr: ${product.artikelnummer} 
                ${product.e_nummer ? `| E-nr: ${product.e_nummer}` : ''}
                | Rabattgrupp: ${product.rabattgrupp}
            </div>
        </div>
        <div class="product-price">${formatPrice(product.pris)} kr</div>
    `;
    
    return div;
}

function addProduct(product, category) {
    // Check if product already exists
    const existing = selectedProducts.find(p => p.artikelnummer === product.artikelnummer);
    if (existing) {
        existing.quantity++;
    } else {
        selectedProducts.push({
            ...product,
            quantity: 1,
            category: category,
            productDiscount: 0  // Individual product discount percentage
        });
    }
    
    updateSelectedProducts();
    updateCategoryCount(category);
}

function removeProduct(artikelnummer) {
    const product = selectedProducts.find(p => p.artikelnummer === artikelnummer);
    if (product) {
        selectedProducts = selectedProducts.filter(p => p.artikelnummer !== artikelnummer);
        updateSelectedProducts();
        updateCategoryCount(product.category);
    }
}

function updateQuantity(artikelnummer, quantity) {
    const product = selectedProducts.find(p => p.artikelnummer === artikelnummer);
    if (product) {
        product.quantity = parseInt(quantity) || 1;
        updateSelectedProducts();
    }
}

function updateProductDiscount(artikelnummer, discount) {
    const product = selectedProducts.find(p => p.artikelnummer === artikelnummer);
    if (product) {
        product.productDiscount = parseFloat(discount) || 0;
        updateSelectedProducts();
    }
}

function updateSelectedProducts() {
    const container = document.getElementById('selectedProductsList');
    
    if (selectedProducts.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📦</div>
                <p>Inga produkter valda ännu</p>
                <p style="font-size: 0.9em; color: #999;">Välj produkter från kategorierna ovan</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = '';
    selectedProducts.forEach(product => {
        const div = document.createElement('div');
        div.className = 'selected-product';
        
        const discount = product.productDiscount || 0;
        const priceAfterDiscount = product.pris * (1 - discount / 100);
        const total = priceAfterDiscount * product.quantity;
        
        div.innerHTML = `
            <div>
                <div class="selected-product-name">${product.benamning}</div>
                <div class="selected-product-article">Art.nr: ${product.artikelnummer}</div>
            </div>
            <div style="color: #666;">
                <div>${formatPrice(product.pris)} kr</div>
                ${discount > 0 ? `<div style="color: #4CAF50; font-size: 0.85em;">-${discount}% = ${formatPrice(priceAfterDiscount)} kr</div>` : ''}
            </div>
            <input type="number" 
                   class="quantity-input" 
                   min="1" 
                   value="${product.quantity}"
                   onchange="updateQuantity('${product.artikelnummer}', this.value)"
                   style="width: 60px;">
            <input type="number" 
                   class="quantity-input" 
                   min="0" 
                   max="100"
                   placeholder="Rabatt%"
                   value="${discount || ''}"
                   onchange="updateProductDiscount('${product.artikelnummer}', this.value)"
                   style="width: 70px;"
                   title="Produktrabatt %">
            <div class="product-total">${formatPrice(total)} kr</div>
            <button class="remove-btn" onclick="removeProduct('${product.artikelnummer}')">✕</button>
        `;
        
        container.appendChild(div);
    });
    
    updateSummary();
}

function updateCategoryCount(category) {
    const count = selectedProducts.filter(p => p.category === category).length;
    const countElement = document.getElementById(category + 'Count');
    if (countElement) {
        countElement.textContent = count + ' valda';
    }
}

function toggleCategory(category) {
    const list = document.getElementById(category + 'List');
    list.classList.toggle('active');
}

function searchProducts(category) {
    const searchInput = document.getElementById('search' + capitalizeFirst(category));
    const searchTerm = searchInput.value.toLowerCase();
    const list = document.getElementById(category + 'List');
    const items = list.querySelectorAll('.product-item');
    
    // Auto-open list when searching
    if (searchTerm) {
        list.classList.add('active');
    }
    
    items.forEach(item => {
        const text = item.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Navigation
function nextStep() {
    // Validation
    if (currentStep === 1) {
        const customerName = document.getElementById('customerName').value.trim();
        if (!customerName) {
            alert('Vänligen ange kundnamn');
            return;
        }
        
        // Save customer data
        quoteData.customer = {
            name: customerName,
            address: document.getElementById('customerAddress').value.trim(),
            contact: document.getElementById('contactPerson').value.trim(),
            email: document.getElementById('contactEmail').value.trim(),
            phone: document.getElementById('contactPhone').value.trim(),
        };
        quoteData.discount = parseFloat(document.getElementById('discount').value) || 0;
    }
    
    if (currentStep === 2) {
        quoteData.products = selectedProducts;
    }
    
    if (currentStep === 3) {
        // Save services with new calculation format
        const service1Total = parseFloat(document.getElementById('service1_total')?.value) || 0;
        const service2Total = parseFloat(document.getElementById('service2_total')?.value) || 0;
        const service3Amount = parseFloat(document.getElementById('service3')?.value) || 0;
        const service4Total = parseFloat(document.getElementById('service4_total')?.value) || 0;
        
        quoteData.services = [
            { 
                name: 'Kabeldragning', 
                amount: service1Total,
                hours: parseFloat(document.getElementById('service1_hours')?.value) || 0,
                rate: parseFloat(document.getElementById('service1_rate')?.value) || 0
            },
            { 
                name: 'Resor, Installation/montering, programmering, driftsättning', 
                amount: service2Total,
                hours: parseFloat(document.getElementById('service2_hours')?.value) || 0,
                rate: parseFloat(document.getElementById('service2_rate')?.value) || 0
            },
            { 
                name: 'Övrigt installationsmaterial', 
                amount: service3Amount 
            },
            { 
                name: 'Projektering, driftsättning, utbildning, dokumentation', 
                amount: service4Total,
                hours: parseFloat(document.getElementById('service4_hours')?.value) || 0,
                rate: parseFloat(document.getElementById('service4_rate')?.value) || 0
            }
        ];
        
        // Save extra discount
        quoteData.extra_discount = {
            text: document.getElementById('extraDiscountText')?.value.trim() || '',
            amount: parseFloat(document.getElementById('extraDiscountAmount')?.value) || 0
        };
        
        // Save settings
        quoteData.custom_terms = document.getElementById('customTerms').value.trim();
        quoteData.advisor = document.getElementById('advisor').value;
        quoteData.show_service_agreement = document.getElementById('showServiceAgreement').checked;
        
        // Generate summary
        generateSummary();
    }
    
    if (currentStep < 4) {
        currentStep++;
        showStep(currentStep);
    }
}

function prevStep() {
    if (currentStep > 1) {
        currentStep--;
        showStep(currentStep);
    }
}

function showStep(step) {
    // Update step indicator
    document.querySelectorAll('.step').forEach((s, index) => {
        s.classList.remove('active', 'completed');
        if (index + 1 < step) {
            s.classList.add('completed');
        } else if (index + 1 === step) {
            s.classList.add('active');
        }
    });
    
    // Show section
    document.querySelectorAll('.section').forEach((s, index) => {
        s.classList.remove('active');
        if (index + 1 === step) {
            s.classList.add('active');
        }
    });
}

function updateSummary() {
    // This is called whenever quantities or services change
    // Full summary generation happens in generateSummary()
}

function generateSummary() {
    const container = document.getElementById('summaryContent');
    
    // Calculate totals using the central function
    const calc = calculateTotals();
    const { subtotal, servicesTotal, totalBeforeDiscount, discountAmount, extraDiscountAmount, grandTotal } = calc;
    
    let html = `
        <div style="background: #f5f5f5; padding: 25px; border-radius: 8px; margin-bottom: 25px;">
            <h3 style="margin-bottom: 15px;">Kunduppgifter</h3>
            <p><strong>Kund:</strong> ${quoteData.customer.name}</p>
            ${quoteData.customer.address ? `<p><strong>Adress:</strong> ${quoteData.customer.address}</p>` : ''}
            ${quoteData.customer.contact ? `<p><strong>Kontakt:</strong> ${quoteData.customer.contact}</p>` : ''}
            ${quoteData.customer.email ? `<p><strong>E-post:</strong> ${quoteData.customer.email}</p>` : ''}
            ${quoteData.customer.phone ? `<p><strong>Telefon:</strong> ${quoteData.customer.phone}</p>` : ''}
        </div>
        
        <h3 style="margin: 25px 0 15px 0;">Produkter</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
            <thead>
                <tr style="background: #f5f5f5; text-align: left;">
                    <th style="padding: 12px; border: 1px solid #ddd;">Antal</th>
                    <th style="padding: 12px; border: 1px solid #ddd;">Benämning</th>
                    <th style="padding: 12px; border: 1px solid #ddd;">Art.nr</th>
                    <th style="padding: 12px; border: 1px solid #ddd; text-align: right;">à-pris</th>
                    <th style="padding: 12px; border: 1px solid #ddd; text-align: right;">Summa</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    selectedProducts.forEach(product => {
        const discount = product.productDiscount || 0;
        const priceAfterDiscount = product.pris * (1 - discount / 100);
        const total = priceAfterDiscount * product.quantity;
        
        let priceDisplay = formatPrice(product.pris);
        if (discount > 0) {
            priceDisplay += `<br/><small style="color: #4CAF50;">-${discount}% = ${formatPrice(priceAfterDiscount)} kr</small>`;
        }
        
        html += `
            <tr>
                <td style="padding: 12px; border: 1px solid #ddd;">${product.quantity}</td>
                <td style="padding: 12px; border: 1px solid #ddd;">${product.benamning}</td>
                <td style="padding: 12px; border: 1px solid #ddd;">${product.artikelnummer}</td>
                <td style="padding: 12px; border: 1px solid #ddd; text-align: right;">${priceDisplay} kr</td>
                <td style="padding: 12px; border: 1px solid #ddd; text-align: right; font-weight: bold;">${formatPrice(total)} kr</td>
            </tr>
        `;
    });
    
    html += `
            </tbody>
        </table>
        
        <h3 style="margin: 25px 0 15px 0;">Tjänster & Installation</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
            <tbody>
    `;
    
    quoteData.services.forEach(service => {
        if (service.amount > 0) {
            html += `
                <tr>
                    <td style="padding: 12px; border: 1px solid #ddd;">${service.name}</td>
                    <td style="padding: 12px; border: 1px solid #ddd; text-align: right; font-weight: bold;">${formatPrice(service.amount)} kr</td>
                </tr>
            `;
        }
    });
    
    html += `
            </tbody>
        </table>
    `;
    
    // Summary totals
    html += `
        <div class="summary">
            <div class="summary-row">
                <div class="summary-label">Delsumma produkter:</div>
                <div class="summary-value">${formatPrice(subtotal)} kr</div>
            </div>
            <div class="summary-row">
                <div class="summary-label">Delsumma tjänster:</div>
                <div class="summary-value">${formatPrice(servicesTotal)} kr</div>
            </div>
            <div class="summary-row">
                <div class="summary-label">Summa före rabatt:</div>
                <div class="summary-value">${formatPrice(totalBeforeDiscount)} kr</div>
            </div>
    `;
    
    if (quoteData.discount > 0) {
        html += `
            <div class="summary-row">
                <div class="summary-label">Kundrabatt (${quoteData.discount}%):</div>
                <div class="summary-value" style="color: #4CAF50;">-${formatPrice(discountAmount)} kr</div>
            </div>
        `;
    }
    
    if (calc.extraDiscountAmount > 0 && quoteData.extra_discount?.text) {
        html += `
            <div class="summary-row">
                <div class="summary-label">${quoteData.extra_discount.text}:</div>
                <div class="summary-value" style="color: #4CAF50;">-${formatPrice(calc.extraDiscountAmount)} kr</div>
            </div>
        `;
    }
    
    html += `
            <div class="summary-row summary-total">
                <div class="summary-label">TOTALT PRIS INVESTERING:</div>
                <div class="summary-value">${formatPrice(grandTotal)} kr</div>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}

async function generatePDF() {
    const btn = event.target;
    btn.disabled = true;
    btn.textContent = '⏳ Genererar PDF...';
    
    try {
        // Prepare data for PDF
        const pdfData = {
            date: new Date().toISOString().split('T')[0],
            customer: quoteData.customer,
            description: document.getElementById('projectDescription').value.trim(),
            products: selectedProducts,
            services: quoteData.services,
            discount: quoteData.discount,
            custom_terms: quoteData.custom_terms,
            advisor: quoteData.advisor,
            show_service_agreement: quoteData.show_service_agreement,
            calculations: calculateTotals()
        };
        
        // Send to server to generate PDF
        const response = await fetch('/generate-pdf', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pdfData)
        });
        
        if (response.ok) {
            // Download the PDF
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Offert_${quoteData.customer.name.replace(/\s+/g, '_')}_${pdfData.date}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            
            btn.textContent = '✅ PDF Genererad!';
            setTimeout(() => {
                btn.disabled = false;
                btn.textContent = '📄 Generera PDF-Offert';
            }, 2000);
        } else {
            throw new Error('PDF generation failed');
        }
    } catch (error) {
        console.error('Error:', error);
        
        // Fallback: Download JSON data for manual PDF generation
        alert('PDF-generering kräver en server. Laddar ner offertdata istället som du kan skicka till mig för PDF-konvertering.');
        
        const pdfData = {
            date: new Date().toISOString().split('T')[0],
            customer: quoteData.customer,
            description: document.getElementById('projectDescription').value.trim(),
            products: selectedProducts,
            services: quoteData.services,
            discount: quoteData.discount,
            custom_terms: quoteData.custom_terms,
            advisor: quoteData.advisor,
            show_service_agreement: quoteData.show_service_agreement,
            calculations: calculateTotals()
        };
        
        const dataStr = JSON.stringify(pdfData, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Offert_${quoteData.customer.name.replace(/\s+/g, '_')}_${pdfData.date}.json`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        btn.disabled = false;
        btn.textContent = '📄 Generera PDF-Offert';
    }
}

function formatPrice(price) {
    return new Intl.NumberFormat('sv-SE', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(price);
}

// Export data for PDF generation (will be used later)
function exportQuoteData() {
    return {
        ...quoteData,
        date: new Date().toISOString().split('T')[0],
        calculations: calculateTotals()
    };
}

function calculateTotals() {
    let subtotal = 0;
    selectedProducts.forEach(p => {
        const discount = p.productDiscount || 0;
        const priceAfterDiscount = p.pris * (1 - discount / 100);
        subtotal += priceAfterDiscount * p.quantity;
    });
    
    let servicesTotal = 0;
    quoteData.services.forEach(s => {
        servicesTotal += s.amount;
    });
    
    const totalBeforeDiscount = subtotal + servicesTotal;
    const discountAmount = totalBeforeDiscount * (quoteData.discount / 100);
    const extraDiscountAmount = quoteData.extra_discount?.amount || 0;
    const grandTotal = totalBeforeDiscount - discountAmount - extraDiscountAmount;
    
    return {
        subtotal,
        servicesTotal,
        totalBeforeDiscount,
        discountAmount,
        extraDiscountAmount,
        grandTotal
    };
}
