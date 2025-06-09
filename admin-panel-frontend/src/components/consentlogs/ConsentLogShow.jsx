// admin-panel-frontend/src/components/consentlogs/ConsentLogShow.jsx
import * as React from "react";
import {
    Show,
    SimpleShowLayout,
    TextField,
    DateField,
    ReferenceField
} from "react-admin";

export const ConsentLogShow = (props) => (
    <Show {...props}>
        <SimpleShowLayout>
            <TextField source="id" label="Consent Log ID" />
            <TextField source="userEmail" label="Kullanıcı E-postası" />
            <ReferenceField label="İlgili Transaction" source="transactionId" reference="transactions" link="show" allowEmpty>
                <>
                    ID: <TextField source="id" /> <br />
                    Şablon: <TextField source="templateName" />
                </>
            </ReferenceField>
            <TextField source="documentType" label="Belge Tipi" />
            <TextField source="documentVersion" label="Belge Versiyonu" />
            <DateField source="consentTimestampClient" label="Onay Zamanı (Client)" showTime />
            <TextField source="ipAddress" label="IP Adresi" />
            <TextField source="userAgent" label="User Agent" />
            <DateField source="createdAt" label="Kayıt Tarihi" showTime />
            <DateField source="updatedAt" label="Son Güncelleme" showTime />
        </SimpleShowLayout>
    </Show>
);