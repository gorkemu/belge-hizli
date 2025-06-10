import * as React from "react";
import {
    Show,
    SimpleShowLayout,
    TextField,
    DateField,
    NumberField,
    ReferenceField,
    FunctionField,
    ChipField,
    UrlField,
    useRecordContext 
} from "react-admin";
import { Link as RouterLink } from 'react-router-dom'; 

// JSON verisini formatlı göstermek için helper component 
const JsonDataField = ({ source, record = {} }) => {
    if (!record || typeof record[source] === 'undefined') return null;
    let data = record[source];
    if (typeof data === 'string') {
        try { data = JSON.parse(data); } catch (e) { return <pre>{data}</pre>; }
    }
    return <pre>{JSON.stringify(data, null, 2)}</pre>;
};

// ReferenceField için özel child component 
const LinkedTransactionField = () => {
    const record = useRecordContext(); // Bu, ReferenceField tarafından bulunan Transaction objesi olmalı
    if (!record) return null; // Kayıt yoksa veya yükleniyorsa bir şey gösterme (ReferenceField allowEmpty halleder)
    
    // Transaction ID'yi ve templateName'i göster, ID'ye tıklandığında Transaction Show sayfasına git.
    // React Admin'in kendi linklemesi yerine React Router Link kullanabiliriz (daha fazla kontrol)
    // veya doğrudan React Admin'in <Link to="..."> component'ini kullanabiliriz.
    // En basiti, ReferenceField'ın link="show" prop'una güvenmektir.
    return (
        <>
            ID: <TextField record={record} source="id" sx={{ display: 'inline', mr: 1 }} />
            (<TextField record={record} source="templateName" sx={{ display: 'inline' }} />)
        </>
    );
};


export const InvoiceShow = (props) => (
    <Show {...props}>
        <SimpleShowLayout>
            <TextField source="id" label="Invoice ID" />
            <TextField source="invoiceNumber" label="Fatura Numarası" emptyText="-" />
            <ChipField source="status" label="Fatura Durumu" />

            <ReferenceField
                label="İlgili Transaction"
                source="transactionId" // Invoice objesindeki transaction'ın ID'sini tutan alan
                reference="transactions" // Hangi resource'a bakılacak
                link="show" // Tıklandığında transactions resource'unun show sayfasına git
                allowEmpty // Eğer transactionId boşsa veya bulunamazsa hata verme
            >
                {/* Child component, bulunan transaction kaydını alır ve onun bir alanını gösterir */}
                {/* <TextField source="id" /> {/* Sadece ID'yi göstermek için */}
                <LinkedTransactionField />
            </ReferenceField>

            <NumberField source="amount" label="Tutar" options={{ style: 'currency', currency: 'TRY' }} />
            <TextField source="currency" label="Para Birimi" />

            <hr style={{ margin: '20px 0', borderTop: '1px solid #eee', gridColumn: 'span 2' }}/>
            <h3>Fatura Bilgileri (Invoice Kaydından)</h3>
            <TextField source="billingType" label="Fatura Tipi" />
            <FunctionField label="Müşteri/Firma Adı" render={record => record.billingType === 'bireysel' ? record.customerName : record.companyName} />
            <FunctionField label="TCKN/VKN" render={record => record.billingType === 'bireysel' ? record.customerTckn : record.taxId} />
            <FunctionField label="Vergi Dairesi" render={record => record.billingType === 'kurumsal' ? record.taxOffice : null} />
            <TextField source="customerAddress" label="Fatura Adresi" />
            <TextField source="customerEmail" label="Fatura E-postası" />
            
            <UrlField source="invoiceUrl" label="Fatura Linki (Entegratör)" emptyText="-" />
            <TextField source="errorMessage" label="Hata Mesajı (Fatura)" emptyText="-" />

            <DateField source="createdAt" label="Kayıt Tarihi" showTime />
            <DateField source="updatedAt" label="Son Güncelleme" showTime />
        </SimpleShowLayout>
    </Show>
);