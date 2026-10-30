#!/usr/bin/env python3
"""Build reproducible plugin/CLI ZIPs without dependencies, local data, or credentials."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED, ZipInfo
import shutil
import argparse
import re
import json
ROOT=Path(__file__).resolve().parent
parser=argparse.ArgumentParser();parser.add_argument('--version',default=None);VERSION=parser.parse_args().version
DIST=ROOT/'dist';DIST.mkdir(exist_ok=True)
def archive(target, entries):
    with ZipFile(target,'w',ZIP_DEFLATED) as out:
        for source,name in sorted(entries,key=lambda item:item[1]):
            info=ZipInfo(name,(2026,1,1,0,0,0));info.compress_type=ZIP_DEFLATED
            info.external_attr=(0o100644 << 16)
            out.writestr(info,source.read_bytes())
for plugin in ('kghq-lovable-importer','kghq-import-styles'):
    folder=ROOT/'wordpress'/plugin
    plugin_version=VERSION or re.search(r'Version:\s*([^\s]+)',(folder/(plugin+'.php')).read_text()).group(1)
    archive(DIST/f'{plugin}-{plugin_version}.zip',[(p,str(Path(plugin)/p.relative_to(folder))) for p in folder.rglob('*') if p.is_file()])
engine=[(p,str(Path('kghq-converter/engine')/p.relative_to(ROOT/'engine'))) for p in (ROOT/'engine').rglob('*') if p.is_file() and 'node_modules' not in p.parts]
engine += [(ROOT/'README.md','kghq-converter/README.md')]
engine += [(p,str(Path('kghq-converter/docs')/p.relative_to(ROOT/'docs'))) for p in (ROOT/'docs').rglob('*') if p.is_file()]
engine_version=VERSION or json.loads((ROOT/'engine/package.json').read_text())['version'].replace('-rc.','-rc')
archive(DIST/f'kghq-converter-{engine_version}.zip',engine)
if (ROOT/'work/export/bundle.json').exists():shutil.copyfile(ROOT/'work/export/bundle.json',DIST/'kghq-example-bundle.json')
print('\n'.join(str(p.relative_to(ROOT))+f' ({p.stat().st_size:,} bytes)' for p in DIST.iterdir() if p.suffix in ('.zip','.json')))
