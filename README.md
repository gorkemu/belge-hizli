# Contract-Generator

A web application that allows users to generate contracts and documents in PDF format using predefined dynamic templates. The system dynamically creates forms and previews based on the template structure stored in MongoDB, utilizes an external service for PDF generation, and delivers the final document via direct download and email.

## ✨ Core Features

*   **Dynamic Templates:** New contract/document types can be added to the system simply by adding new template documents to MongoDB, without requiring code changes.
*   **Dynamic Form Generation:** The user interface form for each template is automatically generated based on the template's `fields` array in MongoDB.
*   **Conditional Form Fields:** Forms intelligently show or hide relevant fields based on user selections in other fields.
*   **Live Preview:** A real-time preview updates as the user fills out the form, reflecting the final document structure based on the template's `content` field (using Handlebars.js).
*   **Form Validation:** Basic validation is performed for required fields that are currently visible.
*   **PDF Generation (External):** Leverages the Browserless.io API to generate PDF documents from the filled form data and template content, ensuring reliability and scalability.
*   **Document Delivery:**
    *   **Direct Download:** Users can instantly download the generated PDF after successful processing.
    *   **Email Delivery:** A copy of the generated PDF is automatically sent to the user's provided email address via SMTP using Nodemailer.
*   **Payment Simulation:** Includes a simulated payment step before document generation (ready for actual payment gateway integration).
*   **Custom Domain & SSL:** Hosted on custom domains with automatically managed free SSL certificates via Vercel and Fly.io.
*   **Static Pages:** Provides basic informational pages (About Us, Contact, Privacy Policy, etc.).

## 🛠️ Technology Stack

*   **Frontend:**
    *   React
    *   Vite
    *   React Router
    *   CSS Modules
    *   Axios
    *   Handlebars.js (Client-side preview)
*   **Backend:**
    *   Node.js
    *   Express.js
    *   MongoDB Atlas (Database)
    *   Mongoose (ODM)
    *   Axios (Calling Browserless API)
    *   Nodemailer (Email delivery)
    *   Handlebars.js (Server-side template processing)
    *   dotenv
*   **Services & Hosting:**
    *   Browserless.io (PDF Generation API)
    *   Vercel (Frontend Hosting: `belgehizli.com`)
    *   Fly.io (Backend Docker Hosting: `belgehizli-api.fly.dev`)
    *   SMTP Provider (For `info@belgehizli.com` email sending)

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
    *   `condition`: (Object, Optional) Defines visibility based on another field: `{ "field": "controlling_field_name", "value": "required_value" }`. **Remember to add a `belge_email` field (type: email, required: true) to all templates for email delivery.**

## 📜 Available Scripts

*   **Backend:**
    *   `npm start`: Runs the backend server with node (for production).
    *   `npm run dev`: Runs the backend server with nodemon (for development).
*   **Frontend:**
    *   `npm run dev`: Starts the frontend development server.
    *   `npm run build`: Builds the frontend for production.
    *   `npm run preview`: Previews the production build locally.

## 🔮 Future Enhancements

*   Real payment system integration (Stripe, Iyzico, etc.).
*   User accounts (Auth, document saving/management).
*   Admin panel for template management (CRUD via UI).
*   Advanced form feature: Repeatable blocks/sections.
*   UI/UX improvements and enhanced styling.
*   Detailed error handling and user feedback.
*   Increased test coverage (Unit & Integration tests).

## 🤝 Contributing 

Contributions are welcome. Please open an issue first to discuss proposed changes.

## 📄 License 

[MIT License](https://github.com/gorkemu/belge-hizli/blob/main/LICENCE)