# Contract-Generator

A web application that allows users to generate contracts and documents in PDF format using predefined dynamic templates. The system dynamically creates forms and previews based on the template structure stored in MongoDB, utilizes an external service for PDF generation, and delivers the final document via direct download and email. It also includes a cookie consent mechanism for privacy compliance.

## ✨ Core Features

*   **Dynamic Templates:** New contract/document types can be added to the system simply by adding new template documents to MongoDB, without requiring code changes.
*   **Dynamic Form Generation:** The user interface form for each template is automatically generated based on the template's `fields` array in MongoDB.
*   **Conditional Form Fields:** Forms intelligently show or hide relevant fields based on user selections in other fields.
*   **Live Preview:** A real-time preview updates as the user fills out the form, reflecting the final document structure (using Handlebars.js and Inter font).
*   **Template Search:** Users can easily search through templates by name or description.
*   **Modern Template List UI:** Features a clean grid layout with template preview images and hover effects.
*   **Form Validation:** Basic validation is performed for required fields that are currently visible.
*   **PDF Generation (External):** Leverages the Browserless.io API to generate PDF documents with embedded Inter font, ensuring consistency and reliability.
*   **Document Delivery:** Includes direct download and automatic email delivery of the generated PDF.
*   **Cookie Consent Banner:** Informs users about cookie usage and collects consent using `react-cookie-consent`, respecting user preferences and aiding compliance (KVKK/GDPR).
*   **Payment Simulation:** Includes a simulated payment step (ready for actual payment gateway integration).
*   **Custom Domain & SSL:** Hosted on `belgehizli.com` with automatically managed free SSL certificates.
*   **Static Pages:** Provides basic informational pages.

## 🛠️ Technology Stack

*   **Frontend:**
    *   React, Vite, React Router
    *   CSS Modules, Axios, Handlebars.js
    *   `react-cookie-consent`
*   **Backend:**
    *   Node.js, Express.js
    *   MongoDB Atlas, Mongoose
    *   Axios, Nodemailer, Handlebars.js
    *   dotenv
*   **Services & Hosting:**
    *   Browserless.io (PDF Generation)
    *   Vercel (Frontend Hosting: `belgehizli.com`)
    *   Fly.io (Backend Docker Hosting: `belgehizli-api.fly.dev`)
    *   SMTP Provider

## 🚀 Live URLs

*   **Frontend:** [https://www.belgehizli.com/](https://www.belgehizli.com/)
*   **Backend API:** [https://belgehizli-api.fly.dev/api](https://belgehizli-api.fly.dev/api)

## 📄 Adding New Templates (IMPORTANT!)

New templates can be added directly to the MongoDB `templates` collection without code changes. Each template document needs:

*   `name`: (String) Display name.
*   `description`: (String) Short description.
*   `price`: (Number) Price (0 if free).
*   `content`: (String) HTML and Handlebars code for the document body.
*   `fields`: (Array) An array of field objects defining the form:
    *   `name`: (String) Unique identifier, used in `content` and form state.
    *   `label`: (String) Display label in the form.
    *   `fieldType`: (String) Input type ("text", "textarea", "number", "date", "select", "radio", "email", "checkbox").
    *   `required`: (Boolean) If the field is mandatory.
    *   `placeholder`: (String, Optional) Placeholder text.
    *   `options`: (Array, Required for select/radio) Array of option strings.
    *   `condition`: (Object, Optional) Defines visibility based on another field: `{ "field": "controlling_field_name", "value": "required_value" }`.
    *   **Crucially, include a field named `belge_email` (type: email, required: true) in all templates** to enable the email delivery feature.

## 📜 Available Scripts

*   **Backend:** `npm start` (prod), `npm run dev` (dev)
*   **Frontend:** `npm run dev` (dev), `npm run build` (build), `npm run preview` (preview prod build)

## 🔮 Future Enhancements

*   Real payment system integration.
*   User accounts & document management.
*   Admin panel for template management.
*   Advanced form feature: Repeatable blocks.
*   UI/UX improvements.
*   Detailed error handling & logging.
*   Individual template preview image generation.
*   Increased test coverage.

## 🤝 Contributing 

Contributions are welcome. Please open an issue first to discuss proposed changes.

## 📄 License

This project is licensed under the **MIT License**. See the [LICENCE](https://github.com/gorkemu/belge-hizli/blob/main/LICENCE) file for details.