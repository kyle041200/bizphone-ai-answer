"""Compare measured canvas widths and unaltered QA screenshots, not Lovable fidelity."""
from pathlib import Path
import json
from PIL import Image, ImageChops

work = Path('importer/work/php-published')
baseline = json.loads((work / 'width-baseline.json').read_text())
current = json.loads((work / 'upgrade.json').read_text())
report = {'scope': 'Synthetic same-content canvas regression, NOT comparison with the published Lovable design',
          'frontEnd': [], 'editor': {}, 'visualSimilarityScore': None}
for before in baseline['measurements']:
    after = next(item for item in current['measurements']
                 if item.get('kind') == 'front-end' and item['id'] == before['id']
                 and item['viewport'] == before['viewport'])
    report['frontEnd'].append({'id': before['id'], 'viewport': before['viewport'],
                              'beforeRootWidth': before['width'], 'afterRootWidth': after['rootWidth'],
                              'withinOnePixelOfViewport': abs(after['rootWidth'] - after['viewport']) <= 1})
editor = next(item for item in current['measurements'] if item['kind'] == 'editor')
old_editor = json.loads((work / 'width-editor-baseline.json').read_text())['measurements'][0]['rootWidth']
report['editor'] = {'beforeRootWidth': old_editor, 'afterRootWidth': editor['rootWidth'],
                    'availableIframeWidth': editor['viewport'],
                    'withinTwoPixelsOfIframe': abs(editor['rootWidth'] - editor['viewport']) <= 2}
assert all(item['withinOnePixelOfViewport'] for item in report['frontEnd'])
assert report['editor']['withinTwoPixelsOfIframe']
for width in (1440, 768, 390):
    left = Image.open(work / f'width-baseline-9-{width}.png').convert('RGB')
    right = Image.open(work / f'canvas-9-{width}.png').convert('RGB')
    size = (max(left.width, right.width), max(left.height, right.height))
    padded = []
    for image in (left, right):
        canvas = Image.new('RGB', size, 'white')
        canvas.paste(image, (0, 0))
        padded.append(canvas)
    pair = Image.new('RGB', (size[0] * 2, size[1]), 'white')
    pair.paste(padded[0], (0, 0))
    pair.paste(padded[1], (size[0], 0))
    pair.save(work / f'width-comparison-{width}.png')
    ImageChops.difference(*padded).save(work / f'width-difference-{width}.png')
report['imageMethod'] = 'Before on left, after on right. Difference is absolute RGB difference with white bottom/right padding only, no registration or rescaling. Theme title/wrapper removal is included.'
(work / 'width-report.json').write_text(json.dumps(report, indent=2) + '\n')
print(json.dumps({'widthChecksPassed': len(report['frontEnd']) + 1, 'fidelityScore': None}))
