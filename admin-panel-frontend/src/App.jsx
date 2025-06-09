// admin-panel-frontend/src/App.jsx
import * as React from "react";
import { Admin, Resource, ListGuesser, ShowGuesser, Edit } from 'react-admin';
import jsonServerProvider from 'ra-data-json-server';
import authProvider from './authProvider';

import { TransactionList } from './components/transactions/TransactionList';
import { TransactionShow } from './components/transactions/TransactionShow';
import { InvoiceList } from './components/invoices/InvoiceList';
import { InvoiceShow } from './components/invoices/InvoiceShow';
import { InvoiceEdit } from './components/invoices/InvoiceEdit';
import { ConsentLogList } from './components/consentlogs/ConsentLogList';
import { ConsentLogShow } from './components/consentlogs/ConsentLogShow';


const ADMIN_DATA_API_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'}/admin-data`;
const dataProvider = jsonServerProvider(ADMIN_DATA_API_URL);

const Dashboard = () => (
    <div>
        <h1>Admin Paneline Hoş Geldiniz</h1>
        <p>Buradan kayıtları yönetebilirsiniz.</p>
    </div>
);

function App() {
  return (
    <Admin
        dataProvider={dataProvider}
        authProvider={authProvider}
        dashboard={Dashboard}
    >
        <Resource name="transactions" list={TransactionList} show={TransactionShow} />
        <Resource name="invoices" list={InvoiceList} show={InvoiceShow} edit={InvoiceEdit} />
        <Resource name="consent-logs" list={ConsentLogList} show={ConsentLogShow} />
    </Admin>
  );
}

export default App;
