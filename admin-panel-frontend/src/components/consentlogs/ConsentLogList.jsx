import {
    List, Datagrid, TextField, DateField, ReferenceField,
    Filter, TextInput, DateInput 
} from "react-admin";

const ConsentLogFilter = (props) => (
    <Filter {...props}>
        <TextInput label="Kullanıcı E-postası" source="userEmail_like" alwaysOn resettable />
        <TextInput label="Belge Versiyonu" source="documentVersion_like" resettable /> 
        <TextInput label="Transaction ID" source="transactionId" resettable />
        <DateInput source="createdAt_gte" label="Başlangıç Tarihi (Kayıt)" resettable />
        <DateInput source="createdAt_lte" label="Bitiş Tarihi (Kayıt)" resettable />
    </Filter>
);

export const ConsentLogList = (props) => (
    <List {...props} filters={<ConsentLogFilter />} sort={{ field: 'createdAt', order: 'DESC' }} perPage={25}>
        <Datagrid rowClick="show" bulkActionButtons={false}>
            <TextField source="userEmail" label="Kullanıcı E-postası" />
            <ReferenceField label="Transaction ID" source="transactionId" reference="transactions" link="show" allowEmpty>
                <TextField source="templateName" /> 
            </ReferenceField>
            <TextField source="documentType" label="Belge Tipi" />
            <TextField source="documentVersion" label="Belge Versiyonu" />
            <DateField source="consentTimestampClient" label="Onay Zamanı (Client)" showTime />
            <TextField source="ipAddress" label="IP Adresi" />
            <DateField source="createdAt" label="Kayıt Tarihi" showTime />
        </Datagrid>
    </List>
);