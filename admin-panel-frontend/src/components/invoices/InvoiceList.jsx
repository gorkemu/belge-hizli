import {
    List, Datagrid, TextField, DateField, NumberField, ReferenceField,
    ChipField, Filter, TextInput, SelectInput, DateInput 
} from "react-admin";

const InvoiceFilter = (props) => (
    <Filter {...props}>
        <TextInput label="Müşteri E-postası" source="customerEmail_like" alwaysOn resettable />
        <SelectInput source="status" label="Fatura Durumu" choices={[
            { id: 'pending_creation', name: 'Oluşturulmayı Bekliyor' },
            { id: 'created_manual', name: 'Manuel Oluşturuldu' },
            { id: 'sent_to_customer_manual', name: 'Müşteriye Gönderildi (Man.)' },
            { id: 'creation_failed', name: 'Oluşturma Başarısız' },
            { id: 'created', name: 'Oluşturuldu (Oto)' },
            { id: 'sent', name: 'Gönderildi (Oto)' },
            { id: 'paid', name: 'Ödendi' },
        ]} resettable />
        <TextInput label="Fatura No" source="invoiceNumber_like" resettable />
        <TextInput label="Transaction ID" source="transactionId" resettable />
        <DateInput source="createdAt_gte" label="Başlangıç Tarihi" resettable />
        <DateInput source="createdAt_lte" label="Bitiş Tarihi" resettable />
    </Filter>
);

export const InvoiceList = (props) => (
    <List {...props} filters={<InvoiceFilter />} sort={{ field: 'createdAt', order: 'DESC' }} perPage={25}>
        <Datagrid rowClick="show" bulkActionButtons={false}>
            <TextField source="invoiceNumber" label="Fatura No" emptyText="-" />
            <ReferenceField label="Transaction ID" source="transactionId" reference="transactions" link="show" allowEmpty>
                <TextField source="templateName" /> 
            </ReferenceField>
            <TextField source="customerEmail" label="Müşteri E-postası" />
            <NumberField source="amount" label="Tutar" options={{ style: 'currency', currency: 'TRY' }} />
            <ChipField source="status" label="Durum" />
            <DateField source="createdAt" label="Oluşturulma Tarihi" showTime />
        </Datagrid>
    </List>
);