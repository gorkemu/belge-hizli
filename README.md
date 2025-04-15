# Contract-Generator

A web application that allows users to generate contracts and documents in PDF format using predefined dynamic templates. The system dynamically creates forms and previews based on the template structure stored in MongoDB.

## ✨ Core Features

*   **Dynamic Templates:** New contract/document types can be added to the system simply by adding new template documents to MongoDB, without requiring code changes.
*   **Dynamic Form Generation:** The form in the user interface for each template is automatically generated based on the template's `fields` array in MongoDB (text boxes, select lists, dates, etc.).
*   **Live Preview:** As the user fills out the form, a preview representing the final document is updated in real-time according to the HTML/Handlebars structure in the template's `content` field.
*   **Form Validation:** Basic validation is automatically performed for fields marked as `required` in the template.
*   **PDF Generation:** Using the filled form data, a PDF document conforming to the template is generated on the backend (using Puppeteer).
*   **Payment Simulation:** A simple payment flow is simulated before document download (ready for actual payment integration).
*   **Static Pages:** Skeleton structure and routing for basic informational pages like Privacy Policy, Terms of Use, etc., are available.

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
    *   Puppeteer (PDF Generation)
    *   Handlebars.js (for server-side template processing)
    *   dotenv (for environment variables)

📁 Project Structure

.
├── backend/
│   ├── models/         # Mongoose schemas (template.js)
│   ├── routes/         # API endpoint definitions (templates.js)
│   ├── pdf-generator/  # PDF generation module (pdfGenerator.js)
│   ├── temp-pdfs/      # (May be created) Folder for temporary PDFs
│   ├── node_modules/
│   ├── .env            # Environment variables (ATLAS_URI etc. - SECRET)
│   ├── server.js       # Main server file
│   └── package.json
└── frontend/
    ├── public/         # Static assets
    ├── src/
    │   ├── assets/
    │   ├── components/   # React components (TemplateList, TemplateDetail, DocumentForm, DocumentPreview etc.)
    │   ├── hooks/        # Custom hooks (usePdfGeneration etc.)
    │   ├── App.jsx       # Main application component and routing
    │   ├── main.jsx      # Application entry point
    │   └── index.css     # Global styles
    ├── node_modules/
    ├── index.html      # Main HTML file
    ├── vite.config.js  # Vite configuration
    └── package.json
└── README.md           # This file
└── .gitignore          # Files ignored by Git

## 🚀 Getting Started

### Prerequisites

*   Node.js (LTS version recommended)
*   npm or yarn
*   MongoDB Atlas account with a cluster created.

### Installation

1.  **Clone the Project:**
    ```bash
    git clone <repository-url>
    cd contract-generator # Navigate to the project directory
    ```

2.  **Backend Setup:**
    ```bash
    cd backend
    npm install
    ```
    *   Create a file named `.env` in the `backend` directory.
    *   Add your MongoDB Atlas connection URI to this file:
        ```dotenv
        ATLAS_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority
        PORT=5001 # Optional, defaults to 5001
        ```
        *Replace `<username>`, `<password>`, `<cluster-url>`, and `<database-name>` with your own credentials.*

3.  **Frontend Setup:**
    ```bash
    cd ../frontend
    npm install
    ```

### Running the Application

1.  **Start the Backend Server:**
    ```bash
    cd ../backend
    npm start
    ```
    *The server will run on port 5001 by default.*

2.  **Start the Frontend Development Server:**
    ```bash
    cd ../frontend
    npm run dev
    ```
    *The application will typically open at `http://localhost:5173` (check the console output).*

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
          "required": true // Boolean (Required)
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

## 📜 Available Scripts

*   **Backend:**
    *   `npm start`: Runs the backend server with node.
    *   `npm run dev`: Runs the backend server in development mode with nodemon (if configured).
*   **Frontend:**
    *   `npm run dev`: Starts the frontend development server (with HMR).
    *   `npm run build`: Compiles the frontend files for production (into the `dist` folder).
    *   `npm run preview`: Previews the compiled production build locally.

## 🔮 Future Enhancements

*   Real payment system integration (Stripe, Iyzico, etc.).
*   User accounts (registration, login, document management).
*   Admin panel for template management.
*   Advanced form features (conditional fields, repeatable blocks).
*   User experience and UI improvements.
*   Detailed error handling and logging.
*   Sending generated PDFs via email.
*   Increased test coverage.
*   Deployment.

## 🤝 Contributing (Optional)

If you wish to contribute, please start by opening an issue or discussing an existing one. Pull requests are welcome.

## 📄 License (Optional)

This project is licensed under the MIT License. See the `LICENSE` file for details (if added).