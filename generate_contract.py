#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Tretec Larm AB - Business Agreement/Contract Generator
Generates professional business agreements from quote data
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_RIGHT, TA_CENTER
import json
from datetime import datetime

class TretecContractGenerator:
    def __init__(self, quote_data):
        self.data = quote_data
        self.width, self.height = A4
        self.styles = getSampleStyleSheet()
        self.setup_styles()
        
    def setup_styles(self):
        """Setup custom paragraph styles"""
        self.styles.add(ParagraphStyle(
            name='ContractTitle',
            parent=self.styles['Heading1'],
            fontSize=24,
            textColor=colors.HexColor('#C9A227'),
            spaceAfter=20,
            alignment=TA_CENTER
        ))
        
        self.styles.add(ParagraphStyle(
            name='ContractHeading',
            parent=self.styles['Heading2'],
            fontSize=14,
            textColor=colors.HexColor('#333333'),
            spaceAfter=10,
            spaceBefore=15,
            fontName='Helvetica-Bold'
        ))
        
        self.styles.add(ParagraphStyle(
            name='ContractBody',
            parent=self.styles['Normal'],
            fontSize=10,
            textColor=colors.HexColor('#333333'),
            leading=14
        ))
        
        self.styles.add(ParagraphStyle(
            name='ContractSmall',
            parent=self.styles['Normal'],
            fontSize=9,
            textColor=colors.HexColor('#666666'),
            leading=12
        ))
    
    def create_header(self, canvas, doc):
        """Create header with logo and company info"""
        canvas.saveState()
        
        # Add logo if exists
        try:
            canvas.drawImage('Treteclogo.jpg', 40, self.height - 80, 
                           width=150, height=50, preserveAspectRatio=True)
        except:
            pass
        
        # Title
        canvas.setFont('Helvetica-Bold', 20)
        canvas.setFillColor(colors.HexColor('#C9A227'))
        canvas.drawCentredString(self.width / 2, self.height - 50, 'AFFÄRSAVTAL / ORDERBEKRÄFTELSE')
        
        # Company info (right side)
        canvas.setFont('Helvetica', 9)
        canvas.setFillColor(colors.black)
        canvas.drawRightString(self.width - 40, self.height - 70, 'Tretec Larm AB')
        canvas.drawRightString(self.width - 40, self.height - 85, 'Nysätersvägen 38, 461 54 Trollhättan')
        canvas.drawRightString(self.width - 40, self.height - 100, 'Tel: 0520 – 47 02 50')
        canvas.drawRightString(self.width - 40, self.height - 115, 'Org.nr: 556452-3966')
        
        # Golden line
        canvas.setStrokeColor(colors.HexColor('#C9A227'))
        canvas.setLineWidth(3)
        canvas.line(40, self.height - 130, self.width - 40, self.height - 130)
        
        canvas.restoreState()
    
    def generate(self, output_filename):
        """Generate the complete contract"""
        doc = SimpleDocTemplate(
            output_filename,
            pagesize=A4,
            rightMargin=40,
            leftMargin=40,
            topMargin=150,
            bottomMargin=60
        )
        
        story = []
        
        # Basic info section
        story.extend(self.create_basic_info())
        
        # Agreed delivery
        story.extend(self.create_delivery_section())
        
        # Payment terms
        story.extend(self.create_payment_section())
        
        # Timeline
        story.extend(self.create_timeline_section())
        
        # Project meetings
        story.extend(self.create_meetings_section())
        
        # Warranty
        story.extend(self.create_warranty_section())
        
        # Service agreements
        story.extend(self.create_service_section())
        
        # Terms and conditions
        story.extend(self.create_terms_section())
        
        # Signatures
        story.extend(self.create_signature_section())
        
        # Build PDF
        doc.build(story, onFirstPage=self.create_header, onLaterPages=self.create_header)
        
        return output_filename
    
    def create_basic_info(self):
        """Create basic information section"""
        elements = []
        
        elements.append(Paragraph("<b>GRUNDUPPGIFTER</b>", self.styles['ContractHeading']))
        
        # Customer and company info in table
        info_data = [
            ['<b>Kund:</b>', self.data['customer'].get('name', 'N/A')],
            ['Adress:', self.data['customer'].get('address', '')],
            ['Org.nr:', self.data['customer'].get('orgNumber', '')],
            ['', ''],
            ['<b>Er referens:</b>', self.data['customer'].get('contactPerson', '')],
            ['<b>Vår referens:</b>', 'Marcus Wänerskog, +46 (0) 761 999 555'],
            ['', ''],
            ['<b>Avtalsdatum:</b>', self.data.get('date', datetime.now().strftime('%Y-%m-%d'))],
            ['<b>Offertnummer:</b>', self.data.get('quoteNumber', 'N/A')],
        ]
        
        info_table = Table(info_data, colWidths=[150, 350])
        info_table.setStyle(TableStyle([
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('TOPPADDING', (0, 0), (-1, -1), 3),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
        ]))
        
        elements.append(info_table)
        elements.append(Spacer(1, 10*mm))
        
        return elements
    
    def create_delivery_section(self):
        """Create delivery section"""
        elements = []
        
        elements.append(Paragraph("<b>AVTALAD LEVERANS</b>", self.styles['ContractHeading']))
        
        calc = self.data.get('calculations', {})
        total = calc.get('grandTotal', 0)
        
        elements.append(Paragraph(
            f"Enligt bifogad offert \"{self.data.get('quoteNumber', 'N/A')}\" daterad {self.data.get('date', 'N/A')}",
            self.styles['ContractBody']
        ))
        elements.append(Spacer(1, 3*mm))
        
        elements.append(Paragraph(
            f"<b>Totalt pris investering: {self.format_price(total)} kr</b><br/>"
            "<i>(Moms 25% är tillkommande)</i>",
            self.styles['ContractBody']
        ))
        elements.append(Spacer(1, 8*mm))
        
        return elements
    
    def create_payment_section(self):
        """Create payment terms section"""
        elements = []
        
        elements.append(Paragraph("<b>BETALNINGSVILLKOR</b>", self.styles['ContractHeading']))
        
        payment_text = """
        Betalning sker enligt följande plan:<br/>
        • <b>30%</b> vid påbörjat arbete (30 dagar netto)<br/>
        • <b>30%</b> efter driftsättning av systemet (30 dagar netto)<br/>
        • <b>40%</b> efter utbildning och överlämning (30 dagar netto)
        """
        
        elements.append(Paragraph(payment_text, self.styles['ContractBody']))
        elements.append(Spacer(1, 8*mm))
        
        return elements
    
    def create_timeline_section(self):
        """Create timeline section"""
        elements = []
        
        elements.append(Paragraph("<b>TIDPLAN & LEVERANS</b>", self.styles['ContractHeading']))
        
        timeline_data = [
            ['Projektstart:', self.data.get('timeline', {}).get('start', 'Enligt överenskommelse')],
            ['Montage/Installation:', self.data.get('timeline', {}).get('installation', 'Enligt överenskommelse')],
            ['Driftsättning:', self.data.get('timeline', {}).get('commissioning', 'Enligt överenskommelse')],
            ['Utbildning & Överlämning:', self.data.get('timeline', {}).get('handover', 'Enligt överenskommelse')],
        ]
        
        timeline_table = Table(timeline_data, colWidths=[180, 320])
        timeline_table.setStyle(TableStyle([
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('TOPPADDING', (0, 0), (-1, -1), 4),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ]))
        
        elements.append(timeline_table)
        elements.append(Spacer(1, 8*mm))
        
        return elements
    
    def create_meetings_section(self):
        """Create project meetings section"""
        elements = []
        
        elements.append(Paragraph("<b>PROJEKTMÖTEN</b>", self.styles['ContractHeading']))
        
        elements.append(Paragraph(
            "Avtalet inkluderar <b>5 projekterings-/byggmöten</b> i samband med projektstart.<br/><br/>"
            "Tillkommande möten, fysiska eller digitala, debiteras med <b>1.000 kr</b> per påbörjad timme. "
            "Timmar sammanställs och faktureras kvartalsvis.",
            self.styles['ContractBody']
        ))
        elements.append(Spacer(1, 8*mm))
        
        return elements
    
    def create_warranty_section(self):
        """Create warranty section"""
        elements = []
        
        elements.append(Paragraph("<b>GARANTI</b>", self.styles['ContractHeading']))
        
        elements.append(Paragraph(
            "<b>5 års garanti</b> på samtligt material efter driftsättning.",
            self.styles['ContractBody']
        ))
        elements.append(Spacer(1, 8*mm))
        
        return elements
    
    def create_service_section(self):
        """Create service agreement selection"""
        elements = []
        
        elements.append(Paragraph("<b>SERVICEAVTAL (välj ett alternativ)</b>", self.styles['ContractHeading']))
        
        service_options = [
            ['☐', '<b>Revisionsavtal: 833 kr/mån</b>', 
             'Årlig revision på inbrottslarm, passersystem samt ellåsning. Fri telefonsupport, 48 timmars inställelse vid påkallad service, vardag dagtid.'],
            ['', '', ''],
            ['☐', '<b>Serviceavtal: 449 kr/mån</b>', 
             'Löper igång månad 61 efter driftsatt anläggning. Fri telefonsupport, 48 timmars inställelse. Material och arbete tillkommande.'],
            ['', '', ''],
            ['☐', '<b>Fullservice: [Belopp] kr/mån</b>', 
             'Löper igång månad 61. Helt fritt material, felsökning och arbete vid tekniskt fel. Undantag: Sabotage, stöld, åska.'],
        ]
        
        service_table = Table(service_options, colWidths=[20, 150, 330])
        service_table.setStyle(TableStyle([
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('TOPPADDING', (0, 0), (-1, -1), 3),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
        ]))
        
        elements.append(service_table)
        elements.append(Spacer(1, 3*mm))
        
        elements.append(Paragraph(
            "<i>(Serviceavtalen kostnadsregleras med SCB bevakningsindex årligen. Faktureras kvartalsvis.)</i>",
            self.styles['ContractSmall']
        ))
        elements.append(Spacer(1, 8*mm))
        
        return elements
    
    def create_terms_section(self):
        """Create terms and conditions"""
        elements = []
        
        elements.append(Paragraph("<b>VILLKOR</b>", self.styles['ContractHeading']))
        
        terms_text = """
        <b>Förändring av anläggning:</b> Kunden har inte rätt att utföra ändringar eller modifiera 
        anläggningen utan samråd. Säkerhetsanläggningen kan skalas upp/ner efter offert från Tretec Larm.<br/><br/>
        
        <b>Tillgång till nätverk:</b> Kunden (IT-avdelning) ska vara behjälplig med portar och 
        nätverksadresser vid installation.<br/><br/>
        
        <b>Uppsägningstid:</b> 12 månader löpande på valda månadstjänster/abonnemang.<br/><br/>
        
        <b>I vårt åtagande ingår EJ:</b> Framdragning och anslutning av 230V. Flyttning av tunga hindrande föremål.
        """
        
        elements.append(Paragraph(terms_text, self.styles['ContractBody']))
        elements.append(Spacer(1, 10*mm))
        
        return elements
    
    def create_signature_section(self):
        """Create signature section"""
        elements = []
        
        elements.append(Paragraph("<b>SIGNATURER</b>", self.styles['ContractHeading']))
        elements.append(Spacer(1, 5*mm))
        
        # Supplier signature
        elements.append(Paragraph("<b>Leverantör - Tretec Larm AB</b>", self.styles['ContractBody']))
        elements.append(Spacer(1, 3*mm))
        
        sig_data = [
            ['Datum:', '_' * 40],
            ['Namnunderskrift:', '_' * 40],
            ['Namnförtydligande:', '_' * 40],
        ]
        
        sig_table = Table(sig_data, colWidths=[150, 350])
        sig_table.setStyle(TableStyle([
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('TOPPADDING', (0, 0), (-1, -1), 4),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ]))
        
        elements.append(sig_table)
        elements.append(Spacer(1, 10*mm))
        
        # Customer signature
        elements.append(Paragraph(
            "<b>Kund</b><br/>"
            "Härmed intygas att undertecknare har rätt att legalt ingå detta avtal, "
            "antingen som behörig firmatecknare eller genom utställd fullmakt.",
            self.styles['ContractBody']
        ))
        elements.append(Spacer(1, 3*mm))
        
        cust_sig_data = [
            ['Datum:', '_' * 40],
            ['Org.nr:', '_' * 40],
            ['Namnunderskrift:', '_' * 40],
            ['Namnförtydligande:', '_' * 40],
        ]
        
        cust_sig_table = Table(cust_sig_data, colWidths=[150, 350])
        cust_sig_table.setStyle(TableStyle([
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('TOPPADDING', (0, 0), (-1, -1), 4),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ]))
        
        elements.append(cust_sig_table)
        elements.append(Spacer(1, 10*mm))
        
        elements.append(Paragraph(
            "<i>Avtalet upprättas i två likalydande exemplar, varav parterna tagit var sitt.</i>",
            self.styles['ContractSmall']
        ))
        
        return elements
    
    def format_price(self, amount):
        """Format price with Swedish formatting"""
        return f"{int(amount):,}".replace(',', ' ')


def generate_contract_pdf(quote_json_str, output_filename='avtal.pdf'):
    """
    Generate contract PDF from quote data
    """
    try:
        quote_data = json.loads(quote_json_str)
        generator = TretecContractGenerator(quote_data)
        return generator.generate(output_filename)
    except Exception as e:
        print(f"Error generating contract: {e}")
        import traceback
        traceback.print_exc()
        return None


if __name__ == '__main__':
    import sys
    if len(sys.argv) > 1:
        with open(sys.argv[1], 'r', encoding='utf-8') as f:
            quote_data = f.read()
        output = sys.argv[2] if len(sys.argv) > 2 else 'avtal.pdf'
        result = generate_contract_pdf(quote_data, output)
        if result:
            print(f"✅ Contract generated: {result}")
        else:
            print("❌ Failed to generate contract")
    else:
        print("Usage: python generate_contract.py <quote_json_file> [output_pdf]")
