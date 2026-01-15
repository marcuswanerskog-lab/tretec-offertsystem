// Tretec Larm - Offertsystem V3.0
// Global state
let customers = [];
let quotes = [];
let currentQuote = {};
let selectedProducts = [];
let editingCustomerIndex = null;
let editingProductIndex = null;

// Product database - will be loaded from product_database.js
// Don't declare it here, use the global one
let PRODUCT_DB = window.PRODUCT_DB || {};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initializing Tretec Offertsystem V3.0...');
    
    // Wait a bit for product_database.js to load
    setTimeout(() => {
        try {
            loadData();
            console.log('✅ Data loaded');
            
            loadProductDatabase();
            
            updateStats();
            console.log('✅ Stats updated');
            
            renderCustomers();
            console.log('✅ Customers rendered');
            
            renderProducts();
            console.log('✅ Products rendered');
            
            renderQuotes();
            console.log('✅ Quotes rendered');
            
            setupServiceCalculations();
            console.log('✅ Service calculations setup');
            
            console.log('🎉 Initialization complete!');
        } catch (error) {
            console.error('❌ Initialization error:', error);
            showAlert('Fel vid start: ' + error.message, 'error');
        }
    }, 100);
});

// ==================== DATA MANAGEMENT ====================

function loadData() {
    const savedCustomers = localStorage.getItem('tretec_customers');
    const savedQuotes = localStorage.getItem('tretec_quotes');
    
    if (savedCustomers) customers = JSON.parse(savedCustomers);
    if (savedQuotes) quotes = JSON.parse(savedQuotes);
}

function saveData() {
    localStorage.setItem('tretec_customers', JSON.stringify(customers));
    localStorage.setItem('tretec_quotes', JSON.stringify(quotes));
}

function loadProductDatabase() {
    // Check if PRODUCT_DB is loaded from product_database.js
    if (typeof window.PRODUCT_DB !== 'undefined' && window.PRODUCT_DB && Object.keys(window.PRODUCT_DB).length > 0) {
        console.log('✅ Product database loaded from product_database.js');
        console.log('📦 Total categories:', Object.keys(window.PRODUCT_DB).length);
        
        // Count products
        let totalProducts = 0;
        Object.keys(window.PRODUCT_DB).forEach(cat => {
            const count = window.PRODUCT_DB[cat].length;
            totalProducts += count;
            console.log(`   - ${cat}: ${count} produkter`);
        });
        console.log(`📊 Total products: ${totalProducts}`);
        
        // Use the global one
        PRODUCT_DB = window.PRODUCT_DB;
        return;
    }
    
    // Fallback to localStorage
    console.warn('⚠️ Product database not found in product_database.js. Trying localStorage...');
    const savedProducts = localStorage.getItem('tretec_products');
    if (savedProducts) {
        PRODUCT_DB = JSON.parse(savedProducts);
        window.PRODUCT_DB = PRODUCT_DB;
        console.log('✅ Product database loaded from localStorage');
    } else {
        // Initialize with empty categories
        console.warn('⚠️ No products found. Initializing empty database.');
        PRODUCT_DB = {
            lasare: [],
            centralapparater: [],
            tillbehor: [],
            ellas: []
        };
        window.PRODUCT_DB = PRODUCT_DB;
    }
}

function saveProductDatabase() {
    localStorage.setItem('tretec_products', JSON.stringify(PRODUCT_DB));
    window.PRODUCT_DB = PRODUCT_DB; // Keep in sync
}

// ==================== NAVIGATION ====================

function showView(viewId) {
    // Hide all views
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    
    // Show selected view
    document.getElementById(viewId).classList.add('active');
    
    // Update data when switching views
    if (viewId === 'customers') renderCustomers();
    if (viewId === 'products') renderProducts();
    if (viewId === 'quotes') renderQuotes();
    if (viewId === 'dashboard') updateStats();
}

function createNewQuote() {
    currentQuote = {
        id: generateQuoteNumber(),
        date: new Date().toISOString().split('T')[0],
        customer: {},
        products: [],
        services: {},
        terms: {},
        status: 'Utkast'
    };
    selectedProducts = [];
    
    // Reset form
    goToQuoteStep(1);
    showView('newQuote');
}

function goToQuoteStep(step) {
    // Hide all steps
    for (let i = 1; i <= 5; i++) {
        const stepContent = document.getElementById(`quoteStep${i}`);
        const stepIndicator = document.getElementById(`stepInd${i}`);
        if (stepContent) stepContent.style.display = 'none';
        if (stepIndicator) stepIndicator.classList.remove('active');
    }
    
    // Show current step
    const currentStepContent = document.getElementById(`quoteStep${step}`);
    const currentStepIndicator = document.getElementById(`stepInd${step}`);
    if (currentStepContent) currentStepContent.style.display = 'block';
    if (currentStepIndicator) currentStepIndicator.classList.add('active');
    
    // Special handling for each step
    if (step === 2) {
        renderProductCategories();
        updateSelectedProductsDisplay();
    }
    
    if (step === 3) {
        calculateServiceTotals();
    }
    
    if (step === 5) {
        renderQuoteSummary();
    }
}

