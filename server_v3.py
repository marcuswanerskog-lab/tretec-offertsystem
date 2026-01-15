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
        
        # Generate unique filename
        customer_name = quote_data['customer']['name'].replace(' ', '_')
        date_str = quote_data['date']
        output_filename = f'Offert_{customer_name}_{date_str}.pdf'
        
        # Use current directory instead of /tmp for Windows compatibility
        import os
        output_path = os.path.join(os.getcwd(), output_filename)
        
        # Convert to JSON string for the generator
        quote_json = json.dumps(quote_data)
        
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
        return jsonify({'error': str(e)}), 500

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
