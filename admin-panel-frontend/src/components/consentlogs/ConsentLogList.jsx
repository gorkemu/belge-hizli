// admin-panel-frontend/src/components/consentlogs/ConsentLogList.jsx
import * as React from "react";
import {
    List,
    Datagrid,
    TextField,
    DateField,
    ReferenceField,
    Filter,
    TextInput
} from "react-admin";

const ConsentLogFilter = (props) => (
    <Filter {...props}>
        <TextInput label="Kullanıcı E-postası" source="userEmail_like" alwaysOn resettable />
        <TextInput label="Belge Versiyonu" source="documentVersion_like" resettable />
        <TextInput label="Transaction ID" source="transactionId" resettable /> 
        {/* Transaction ID ile filtrelemek için backend'de transactionId alanının string aranabilir olması gerekir */}
    </Filter>
);

export const ConsentLogList = (props) => (
    <List {...props} filters={<ConsentLogFilter />} sort={{ field: 'createdAt', order: 'DESC' }} perPage={25}>
        <Datagrid rowClick="show" bulkActionButtons={false}>
            {/* _id'yi ReferenceField olarak göstermiyoruz */}
            {/* <TextField source="id" label="Consent Log ID" /> */} {/* ID'yi göstermek isterseniz */}
            <TextField source="userEmail" label="Kullanıcı E-postası" />
            <ReferenceField label="Transaction ID" source="transactionId" reference="transactions" link="show" allowEmpty>
                <TextField source="templateName" /> {/* Veya Transaction'ın ID'sini göster: <TextField source="id" /> */}
            </ReferenceField>
            <TextField source="documentType" label="Belge Tipi" />
            <TextField source="documentVersion" label="Belge Versiyonu" />
            <DateField source="consentTimestampClient" label="Onay Zamanı (Client)" showTime />
            <TextField source="ipAddress" label="IP Adresi" />
            {/* <TextField source="userAgent" label="User Agent" /> User agent genellikle çok uzundur, Show sayfasında gösterilebilir */}
            <DateField source="createdAt" label="Kayıt Tarihi" showTime />
        </Datagrid>
    </List>
);