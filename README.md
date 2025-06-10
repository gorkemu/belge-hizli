# Contract-Generator (Belge Hızlı)

A web application that allows users to generate contracts and documents in PDF format using predefined dynamic templates. The system features a simulated payment flow, requires user consent, allows optional billing info, generates PDFs, delivers them via email & download, and records transaction, consent, and invoice data. It also includes a **React Admin-based admin panel** for managing this data.

## ✨ Core Features

*   **Dynamic Templates:** Add new contract/document types to MongoDB without code changes.
*   **Dynamic & Advanced Form Generation:** Repeatable blocks, conditional fields.
*   **Live Preview:** Real-time preview with consistent styling.
*   **Template Search & Modern List UI.**
*   **Form Validation & User-Friendly Error Handling.**
*   **Simulated Payment Flow:**
    *   Frontend redirection to a simulation page.
    *   Backend callback endpoint processes simulated payment outcomes.
*   **Legal Consent & Logging:**
    *   Explicit user agreement to Pre-Information Form and Terms of Service.
    *   Consent details (IP, User-Agent, document version, timestamp) are logged.
*   **Optional Billing Information:** Form for billing details (optional during beta).
*   **PDF Generation (External):** Uses Browserless.io.
*   **Document Delivery:** Email delivery and direct PDF download from success page.
*   **Backend Data Recording:**
    *   `Transaction` records for every attempt, tracking detailed status.
    *   `ConsentLog` records for each user consent, linked to transactions.
    *   `Invoice` records (if billing info provided), linked to transactions.
*   **Admin Panel (React Admin):**
    *   Separate frontend application.
    *   JWT-based authentication.
    *   Lists, detailed views, and edit capabilities (for Invoices) for Transactions, Invoices, and Consent Logs.
    *   **Dedicated "Pending Invoices" view** for streamlined manual invoicing.
    *   Backend API (`/api/admin-data`) tailored for React Admin, supporting pagination, sorting, and **advanced field filtering (text, date range, exact match).**
*   **Cookie Consent Banner & Static Legal Pages.**
*   **Custom Domain & SSL.**

## 🛠️ Technology Stack

*   **User Frontend:** React, Vite, React Router, CSS Modules, Axios, Handlebars.js, `react-cookie-consent`, `react-helmet-async`
*   **Admin Panel Frontend:** React, Vite, **React Admin**, `ra-data-json-server`, `@mui/material`, Axios, React Router
*   **Backend:** Node.js, Express.js, MongoDB Atlas, Mongoose, Axios, Nodemailer, Handlebars.js, dotenv, `jsonwebtoken`
*   **Services & Hosting:** Browserless.io (PDF), Vercel (Frontends), Fly.io (Backend Docker), SMTP Provider

## 🚀 Live URLs

*   **User Frontend:** [https://www.belgehizli.com/](https://www.belgehizli.com/)

*   **Backend API:** [https://belgehizli-api.fly.dev/api](https://belgehizli-api.fly.dev/api) (Endpoints include `/api/sablonlar`, `/api/payment`, `/api/document`, `/api/admin`, `/api/admin-data`)

## 📄 Adding New Templates (IMPORTANT!)

Add new templates directly to the MongoDB `templates` collection. Key fields: `name`, `description`, `price`, `content` (HTML/Handlebars - use `{{#each blockName}}...{{this.subfieldName}}...{{/each}}` for repeatable blocks), and `fields`.

*   **Field Object:** `name`, `label`, `fieldType` ("text", "textarea", "number", "date", "select", "radio", "email", "checkbox", **"repeatable"**), `required`, `placeholder`, `options`, `condition: {field, value}`.
*   **Repeatable Field Object:** Also include `blockTitle`, `addLabel`, `removeLabel`, `minInstances`, `maxInstances`, and a `subfields` array (containing standard field objects).
*   **Remember:** Include a `belge_email` field (type: email, required: true) for email delivery.

## 📜 Available Scripts
*   **Backend:** `npm start` (prod), `npm run dev` (dev)
*   **User Frontend:** `npm run dev` (dev), `npm run build` (build), `npm run preview` (preview prod build)
*   **Admin Panel Frontend:** `npm run dev`, `npm run build`

## 🔮 Future Enhancements
*   Real payment system integration (ParamPOS, etc.).
*   Full e-Invoice integration.
*   User accounts & document management (for main site).
*   **Admin Panel:** More advanced filtering options (e.g., by related data), dashboard stats, user management, custom actions (e.g., resend email).
*   Increased test coverage.

## 🤝 Contributing

Contributions are welcome. Please open an issue first to discuss proposed changes.

## 📄 License

This project is licensed under the **MIT License**. See the [LICENCE](https://github.com/gorkemu/belge-hizli/blob/main/LICENCE) file for details.