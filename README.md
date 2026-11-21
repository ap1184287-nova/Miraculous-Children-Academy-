# Miraculous Children Academy — Digital School Portal & PWA

Bilingual (**Hindi + English**) digital school portal and installable Progressive Web App (PWA) for **Miraculous Children Academy**, **Nikhura, Buxar, Bihar, India** (**CBSE Pattern · Nursery to Class 10**).

Designed for **₹0 hosting cost on GitHub Pages** with preconfigured relative asset paths, offline caching, dynamic Admin theme color customization, and Android App (TWA) readiness.

---

## Key Features

- **8 Complete Sections**:
  - **Home**: School crest emblem, Nikhura campus banner, welcome & principal's message, school highlights, live notices feed, and quick links.
  - **About School**: School introduction, vision & mission, milestone timeline (2012–2026), and live-editable Principal & Teachers directory.
  - **Academics (Nursery – Class 10)**: Stage-wise CBSE curriculum, subjects, co-curriculars, class teachers, linked homework, and study materials.
  - **Student Corner**: Class-wise study notes, worksheets, sample papers (online reader + `.txt` download), daily & holiday homework filters, CBSE exam schedule/grading scale, and **Demo Student Lookup** (Roll Number, Class & Section search, Demo Student ID card, Attendance Register, and Term Mark Sheets).
  - **Notice Board**: Filterable circulars (`Holidays`, `Examination`, `Academic`, `Circulars`, `Events`) with search and reader modal.
  - **Gallery**: Categorized campus & event photography (`School`, `Events`, `Sports & Cultural`) with lightbox preview and Admin device photo upload.
  - **Contact Us**: Campus address, demo helpline, office hours, zero-budget Google Maps direct search link (no paid API keys), and validated enquiry form saved to Admin inbox.
  - **Admin Panel (Demo)**:
    - Demo Passcode: `MCA-ADMIN-2026`
    - Manage notices, gallery photos, study materials/sample papers, daily/holiday homework, faculty & class teachers, demo student records, attendance, exam marks, website content (CMS), and **Primary Brand Color Picker** (presets + custom hex/color picker persisted in `localStorage`).
- **Bilingual UI**: Instant English / हिन्दी switcher across navigation, content, and portals.
- **PWA & Offline Support**: Web App Manifest, Service Worker caching (`vite-plugin-pwa`), 192px/512px/maskable icons, and install prompt.

---

## Privacy & Demo Data Notice

- Student Lookup uses **strictly fictional demo student profiles** only (`isDemoRecord: true`).
- No real student personal data or private phone numbers are published.
- Admin updates persist locally in browser `localStorage` (`src/services/repository.ts`), structured for clean upgrade to **Firebase Auth + Firestore**.

---

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

### Verification Scripts

```bash
npm test      # Run unit tests (node:test via tsx)
npm run lint  # TypeScript type-check (tsc --noEmit)
npm run build # Build production static site into ./dist
```

---

## Free Hosting on GitHub Pages (GitHub Actions)

This repository includes `.github/workflows/deploy-gh-pages.yml` and `base: './'` in `vite.config.ts` so it deploys cleanly to `https://<username>.github.io/<repo-name>/`:

1. Create a **Public** repository on GitHub (e.g., `miraculous-children-academy`).
2. Push this project to your GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Initial Miraculous Children Academy portal and PWA"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo>.git
   git push -u origin main
   ```
3. In your GitHub repository, open **Settings → Pages**.
4. Under **Build and deployment → Source**, choose **GitHub Actions**.
5. Once the workflow finishes, your site is live at:
   `https://<your-username>.github.io/<your-repo>/`

---

## Converting to an Android App (`.APK` / `.AAB`)

Once live on GitHub Pages, convert the PWA into an Android Trusted Web Activity (TWA):

- **Option 1 (No CLI):** Open [pwabuilder.com](https://www.pwabuilder.com), enter your live GitHub Pages URL, and download the Android package.
- **Option 2 (Google Bubblewrap CLI):**
  ```bash
  npm install -g @bubblewrap/cli
  bubblewrap init --manifest=https://<your-username>.github.io/<your-repo>/manifest.webmanifest
  bubblewrap build
  ```
