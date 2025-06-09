// admin-panel-frontend/src/components/invoices/InvoiceList.jsx
import * as React from "react";
import {
    List,
    Datagrid,
    TextField,
    DateField,
    NumberField,
    ReferenceField,
    ChipField,
    Filter,
    TextInput,
    SelectInput,
    ReferenceInput // Transaction ID ile filtrelemek için
} from "react-admin";

const InvoiceFilter = (props) => (
    <Filter {...props}>
        <TextInput label="Müşteri E-postası" source="customerEmail_like" alwaysOn resettable />
        <SelectInput source="status" label="Fatura Durumu" choices={[
            { id: 'pending_creation', name: 'Oluşturulmayı Bekliyor' },
            { id: 'created_manual', name: 'Manuel Oluşturuldu' }, // Manuel oluşturma için yeni statü ekleyebiliriz
            { id: 'sent_to_customer_manual', name: 'Müşteriye Gönderildi (Manuel)' },
            { id: 'creation_failed', name: 'Oluşturma Başarısız' },
            // Gelecekte eklenebilecek diğer statüler: 'paid', 'overdue' vb.
        ]} resettable />
        <TextInput label="Fatura No" source="invoiceNumber_like" resettable />
        {/* Transaction ID ile filtreleme için ReferenceInput kullanabiliriz, 
            ancak bu, tüm transaction'ları çekip bir select box oluşturur, çok fazla transaction varsa yavaş olabilir.
            Daha iyisi, Transaction listesinden Invoice'a link verirken filtre parametresi göndermek veya
            Transaction ID için basit bir TextInput kullanmak olabilir. Şimdilik TextInput ile yapalım.
        */}
        <TextInput label="Transaction ID" source="transactionId" resettable />
    </Filter>
);

export const InvoiceList = (props) => (
    <List {...props} filters={<InvoiceFilter />} sort={{ field: 'createdAt', order: 'DESC' }} perPage={25}>
        <Datagrid rowClick="show" bulkActionButtons={false}> {/* Detay için show, düzenleme için edit */}
            {/* <TextField source="id" label="Invoice ID" /> */}
            <TextField source="invoiceNumber" label="Fatura No" emptyText="-" />
            <ReferenceField label="Transaction ID" source="transactionId" reference="transactions" link="show">
                <TextField source="id" /> 
            </ReferenceField>
            <TextField source="customerEmail" label="Müşteri E-postası" />
            <TextField source="templateName" label="Şablon Adı (Transaction'dan)" /> {/* Bu alan populate ile geliyorsa */}
            <NumberField source="amount" label="Tutar" options={{ style: 'currency', currency: 'TRY' }} />
            <ChipField source="status" label="Durum" /> 
            <DateField source="createdAt" label="Oluşturulma Tarihi" showTime />
        </Datagrid>
    </List>
);