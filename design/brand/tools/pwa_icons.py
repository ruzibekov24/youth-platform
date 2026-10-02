from PIL import Image
import numpy as np
ink=np.asarray(Image.open('markink.png').convert('L'))<128
blue=np.asarray(Image.open('blue.png').convert('L'))<128
ys,xs=np.where(ink|blue); x0,x1,y0,y1=xs.min(),xs.max(),ys.min(),ys.max()
def layer(mask,rgb):
    a=Image.fromarray((mask*255).astype('uint8')); im=Image.new('RGBA',a.size,rgb+(0,)); im.putalpha(a); return im
mark=Image.new('RGBA',ink.shape[::-1],(0,0,0,0))
mark.alpha_composite(layer(blue,(0x5B,0x5C,0xFF))); mark.alpha_composite(layer(ink,(0x0B,0x0F,0x1A)))
mark=mark.crop((x0,y0,x1,y1))
def icon(size, frac, path):
    bg=Image.new('RGBA',(size,size),(255,255,255,255))
    w,h=mark.size; s=size*frac/max(w,h)
    m=mark.resize((round(w*s),round(h*s)),Image.LANCZOS)
    bg.alpha_composite(m,((size-m.size[0])//2,(size-m.size[1])//2))
    bg.convert('RGB').save(path, optimize=True)
o='C:/Projects/youth-platform/web/public/icons/'
import os; os.makedirs(o,exist_ok=True)
icon(192,0.62,o+'icon-192.png'); icon(512,0.62,o+'icon-512.png')
icon(512,0.46,o+'maskable-512.png')  # maskable: belgi markaziy 80% xavfsiz zonada
print('ok')
