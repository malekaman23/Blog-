# Production-readiness changes — kaha paste karna hai

```
C:\Projects\blog-project\
├── backend\app\database.py           ← replace
├── backend\app\routers\uploads.py    ← replace
└── backend\requirements.txt          ← replace
```

## 1. Database — Postgres support (3 number wala point)
`database.py` me pehle se hi `DATABASE_URL` env var support tha (achhi baat), maine bas ek chhota fix add kiya: Render jaise kuch providers `postgres://` se shuru hone wala URL dete hain, lekin naya SQLAlchemy sirf `postgresql://` accept karta hai — ab wo automatically convert ho jayega.

**Kaise use karo (optional — jab chaho tab shift karo):**
1. Render dashboard me ek free PostgreSQL database banao.
2. Wahan se "Internal Database URL" copy karo.
3. Apne backend web service me env var set karo: `DATABASE_URL=<wahi URL>`.
4. Restart karo — backend khud table bana lega (`Base.metadata.create_all` + light migrations already handle karte hain).

Agar `DATABASE_URL` set nahi karoge, to bilkul pehle jaisa SQLite hi chalega — kuch nahi tootega.

## 2. Uploads — cloud storage + ek real bug bhi fix hua (4 number wala point)

**Pehle se chhupa hua bug:** `uploads.py` sirf images (jpg/png/webp/gif) aur videos accept karta tha. Lekin pichhle round me jo **per-post PDF** aur **site logo (SVG)** features bana the, wo isi `/api/upload` endpoint ka use karte hain — matlab PDF upload karte hi ya SVG logo upload karte hi ye **error deta** (kyunki `.pdf` aur `.svg` allowed list me the hi nahi). Ab fix kar diya — `.pdf`, `.svg`, `.ico` sab allowed hain.

**Cloud storage (optional):** Free hosting (Render free tier) pe local disk restart hone par uda sakti hai — matlab uploaded photos/videos/PDFs gayab ho sakte hain. Ab agar Cloudinary ke env vars set karoge, uploads automatically Cloudinary pe (permanent) jayenge; nahi karoge to bilkul pehle jaisa local folder me hi save hoga — local dev me kuch change nahi hota.

**Kaise use karo (optional):**
1. [cloudinary.com](https://cloudinary.com) pe free account banao.
2. Dashboard pe "API Environment variable" dikhta hai, kuch aisa: `CLOUDINARY_URL=cloudinary://123456:abc123@your-cloud-name`
3. Backend env var me yahi poora string daal do: `CLOUDINARY_URL=cloudinary://...`
4. Restart — ab saare naye uploads Cloudinary pe jayenge.

(Agar ye env var set nahi karoge, uploads pehle jaisa hi local me save honge.)

## 3. `requirements.txt` me 3 naye packages add hue
- `psycopg2-binary` — Postgres ke liye (sirf jab `DATABASE_URL` postgres ho)
- `cloudinary` — cloud storage ke liye (sirf jab `CLOUDINARY_URL` set ho)
- `google-auth` — "Continue with Google" feature ke liye (pehle se code me tha, lekin requirements.txt me add karna bhool gaye the — isliye jab tak koi manually `pip install google-auth` nahi karta, Google Sign-In backend pe kaam nahi karta tha)

## Restart checklist
1. Upar diye 3 files replace karo.
2. `pip install -r requirements.txt --break-system-packages` (ya apne venv me) chalao — naye packages install karne ke liye.
3. Backend restart karo.
4. Kuch bhi env var set na karo to sab pehle jaisa hi chalega (local SQLite + local disk uploads) — bas ab PDF/SVG upload error nahi dega.
