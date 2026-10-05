# موقع المركز الوطني للمنشآت العائلية — National Center for Family Businesses (NCFB)

## العربية

### ما هذا المشروع
الموقع الرسمي الثابت للمركز الوطني للمنشآت العائلية، مبني بـ [Astro](https://astro.build) عن النموذج المعتمد (`identity/mockups/site.tpl.html`).
العربية هي اللغة الافتراضية في جذر الموقع (`/`) باتجاه من اليمين إلى اليسار، والنسخة الإنجليزية الكاملة تحت `/en/` بالروابط نفسها.
المحتوى كله في ملفات JSON يمكن تحريرها من لوحة التحرير `/admin/` (Decap CMS)، والنماذج تعمل عبر Netlify Forms.

### التشغيل محلياً
```bash
npm install        # مرة واحدة
npm run dev        # خادم التطوير على http://localhost:4321
npm run build      # بناء الموقع في مجلد dist/
npm run preview    # معاينة النسخة المبنية
```
يتطلب Node.js 22 أو أحدث.

### بنية المشروع
```
src/
  content/            ← كل المحتوى القابل للتحرير (عربي + إنجليزي في كل حقل: {"ar": ..., "en": ...})
    settings.json       اسم المركز، نبذة التذييل، البريد، حقوق النشر، نص الخصوصية والشروط
    home.json           نصوص الصفحة الرئيسية والواجهة
    sections/*.json     الأقسام السبعة: العنوان والمقدمة والأيقونة وصورة الرأس وصفحاتها الفرعية
    services/*.json     تفاصيل كل خدمة: الوصف، ما تحصل عليه، المراحل، الفئة المستهدفة، المدة، طريقة التقديم
    board.json          أعضاء مجلس الإدارة
    ceo.json            الرئيس التنفيذي: الاسم والكلمة والسيرة
    history.json        محطات تاريخ المركز
    publications.json   المنشورات
    videos.json         المقاطع
    events.json         الفعاليات (وهي مصدر الروزنامة أيضاً)
    programs.json       البرامج التدريبية المفتوحة
    custom-program.json صفحة البرامج حسب الطلب ونموذجها
  i18n/ui.json        نصوص الواجهة الثابتة (أزرار، عناوين حقول...) بالعربية والإنجليزية
  assets/             الشعار والصور (تُحسَّن تلقائياً عند البناء)
  styles/tokens.css   رموز التصميم (منسوخة من identity/tokens/tokens.css، الوضع الفاتح فقط)
  styles/site.css     أنماط الموقع المنقولة من النموذج
  components/         مكونات الصفحات وقوالبها (templates/)
  layouts/Base.astro  الإطار العام: الرأس، التذييل، وسوم SEO و hreflang
  lib/site.ts         خريطة الصفحات والروابط بين اللغتين
  pages/              المسارات: [...slug].astro (عربي) و en/[...slug].astro (إنجليزي)، index (الصفحة الافتتاحية)، 404
public/admin/         لوحة التحرير (Decap CMS): index.html و config.yml
public/uploads/       الملفات والصور المرفوعة من لوحة التحرير
```

### الصفحات
`/` الصفحة الافتتاحية، `/home/` الرئيسية، ثم الأقسام: `/about/`، `/library/`، `/events/`، `/training/`، `/consulting/`، `/alt/`، `/advocacy/` وصفحاتها الفرعية (مثل `/about/board/`، `/consulting/charter/`، `/events/calendar/`)،
إضافة إلى `/contact/` و `/events/register/` و `/training/register/` و `/thanks/` و `/privacy/` و `/terms/`. كل صفحة لها نظير إنجليزي تحت `/en/`.

### تحرير المحتوى عبر لوحة التحرير
1. افتح `https://<النطاق>/admin/` وسجّل الدخول بحساب Netlify Identity (يصل بدعوة من مدير الموقع).
2. اختر المجموعة (الأقسام، الخدمات، الفعاليات...) وعدّل الحقلين العربي والإنجليزي.
3. اضغط «نشر»؛ يُحفظ التعديل كـ commit في فرع `main`، ويعيد Netlify بناء الموقع خلال دقيقة تقريباً.

ملاحظات: معرّفات الأقسام والصفحات (`id` و `slug`) تحدد الروابط فلا تُغيَّر. لإضافة صورة لعضو مجلس أو للرئيس التنفيذي ارفعها من حقل الصورة؛ تبقى العناصر النائبة حتى تُرفع الصور.
للتحرير محلياً دون Netlify: شغّل `npx decap-server` بجانب `npm run dev` ثم افتح `http://localhost:4321/admin/`.

### النشر على Netlify
1. ارفع المستودع إلى GitHub (أو GitLab/Bitbucket)، ثم في Netlify: **Add new site → Import an existing project** واختر المستودع.
2. أمر البناء: `npm run build` — مجلد النشر: `dist` (مضبوطان أيضاً في `netlify.toml`).
3. فعّل **Identity** من إعدادات الموقع، واجعل التسجيل بالدعوة فقط (Registration: Invite only)، ثم فعّل **Git Gateway** من Identity → Services، وادعُ المحررين من تبويب Identity.
4. **النماذج**: تُكتشف تلقائياً عند النشر (`custom-program`، `event-registration`، `program-registration`، `contact`). فعّل Form detection إن لم يكن مفعّلاً، وأضف إشعاراً بالبريد من Forms → Form notifications.

### ربط النطاق
من Netlify: **Domain management → Add a domain**، ثم أضف سجلات DNS التي يطلبها Netlify لدى مزوّد النطاق (أو انقل خوادم الأسماء إلى Netlify DNS). شهادة HTTPS تُصدر تلقائياً.
بعدها حدّث `SITE_URL` في `astro.config.mjs` و `site_url` في `public/admin/config.yml`.

### مهام متبقية (TODO)
- المحتوى الرسمي: كل النصوص الحالية نموذجية (أسماء المجلس وصورهم، الرئيس التنفيذي، تاريخ المركز، المنشورات وملفاتها، المقاطع وروابطها، الفعاليات والبرامج، سياسة الخصوصية والشروط).
- نسخة بيضاء من الشعار للتذييل الداكن (يظهر الآن على لوحة بيضاء كما في النموذج).
- بيانات التواصل الحقيقية (البريد الحالي `info@example.sa` مؤقت؛ رقم الهاتف والعنوان غير موجودين بعد).
- رابط الموقع الحقيقي بدل `https://www.example.sa` في `astro.config.mjs` و `public/admin/config.yml`.

---

## English

### What this is
The static website of the National Center for Family Businesses (NCFB), built with [Astro](https://astro.build) from the approved prototype (`identity/mockups/site.tpl.html`).
Arabic is the default language at the root (`/`, right-to-left); the full English version lives under `/en/` with the same slugs.
All content is in JSON files editable through the `/admin/` dashboard (Decap CMS); forms use Netlify Forms.

### Run locally
```bash
npm install        # once
npm run dev        # dev server at http://localhost:4321
npm run build      # builds the site into dist/
npm run preview    # serves the built site
```
Requires Node.js 22+.

### Project structure
See the tree above. In short: editable content in `src/content/` (every text field is `{"ar": ..., "en": ...}`), fixed interface strings in `src/i18n/ui.json`, images and logo in `src/assets/` (optimized with `astro:assets` at build time), design tokens in `src/styles/tokens.css` (copied from the identity source, light theme only), ported prototype styles in `src/styles/site.css`, page templates in `src/components/templates/`, routes in `src/pages/` (`[...slug].astro` for Arabic, `en/[...slug].astro` for English, `index.astro` for the opening page, `404.astro`). Icons are inlined at build time from `lucide-static` with stroke width 1.5.

### Where content lives
| File | Holds |
|---|---|
| `settings.json` | site name, footer tagline, contact email, copyright, privacy and terms text |
| `home.json` | home page hero and section texts |
| `sections/*.json` | the 7 sections: title, intro, icon, header photo, sub-pages (title, icon, description) |
| `services/*.json` | service details: description, what you get, steps, audience, duration, format |
| `board.json`, `ceo.json`, `history.json` | About pages |
| `publications.json`, `videos.json` | Digital library |
| `events.json` | events (also feed the calendar) |
| `programs.json`, `custom-program.json` | Training pages |

### Editing through /admin
1. Open `https://<domain>/admin/` and sign in with Netlify Identity (editors are invited by the site admin).
2. Pick a collection, edit the Arabic and English fields, press **Publish**.
3. The change is committed to `main`; Netlify rebuilds and publishes the site in about a minute.

Do not change section/page `id` or `slug` values: they define the URLs. For local editing without Netlify, run `npx decap-server` next to `npm run dev` and open `http://localhost:4321/admin/`.

### Deploy on Netlify
1. Push the repository to GitHub/GitLab/Bitbucket; in Netlify choose **Add new site → Import an existing project**.
2. Build command `npm run build`, publish directory `dist` (also set in `netlify.toml`).
3. Enable **Identity** (set registration to *Invite only*), then enable **Git Gateway** under Identity → Services, and invite editors. The CMS (`git-gateway` backend, branch `main`) works once both are on.
4. **Forms** are detected automatically at deploy (`custom-program`, `event-registration`, `program-registration`, `contact`); each posts to the thank-you page of its language (`/thanks/`, `/en/thanks/`) and has a honeypot field. Turn on form detection if needed and add email notifications under Forms → Form notifications.

### Connect the domain
In Netlify, **Domain management → Add a domain**, then create the DNS records Netlify shows at your registrar (or move the nameservers to Netlify DNS). HTTPS is issued automatically. Then update `SITE_URL` in `astro.config.mjs` and `site_url` in `public/admin/config.yml`.

### TODO
- Official content: all current text is sample text (board names/photos, CEO, history, publications and PDFs, videos and links, events, programs, privacy policy and terms).
- A white version of the logo for the dark footer (currently shown on a white plate, as in the prototype).
- Real contact details (`info@example.sa` is a placeholder; no phone or address yet).
- The real site URL instead of `https://www.example.sa` in `astro.config.mjs` and `public/admin/config.yml`.
