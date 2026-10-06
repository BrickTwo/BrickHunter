"""Read-only PDF QA: render application downloads and verify rows and page footers.

Usage: python scripts/upgrade/inspect-export-pdfs.py RUN_FOLDER [BASELINE_FOLDER]
Requires bundled pypdf, pdfplumber, Pillow and Poppler (PDFTOPPM environment variable).
"""
import hashlib
import json
import os
from pathlib import Path
import re
import subprocess
import sys
from decimal import Decimal

import pdfplumber
from pypdf import PdfReader
from PIL import Image, ImageChops, ImageDraw

root = Path(sys.argv[1])
baseline = Path(sys.argv[2]) if len(sys.argv) > 2 else None
report = json.loads((root / 'report.json').read_text(encoding='utf-8'))
results = []
rendered = []
sha = lambda file: hashlib.sha256(file.read_bytes()).hexdigest()

for case in report['cases']:
    name = case['name']
    pdf = root / (name + '.pdf')
    reader = PdfReader(pdf)
    text = '\n'.join(page.extract_text() for page in reader.pages)
    assert 'ÄÖÜ äöü ß' in text, (name, 'missing umlauts')
    for index, page in enumerate(reader.pages, 1):
        page_text = page.extract_text()
        assert f'Page {index} of {len(reader.pages)}' in page_text, (name, 'wrong page footer')
        assert all(header in page_text for header in ['DesignId', 'ElementId', 'Image', 'Color', 'Quantity', 'BrickLink', 'PaB']), (name, 'missing header')
    extracted_rows = []
    image_count = 0
    with pdfplumber.open(pdf) as parsed:
        for page in parsed.pages:
            image_count += len(page.images)
            assert all(char['top'] >= 0 and char['bottom'] <= page.height for char in page.chars), (name, 'text outside page')
            for table in page.extract_tables():
                for row in table:
                    if row[0] and re.fullmatch(r'4\d{3}', row[0]):
                        extracted_rows.append(row)
    assert [row[0] for row in extracted_rows] == case['expected']['ids'], (name, 'missing or reordered rows', extracted_rows)
    assert sum(int(row[4]) for row in extracted_rows) == case['expected']['quantity'], (name, 'wrong quantity sum')
    assert all(row[5] == '0.3' and row[6] == '0.25 EUR' for row in extracted_rows), (name, 'changed prices')
    assert image_count == case['expected']['rows'], (name, 'missing images')
    subprocess.run([os.environ['PDFTOPPM'], '-png', '-r', '120', str(pdf), str(root / name)], check=True, capture_output=True)
    pages = sorted(root.glob(name + '-[0-9]*.png'))
    assert len(pages) == len(reader.pages)
    item = {'name': name, 'pages': len(reader.pages), 'rows': len(extracted_rows), 'images': image_count, 'quantitySum': case['expected']['quantity'], 'brickLinkTotal': str(sum((Decimal(row[5]) * int(row[4]) for row in extracted_rows), Decimal(0))), 'pabTotal': str(sum((Decimal(row[6].split()[0]) * int(row[4]) for row in extracted_rows), Decimal(0))), 'textWithinPageBounds': True, 'pdfSha256': sha(pdf), 'textSha256': hashlib.sha256(text.encode()).hexdigest(), 'pageImages': []}
    for page in pages:
        rendered.append(page)
        entry = {'file': page.name, 'sha256': sha(page)}
        if baseline:
            previous = baseline / page.name
            a, b = Image.open(previous).convert('RGB'), Image.open(page).convert('RGB')
            assert a.size == b.size
            diff = ImageChops.difference(a, b)
            pixels = diff.tobytes()
            entry['differentPixels'] = sum(pixels[index:index + 3] != b'\0\0\0' for index in range(0, len(pixels), 3))
            entry['diffBounds'] = diff.getbbox()
            assert entry['differentPixels'] == 0, (name, page.name, 'render changed', entry)
        item['pageImages'].append(entry)
    if baseline:
        old = PdfReader(baseline / (name + '.pdf'))
        assert len(old.pages) == len(reader.pages)
        assert '\n'.join(page.extract_text() for page in old.pages) == text, (name, 'text changed')
    results.append(item)

# Review every rendered page in a contact sheet; page PNGs remain available at full resolution.
thumb_w, thumb_h, columns = 360, 530, 3
sheet = Image.new('RGB', (columns * thumb_w, ((len(rendered) + columns - 1) // columns) * thumb_h), 'white')
draw = ImageDraw.Draw(sheet)
for index, page in enumerate(rendered):
    image = Image.open(page).convert('RGB')
    image.thumbnail((thumb_w - 10, thumb_h - 30))
    x, y = index % columns * thumb_w, index // columns * thumb_h
    sheet.paste(image, (x + 5, y + 25))
    draw.text((x + 5, y + 5), page.name, fill='black')
sheet.save(root / 'contact-sheet.png')
(root / 'pdf-inspection.json').write_text(json.dumps(results, indent=2) + '\n', encoding='utf-8')
print(json.dumps({'cases': len(results), 'pages': len(rendered), 'rows': sum(item['rows'] for item in results), 'rendersIdenticalToBaseline': bool(baseline)}))
