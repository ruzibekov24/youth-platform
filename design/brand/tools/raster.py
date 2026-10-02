from PIL import Image
import numpy as np
ink=np.asarray(Image.open('markink.png').convert('L'))<128
blue=np.asarray(Image.open('blue.png').convert('L'))<128
ys,xs=np.where(ink|blue); x0,x1,y0,y1=xs.min(),xs.max(),ys.min(),ys.max()
w,h=x1-x0,y1-y0; side=int(max(w,h)*1.12); cx,cy=(x0+x1)//2,(y0+y1)//2
def layer(mask,rgb):
    a=Image.fromarray((mask*255).astype('uint8'))
    im=Image.new('RGBA',a.size,rgb+(0,)); im.putalpha(a); return im
canvas=Image.new('RGBA',ink.shape[::-1],(0,0,0,0))
canvas.alpha_composite(layer(blue,(0x5B,0x5C,0xFF))); canvas.alpha_composite(layer(ink,(0x0B,0x0F,0x1A)))
sq=canvas.crop((cx-side//2,cy-side//2,cx+side//2,cy+side//2))
o='C:/Projects/youth-platform/web/app/'
sq.resize((256,256),Image.LANCZOS).save(o+'favicon.ico',sizes=[(16,16),(32,32),(48,48),(64,64)])
bg=Image.new('RGBA',(180,180),(255,255,255,255)); m=sq.resize((140,140),Image.LANCZOS); bg.alpha_composite(m,(20,20)); bg.convert('RGB').save(o+'apple-icon.png')
sq.resize((512,512),Image.LANCZOS).save('C:/Projects/youth-platform/web/public/brand/mark.png')
print('ok', side)
