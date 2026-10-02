import sys
sys.path.insert(0,'pylib312')
import vtracer, numpy as np
from PIL import Image, ImageFilter
S=4
im=Image.open(r'C:/Projects/youth-platform/design/brand/logo-light-raster.png').convert('RGB')
W,H=im.size
def masks(blur):
    big=im.resize((W*S,H*S),Image.LANCZOS).filter(ImageFilter.GaussianBlur(blur))
    a=np.asarray(big).astype(int); r,g,b=a[...,0],a[...,1],a[...,2]
    blue=(b>170)&(r<170)&(b-r>60)
    lum=(r*299+g*587+b*114)/1000
    return (lum<120)&~blue, blue
def save(mask,name,dilate=0,lt=4.0):
    m=Image.fromarray(np.where(mask,0,255).astype('uint8'))
    if dilate: m=m.filter(ImageFilter.MinFilter(dilate))
    m.convert('RGB').save(name+'.png')
    vtracer.convert_image_to_svg_py(name+'.png',name+'.svg',colormode='binary',mode='spline',filter_speckle=40,corner_threshold=60,length_threshold=lt,splice_threshold=45,path_precision=2)
ink,_=masks(3.5); ink[:, :1300]=False; save(ink,'text')
ink,blue=masks(8); ink[:, 1300:]=False; blue[:,1300:]=False
save(ink,'markink',lt=10.0); save(blue,'blue',dilate=5,lt=10.0)
