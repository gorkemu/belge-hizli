// admin-panel-frontend/src/components/transactions/TransactionList.jsx
import * as React from "react";
import {
    List,
    Datagrid,
    TextField,
    DateField,
    NumberField,
    ChipField,
    ReferenceField, // Sadece gerçekten referans olanlar için
    Filter,       // Filtreleme için
    TextInput,    // Filtre inputu
    SelectInput   // Filtre select'i
} from "react-admin";

// Filtreleme için bir component
const TransactionFilter = (props) => (
    <Filter {...props}>
        <TextInput label="Kullanıcı E-postası" source="userEmail_like" alwaysOn resettable />
        <TextInput label="Şablon Adı" source="templateName_like" resettable />
        <SelectInput source="status" label="Durum" choices={[
            { id: 'initiated', name: 'Başlatıldı' },
            { id: 'payment_pending', name: 'Ödeme Bekliyor' },
            { id: 'payment_successful', name: 'Ödeme Başarılı' },
            { id: 'payment_failed', name: 'Ödeme Başarısız' },
            { id: 'pdf_generated', name: 'PDF Oluşturuldu' },
            { id: 'email_sent', name: 'E-posta Gönderildi' },
            { id: 'completed', name: 'Tamamlandı' },
            { id: 'failed', name: 'Başarısız (Genel)' },
        ]} resettable />
    </Filter>
);

export const TransactionList = (props) => (
    <List {...props} filters={<TransactionFilter />} sort={{ field: 'createdAt', order: 'DESC' }} perPage={25}>
        <Datagrid rowClick="show" bulkActionButtons={false}>
            {/* _id yerine React Admin'in otomatik kullandığı 'id' yeterli */}
            {/* <TextField source="id" label="ID" /> */} {/* Genellikle göstermeyiz, Show sayfasında olur */}
            <TextField source="userEmail" label="Kullanıcı E-postası" />
            <TextField source="templateName" label="Şablon Adı" />
            {/* templateId'yi göstermek istiyorsak, ama "templates" kaynağımız yoksa ReferenceField kullanmamalıyız */}
            <TextField source="templateId" label="Şablon ID" />
            <NumberField source="amount" label="Tutar" options={{ style: 'currency', currency: 'TRY' }} />
            <ChipField source="status" label="Durum" /> {/* Durumu ChipField ile göstermek daha şık olabilir */}
            <DateField source="createdAt" label="İşlem Tarihi" showTime />
            {/* invoiceId'yi "invoices" kaynağına bağlayalım */}
            <ReferenceField label="Fatura ID" source="invoiceId" reference="invoices" link="show" allowEmpty>
                 <TextField source="id" /> {/* Veya faturanın başka bir alanını gösterebiliriz, örn: invoiceNumber */}
            </ReferenceField>
        </Datagrid>
    </List>
);