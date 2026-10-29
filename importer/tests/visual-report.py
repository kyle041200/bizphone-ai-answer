from PIL import Image, ImageChops, ImageStat, ImageDraw
from pathlib import Path
import json
ROOT=Path(__file__).resolve().parents[1]
work=ROOT/'work';metrics=[];sections=[]
for slug,prefix in [('bizphone',''),('bizsite','bizsite-')]:
    data=json.loads((work/f'{prefix}visual-metrics.json').read_text())
    for index,width in enumerate((1440,768,390)):
        a=Image.open(work/f'{prefix}source-{width}-top.png').convert('RGB')
        b=Image.open(work/f'{prefix}imported-{width}-top.png').convert('RGB')
        d=ImageChops.difference(a,b);channels=d.split()
        mask=ImageChops.lighter(ImageChops.lighter(channels[0],channels[1]),channels[2]).point(lambda value:255 if value>25 else 0)
        metrics.append({'page':slug,'width':width,'viewportHeight':a.height,'pixelsAnyRGBDeltaAbove25Percent':round(mask.histogram()[255]/(a.width*a.height)*100,2),'meanAbsoluteChannelDifference':round(sum(ImageStat.Stat(d).mean)/3,2),'sourceFullHeight':data['source'][index]['height'],'importedFullHeight':data['imported'][index]['height']})
        sheet=Image.new('RGB',(width*2,1040),'#eeeeee');draw=ImageDraw.Draw(sheet)
        draw.text((12,10),'SOURCE',fill='#222222');draw.text((width+12,10),'WORDPRESS / TWENTY SEVENTEEN',fill='#222222')
        sheet.paste(a,(0,40));sheet.paste(b,(width,40));sheet.save(work/f'{prefix}comparison-{width}.png');d.save(work/f'{prefix}difference-{width}.png')
        sections.append(f'<section><h2>/{slug} · {width}px</h2><p>Source on the left, WordPress on the right. First 1,000 pixels only. <a href="{prefix}source-{width}.png">Full source</a> · <a href="{prefix}imported-{width}.png">Full WordPress page</a> · <a href="{prefix}difference-{width}.png">Pixel difference</a></p><img src="{prefix}comparison-{width}.png" alt="Source and WordPress screenshot comparison for {slug} at {width}px"></section>')
(work/'pixel-comparison.json').write_text(json.dumps(metrics,indent=2))
(work/'visual-comparison.html').write_text('<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>KGHQ source / WordPress QA</title><style>body{font:16px/1.6 system-ui;background:#f3f0f8;color:#211c30;margin:24px auto;max-width:1600px;padding:0 20px}section{background:white;padding:20px;margin:24px 0;border-radius:14px}img{max-width:100%;height:auto}a{color:#683bb3}</style><h1>KGHQ Lovable Importer: screenshot evidence</h1><p>Local draft staging on Twenty Seventeen. These comparisons do not certify other themes or full-page pixel equality. Read TEST-REPORT.md for spacing differences, fonts, unsupported components, and deletion tests.</p>'+''.join(sections)+'</html>')
print(json.dumps(metrics,indent=2))
