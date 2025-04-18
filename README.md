# Contract-Generator

A web application that allows users to generate contracts and documents in PDF format using predefined dynamic templates. The system dynamically creates forms and previews based on the template structure stored in MongoDB, and utilizes an external service for PDF generation.

## ✨ Core Features

*   **Dynamic Templates:** New contract/document types can be added to the system simply by adding new template documents to MongoDB, without requiring code changes.
*   **Dynamic Form Generation:** The user interface form for each template is automatically generated based on the template's `fields` array in MongoDB (text boxes, select lists, dates, etc.).
*   **Conditional Form Fields:** Forms can conditionally show or hide specific fields based on user selections in other fields, providing a more interactive experience.
*   **Live Preview:** As the user fills out the form, a preview representing the final document is updated in real-time according to the template's `content` field (using Handlebars.js).
*   **Form Validation:** Basic validation is automatically performed for fields marked as `required` in the template (only when visible).
*   **PDF Generation (via External Service):** Uses the filled form data and template content to generate a PDF document via the Browserless.io API, offloading the resource-intensive task from the backend server.
*   **Payment Simulation:** A simple payment flow is simulated before document download (ready for actual payment integration).
*   **Static Pages:** Skeleton structure and routing for basic informational pages like Privacy Policy, Terms of Use, etc., are available.
*   **Deployed:** Frontend hosted on Vercel, Backend API (Dockerized) hosted on Fly.io.

## 🛠️ Technology Stack

*   **Frontend:**
    *   React
    *   Vite
    *   CSS Modules
    *   Axios
    *   Handlebars.js (for client-side preview)
*   **Backend:**
    *   Node.js
    *   Express.js
    *   MongoDB Atlas (Database)
    *   Mongoose (ODM)
    *   Axios (for calling Browserless API)
    *   Handlebars.js (for server-side template processing before sending to Browserless)
    *   dotenv (for environment variables)
*   **Services:**
    *   Browserless.io (External Headless Chrome API for PDF generation)
    *   Vercel (Frontend Hosting)
    *   Fly.io (Backend Docker Hosting)

## 🚀 Deployment

*   **Frontend:** Deployed on [Vercel](https://vercel.com/) via Git integration. The live URL is: [https://belgehizli.vercel.app/](https://belgehizli.vercel.app/)
*   **Backend:** Deployed as a Docker container on [Fly.io](https://fly.io/) via Git integration and `fly.toml` / `Dockerfile`. The live API URL is: [https://belgehizli-api.fly.dev/api](https://belgehizli-api.fly.dev/api)
*   **Database:** Hosted on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
*   **PDF Generation:** Handled by making API calls to [Browserless.io](https://www.browserless.io/). Requires a `BROWSERLESS_API_KEY` environment variable set in the backend deployment environment (Fly.io Secrets).

## 📄 Adding New Templates (IMPORTANT!)

The core strength of this application is the ability to add new document templates **without modifying the code**. To add a new template:

1.  Connect to your database using MongoDB Atlas, Compass, or the Mongo Shell.
2.  Select the `templates` collection.
3.  Insert a new document that adheres to the following JSON structure:

    ```json
    {
      "name": "Template Name", // String (Required)
      "description": "Short description of the template.", // String (Required)
      "price": 10.0, // Number (Required - 0 if free)
      "content": "<!-- HTML and Handlebars Code -->\n<p>Hello {{user_name}},</p>\n{{#if (eq type 'Important')}}<b>This is an important document.</b>{{/if}}", // String (Required)
      "fields": [ // Array (Required)
        {
          "name": "user_name", // String (Required - used in content)
          "label": "User Name", // String (Required - Form label)
          "fieldType": "text", // String (Required - "text", "textarea", "number", "date", "select", "radio", "email", "checkbox")
          "placeholder": "Enter your full name", // String (Optional)
          "required": true, // Boolean (Required)
          // Optional condition for visibility:
          // "condition": { "field": "controlling_field_name", "value": "required_value_for_visibility" }
        },
        {
          "name": "type",
          "label": "Document Type",
          "fieldType": "select",
          "options": ["Normal", "Important", "Urgent"], // Array (Required for select/radio)
          "required": true
        }
        // ... other fields
      ]
    }
    ```

*   Every field object in the `fields` array **must** include `name`, `label`, `fieldType`, and `required`.
*   The `options` array is **required** for `fieldType` values of `select` or `radio`.
*   Handlebars expressions (`{{handlebars_expressions}}`) and helper usage (`eq`, `math`, etc.) within the `content` **must** be consistent with the `name`s defined in the `fields` array and the data structure coming from the form.
*   To make a field conditional, add a `condition` object specifying the `field` to check and the `value` it must have for the current field to be displayed.

## 📜 Available Scripts

*   **Backend:**
    *   `npm start`: Runs the backend server with node (used in production).
    *   `npm run dev`: Runs the backend server in development mode with nodemon.
*   **Frontend:**
    *   `npm run dev`: Starts the frontend development server (with HMR).
    *   `npm run build`: Compiles the frontend files for production (into the `dist` folder).
    *   `npm run preview`: Previews the compiled production build locally.

## 🔮 Future Enhancements

*   Real payment system integration (Stripe, Iyzico, etc.).
*   User accounts (registration, login, document management).
*   Admin panel for template management.
*   Advanced form feature: Repeatable blocks/sections.
*   UI/UX improvements and enhanced styling.
*   Detailed error handling and user feedback.
*   Sending generated PDFs via email.
*   Increased test coverage (Unit & Integration tests).

## 🤝 Contributing (Optional)

Contributions are welcome. Please open an issue first to discuss what you would like to change or add. Pull requests can then be submitted.

## 📄 License (Optional)

This project is licensed under the MIT License. See the `LICENSE` file for details (if added).