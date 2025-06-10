import * as React from "react";
import {
    Show,
    SimpleShowLayout,
    TextField,
    DateField,
    ReferenceField,
    useRecordContext // LinkedTransactionField için
} from "react-admin";

// InvoiceShow.jsx'teki LinkedTransactionField'ı buraya da kopyalayabiliriz
// veya ortak bir yere taşıyıp import edebiliriz. Şimdilik kopyalayalım.
const LinkedTransactionField = () => {
    const record = useRecordContext();
    if (!record) return null;
    return (
        <>
            ID: <TextField record={record} source="id" sx={{ display: 'inline', mr: 1 }} />
            (<TextField record={record} source="templateName" sx={{ display: 'inline' }} />)
        </>
    );
};

export const ConsentLogShow = (props) => (
    <Show {...props}>
        <SimpleShowLayout>
            <TextField source="id" label="Consent Log ID" />
            <TextField source="userEmail" label="Kullanıcı E-postası" />

            <ReferenceField
                label="İlgili Transaction"
                source="transactionId"
                reference="transactions"
                link="show"
                allowEmpty
            >
                <LinkedTransactionField />
            </ReferenceField>

            <TextField source="documentType" label="Belge Tipi" />
            <TextField source="documentVersion" label="Belge Versiyonu" />
            <DateField source="consentTimestampClient" label="Onay Zamanı (Client)" showTime />
            <TextField source="ipAddress" label="IP Adresi" />
            <TextField source="userAgent" label="User Agent" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }} /> {/* Uzun olabileceği için stil */}
            <DateField source="createdAt" label="Kayıt Tarihi" showTime />
            <DateField source="updatedAt" label="Son Güncelleme" showTime />
        </SimpleShowLayout>
    </Show>
);