# CN Lanka Tours Website

A responsive single-page travel landing site for CN Lanka Tours Sri Lanka.

## 🚀 Features
- Responsive hero, about, tours, services, gallery, reviews, booking, and contact sections
- Tour filtering and cards populated from JavaScript data
- Booking form and newsletter form with Formspree server-side submission support
- Smooth scrolling navigation and active section highlighting
- Local image assets and production-ready deployment

## 📁 Project Structure
- `index.html` — main website content and sections
- `style.css` — custom styling and hero layout
- `main.js` — app logic, tour/gallery data, filters, forms
- `images/` — local image assets for hero, about, tours, gallery
- `firebase.json`, `.firebaserc` — Firebase hosting config
- `package.json` — project metadata

## 🧰 Setup (Local)
1. Clone repo:
   ```bash
   git clone https://github.com/KalanaWija/CnLankaTours.git
   cd CnLankaTours
   ```
2. Install dependencies (optional if using only static files):
   ```bash
   npm install
   ```
3. Open `index.html` directly or run via Live Server.

## 📧 Form submissions (server-side)
This project uses Formspree in `main.js`:
- `FORMSPREE_BOOKING_URL`
- `FORMSPREE_NEWSLETTER_URL`

Replace with your real Formspree endpoints.

## ☁️ Deploy to Firebase
1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```
2. Login:
   ```bash
   firebase login
   ```
3. Initialize hosting (if needed):
   ```bash
   firebase init hosting
   ```
4. Deploy:
   ```bash
   firebase deploy
   ```

## 📌 Notes
- Add your own images under `images/` and update references in `style.css` and `main.js`.
- Ensure `FORMSPREE_*` URLs are set before using booking/newsletter.

## 📞 Contact
- Email: `cnlankatours@gmail.com`
- Address: No:15, Galketiya, Unawatuna, Galle, Sri Lanka
