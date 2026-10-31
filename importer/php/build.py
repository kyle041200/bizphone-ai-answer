"""Build PHP-only preview packages; development utility, never run by WordPress."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
import hashlib
import json

root = Path(__file__).resolve().parent
output = root.parents[1] / 'kghq-downloads/php-published-preview'
output.mkdir(parents=True, exist_ok=True)
version = '0.6.0-alpha1'

def package(name, entries):
    target = output / f'{name}-{version}.zip'
    with ZipFile(target, 'w', ZIP_DEFLATED) as archive:
        for path, entry in sorted(entries, key=lambda value: value[1]):
            archive.write(path, entry)
    with ZipFile(target) as archive:
        assert archive.testzip() is None
        assert all('..' not in Path(name).parts for name in archive.namelist())
    return {'file': target.name, 'bytes': target.stat().st_size,
            'sha256': hashlib.sha256(target.read_bytes()).hexdigest()}

plugin = root / 'wordpress/kghq-lovable-importer'
companion = root / 'wordpress/kghq-published-styles'
entries = [(path, f'kghq-lovable-importer/{path.relative_to(plugin)}')
           for path in plugin.rglob('*') if path.is_file()]
for name in ['README.md', 'STYLING-GUIDE.md', 'TEST-REPORT.md']:
    entries.append((root / name, f'kghq-lovable-importer/{name}'))
results = [package('kghq-lovable-importer', entries)]
entries = [(companion / 'kghq-published-styles.php', 'kghq-published-styles/kghq-published-styles.php')]
for name in ['styles.php', 'published.css', 'canvas.php']:
    entries.append((plugin / name, f'kghq-published-styles/{name}'))
entries.append((root / 'STYLING-GUIDE.md', 'kghq-published-styles/STYLING-GUIDE.md'))
entries.append((plugin / 'LICENSE.txt', 'kghq-published-styles/LICENSE.txt'))
results.append(package('kghq-published-styles', entries))
source = [(path, f'php-published-source/importer/php/{path.relative_to(root)}')
          for path in root.rglob('*') if path.is_file() and '__pycache__' not in path.parts]
for path in (root.parent / 'qa').glob('published-*'):
    if path.is_file():
        source.append((path, f'php-published-source/importer/qa/{path.name}'))
results.append(package('kghq-published-source', source))
(output / 'packages.json').write_text(json.dumps(results, indent=2) + '\n')
for name in ['README.md', 'STYLING-GUIDE.md', 'TEST-REPORT.md']:
    (output / name).write_bytes((root / name).read_bytes())
print(json.dumps(results, indent=2))
