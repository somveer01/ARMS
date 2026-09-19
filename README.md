# ARMS — Agricultural Retailer Management System
### कृषि खुदra प्रबंधन प्रणाली (बीज, खाद, कीटनाशक व किसान उधारी खाता बही)

[![React](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8.svg)](https://tailwindcss.com/)
[![Capacitor](https://img.shields.io/badge/Capacitor-7.0-1199ee.svg)](https://capacitorjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Ready-336791.svg)](https://www.postgresql.org/)

**ARMS** is a modern retail POS, stock inventory, and credit ledger (Khata) software designed specifically for agricultural input retailers selling seeds, fertilizers, pesticides, micro-nutrients, and farming equipment.

Available seamlessly across **Web (Desktop Counter POS)**, **Android App**, and **iOS App**.

---

## 🌟 Key Features

### 1. Bilingual Support (हिन्दी ⇋ English)
* Instant 1-tap language toggle across the entire application without page reload.
* Localized terminology tailored for Indian agricultural retail:
  * Seeds (बीज), Fertilizers (खाद/उर्वरक - Urea, DAP, NPK), Pesticides (कीटनाशक दवाएं).
  * Units: बैग (Bag), पैकेट (Pkt), बोतल (Btl), किलो (Kg), क्विंटल (Qtl), लीटर (Ltr).
  * Billing: कुल बिल, जमा राशि, शेष उधारी, पिछला बकाया, कुल शेष बकाया.

### 2. Complete 7-Step Agri-Retail Workflow
1. **Master Setup (मास्टर सेटअप)**: Setup products, categories, units, distributors/suppliers, and village/district directories.
2. **Purchase Entry (खरीद प्रविष्टि)**: Record supplier shipments, auto-calculate purchase costs, and auto-increment stock & supplier payable liability.
3. **Inventory / Stock (स्टॉक प्रबंधन)**: Real-time stock status, low-stock warnings, and complete in/out movement history.
4. **Farmer Registration (किसान पंजीकरण)**: Village, district, mobile number, landholding acreage, and credit limits.
5. **Sales Entry POS (बिक्री बिलिंग)**: Search farmers, add multiple items, live stock validation, split payment (paid vs **auto remaining due**), and instant thermal receipt printing.
6. **Payment Recovery Entry (उधारी जमा)**: FIFO auto-adjustment against oldest unpaid bills and balance reduction.
7. **All 7 Reports & Analytics**:
   * **Village-Wise Due Report**: Group by District ➔ Village, list all farmers with dues, and calculate village grand totals with direct WhatsApp payment reminder links.
   * **Daily Sales Report**: Cash, UPI, and credit extended today.
   * **Purchase Report**: Supplier-wise and product-wise procurement summary.
   * **Stock Valuation Report**: Available stock and low-stock alerts.
   * **Farmer Khata Statement**: Complete individual debit & credit ledger.
   * **Monthly Report**: Monthly turnover, purchases, and collections.
   * **Custom Date Report**: Flexible date range financial analysis.

---

## 🚀 Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/) (v18 or higher)
* [Git](https://git-scm.com/)

### Installation
```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/arms-agri-retail.git
cd arms-agri-retail

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The application will be live at:
* Local: `http://localhost:5173/`
* Network (for Android phone on same Wi-Fi): `http://<your-ip>:5173/`

---

## 📱 Mobile App (Android & iOS)

This project uses **Capacitor 7** to package native Android and iOS applications from a single codebase:

### Android APK Build
```bash
# Sync web build to Android project
npm run build
npx cap sync

# Open project in Android Studio to build APK
npx cap open android
```
In Android Studio, click **Build ➔ Build Bundle(s) / APK(s) ➔ Build APK(s)** to generate `app-debug.apk`.

### Instant Android PWA Installation
Open `http://<your-ip>:5173/` in Google Chrome on your Android phone and tap **"Install App"** to install it directly to your home screen with offline support!

---

## 🗄️ PostgreSQL Database Integration

A complete PostgreSQL schema and seed dataset is included in `scripts/`:
* `scripts/schema.sql`: Full DDL with B-Tree indexes on `village_id`, `mobile`, `sale_date`.
* `scripts/seed_data.sql`: Realistic sample agricultural products and farmer records.
* `scripts/export_postgres_to_json.js`: Automated extraction tool to sync PostgreSQL directly with ARMS.

See [`POSTGRESQL_SEEDING_GUIDE.md`](./POSTGRESQL_SEEDING_GUIDE.md) for full instructions.

---

## 📄 License
MIT License. Built for agricultural retailers and farmers. 🌱
