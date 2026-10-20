# AdSense — apply karne se lekar ads live karne tak

## 1. Apply karne se pehle (checklist)

- [ ] Site deploy ho chuki hai apne custom domain pe (HTTPS ke sath) — free subdomain se apply mat karo
- [ ] Kam se kam 15-20 articles, **har ek 1500+ words**, original content
- [ ] Har article me kam se kam ek image/video hai
- [ ] Privacy Policy, Terms of Use, About, Contact — chaaron footer me link hain (ye already ho chuka hai)
- [ ] `robots.txt` aur `sitemap.xml` live hain — deploy karne ke baad check karo `https://tumhara-domain.com/sitemap.xml` khulta hai ya nahi
- [ ] Doosre kisi ad network (agar laga rakha hai) ke ads hata diye
- [ ] Domain kam se kam 30 din purana hai

## 2. Apply kaise karo

1. [google.com/adsense](https://www.google.com/adsense) pe jaake apne site ke URL se sign up karo
2. Google tumhe ek meta-tag ya HTML snippet dega "site ownership verify" karne ke liye — wo `app/layout.js` ke `<head>` me daal sakte ho, ya `.env.local` me `NEXT_PUBLIC_ADSENSE_CLIENT` set karke bhi verify ho jaata hai (snippet automatically load hoga)
3. Submit karke wait karo — review me 2-14 din lagte hain
4. Jab tak review chal raha hai, naye articles publish karte raho, bada structural change mat karo

## 3. Approve hone ke baad — site me ads kaise activate karein

1. AdSense dashboard me apna **Publisher ID** copy karo (format: `ca-pub-1234567890123456`)
2. Frontend ke `.env.local` (ya jahan bhi deploy kiya hai — Vercel ke "Environment Variables" settings) me:
   ```
   NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-1234567890123456
   ```
3. Redeploy karo — AdSense ka script apne aap `<head>` me load hone lagega
4. AdSense dashboard me "Ads → By ad unit" se naya ad unit banao, uska **slot ID** copy karo
5. `frontend/app/blog/[slug]/page.js` me jo `<AdUnit slot="0000000000" />` line hai, usme apna real slot ID daal do

Bas itna hi — jab tak `NEXT_PUBLIC_ADSENSE_CLIENT` set nahi hoga, site pe koi ad nahi dikhega (review ke dauran safe rahega).

## 4. Aur AdUnit kahin aur bhi lagana ho

Kisi bhi page me import karke use kar sakte ho:
```jsx
import AdUnit from "../components/AdUnit";
...
<AdUnit slot="तुम्हारा-slot-id" />
```
Homepage sidebar me ya blog listing ke beech me bhi laga sakte ho — bas zyada ads se page slow/spammy na lage, 2-3 jagah kaafi hai.

## 5. Income aur payout

- **CPC** (click) aur **CPM** (1000 views) dono se kamai hoti hai
- Dashboard pe real-time earnings dikhti hai (AdSense → Reports)
- Minimum **$100** balance hone par agle mahine ke 21-26 tareekh ke beech bank transfer hota hai
- Google Payments Profile me bank details (IFSC, account number) ek baar set karni hoti hai

## 6. Jo cheezein ban/suspend karwa sakti hain

- Khud apne ads pe click karna, ya doston se click karwana
- Bots/paid traffic/click-farms se visits badhana
- Copied content, ya content jo visible pages pe na ho (cloaking)
- Ads ko accidental-click layout me lagana (buttons ke bilkul upar, etc.)
