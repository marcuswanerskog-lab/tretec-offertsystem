#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Tretec Larm AB - PDF Generation Server V3.0
Simple Flask server to handle PDF generation requests
"""

from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
import json
import os
from generate_pdf import generate_quote_pdf
from generate_contract import generate_contract_pdf
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS for local development

@app.route('/')
def index():
    """Serve the main HTML file - V3"""
    # Try V3 first, fallback to old version
    if os.path.exists('offertsystem_v3.html'):
        return send_file('offertsystem_v3.html')
    else:
        return send_file('offertsystem.html')

@app.route('/app_v3.js')
def app_v3_js():
    """Serve the V3 JavaScript file"""
    return send_file('app_v3.js', mimetype='application/javascript')

@app.route('/app.js')
def app_js():
    """Serve the old JavaScript file (for backwards compatibility)"""
    return send_file('app.js', mimetype='application/javascript')

@app.route('/product_database.js')
def product_db():
    """Serve the product database"""
    return send_file('product_database.js', mimetype='application/javascript')

@app.route('/generate-pdf', methods=['POST'])
def generate_pdf():
    """Generate PDF from quote data"""
    try:
        quote_data = request.get_json()
        
        print("="*60)
        print("Received quote data:")
        print(json.dumps(quote_data, indent=2, ensure_ascii=False))
        print("="*60)
        
        # Transform data to match PDF generator expectations
        transformed_data = transform_quote_data(quote_data)
        
        # Generate unique filename
        customer_name = quote_data['customer']['name'].replace(' ', '_').replace('/', '_')
        date_str = quote_data.get('date', datetime.now().strftime('%Y-%m-%d'))
        output_filename = f'Offert_{customer_name}_{date_str}.pdf'
        
        # Use current directory for Windows compatibility
        import os
        output_path = os.path.join(os.getcwd(), output_filename)
        
        # Convert to JSON string for the generator
        quote_json = json.dumps(transformed_data, ensure_ascii=False)
        
        # Generate PDF
        result = generate_quote_pdf(quote_json, output_path)
        
        if result and os.path.exists(result):
            return send_file(
                result,
                mimetype='application/pdf',
                as_attachment=True,
                download_name=output_filename
            )
        else:
            return jsonify({'error': 'Failed to generate PDF'}), 500
            
    except Exception as e:
        print(f"Error generating PDF: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e), 'traceback': traceback.format_exc()}), 500

def transform_quote_data(data):
    """Transform JavaScript quote data to PDF generator format"""
    # Calculate totals
    products_total = 0
    services_total = 0
    
    # Transform products from selectedProducts array
    products_list = []
    if 'products' in data and data['products']:
        for item in data['products']:
            product = item.get('product', {})
            quantity = item.get('quantity', 1)
            discount = item.get('discount', 0)
            
            price = float(product.get('pris', 0) or product.get('price', 0))
            discounted_price = price * (1 - discount / 100)
            line_total = discounted_price * quantity
            products_total += line_total
            
            products_list.append({
                'category': item.get('category', 'other'),
                'name': product.get('benamning', '') or product.get('name', ''),
                'article_number': product.get('artikelnummer', '') or product.get('sku', ''),
                'quantity': quantity,
                'price': price,
                'discount': discount,
                'total': line_total
            })
    
    # Transform services
    services_list = []
    if 'services' in data:
        services = data['services']
        
        # Cable work
        cable_hours = float(services.get('cableHours', 0) or 0)
        cable_rate = float(services.get('cableRate', 0) or 0)
        cable_total = float(services.get('cableTotal', 0) or 0)
        if cable_total > 0:
            services_list.append({
                'name': 'Kabeldragning',
                'hours': cable_hours,
                'rate': cable_rate,
                'amount': cable_total
            })
            services_total += cable_total
        
        # Installation work
        install_hours = float(services.get('installHours', 0) or 0)
        install_rate = float(services.get('installRate', 0) or 0)
        install_total = float(services.get('installTotal', 0) or 0)
        if install_total > 0:
            services_list.append({
                'name': 'Resor, Installation/montering',
                'hours': install_hours,
                'rate': install_rate,
                'amount': install_total
            })
            services_total += install_total
        
        # Project work
        project_hours = float(services.get('projectHours', 0) or 0)
        project_rate = float(services.get('projectRate', 0) or 0)
        project_total = float(services.get('projectTotal', 0) or 0)
        if project_total > 0:
            services_list.append({
                'name': 'Projektering, utbildning',
                'hours': project_hours,
                'rate': project_rate,
                'amount': project_total
            })
            services_total += project_total
        
        # Other costs
        other_cost = float(services.get('otherCost', 0) or 0)
        if other_cost > 0:
            services_list.append({
                'name': 'Övrigt installationsmaterial',
                'amount': other_cost
            })
            services_total += other_cost
    
    # Calculate totals
    subtotal_before_discount = products_total + services_total
    
    # Get discount
    discount_percent = float(data.get('terms', {}).get('discount', 0) or 0)
    discount_amount = subtotal_before_discount * (discount_percent / 100)
    
    # Extra discount
    extra_discount_amount = float(data.get('terms', {}).get('extraDiscountAmount', 0) or 0)
    extra_discount_desc = data.get('terms', {}).get('extraDiscountDesc', '')
    
    # Grand total
    grand_total = subtotal_before_discount - discount_amount - extra_discount_amount
    
    # Build transformed data
    transformed = {
        'customer': data.get('customer', {}),
        'date': data.get('date', datetime.now().strftime('%Y-%m-%d')),
        'products': products_list,
        'services': services_list,
        'discount': discount_percent,
        'extra_discount': {
            'text': extra_discount_desc,
            'amount': extra_discount_amount
        } if extra_discount_amount > 0 else None,
        'calculations': {
            'subtotal': products_total,
            'servicesTotal': services_total,
            'totalBeforeDiscount': subtotal_before_discount,
            'discountAmount': discount_amount,
            'extraDiscountAmount': extra_discount_amount,
            'grandTotal': grand_total
        },
        'custom_terms': data.get('terms', {}).get('terms', ''),
        'advisor': data.get('terms', {}).get('advisor', 'Marcus Wänerskog'),
        'show_service_agreement': data.get('terms', {}).get('showService', 'yes') == 'yes'
    }
    
    return transformed




@app.route('/generate-contract', methods=['POST'])
def generate_contract():
    """Generate contract/agreement from quote data"""
    try:
        quote_data = request.get_json()
        
        print("="*60)
        print("Generating contract...")
        print("="*60)
        
        # Transform data (same as PDF)
        transformed_data = transform_quote_data(quote_data)
        
        # Generate unique filename
        customer_name = quote_data['customer']['name'].replace(' ', '_').replace('/', '_')
        date_str = quote_data.get('date', datetime.now().strftime('%Y-%m-%d'))
        output_filename = f'Avtal_{customer_name}_{date_str}.pdf'
        
        import os
        output_path = os.path.join(os.getcwd(), output_filename)
        
        # Convert to JSON string
        quote_json = json.dumps(transformed_data, ensure_ascii=False)
        
        # Generate contract PDF
        result = generate_contract_pdf(quote_json, output_path)
        
        if result and os.path.exists(result):
            return send_file(
                result,
                mimetype='application/pdf',
                as_attachment=True,
                download_name=output_filename
            )
        else:
            return jsonify({'error': 'Failed to generate contract'}), 500
            
    except Exception as e:
        print(f"Error generating contract: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e), 'traceback': traceback.format_exc()}), 500

@app.route('/health')
def health():
    """Health check endpoint"""
    return jsonify({'status': 'ok', 'message': 'Tretec Larm PDF Server V3.0 Running'})

if __name__ == '__main__':
    print("=" * 60)
    print("TRETEC LARM AB - OFFERTSYSTEM SERVER V3.0")
    print("=" * 60)
    print("")
    print("Server starting...")
    print("Öppna webbläsaren och gå till: http://localhost:5000")
    print("")
    print("Tryck Ctrl+C för att stoppa servern")
    print("=" * 60)
    print("")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
