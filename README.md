# Contract-Generator (Belge Hızlı)

A web application that allows users to generate contracts and documents in PDF format using predefined dynamic templates. The system features a **simulated payment flow**, requires user consent for legal terms, allows optional collection of billing information, generates PDFs via an external service, delivers them via email, **allows direct download from a success page**, and records transaction, consent, and basic invoice data on the backend.

## ✨ Core Features

*   **Dynamic Templates:** Add new contract/document types to MongoDB without code changes.
*   **Dynamic & Advanced Form Generation:**
    *   Auto-generates UI forms from template definitions.
    *   **Repeatable Blocks:** Supports multiple instances of field groups.
    *   **Conditional Fields:** Shows/hides fields based on user selections.
*   **Live Preview:** Real-time preview updates with **Inter font and dd.mm.yyyy date format**.
*   **Template Search & Modern List UI:** Easy searching with a clean grid layout.
*   **Form Validation:** Validates required fields, showing field-specific errors.
*   **Simulated Payment Flow:**
    *   User is redirected to a simulation page after initiating a document request.
    *   Backend callback endpoint processes simulated payment success/failure.
*   **Legal Consent & Logging:**
    *   Requires explicit user agreement to Pre-Information Form and Terms of Service (Distance Sales Contract) before proceeding.
    *   **Consent details (IP, User-Agent, document version, timestamp) are logged** to the backend.
*   **Optional Billing Information:** A form to collect billing details. **(Currently optional during beta).**
*   **User-Friendly Error Handling:** Clear, non-disappearing error messages.
*   **PDF Generation (External):** Uses Browserless.io API for PDF creation.
*   **Document Delivery:**
    *   Automatic email delivery of the generated PDF.
    *   **Direct PDF download option from the payment success page.**
*   **Backend Data Recording:**
    *   Creates a `Transaction` record for every attempt, tracking status (payment pending, successful, PDF generated, email sent, completed, failed).
    *   Creates a `ConsentLog` record for each user consent.
    *   If billing information is provided, an `Invoice` record (with basic details) is created and linked to the transaction.
*   **Cookie Consent Banner:** Collects user consent for cookie usage.
*   **Custom Domain & SSL:** Hosted on `belgehizli.com` with SSL.
*   **Static Pages:** Essential informational and legal pages.

## 🛠️ Technology Stack

*   **Frontend:** React, Vite, React Router, CSS Modules, Axios, Handlebars.js, `react-cookie-consent`, `react-helmet-async`
*   **Backend:** Node.js, Express.js, MongoDB Atlas, Mongoose, Axios, Nodemailer, Handlebars.js, dotenv
*   **Services & Hosting:** Browserless.io (PDF), Vercel (Frontend), Fly.io (Backend Docker), SMTP Provider

## 🚀 Live URLs

*   **Frontend:** [https://www.belgehizli.com/](https://www.belgehizli.com/)
*   **Backend API:** [https://belgehizli-api.fly.dev/api](https://belgehizli-api.fly.dev/api) (Endpoints include `/api/sablonlar`, `/api/payment`, `/api/document`)

## 📄 Adding New Templates (IMPORTANT!)

Add new templates directly to the MongoDB `templates` collection. Key fields: `name`, `description`, `price`, `content` (HTML/Handlebars - use `{{#each blockName}}...{{this.subfieldName}}...{{/each}}` for repeatable blocks), and `fields`.

*   **Field Object:** `name`, `label`, `fieldType` ("text", "textarea", "number", "date", "select", "radio", "email", "checkbox", **"repeatable"**), `required`, `placeholder`, `options`, `condition: {field, value}`.
*   **Repeatable Field Object:** Also include `blockTitle`, `addLabel`, `removeLabel`, `minInstances`, `maxInstances`, and a `subfields` array (containing standard field objects).
*   **Remember:** Include a `belge_email` field (type: email, required: true) for email delivery.

## 📜 Available Scripts

*   **Backend:** `npm start` (prod), `npm run dev` (dev)
*   **Frontend:** `npm run dev` (dev), `npm run build` (build), `npm run preview` (preview prod build)

## 🔮 Future Enhancements

*   Real payment system integration (ParamPOS, etc.).
*   Full e-Invoice integration using the created `Invoice` records.
*   User accounts & document management.
*   Admin panel for template and transaction/invoice/consent log management.
*   Increased test coverage.

## 🤝 Contributing

Contributions are welcome. Please open an issue first to discuss proposed changes.

## 📄 License

This project is licensed under the **MIT License**. See the [LICENCE](https://github.com/gorkemu/belge-hizli/blob/main/LICENCE) file for details.