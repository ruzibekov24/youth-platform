from PIL import Image
import numpy as np, os
ink=np.asarray(Image.open('markink.png').convert('L'))<128
blue=np.asarray(Image.open('blue.png').convert('L'))<128
ys,xs=np.where(ink|blue); x0,x1,y0,y1=xs.min(),xs.max(),ys.min(),ys.max()
def layer(mask,rgb):
    a=Image.fromarray((mask*255).astype('uint8')); im=Image.new('RGBA',a.size,rgb+(0,)); im.putalpha(a); return im
mark=Image.new('RGBA',ink.shape[::-1],(0,0,0,0))
mark.alpha_composite(layer(blue,(0x5B,0x5C,0xFF))); mark.alpha_composite(layer(ink,(0x0B,0x0F,0x1A)))
mark=mark.crop((x0,y0,x1,y1))
mono=layer(ink|blue,(255,255,255)).crop((x0,y0,x1,y1))
def place(src,size,frac,bg=None):
    c=Image.new('RGBA',(size,size),bg or (0,0,0,0)); w,h=src.size; s=size*frac/max(w,h)
    m=src.resize((round(w*s),round(h*s)),Image.LANCZOS); c.alpha_composite(m,((size-m.size[0])//2,(size-m.size[1])//2)); return c
R='C:/Projects/youth-platform/android-twa/app/src/main/res/'
os.makedirs(R+'drawable-nodpi',exist_ok=True)
place(mark,432,0.40).save(R+'drawable-nodpi/ic_launcher_foreground.png',optimize=True)   # 66% xavfsiz zona ichida
place(mono,432,0.40).save(R+'drawable-nodpi/ic_launcher_mono.png',optimize=True)
place(mark,512,0.62).save(R+'drawable-nodpi/splash.png',optimize=True)
for d,px in {'mdpi':48,'hdpi':72,'xhdpi':96,'xxhdpi':144,'xxxhdpi':192}.items():
    os.makedirs(R+f'mipmap-{d}',exist_ok=True)
    place(mark,px,0.60,(255,255,255,255)).convert('RGB').save(R+f'mipmap-{d}/ic_launcher.png',optimize=True)
print('ok')
