// admin-panel-frontend/src/components/transactions/TransactionShow.jsx
import * as React from "react"; // useState'i import etmeyi unutmayın
import {
    Show,
    SimpleShowLayout,
    TextField,
    DateField,
    NumberField,
    ReferenceField,
    FunctionField,
    ChipField,
    useNotify,      
    useRefresh,     
    useRecordContext, 
    Button          
} from "react-admin";
import axios from 'axios'; 

// JSON verisini formatlı göstermek için helper component
const JsonDataField = ({ source, record = {} }) => {
    if (!record || typeof record[source] === 'undefined') {
        return null; // Veri yoksa bir şey gösterme veya "Yok" de
    }
    let data = record[source];
    if (typeof data === 'string') {
        try {
            data = JSON.parse(data);
        } catch (e) {
            return <pre>{data}</pre>; // Parse edilemezse olduğu gibi göster
        }
    }
    return <pre>{JSON.stringify(data, null, 2)}</pre>;
};

// --- E-postayı Tekrar Gönder Butonu ---
const ResendEmailButton = () => {
    const record = useRecordContext(); // Mevcut transaction kaydını alır
    const notify = useNotify();
    const refresh = useRefresh(); // Sayfayı yenilemek için
    const [loading, setLoading] = React.useState(false);

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

    const handleClick = async () => {
        if (!record || !record.id) {
            notify('Transaction ID bulunamadı.', { type: 'error' });
            return;
        }
        if (!record.userEmail || record.userEmail === 'unknown@example.com') {
            notify('Bu işlem için geçerli bir kullanıcı e-postası bulunmuyor, e-posta gönderilemez.', { type: 'warning' });
            return;
        }


        setLoading(true);
        try {
            await axios.post(`${API_BASE_URL}/document/resend-email/${record.id}`);
            notify('E-posta tekrar gönderme isteği başarıyla iletildi.', { type: 'success' });
            // refresh(); // Opsiyonel: Transaction kaydında bir değişiklik (örn: lastEmailResentAt) olursa sayfayı yenile
        } catch (error) {
            console.error("Error resending email:", error);
            const message = error.response?.data?.message || 'E-posta tekrar gönderilirken bir hata oluştu.';
            notify(message, { type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    if (!record || !record.userEmail || record.userEmail === 'unknown@example.com') {
        // E-posta yoksa butonu gösterme veya pasif yap
        return null; // Veya <Button label="E-posta Gönderilemez" disabled />;
    }

    return (
        <Button
            label="E-postayı Tekrar Gönder"
            onClick={handleClick}
            disabled={loading}
            variant="contained" // Material UI butonu için
            color="secondary"   // Farklı bir renk
            sx={{ marginTop: 2, marginBottom: 1 }} // Biraz boşluk
        />
    );
};
// --- BUTON SONU ---

export const TransactionShow = (props) => (
    // Show component'ine actions prop'u ile butonu ekleyebiliriz veya SimpleShowLayout içine
    <Show {...props} >
        <SimpleShowLayout>
            <ResendEmailButton />

            <TextField source="id" label="Transaction ID" />
            <TextField source="userEmail" label="Kullanıcı E-postası" />
            <TextField source="templateName" label="Şablon Adı" />
            <TextField source="templateId" label="Şablon ID (Referans Değil)" />

            <NumberField source="amount" label="Tutar" options={{ style: 'currency', currency: 'TRY' }} />
            <TextField source="currency" label="Para Birimi" />
            <ChipField source="status" label="Durum" />
            <TextField source="paymentGatewayRef" label="Ödeme Ref." emptyText="-" />
            
            <ReferenceField label="Fatura Detayı" source="invoiceId" reference="invoices" link="show" allowEmpty>
                <TextField source="id" />
            </ReferenceField>
            
            {/* Consent Log için placeholder veya link */}
            {/* <TextField source="consentLogId" label="Onay Log ID" /> */}


            <DateField source="createdAt" label="Oluşturulma Tarihi" showTime />
            <DateField source="updatedAt" label="Güncellenme Tarihi" showTime />
            
            <FunctionField label="Form Verileri" render={record => <JsonDataField source="formDataSnapshot" record={record} />} />
            <FunctionField 
                label="Fatura Bilgileri" 
                render={record => record.billingInfoSnapshot ? <JsonDataField source="billingInfoSnapshot" record={record} /> : "Girilmemiş"} 
            />

            <TextField source="errorMessage" label="Hata Mesajı" emptyText="-" />
        </SimpleShowLayout>
    </Show>
);