// ==================== CUSTOMER MANAGEMENT ====================

function generateCustomerNumber() {
    const highest = customers.reduce((max, c) => {
        const num = parseInt(c.customerNumber);
        return num > max ? num : max;
    }, 1000);
    return (highest + 1).toString();
}

function openCustomerModal(index = null) {
    editingCustomerIndex = index;
    
    if (index !== null) {
        const customer = customers[index];
        document.getElementById('modalCustomerNumber').value = customer.customerNumber;
        document.getElementById('modalCustomerName').value = customer.name;
        document.getElementById('modalCustomerOrg').value = customer.orgNumber;
        document.getElementById('modalCustomerContact').value = customer.contact || '';
        document.getElementById('modalCustomerPhone').value = customer.phone || '';
        document.getElementById('modalCustomerEmail').value = customer.email || '';
        document.getElementById('modalCustomerAddress').value = customer.address || '';
        document.getElementById('modalCustomerZip').value = customer.zip || '';
        document.getElementById('modalCustomerCity').value = customer.city || '';
    } else {
        document.getElementById('modalCustomerNumber').value = generateCustomerNumber();
        document.getElementById('modalCustomerName').value = '';
        document.getElementById('modalCustomerOrg').value = '';
        document.getElementById('modalCustomerContact').value = '';
        document.getElementById('modalCustomerPhone').value = '';
        document.getElementById('modalCustomerEmail').value = '';
        document.getElementById('modalCustomerAddress').value = '';
        document.getElementById('modalCustomerZip').value = '';
        document.getElementById('modalCustomerCity').value = '';
    }
    
    document.getElementById('customerModal').classList.add('active');
}

function closeCustomerModal() {
    document.getElementById('customerModal').classList.remove('active');
    editingCustomerIndex = null;
}

function saveCustomer() {
    const customer = {
        customerNumber: document.getElementById('modalCustomerNumber').value,
        name: document.getElementById('modalCustomerName').value,
        orgNumber: document.getElementById('modalCustomerOrg').value,
        contact: document.getElementById('modalCustomerContact').value,
        phone: document.getElementById('modalCustomerPhone').value,
        email: document.getElementById('modalCustomerEmail').value,
        address: document.getElementById('modalCustomerAddress').value,
        zip: document.getElementById('modalCustomerZip').value,
        city: document.getElementById('modalCustomerCity').value
    };
    
    if (!customer.name || !customer.orgNumber) {
        showAlert('Företagsnamn och organisationsnummer är obligatoriska!', 'error');
        return;
    }
    
    if (editingCustomerIndex !== null) {
        customers[editingCustomerIndex] = customer;
        showAlert('Kund uppdaterad!', 'success');
    } else {
        customers.push(customer);
        showAlert('Kund tillagd!', 'success');
    }
    
    saveData();
    renderCustomers();
    closeCustomerModal();
    updateStats();
}

function deleteCustomer(index) {
    if (confirm('Är du säker på att du vill ta bort denna kund?')) {
        customers.splice(index, 1);
        saveData();
        renderCustomers();
        showAlert('Kund borttagen!', 'success');
        updateStats();
    }
}

