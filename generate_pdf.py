#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Tretec Larm AB - PDF Quote Generator
Generates professional quotes with company branding
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, Image, PageBreak, KeepTogether
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_RIGHT, TA_CENTER, TA_JUSTIFY
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import json
from datetime import datetime
import sys

class TretecQuoteGenerator:
    def __init__(self, quote_data):
        self.data = quote_data
        self.width, self.height = A4
        self.styles = getSampleStyleSheet()
        self.setup_styles()
        
    def setup_styles(self):
        """Setup custom paragraph styles"""
        # Title style
        self.styles.add(ParagraphStyle(
            name='TretecTitle',
            parent=self.styles['Heading1'],
            fontSize=32,
            textColor=colors.HexColor('#C9A227'),
            spaceAfter=12,
            fontName='Helvetica-Bold'
        ))
        
        # Heading style
        self.styles.add(ParagraphStyle(
            name='TretecHeading',
            parent=self.styles['Heading2'],
            fontSize=14,
            textColor=colors.HexColor('#333333'),
            spaceAfter=10,
            spaceBefore=15,
            fontName='Helvetica-Bold'
        ))
        
        # Body style
        self.styles.add(ParagraphStyle(
            name='TretecBody',
            parent=self.styles['Normal'],
            fontSize=10,
            textColor=colors.HexColor('#333333'),
            leading=14,
            fontName='Helvetica'
        ))
        
        # Small text style
        self.styles.add(ParagraphStyle(
            name='TretecSmall',
            parent=self.styles['Normal'],
            fontSize=8,
            textColor=colors.HexColor('#666666'),
            leading=11,
            fontName='Helvetica'
        ))
    
    def create_header(self, canvas, doc):
        """Create header with logo and company info"""
        canvas.saveState()
        
        # Add logo
        try:
            canvas.drawImage('Treteclogo.jpg', 40, self.height - 80, 
                           width=150, height=50, preserveAspectRatio=True)
        except:
            pass
        
        # Company address (right side)
        canvas.setFont('Helvetica', 9)
        canvas.drawRightString(self.width - 40, self.height - 45, 'Tretec Larm AB')
        canvas.drawRightString(self.width - 40, self.height - 60, 'Nysätersvägen 38')
        canvas.drawRightString(self.width - 40, self.height - 75, 'tel 0520 – 47 02 50')
        
        # Golden line
        canvas.setStrokeColor(colors.HexColor('#C9A227'))
        canvas.setLineWidth(3)
        canvas.line(40, self.height - 100, self.width - 40, self.height - 100)
        
        canvas.restoreState()
    
    def create_footer(self, canvas, doc):
        """Create footer with page number"""
        canvas.saveState()
        canvas.setFont('Helvetica', 8)
        canvas.setFillColor(colors.HexColor('#666666'))
        
        # Page number
        page_num = canvas.getPageNumber()
        text = f"Sida {page_num}"
        canvas.drawRightString(self.width - 40, 30, text)
        
        # Footer line
        canvas.setStrokeColor(colors.HexColor('#CCCCCC'))
        canvas.setLineWidth(1)
        canvas.line(40, 40, self.width - 40, 40)
        
        canvas.restoreState()
    
    def generate(self, output_filename):
        """Generate the complete PDF quote"""
        doc = SimpleDocTemplate(
            output_filename,
            pagesize=A4,
            rightMargin=40,
            leftMargin=40,
            topMargin=120,
            bottomMargin=60
        )
        
        story = []
        
        # Title
        story.append(Paragraph("OFFERT!", self.styles['TretecTitle']))
        story.append(Spacer(1, 5*mm))
        
        # Customer and date
        customer_date = f"<b>{self.data['customer']['name']}</b>"
        if self.data['customer'].get('address'):
            customer_date += f" - {self.data['customer']['address']}"
        customer_date += f"<br/>{self.data['date']}"
        story.append(Paragraph(customer_date, self.styles['TretecBody']))
        story.append(Spacer(1, 8*mm))
        
        # Company presentation
        story.append(Paragraph("<b>Företagspresentation</b>", self.styles['TretecHeading']))
        presentation = """
        Tretec Larm levererar helhetslösningar inom säkerhet, där vi använder oss av de ledande 
        leverantörerna inom respektive produktområde. Vi sköter hela processen från riskanalys 
        och projektering till försäljning, installation och service av det säkerhetssystem som passar 
        just Ert företags önskningar, krav och behov.<br/><br/>
        Tretec Larm är auktoriserad partner till Securitas Direct AB.<br/><br/>
        Vi arbetar bland annat inom följande affärsområden:<br/>
        Inbrottslarm, Överfallslarm, Personlarm, Brand- och utrymningslarm, Passeringssystem och 
        kodlås, kameraövervakning/CCTV-system.
        """
        story.append(Paragraph(presentation, self.styles['TretecBody']))
        story.append(Spacer(1, 8*mm))
        
        # Offer section
        story.append(Paragraph("<b>Offert</b>", self.styles['TretecHeading']))
        offer_text = "Refererande till Er förfrågan har vi härmed nöjet att inkomma med offert enligt nedanstående:"
        story.append(Paragraph(offer_text, self.styles['TretecBody']))
        story.append(Spacer(1, 5*mm))
        
        # Project description if available
        if self.data.get('description'):
            story.append(Paragraph(f"<b>Vi offererar:</b><br/>{self.data['description']}", 
                                 self.styles['TretecBody']))
            story.append(Spacer(1, 5*mm))
        
        # Material specification
        story.append(Paragraph("<b>Materialspecifikation och kostnad:</b>", self.styles['TretecHeading']))
        story.append(Spacer(1, 3*mm))
        
        # Products table
        if self.data['products']:
            story.extend(self.create_products_table())
        
        # Services
        if self.data['services']:
            story.extend(self.create_services_section())
        
        # Page break before summary
        story.append(PageBreak())
        
        # Summary
        story.extend(self.create_summary())
        
        # Terms and conditions
        story.extend(self.create_terms())
        
        # Service agreement options
        if self.data.get('show_service_agreement', True):
            story.extend(self.create_service_agreement())
        
        # Signature section
        story.extend(self.create_signature())
        
        # Build PDF
        doc.build(story, onFirstPage=self.create_header, onLaterPages=self.create_header)
        
        return output_filename
    
    def create_products_table(self):
        """Create products table grouped by category"""
        elements = []
        
        # Group products by category
        categories = {}
        for product in self.data['products']:
            cat = product.get('category', 'other')
            if cat not in categories:
                categories[cat] = []
            categories[cat].append(product)
        
        category_names = {
            'lasare': 'VAKA - Läsare',
            'centralapparater': 'VAKA - Centralapparater',
            'tillbehor': 'Övrigt',
            'ellas': 'Ellås'
        }
        
        for cat_key, products in categories.items():
            if not products:
                continue
                
            # Category header
            cat_name = category_names.get(cat_key, cat_key.title())
            elements.append(Paragraph(f"<b>{cat_name}</b>", self.styles['TretecBody']))
            elements.append(Spacer(1, 2*mm))
            
            # Create table data
            table_data = []
            for product in products:
                qty = product['quantity']
                name = product['benamning']
                
                # Description if available (truncated for space)
                desc = product.get('description', '')
                if desc and len(desc) > 200:
                    desc = desc[:197] + '...'
                
                table_data.append([
                    str(qty),
                    Paragraph(f"<b>{name}</b><br/><font size=8>{desc}</font>" if desc else f"<b>{name}</b>", 
                             self.styles['TretecSmall'])
                ])
            
            # Create table
            table = Table(table_data, colWidths=[25, 480])
            table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#F5F5F5')),
                ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#CCCCCC')),
                ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                ('LEFTPADDING', (0, 0), (-1, -1), 8),
                ('RIGHTPADDING', (0, 0), (-1, -1), 8),
                ('TOPPADDING', (0, 0), (-1, -1), 6),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
            ]))
            
            elements.append(table)
            elements.append(Spacer(1, 5*mm))
        
        return elements
    
    def create_services_section(self):
        """Create services section with hour-based calculations"""
        elements = []
        
        services_with_amount = [s for s in self.data['services'] if s['amount'] > 0]
        if not services_with_amount:
            return elements
        
        for service in services_with_amount:
            if service.get('hours') and service.get('rate'):
                # Hour-based service
                elements.append(Paragraph(
                    f"<b>1</b> {service['name']}<br/>"
                    f"<font size=9>{service['hours']} timmar × {self.format_price(service['rate'])} kr/tim = {self.format_price(service['amount'])} kr</font>",
                    self.styles['TretecBody']
                ))
            else:
                # Fixed amount service
                elements.append(Paragraph(f"<b>1</b> {service['name']}", self.styles['TretecBody']))
            elements.append(Spacer(1, 3*mm))
        
        return elements
    
    def create_summary(self):
        """Create pricing summary"""
        elements = []
        calc = self.data['calculations']
        
        elements.append(Paragraph("<b>Prissammanfattning</b>", self.styles['TretecHeading']))
        elements.append(Spacer(1, 3*mm))
        
        # Create summary table
        summary_data = []
        
        # Products subtotal
        if calc['subtotal'] > 0:
            summary_data.append(['Material och produkter:', f"{self.format_price(calc['subtotal'])} kr"])
        
        # Services subtotal
        if calc['servicesTotal'] > 0:
            summary_data.append(['Arbete och tjänster:', f"{self.format_price(calc['servicesTotal'])} kr"])
        
        # Subtotal
        summary_data.append(['<b>Summa före rabatt:</b>', f"<b>{self.format_price(calc['totalBeforeDiscount'])} kr</b>"])
        
        # Discount if applicable
        if self.data.get('discount', 0) > 0:
            summary_data.append([
                f"Kundrabatt ({self.data['discount']}%):",
                f"<font color='#4CAF50'>-{self.format_price(calc['discountAmount'])} kr</font>"
            ])
        
        # Extra discount if applicable
        if calc.get('extraDiscountAmount', 0) > 0 and self.data.get('extra_discount', {}).get('text'):
            summary_data.append([
                f"{self.data['extra_discount']['text']}:",
                f"<font color='#4CAF50'>-{self.format_price(calc['extraDiscountAmount'])} kr</font>"
            ])
        
        # Total
        summary_data.append(['', ''])  # Empty row
        summary_data.append([
            '<b><font size=14>Totalt pris investering</font></b>',
            f"<b><font size=14 color='#C9A227'>{self.format_price(calc['grandTotal'])} kr</font></b>"
        ])
        
        # Create table
        table = Table(summary_data, colWidths=[350, 150])
        table.setStyle(TableStyle([
            ('ALIGN', (1, 0), (1, -1), 'RIGHT'),
            ('LINEABOVE', (0, -2), (-1, -2), 2, colors.HexColor('#C9A227')),
            ('TOPPADDING', (0, 0), (-1, -1), 6),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ]))
        
        elements.append(table)
        elements.append(Spacer(1, 8*mm))
        
        return elements
    
    def create_terms(self):
        """Create terms and conditions"""
        elements = []
        
        elements.append(Paragraph("<b>I vårt åtagande ingår ej:</b>", self.styles['TretecHeading']))
        elements.append(Paragraph(
            "Framdragning och anslutning av 230V. Flyttning av tunga hindrande föremål.",
            self.styles['TretecBody']
        ))
        elements.append(Spacer(1, 5*mm))
        
        # Custom terms if provided
        if self.data.get('custom_terms'):
            elements.append(Paragraph("<b>Villkor:</b>", self.styles['TretecHeading']))
            elements.append(Paragraph(self.data['custom_terms'], self.styles['TretecBody']))
            elements.append(Spacer(1, 5*mm))
        
        return elements
    
    def create_service_agreement(self):
        """Create service agreement options"""
        elements = []
        
        elements.append(Paragraph("<b>Välj servicenivå:</b>", self.styles['TretecHeading']))
        elements.append(Spacer(1, 3*mm))
        
        # Service options
        service_text = """
        <b>☐ Grundservice: 49kr/mån + moms</b><br/>
        Fri telefonsupport, 10% på arbete samt material vid servicejobb<br/><br/>
        
        <b>☐ Fullserviceavtal: 1.026kr/mån + moms</b><br/>
        Helt fritt material och arbete vid servicejobb<br/>
        Ej sabotage/stöld samt åska<br/><br/>
        
        <font size=8>Serviceavtalen kostnadsregleras med SCB bevakningsindex årligen. Fakturaperiod kvartalsvis.</font>
        """
        
        elements.append(Paragraph(service_text, self.styles['TretecBody']))
        elements.append(Spacer(1, 5*mm))
        
        return elements
    
    def create_signature(self):
        """Create signature section"""
        elements = []
        
        # Advisor
        advisor = self.data.get('advisor', 'Marcus Wänerskog')
        advisor_phone = '+46 (0) 761 999 555' if 'Marcus' in advisor else '+46 (0) 707 953 321'
        advisor_email = 'marcus.wanerskog@tretec.se' if 'Marcus' in advisor else 'pekka.hakkarainen@tretec.se'
        
        elements.append(Paragraph("<b>Säkerhetsrådgivare</b>", self.styles['TretecHeading']))
        elements.append(Paragraph(
            f"☒ {advisor} {advisor_phone} {advisor_email}",
            self.styles['TretecBody']
        ))
        elements.append(Spacer(1, 8*mm))
        
        # Acceptance
        elements.append(Paragraph(
            "<b>Ja tack, jag beställer enligt ovanstående:</b>",
            self.styles['TretecHeading']
        ))
        elements.append(Spacer(1, 10*mm))
        
        # Signature lines
        sig_data = [
            ['_' * 40, '_' * 50],
            ['Ort och datum', 'Namnteckning/förtydligande']
        ]
        
        sig_table = Table(sig_data, colWidths=[200, 250])
        sig_table.setStyle(TableStyle([
            ('FONTSIZE', (0, 1), (-1, 1), 9),
            ('TEXTCOLOR', (0, 1), (-1, 1), colors.HexColor('#666666')),
        ]))
        
        elements.append(sig_table)
        elements.append(Spacer(1, 10*mm))
        
        # Other terms
        terms = """
        <b>Övriga Villkor:</b><br/>
        Offerten gäller 30 dagar från dagens datum<br/>
        Mervärdesskatt: Tillkommer<br/>
        Betalningsvillkor: 30 dagar netto<br/>
        Leveranstid: Enligt överenskommelse<br/>
        Leveransvillkor: Fritt arbetsplatsen<br/>
        Garantitid: 1 år
        """
        
        elements.append(Paragraph(terms, self.styles['TretecSmall']))
        
        return elements
    
    def format_price(self, amount):
        """Format price with Swedish formatting"""
        return f"{int(amount):,}".replace(',', ' ')

def generate_quote_pdf(quote_json_str, output_filename='offert.pdf'):
    """
    Generate PDF quote from JSON data
    
    Args:
        quote_json_str: JSON string with quote data
        output_filename: Output PDF filename
    
    Returns:
        Path to generated PDF
    """
    try:
        quote_data = json.loads(quote_json_str)
        generator = TretecQuoteGenerator(quote_data)
        return generator.generate(output_filename)
    except Exception as e:
        print(f"Error generating PDF: {e}")
        import traceback
        traceback.print_exc()
        return None

if __name__ == '__main__':
    if len(sys.argv) > 1:
        # Read JSON from file
        with open(sys.argv[1], 'r', encoding='utf-8') as f:
            quote_data = f.read()
        output = sys.argv[2] if len(sys.argv) > 2 else 'offert.pdf'
        result = generate_quote_pdf(quote_data, output)
        if result:
            print(f"✅ PDF generated: {result}")
        else:
            print("❌ Failed to generate PDF")
    else:
        print("Usage: python generate_pdf.py <quote_json_file> [output_pdf]")
