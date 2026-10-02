import re
S=4
def paths(f):
    out=[]
    for m in re.finditer(r'<path d="([^"]*)"[^>]*transform="translate\(([-\d.]+),([-\d.]+)\)"',open(f).read()):
        d,tx,ty=m.group(1),float(m.group(2)),float(m.group(3))
        nums=list(map(float,re.findall(r'-?\d+\.?\d*',d)))
        xs=[n+tx for n in nums[0::2]]; ys=[n+ty for n in nums[1::2]]
        # round path numbers to 1 decimal to shrink file
        d=re.sub(r'-?\d+\.\d+',lambda k:('%.1f'%float(k.group())).rstrip('0').rstrip('.'),d)
        out.append(dict(d=d,tx=round(tx,1),ty=round(ty,1),bb=(min(xs),min(ys),max(xs),max(ys))))
    return out
ink=paths('markink.svg')+paths('text.svg'); blue=paths('blue.svg')
mark_ink=[p for p in ink if p['bb'][0]<1300]; text=[p for p in ink if p['bb'][0]>=1300]
def bbox(ps):
    return (min(p['bb'][0] for p in ps),min(p['bb'][1] for p in ps),max(p['bb'][2] for p in ps),max(p['bb'][3] for p in ps))
def P(p,fill): return f'<path fill="{fill}" transform="translate({p["tx"]} {p["ty"]})" d="{p["d"]}"/>'
def svg(ps_fills,bb,pad,extra=''):
    x0,y0,x1,y1=bb; x0-=pad;y0-=pad;x1+=pad;y1+=pad
    w,h=x1-x0,y1-y0
    body=''.join(P(p,f) for p,f in ps_fills)
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{x0:.0f} {y0:.0f} {w:.0f} {h:.0f}">{extra}{body}</svg>\n'
INK,BLUE,WHITE='#0B0F1A','#5B5CFF','#FFFFFF'
full_bb=bbox(ink+blue); mark_bb=bbox(mark_ink+blue)
def full(ic): return [(p,BLUE) for p in blue]+[(p,ic) for p in ink]
def mark(ic): return [(p,BLUE) for p in blue]+[(p,ic) for p in mark_ink]
import os
o=r'C:/Projects/youth-platform/web/public/brand/'
open(o+'logo.svg','w').write(svg(full(INK),full_bb,8))
open(o+'logo-white.svg','w').write(svg(full(WHITE),full_bb,8))
open(o+'mark.svg','w').write(svg(mark(INK),mark_bb,8))
open(o+'mark-white.svg','w').write(svg(mark(WHITE),mark_bb,8))
# favicon/icon: mark centered on square
x0,y0,x1,y1=mark_bb; w,h=x1-x0,y1-y0; side=max(w,h)*1.12
cx,cy=(x0+x1)/2,(y0+y1)/2
body=''.join(P(p,f) for p,f in mark(INK))
open(r'C:/Projects/youth-platform/web/app/icon.svg','w').write(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{cx-side/2:.0f} {cy-side/2:.0f} {side:.0f} {side:.0f}">{body}</svg>\n')
print(full_bb, mark_bb, [os.path.getsize(o+f) for f in ['logo.svg','mark.svg']])
