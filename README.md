# Contract-Generator

A web application that allows users to generate contracts and documents in PDF format using predefined dynamic templates. The system dynamically creates forms (including repeatable sections and conditional fields) and previews based on the template structure stored in MongoDB, utilizes an external service for PDF generation, and delivers the final document via direct download and email.

## ✨ Core Features

*   **Dynamic Templates:** New contract/document types can be added to the system simply by adding new template documents to MongoDB, without requiring code changes.
*   **Dynamic & Advanced Form Generation:**
    *   Automatically generates UI forms based on the template's `fields` array.
    *   **Repeatable Blocks:** Supports adding or removing multiple instances of a group of fields (e.g., multiple tenants, partners, items) using the `repeatable` fieldType.
    *   **Conditional Fields:** Intelligently shows or hides relevant fields based on user selections in other fields.
*   **Live Preview:** A real-time preview updates as the user fills out the form, reflecting the final document structure (using Handlebars.js and Inter font).
*   **Template Search:** Users can easily search through templates by name or description.
*   **Modern Template List UI:** Features a clean grid layout with template preview images and hover effects.
*   **Form Validation:** Performs validation for required fields, including those within repeatable blocks.
*   **PDF Generation (External):** Leverages the Browserless.io API to generate PDF documents with embedded Inter font.
*   **Document Delivery:** Offers direct download and automatic email delivery of the generated PDF.
*   **Cookie Consent Banner:** Informs users about cookie usage and collects consent.
*   **Payment Simulation:** Includes a simulated payment step.
*   **Custom Domain & SSL:** Hosted on `belgehizli.com` with automatic SSL.
*   **Static Pages:** Provides basic informational pages.

## 🛠️ Technology Stack

*   **Frontend:** React, Vite, React Router, CSS Modules, Axios, Handlebars.js, `react-cookie-consent`
*   **Backend:** Node.js, Express.js, MongoDB Atlas, Mongoose, Axios, Nodemailer, Handlebars.js, dotenv
*   **Services & Hosting:** Browserless.io (PDF), Vercel (Frontend), Fly.io (Backend Docker), SMTP Provider

## 🚀 Live URLs

*   **Frontend:** [https://www.belgehizli.com/](https://www.belgehizli.com/)
*   **Backend API:** [https://belgehizli-api.fly.dev/api](https://belgehizli-api.fly.dev/api)

## 📄 Adding New Templates (IMPORTANT!)

Add new templates directly to the MongoDB `templates` collection. Key fields: `name`, `description`, `price`, `content` (HTML/Handlebars - use `{{#each blockName}}...{{this.subfieldName}}...{{/each}}` for repeatable blocks), and `fields`.

*   **Field Object:** `name`, `label`, `fieldType` ("text", "textarea", "number", "date", "select", "radio", "email", "checkbox", **"repeatable"**), `required`, `placeholder`, `options`, `condition: {field, value}`.
*   **Repeatable Field Object:** Also include `blockTitle`, `addLabel`, `removeLabel`, `minInstances`, `maxInstances`, and a `subfields` array (containing standard field objects).
*   **Remember:** Include a `belge_email` field (type: email, required: true) for email delivery.

## 📜 Available Scripts

*   **Backend:** `npm start` (prod), `npm run dev` (dev)
*   **Frontend:** `npm run dev` (dev), `npm run build` (build), `npm run preview` (preview prod build)

## 🔮 Future Enhancements

*   Real payment system integration.
*   User accounts & document management.
*   Admin panel for template management.
*   Enhanced validation for repeatable blocks and subfields.
*   UI/UX improvements.
*   Increased test coverage.

## 🤝 Contributing 

Contributions are welcome. Please open an issue first to discuss proposed changes.

## 📄 License

This project is licensed under the **MIT License**. See the [LICENCE](https://github.com/gorkemu/belge-hizli/blob/main/LICENCE) file for details.