function renderCustomers() {
    const tbody = document.getElementById('customerTableBody');
    tbody.innerHTML = '';
    
    customers.forEach((customer, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${customer.customerNumber}</td>
            <td><strong>${customer.name}</strong></td>
            <td>${customer.orgNumber}</td>
            <td>${customer.contact || '-'}</td>
            <td>${customer.phone || '-'}</td>
            <td>${customer.email || '-'}</td>
            <td class="actions">
                <button class="icon-btn edit" onclick="openCustomerModal(${index})">✏️ Redigera</button>
                <button class="icon-btn delete" onclick="deleteCustomer(${index})">🗑️ Ta bort</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function filterCustomers() {
    const searchTerm = document.getElementById('customerSearch').value.toLowerCase();
    const rows = document.querySelectorAll('#customerTableBody tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
}

// Customer search for quote
function searchCustomers() {
    const searchTerm = document.getElementById('customerLookup').value.toLowerCase();
    const suggestions = document.getElementById('customerSuggestions');
    
    if (searchTerm.length < 2) {
        suggestions.style.display = 'none';
        return;
    }
    
    const matches = customers.filter(c => 
        c.name.toLowerCase().includes(searchTerm) ||
        c.orgNumber.toLowerCase().includes(searchTerm)
    );
    
    if (matches.length > 0) {
        suggestions.innerHTML = matches.map(c => `
            <div style="padding: 10px; cursor: pointer; border-bottom: 1px solid #ddd;" 
                 onclick="selectCustomer('${c.customerNumber}')">
                <strong>${c.name}</strong> - ${c.orgNumber}
            </div>
        `).join('');
        suggestions.style.display = 'block';
    } else {
        suggestions.innerHTML = '<div style="padding: 10px;">Inga kunder hittades</div>';
        suggestions.style.display = 'block';
    }
}

function selectCustomer(customerNumber) {
    const customer = customers.find(c => c.customerNumber === customerNumber);
    if (customer) {
        document.getElementById('quoteCustomerNumber').value = customer.customerNumber;
        document.getElementById('quoteCustomerName').value = customer.name;
        document.getElementById('quoteCustomerOrg').value = customer.orgNumber;
        document.getElementById('quoteCustomerContact').value = customer.contact || '';
        document.getElementById('quoteCustomerPhone').value = customer.phone || '';
        document.getElementById('quoteCustomerEmail').value = customer.email || '';
        document.getElementById('quoteCustomerAddress').value = customer.address || '';
        document.getElementById('quoteCustomerZip').value = customer.zip || '';
        document.getElementById('quoteCustomerCity').value = customer.city || '';
        
        document.getElementById('customerSuggestions').style.display = 'none';
        document.getElementById('customerLookup').value = '';
    }
}

// ==================== PRODUCT MANAGEMENT ====================

function openProductModal(category = null, index = null) {
    if (category !== null && index !== null) {
        const product = PRODUCT_DB[category][index];
        document.getElementById('modalProductArticle').value = product.artikelnummer || product.sku || '';
        document.getElementById('modalProductName').value = product.benamning || product.name || '';
        document.getElementById('modalProductCategory').value = category;
        document.getElementById('modalProductPrice').value = product.pris || product.price || '';
        document.getElementById('modalProductSupplier').value = product.supplier || '';
        document.getElementById('modalProductRabatt').value = product.rabattgrupp || '';
        document.getElementById('modalProductCat').value = category;
        document.getElementById('modalProductIndex').value = index;
    } else {
        document.getElementById('modalProductArticle').value = '';
        document.getElementById('modalProductName').value = '';
        document.getElementById('modalProductCategory').value = 'lasare';
        document.getElementById('modalProductPrice').value = '';
        document.getElementById('modalProductSupplier').value = '';
        document.getElementById('modalProductRabatt').value = '';
        document.getElementById('modalProductCat').value = '';
        document.getElementById('modalProductIndex').value = '';
    }
    
    document.getElementById('productModal').classList.add('active');
}

function closeProductModal() {
    document.getElementById('productModal').classList.remove('active');
}

function saveProduct() {
    const article = document.getElementById('modalProductArticle').value;
    const name = document.getElementById('modalProductName').value;
    const category = document.getElementById('modalProductCategory').value;
    const price = parseFloat(document.getElementById('modalProductPrice').value);
    const supplier = document.getElementById('modalProductSupplier').value;
    const rabatt = document.getElementById('modalProductRabatt').value;
    
    if (!article || !name || !price) {
        showAlert('Artikelnummer, benämning och pris är obligatoriska!', 'error');
        return;
    }
    
    const product = {
        artikelnummer: article,
        benamning: name,
        pris: price,
        supplier: supplier,
        rabattgrupp: rabatt,
        e_nummer: '',
        lagsta_orderantal: null
    };
    
    const oldCat = document.getElementById('modalProductCat').value;
    const index = document.getElementById('modalProductIndex').value;
    
    if (oldCat && index) {
        // Editing existing
        if (oldCat === category) {
            PRODUCT_DB[category][parseInt(index)] = product;
        } else {
            // Category changed
            PRODUCT_DB[oldCat].splice(parseInt(index), 1);
            if (!PRODUCT_DB[category]) PRODUCT_DB[category] = [];
            PRODUCT_DB[category].push(product);
        }
        showAlert('Produkt uppdaterad!', 'success');
    } else {
        // Adding new
        if (!PRODUCT_DB[category]) PRODUCT_DB[category] = [];
        PRODUCT_DB[category].push(product);
        showAlert('Produkt tillagd!', 'success');
    }
    
    saveProductDatabase();
    renderProducts();
    closeProductModal();
    updateStats();
}

function deleteProduct(category, index) {
    if (confirm('Är du säker på att du vill ta bort denna produkt?')) {
        PRODUCT_DB[category].splice(index, 1);
        if (PRODUCT_DB[category].length === 0) {
            delete PRODUCT_DB[category];
        }
        saveProductDatabase();
        renderProducts();
        showAlert('Produkt borttagen!', 'success');
        updateStats();
    }
}

function renderProducts() {
    const tbody = document.getElementById('productTableBody');
    const categoryFilter = document.getElementById('categoryFilter');
    
    tbody.innerHTML = '';
    
    // Update category filter
    const categories = Object.keys(PRODUCT_DB);
    categoryFilter.innerHTML = '<option value="">Alla kategorier</option>';
    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
        categoryFilter.appendChild(option);
    });
    
    // Render products
    Object.keys(PRODUCT_DB).forEach(category => {
        PRODUCT_DB[category].forEach((product, index) => {
            const row = document.createElement('tr');
            row.dataset.category = category;
            row.innerHTML = `
                <td>${product.artikelnummer || product.sku || '-'}</td>
                <td><strong>${product.benamning || product.name || '-'}</strong></td>
                <td>${category}</td>
                <td>${product.pris || product.price || 0} kr</td>
                <td>${product.supplier || '-'}</td>
                <td class="actions">
                    <button class="icon-btn edit" onclick="openProductModal('${category}', ${index})">✏️ Redigera</button>
                    <button class="icon-btn delete" onclick="deleteProduct('${category}', ${index})">🗑️ Ta bort</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    });
}

function filterProducts() {
    const searchTerm = document.getElementById('productSearch').value.toLowerCase();
    const categoryFilter = document.getElementById('categoryFilter').value;
    const rows = document.querySelectorAll('#productTableBody tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        const category = row.dataset.category;
        
        const matchesSearch = text.includes(searchTerm);
        const matchesCategory = !categoryFilter || category === categoryFilter;
        
        row.style.display = (matchesSearch && matchesCategory) ? '' : 'none';
    });
}

// ==================== QUOTE - PRODUCTS ====================

function renderProductCategories() {
    const container = document.getElementById('productCategories');
    container.innerHTML = '';
    
    console.log('🔍 Rendering product categories...');
    console.log('PRODUCT_DB:', PRODUCT_DB);
    console.log('Categories:', Object.keys(PRODUCT_DB));
    
    Object.keys(PRODUCT_DB).forEach(category => {
        if (PRODUCT_DB[category].length === 0) {
            console.log(`⚠️ Category '${category}' is empty, skipping...`);
            return;
        }
        
        console.log(`✅ Rendering category '${category}' with ${PRODUCT_DB[category].length} products`);
        
        const categorySection = document.createElement('div');
        categorySection.className = 'category-section';
        
        const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
        
        categorySection.innerHTML = `
            <div class="category-header" onclick="toggleCategory('${category}')">
                <span>${categoryName} (${PRODUCT_DB[category].length} produkter)</span>
                <span id="catArrow_${category}">▼</span>
            </div>
            <div class="category-content" id="catContent_${category}">
                <div id="products_${category}"></div>
            </div>
        `;
        
        container.appendChild(categorySection);
        
        // Render products in category
        const productsDiv = document.getElementById(`products_${category}`);
        PRODUCT_DB[category].forEach((product, index) => {
            const productDiv = document.createElement('div');
            productDiv.className = 'product-item';
            productDiv.onclick = () => toggleProductSelection(category, index);
            
            const isSelected = selectedProducts.some(p => 
                p.category === category && p.index === index
            );
            if (isSelected) productDiv.classList.add('selected');
            
            productDiv.innerHTML = `
                <div>
                    <strong>${product.benamning || product.name}</strong><br>
                    <small>${product.artikelnummer || product.sku || ''}</small>
                </div>
                <div style="font-weight: 700; color: var(--primary-gold);">
                    ${(product.pris || product.price || 0).toLocaleString('sv-SE')} kr
                </div>
            `;
            
            productsDiv.appendChild(productDiv);
        });
    });
}

function toggleCategory(category) {
    const content = document.getElementById(`catContent_${category}`);
    const arrow = document.getElementById(`catArrow_${category}`);
    
    if (content.classList.contains('open')) {
        content.classList.remove('open');
        arrow.textContent = '▼';
    } else {
        content.classList.add('open');
        arrow.textContent = '▲';
    }
}

function toggleProductSelection(category, index) {
    const existingIndex = selectedProducts.findIndex(p => 
        p.category === category && p.index === index
    );
    
    if (existingIndex >= 0) {
        // Remove
        selectedProducts.splice(existingIndex, 1);
    } else {
        // Add
        const product = PRODUCT_DB[category][index];
        selectedProducts.push({
            category: category,
            index: index,
            product: product,
            quantity: 1,
            discount: 0
        });
    }
    
    updateSelectedProductsDisplay();
    renderProductCategories();
}

function updateSelectedProductsDisplay() {
    const container = document.getElementById('selectedProductsContainer');
    
    if (selectedProducts.length === 0) {
        container.innerHTML = '<p>Inga produkter valda än</p>';
        return;
    }
    
    container.innerHTML = selectedProducts.map((item, idx) => {
        const product = item.product;
        const price = product.pris || product.price || 0;
        const discountedPrice = price * (1 - item.discount / 100);
        const total = discountedPrice * item.quantity;
        
        return `
            <div class="selected-product">
                <div><strong>${product.benamning || product.name}</strong></div>
                <div>${price.toLocaleString('sv-SE')} kr</div>
                <div>
                    <input type="number" min="1" value="${item.quantity}" 
                           onchange="updateProductQuantity(${idx}, this.value)" 
                           style="width: 80px;">
                </div>
                <div>
                    <input type="number" min="0" max="100" value="${item.discount}" 
                           onchange="updateProductDiscount(${idx}, this.value)" 
                           style="width: 80px;" placeholder="%">
                </div>
                <div style="font-weight: 700;">${total.toLocaleString('sv-SE')} kr</div>
                <button class="remove-btn" onclick="removeSelectedProduct(${idx})">✕</button>
            </div>
        `;
    }).join('');
}

function updateProductQuantity(idx, value) {
    selectedProducts[idx].quantity = parseInt(value) || 1;
    updateSelectedProductsDisplay();
}

function updateProductDiscount(idx, value) {
    selectedProducts[idx].discount = parseFloat(value) || 0;
    updateSelectedProductsDisplay();
}

function removeSelectedProduct(idx) {
    selectedProducts.splice(idx, 1);
    updateSelectedProductsDisplay();
    renderProductCategories();
}

function filterQuoteProducts() {
    const searchTerm = document.getElementById('quoteProductSearch').value.toLowerCase();
    const allProducts = document.querySelectorAll('.product-item');
    
    allProducts.forEach(item => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(searchTerm) ? 'flex' : 'none';
    });
}

// ==================== QUOTE - SERVICES ====================

function setupServiceCalculations() {
    // Cable
    document.getElementById('serviceCableHours')?.addEventListener('input', calculateServiceTotals);
    document.getElementById('serviceCableRate')?.addEventListener('input', calculateServiceTotals);
    
    // Install
    document.getElementById('serviceInstallHours')?.addEventListener('input', calculateServiceTotals);
    document.getElementById('serviceInstallRate')?.addEventListener('input', calculateServiceTotals);
    
    // Project
    document.getElementById('serviceProjectHours')?.addEventListener('input', calculateServiceTotals);
    document.getElementById('serviceProjectRate')?.addEventListener('input', calculateServiceTotals);
}

function calculateServiceTotals() {
    // Cable
    const cableHours = parseFloat(document.getElementById('serviceCableHours')?.value || 0);
    const cableRate = parseFloat(document.getElementById('serviceCableRate')?.value || 0);
    const cableTotal = cableHours * cableRate;
    if (document.getElementById('serviceCableTotal')) {
        document.getElementById('serviceCableTotal').value = cableTotal;
    }
    
    // Install
    const installHours = parseFloat(document.getElementById('serviceInstallHours')?.value || 0);
    const installRate = parseFloat(document.getElementById('serviceInstallRate')?.value || 0);
    const installTotal = installHours * installRate;
    if (document.getElementById('serviceInstallTotal')) {
        document.getElementById('serviceInstallTotal').value = installTotal;
    }
    
    // Project
    const projectHours = parseFloat(document.getElementById('serviceProjectHours')?.value || 0);
    const projectRate = parseFloat(document.getElementById('serviceProjectRate')?.value || 0);
    const projectTotal = projectHours * projectRate;
    if (document.getElementById('serviceProjectTotal')) {
        document.getElementById('serviceProjectTotal').value = projectTotal;
    }
}

// ==================== QUOTE - SUMMARY ====================

function renderQuoteSummary() {
    const container = document.getElementById('quoteSummaryContent');
    
    // Gather all data
    const customerName = document.getElementById('quoteCustomerName').value;
    const customerOrg = document.getElementById('quoteCustomerOrg').value;
    const customerContact = document.getElementById('quoteCustomerContact').value;
    
    // Calculate totals
    let productTotal = 0;
    const productLines = selectedProducts.map(item => {
        const product = item.product;
        const price = product.pris || product.price || 0;
        const discountedPrice = price * (1 - item.discount / 100);
        const lineTotal = discountedPrice * item.quantity;
        productTotal += lineTotal;
        
        return `
            <tr>
                <td>${item.quantity}x</td>
                <td>${product.benamning || product.name}</td>
                <td>${price.toLocaleString('sv-SE')} kr</td>
                <td>${item.discount}%</td>
                <td style="font-weight: 700;">${lineTotal.toLocaleString('sv-SE')} kr</td>
            </tr>
        `;
    }).join('');
    
    const cableTotal = parseFloat(document.getElementById('serviceCableTotal')?.value || 0);
    const installTotal = parseFloat(document.getElementById('serviceInstallTotal')?.value || 0);
    const projectTotal = parseFloat(document.getElementById('serviceProjectTotal')?.value || 0);
    const otherCost = parseFloat(document.getElementById('serviceOtherCost')?.value || 0);
    
    const servicesTotal = cableTotal + installTotal + projectTotal + otherCost;
    const subtotal = productTotal + servicesTotal;
    
    const discount = parseFloat(document.getElementById('quoteDiscount')?.value || 0);
    const discountAmount = subtotal * (discount / 100);
    
    const extraDiscountAmount = parseFloat(document.getElementById('quoteExtraDiscountAmount')?.value || 0);
    const extraDiscountDesc = document.getElementById('quoteExtraDiscountDesc')?.value;
    
    const grandTotal = subtotal - discountAmount - extraDiscountAmount;
    
    container.innerHTML = `
        <div class="summary-box">
            <h3 style="margin-bottom: 20px;">📋 Kunduppgifter</h3>
            <p><strong>Företag:</strong> ${customerName}</p>
            <p><strong>Org.nr:</strong> ${customerOrg}</p>
            <p><strong>Kontakt:</strong> ${customerContact || '-'}</p>
        </div>

        <div class="summary-box" style="margin-top: 20px;">
            <h3 style="margin-bottom: 20px;">📦 Produkter</h3>
            <table style="width: 100%;">
                <thead>
                    <tr style="border-bottom: 2px solid #ddd;">
                        <th style="text-align: left; padding: 10px;">Antal</th>
                        <th style="text-align: left; padding: 10px;">Produkt</th>
                        <th style="text-align: right; padding: 10px;">á-pris</th>
                        <th style="text-align: right; padding: 10px;">Rabatt</th>
                        <th style="text-align: right; padding: 10px;">Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${productLines}
                </tbody>
            </table>
            <div class="summary-line" style="margin-top: 20px;">
                <strong>Summa produkter:</strong>
                <strong>${productTotal.toLocaleString('sv-SE')} kr</strong>
            </div>
        </div>

        <div class="summary-box" style="margin-top: 20px;">
            <h3 style="margin-bottom: 20px;">🔧 Tjänster</h3>
            ${cableTotal > 0 ? `<div class="summary-line"><span>Kabeldragning:</span><span>${cableTotal.toLocaleString('sv-SE')} kr</span></div>` : ''}
            ${installTotal > 0 ? `<div class="summary-line"><span>Installation/montering:</span><span>${installTotal.toLocaleString('sv-SE')} kr</span></div>` : ''}
            ${projectTotal > 0 ? `<div class="summary-line"><span>Projektering/utbildning:</span><span>${projectTotal.toLocaleString('sv-SE')} kr</span></div>` : ''}
            ${otherCost > 0 ? `<div class="summary-line"><span>Övrigt material:</span><span>${otherCost.toLocaleString('sv-SE')} kr</span></div>` : ''}
            <div class="summary-line" style="margin-top: 20px;">
                <strong>Summa tjänster:</strong>
                <strong>${servicesTotal.toLocaleString('sv-SE')} kr</strong>
            </div>
        </div>

        <div class="summary-box" style="margin-top: 20px;">
            <h3 style="margin-bottom: 20px;">💰 Totalt</h3>
            <div class="summary-line">
                <span>Summa före rabatt:</span>
                <span>${subtotal.toLocaleString('sv-SE')} kr</span>
            </div>
            ${discount > 0 ? `
                <div class="summary-line">
                    <span>Kundrabatt (${discount}%):</span>
                    <span style="color: var(--success-green);">-${discountAmount.toLocaleString('sv-SE')} kr</span>
                </div>
            ` : ''}
            ${extraDiscountAmount > 0 ? `
                <div class="summary-line">
                    <span>${extraDiscountDesc}:</span>
                    <span style="color: var(--success-green);">-${extraDiscountAmount.toLocaleString('sv-SE')} kr</span>
                </div>
            ` : ''}
            <div class="summary-line total">
                <span>TOTALT:</span>
                <span>${grandTotal.toLocaleString('sv-SE')} kr</span>
            </div>
            <p style="margin-top: 10px; font-style: italic;">+ moms 25%</p>
        </div>
    `;
}

// ==================== QUOTE - SAVE & PDF ====================

function generateQuoteNumber() {
    const year = new Date().getFullYear();
    const count = quotes.length + 1;
    return `${year}-${String(count).padStart(4, '0')}`;
}

function saveQuote() {
    // Gather all data
    currentQuote.customer = {
        customerNumber: document.getElementById('quoteCustomerNumber').value,
        name: document.getElementById('quoteCustomerName').value,
        orgNumber: document.getElementById('quoteCustomerOrg').value,
        contact: document.getElementById('quoteCustomerContact').value,
        phone: document.getElementById('quoteCustomerPhone').value,
        email: document.getElementById('quoteCustomerEmail').value,
        address: document.getElementById('quoteCustomerAddress').value,
        zip: document.getElementById('quoteCustomerZip').value,
        city: document.getElementById('quoteCustomerCity').value,
        invoiceAddress: document.getElementById('quoteInvoiceAddress').value,
        invoiceRef: document.getElementById('quoteInvoiceRef').value,
        invoiceGLN: document.getElementById('quoteInvoiceGLN').value,
        invoicePDF: document.getElementById('quoteInvoicePDF').value
    };
    
    currentQuote.products = selectedProducts;
    
    currentQuote.services = {
        cableHours: document.getElementById('serviceCableHours').value,
        cableRate: document.getElementById('serviceCableRate').value,
        cableTotal: document.getElementById('serviceCableTotal').value,
        installHours: document.getElementById('serviceInstallHours').value,
        installRate: document.getElementById('serviceInstallRate').value,
        installTotal: document.getElementById('serviceInstallTotal').value,
        projectHours: document.getElementById('serviceProjectHours').value,
        projectRate: document.getElementById('serviceProjectRate').value,
        projectTotal: document.getElementById('serviceProjectTotal').value,
        otherCost: document.getElementById('serviceOtherCost').value
    };
    
    currentQuote.terms = {
        terms: document.getElementById('quoteTerms').value,
        discount: document.getElementById('quoteDiscount').value,
        extraDiscountDesc: document.getElementById('quoteExtraDiscountDesc').value,
        extraDiscountAmount: document.getElementById('quoteExtraDiscountAmount').value,
        advisor: document.getElementById('quoteAdvisor').value,
        showService: document.getElementById('quoteShowService').value
    };
    
    // Check if updating existing
    const existingIndex = quotes.findIndex(q => q.id === currentQuote.id);
    if (existingIndex >= 0) {
        quotes[existingIndex] = currentQuote;
        showAlert('Offert uppdaterad!', 'success');
    } else {
        quotes.push(currentQuote);
        showAlert('Offert sparad!', 'success');
    }
    
    saveData();
    updateStats();
}

function generateQuotePDF() {
    saveQuote();
    
    // Prepare data for PDF generation
    const quoteData = {
        ...currentQuote,
        date: new Date().toISOString().split('T')[0]
    };
    
    // Send to server
    fetch('/generate-pdf', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(quoteData)
    })
    .then(response => {
        if (!response.ok) throw new Error('PDF generation failed');
        return response.blob();
    })
    .then(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Offert_${currentQuote.customer.name}_${currentQuote.date}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
        showAlert('PDF genererad och nedladdad!', 'success');
    })
    .catch(error => {
        console.error('Error:', error);
        showAlert('Fel vid PDF-generering: ' + error.message, 'error');
    });
}

// ==================== QUOTE MANAGEMENT ====================

function renderQuotes() {
    const tbody = document.getElementById('quoteTableBody');
    tbody.innerHTML = '';
    
    quotes.forEach((quote, index) => {
        const row = document.createElement('tr');
        
        // Calculate total
        let total = 0;
        quote.products?.forEach(item => {
            const price = item.product.pris || item.product.price || 0;
            const discountedPrice = price * (1 - item.discount / 100);
            total += discountedPrice * item.quantity;
        });
        
        const servicesTotal = 
            parseFloat(quote.services?.cableTotal || 0) +
            parseFloat(quote.services?.installTotal || 0) +
            parseFloat(quote.services?.projectTotal || 0) +
            parseFloat(quote.services?.otherCost || 0);
        
        total += servicesTotal;
        
        const discount = parseFloat(quote.terms?.discount || 0);
        const discountAmount = total * (discount / 100);
        const extraDiscount = parseFloat(quote.terms?.extraDiscountAmount || 0);
        
        total = total - discountAmount - extraDiscount;
        
        row.innerHTML = `
            <td><strong>${quote.id}</strong></td>
            <td>${quote.date}</td>
            <td>${quote.customer?.name || '-'}</td>
            <td style="font-weight: 700; color: var(--primary-gold);">${total.toLocaleString('sv-SE')} kr</td>
            <td><span style="padding: 5px 10px; background: #fff3cd; border-radius: 4px;">${quote.status}</span></td>
            <td class="actions">
                <button class="icon-btn view" onclick="viewQuote(${index})">👁️ Visa</button>
                <button class="icon-btn edit" onclick="editQuote(${index})">✏️ Redigera</button>
                <button class="icon-btn delete" onclick="deleteQuote(${index})">🗑️ Ta bort</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function filterQuotes() {
    const searchTerm = document.getElementById('quoteSearch').value.toLowerCase();
    const rows = document.querySelectorAll('#quoteTableBody tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
}

function viewQuote(index) {
    const quote = quotes[index];
    showAlert('Vyläge kommande i nästa version!', 'error');
    // TODO: Implement view mode
}

function editQuote(index) {
    const quote = quotes[index];
    currentQuote = quote;
    selectedProducts = quote.products || [];
    
    // Populate form
    document.getElementById('quoteCustomerNumber').value = quote.customer.customerNumber || '';
    document.getElementById('quoteCustomerName').value = quote.customer.name || '';
    document.getElementById('quoteCustomerOrg').value = quote.customer.orgNumber || '';
    document.getElementById('quoteCustomerContact').value = quote.customer.contact || '';
    document.getElementById('quoteCustomerPhone').value = quote.customer.phone || '';
    document.getElementById('quoteCustomerEmail').value = quote.customer.email || '';
    document.getElementById('quoteCustomerAddress').value = quote.customer.address || '';
    document.getElementById('quoteCustomerZip').value = quote.customer.zip || '';
    document.getElementById('quoteCustomerCity').value = quote.customer.city || '';
    document.getElementById('quoteInvoiceAddress').value = quote.customer.invoiceAddress || '';
    document.getElementById('quoteInvoiceRef').value = quote.customer.invoiceRef || '';
    document.getElementById('quoteInvoiceGLN').value = quote.customer.invoiceGLN || '';
    document.getElementById('quoteInvoicePDF').value = quote.customer.invoicePDF || '';
    
    document.getElementById('serviceCableHours').value = quote.services?.cableHours || 8;
    document.getElementById('serviceCableRate').value = quote.services?.cableRate || 695;
    document.getElementById('serviceInstallHours').value = quote.services?.installHours || 0;
    document.getElementById('serviceInstallRate').value = quote.services?.installRate || 895;
    document.getElementById('serviceProjectHours').value = quote.services?.projectHours || 0;
    document.getElementById('serviceProjectRate').value = quote.services?.projectRate || 995;
    document.getElementById('serviceOtherCost').value = quote.services?.otherCost || 0;
    
    document.getElementById('quoteTerms').value = quote.terms?.terms || '';
    document.getElementById('quoteDiscount').value = quote.terms?.discount || 0;
    document.getElementById('quoteExtraDiscountDesc').value = quote.terms?.extraDiscountDesc || '';
    document.getElementById('quoteExtraDiscountAmount').value = quote.terms?.extraDiscountAmount || 0;
    document.getElementById('quoteAdvisor').value = quote.terms?.advisor || 'Marcus Wänerskog';
    document.getElementById('quoteShowService').value = quote.terms?.showService || 'yes';
    
    goToQuoteStep(1);
    showView('newQuote');
}

function deleteQuote(index) {
    if (confirm('Är du säker på att du vill ta bort denna offert?')) {
        quotes.splice(index, 1);
        saveData();
        renderQuotes();
        showAlert('Offert borttagen!', 'success');
        updateStats();
    }
}

// ==================== UTILITIES ====================

function showAlert(message, type = 'success') {
    const container = document.getElementById('alertContainer');
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    container.appendChild(alert);
    
    setTimeout(() => alert.remove(), 3000);
}

function updateStats() {
    document.getElementById('statsQuotes').textContent = quotes.length;
    document.getElementById('statsCustomers').textContent = customers.length;
    
    let productCount = 0;
    Object.keys(PRODUCT_DB).forEach(cat => {
        productCount += PRODUCT_DB[cat].length;
    });
    document.getElementById('statsProducts').textContent = productCount;
}

// Style for step indicators
const style = document.createElement('style');
style.textContent = `
    .quote-step {
        padding: 10px 15px;
        border-radius: 6px;
        background: #e0e0e0;
        opacity: 0.6;
        transition: all 0.3s;
    }
    .quote-step.active {
        background: var(--primary-gold);
        color: white;
        opacity: 1;
        transform: scale(1.05);
    }
`;
document.head.appendChild(style);

// ==================== EXPOSE FUNCTIONS GLOBALLY ====================
// Make all functions called from HTML globally accessible
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
