// admin-panel-frontend/src/components/invoices/InvoiceShow.jsx
import * as React from "react";
import {
    Show,
    SimpleShowLayout,
    TextField,
    DateField,
    NumberField,
    ReferenceField,
    FunctionField, // JSON snapshot için
    ChipField,
    UrlField // invoiceUrl için
} from "react-admin";

// TransactionShow'dan kopyalanan JSON helper
const JsonDataField = ({ source, record = {} }) => {
    if (!record || typeof record[source] === 'undefined') return null;
    let data = record[source];
    if (typeof data === 'string') {
        try { data = JSON.parse(data); } catch (e) { return <pre>{data}</pre>; }
    }
    return <pre>{JSON.stringify(data, null, 2)}</pre>;
};

export const InvoiceShow = (props) => (
    <Show {...props}>
        <SimpleShowLayout>
            <TextField source="id" label="Invoice ID" />
            <TextField source="invoiceNumber" label="Fatura Numarası" emptyText="Yok" />
            <ChipField source="status" label="Fatura Durumu" />

            <ReferenceField label="İlgili Transaction" source="transactionId" reference="transactions" link="show">
                <>
                    ID: <TextField source="id" /> <br />
                    Kullanıcı: <TextField source="userEmail" /> <br />
                    Şablon: <TextField source="templateName" />
                </>
            </ReferenceField>

            <NumberField source="amount" label="Tutar" options={{ style: 'currency', currency: 'TRY' }} />
            <TextField source="currency" label="Para Birimi" />

            <hr style={{ margin: '20px 0', borderTop: '1px solid #eee' }}/>
            <h3>Fatura Bilgileri</h3>
            <TextField source="billingType" label="Fatura Tipi" />
            {/* 
                billingInfo.customerName gibi doğrudan erişemeyiz, çünkü billingInfo bir snapshot'tı.
                Transaction'daki billingInfoSnapshot'ı burada göstermek daha iyi olabilir.
                Ya da Invoice modelinde bu alanlar ayrı ayrı tutuluyor, onları kullanacağız.
            */}
            {/* Bireysel Alanlar - Record'daki billingType'a göre koşullu render */}
            <FunctionField label="Müşteri Adı" render={record => record.billingType === 'bireysel' ? record.customerName : null} />
            <FunctionField label="TCKN" render={record => record.billingType === 'bireysel' ? record.customerTckn : null} />
            {/* Kurumsal Alanlar */}
            <FunctionField label="Şirket Unvanı" render={record => record.billingType === 'kurumsal' ? record.companyName : null} />
            <FunctionField label="Vergi Dairesi" render={record => record.billingType === 'kurumsal' ? record.taxOffice : null} />
            <FunctionField label="VKN" render={record => record.billingType === 'kurumsal' ? record.taxId : null} />
            {/* Ortak Alanlar */}
            <TextField source="customerAddress" label="Fatura Adresi" />
            <TextField source="customerEmail" label="Fatura E-postası" />
            
            <UrlField source="invoiceUrl" label="Fatura Linki (Entegratör)" emptyText="-" />
            <TextField source="errorMessage" label="Hata Mesajı (Fatura)" emptyText="-" />

            <DateField source="createdAt" label="Kayıt Tarihi" showTime />
            <DateField source="updatedAt" label="Son Güncelleme" showTime />
        </SimpleShowLayout>
    </Show>
);