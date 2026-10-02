import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage as nd
N=1000
# --- tile mask (rounded square)
yy,xx=np.mgrid[0:N,0:N].astype(float)
m=0.05*N; r=0.23*N
def rrect(x0,y0,x1,y1,r):
    cx=np.clip(xx,x0+r,x1-r); cy=np.clip(yy,y0+r,y1-r)
    return r-np.hypot(xx-cx,yy-cy)  # signed: >0 inside
sd=rrect(m,m,N-m,N-m,r)
tile=np.clip(sd+0.5,0,1)
bev=0.16*N
t=np.clip(sd/bev,0,1); tile_h=(1-(1-t)**2.2)*0.11*N   # rounded bevel
tile_h+= (1-((xx-N/2)**2+(yy-N/2)**2)/(N*N))*0.01*N   # slight dome
# --- logo masks
ink=np.asarray(Image.open('markink.png').convert('L'))<128
blue=np.asarray(Image.open('blue.png').convert('L'))<128
ys,xs=np.where(ink|blue); x0,x1,y0,y1=xs.min(),xs.max(),ys.min(),ys.max()
def fit(mask):
    im=Image.fromarray((mask[y0:y1,x0:x1]*255).astype('uint8'))
    w,h=im.size; s=0.50*N/max(w,h); im=im.resize((int(w*s),int(h*s)),Image.LANCZOS)
    c=Image.new('L',(N,N),0); c.paste(im,((N-im.size[0])//2+int(0.01*N),(N-im.size[1])//2)); return np.asarray(c)/255.
inkm=fit(ink); bluem=fit(blue)
# blue drawn under ink; final regions
inkr=inkm; bluer=np.clip(bluem-inkm,0,1)
logo=np.clip(inkr+bluer,0,1)
def inflate(mask,depth):
    d=nd.distance_transform_edt(mask>0.5)
    rad=0.05*N
    t=np.clip(d/rad,0,1); h=np.sqrt(1-(1-t)**2)*depth
    return nd.gaussian_filter(h,1.5)
# inflate separately so seam between ink/blue reads as a groove
h_ink=inflate(inkr,0.06*N); h_blue=inflate(bluer,0.06*N)
H=tile_h+np.maximum(h_ink,h_blue)
H=nd.gaussian_filter(H,1.2)
gy,gx=np.gradient(H)
n=np.dstack([-gx,-gy,np.ones_like(H)]); n/=np.linalg.norm(n,axis=2,keepdims=True)
L=np.array([-0.45,-0.6,0.66]); L/=np.linalg.norm(L)
diff=np.clip((n*L).sum(2),0,1); diff=diff**0.8
V=np.array([0,0,1.]); Hh=(L+V)/np.linalg.norm(L+V)
spec=np.clip((n*Hh).sum(2),0,1)**40
# ambient occlusion: tile darkened near logo base (contact)
ao=1-0.22*nd.gaussian_filter(logo,0.025*N)*(1-logo)
ao*=1-0.04*np.clip(1-sd/(0.25*N),0,1)*tile  # slight edge darkening
alb=np.zeros((N,N,3))
alb[:]=np.array([0.975,0.978,0.99])
navy=np.array([0x1E,0x2A,0x52])/255.; bl=np.array([0x5B,0x5C,0xFF])/255.
alb=alb*(1-logo[...,None])+navy*inkr[...,None]+bl*bluer[...,None]
amb=0.80; kd=0.24
col=alb*(amb+kd*diff[...,None])*ao[...,None]
ks=0.05+0.22*logo
col+=spec[...,None]*ks[...,None]
col=np.clip(col,0,1)
rgba=np.dstack([col,tile]).astype(float)
img=Image.fromarray((rgba*255).astype('uint8'),'RGBA').resize((400,400),Image.LANCZOS)
img.save('C:/Projects/youth-platform/web/public/brand/icons/base.png')
img.save('base_preview.png')
print('ok')
