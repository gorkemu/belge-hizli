import * as React from "react";
import { BrowserRouter as Router, Route, Routes as DomRoutes, Link as RouterDomLink } from 'react-router-dom'; // Eğer ana sitenizde de Router varsa, burada tekrar Router sarmalamaya gerek yok.
import { 
    Admin, Resource, ListGuesser, ShowGuesser, Edit, 
    Layout, Menu, MenuItemLink, CustomRoutes, 
    Link 
} from 'react-admin';
import jsonServerProvider from 'ra-data-json-server';
import authProvider from './authProvider';
import ChangePasswordPage from './pages/ChangePasswordPage'; 

// --- Özel Menü Component'i (İsteğe Bağlı ama Düzenli) ---
import VpnKeyIcon from '@mui/icons-material/VpnKey'; 
import LabelIcon from '@mui/icons-material/Label'; // Resource ikonları için
import ReceiptIcon from '@mui/icons-material/Receipt';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd'; // Fatura bekleyenler için
import DashboardIcon from '@mui/icons-material/Dashboard'; // Dashboard ikonu için

// Component importları
import { PendingInvoiceList } from './components/pendingInvoices/PendingInvoiceList';
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


const MyMenu = () => (
    <Menu>
        <Menu.DashboardItem />
        <MenuItemLink
            to="/transactions-pending-invoice"
            primaryText="Faturalanacaklar"
            leftIcon={<AssignmentIndIcon />}
        />
        <MenuItemLink 
            to="/transactions" 
            primaryText="Transactions" 
            leftIcon={<LabelIcon />} // İkonları değiştirebilirsiniz
        />
        <MenuItemLink 
            to="/invoices" 
            primaryText="Invoices" 
            leftIcon={<ReceiptIcon />} 
        />
        <MenuItemLink 
            to="/consent-logs" 
            primaryText="Consent Logs" 
            leftIcon={<VerifiedUserIcon />} 
        />
        <MenuItemLink 
            to="/change-password" 
            primaryText="Şifre Değiştir" 
            leftIcon={<VpnKeyIcon />} // <-- MENÜ ÖĞESİ
        />
    </Menu>
);

const MyLayout = (props) => <Layout {...props} menu={MyMenu} />; // Eğer Layout'u import ettiyseniz


function App() {
  return (
    <Admin
        dataProvider={dataProvider}
        authProvider={authProvider}
        dashboard={Dashboard}
        layout={MyLayout} // <-- Özel layout'u kullan
        // requireAuth // Bu prop tüm sayfalar için girişi zorunlu kılar
    >
        <Resource name="transactions-pending-invoice" options={{ label: 'Faturalanacaklar' }} list={PendingInvoiceList} />
        <Resource name="transactions" list={TransactionList} show={TransactionShow} />
        <Resource name="invoices" list={InvoiceList} show={InvoiceShow} edit={InvoiceEdit} />
        <Resource name="consent-logs" list={ConsentLogList} show={ConsentLogShow} />
        {/* Şifre değiştirme için özel bir Resource tanımlamaya gerek yok, custom route kullanacağız */}
        {/* Ama React Admin'in routing sistemine dahil etmek için boş bir Resource eklenebilir */}
        {/* Veya daha iyisi, CustomRoutes kullanmak */}
        <CustomRoutes> 
            <Route path="/change-password" element={<ChangePasswordPage />} />
        </CustomRoutes>
    </Admin>
  );
}

export default App;
