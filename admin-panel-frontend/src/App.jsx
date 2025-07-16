import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes as DomRoutes, Link as RouterDomLink } from 'react-router-dom'; // Eğer ana sitenizde de Router varsa, burada tekrar Router sarmalamaya gerek yok.
import { 
    Admin, Resource, ListGuesser, ShowGuesser, Edit, 
    Layout, Menu, MenuItemLink, CustomRoutes, 
    Link, Title, Loading, Error 
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

import { Card, CardContent, Typography, Grid, Paper } from '@mui/material'; // MUI componentleri
import axios from 'axios'; // API isteği için

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
const ADMIN_DATA_API_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'}/admin-data`;
const dataProvider = jsonServerProvider(ADMIN_DATA_API_URL);

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await axios.get(`${API_BASE_URL}/admin-data/dashboard-stats`);
                setStats(response.data);
            } catch (err) {
                console.error("Error fetching dashboard stats:", err);
                setError(err.response?.data?.message || "İstatistikler yüklenirken bir hata oluştu.");
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []); // Boş bağımlılık dizisi, sadece component mount olduğunda çalışır

    if (loading) return <Loading />;
    if (error) return <Error title="Hata" message={error} />; // React Admin'in Error component'i veya özel bir hata gösterimi
    if (!stats) return <Typography>İstatistik verisi bulunamadı.</Typography>;

    // Basit stil objeleri (isteğe bağlı, CSS Modules ile de yapılabilir)
    const statCardStyle = {
        padding: '20px',
        textAlign: 'center',
        minHeight: '120px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    };

    return (
        <Card sx={{ margin: 2 }}>
            <Title title="Admin Paneli - Genel Bakış" />
            <CardContent>
                <Typography variant="h5" component="h1" gutterBottom>
                    Hoş Geldiniz!
                </Typography>
                <Typography paragraph>
                    Sistemin genel durumu aşağıdadır:
                </Typography>
                <Grid container spacing={3} sx={{ marginTop: 2 }}>
                    <Grid item xs={12} sm={6} md={4}>
                        <Paper sx={{...statCardStyle, backgroundColor: '#e3f2fd' }}> {/* Açık Mavi */}
                            <Typography variant="h6">Toplam İşlem</Typography>
                            <Typography variant="h3">{stats.totalTransactions}</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <Paper sx={{...statCardStyle, backgroundColor: '#e8f5e9' }}> {/* Açık Yeşil */}
                            <Typography variant="h6">Bugünkü İşlemler</Typography>
                            <Typography variant="h3">{stats.todayTransactions}</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <Paper sx={{...statCardStyle, backgroundColor: '#fff3e0' }}> {/* Açık Turuncu */}
                            <Typography variant="h6">Toplam Fatura</Typography>
                            <Typography variant="h3">{stats.totalInvoices}</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <Paper sx={{...statCardStyle, backgroundColor: '#ffebee' }}> {/* Açık Kırmızı/Pembe */}
                            <Typography variant="h6">Bekleyen Fatura</Typography>
                            <Typography variant="h3">{stats.pendingInvoices}</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <Paper sx={{...statCardStyle, backgroundColor: '#f3e5f5' }}> {/* Açık Mor */}
                            <Typography variant="h6">Toplam Onay Logu</Typography>
                            <Typography variant="h3">{stats.totalConsentLogs}</Typography>
                        </Paper>
                    </Grid>
                     {/* Başka istatistikler veya hızlı linkler buraya eklenebilir */}
                </Grid>
            </CardContent>
        </Card>
    );
};


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
