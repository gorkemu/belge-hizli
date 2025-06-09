// admin-panel-frontend/src/components/transactions/TransactionShow.jsx
import * as React from "react";
import {
    Show,
    SimpleShowLayout,
    TextField,
    DateField,
    NumberField,
    ReferenceField,
    FunctionField,
    ChipField // ChipField'ı import etmeyi unutmuş olabiliriz
} from "react-admin";

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


export const TransactionShow = (props) => (
    <Show {...props}>
        <SimpleShowLayout>
            <TextField source="id" label="Transaction ID" />
            <TextField source="userEmail" label="Kullanıcı E-postası" />
            <TextField source="templateName" label="Şablon Adı" />
            {/* templateId'yi doğrudan TextField olarak gösteriyoruz */}
            <TextField source="templateId" label="Şablon ID (Referans Değil)" />

            <NumberField source="amount" label="Tutar" options={{ style: 'currency', currency: 'TRY' }} />
            <TextField source="currency" label="Para Birimi" />
            <ChipField source="status" label="Durum" /> {/* ChipField status için daha iyi olabilir */}
            <TextField source="paymentGatewayRef" label="Ödeme Ref." emptyText="-" /> {/* allowEmpty yerine emptyText */}
            
            {/* Fatura ID'si varsa, invoices kaynağına link ver. allowEmpty burada kalabilir. */}
            <ReferenceField label="Fatura Detayı" source="invoiceId" reference="invoices" link="show" allowEmpty>
                <TextField source="id" />
            </ReferenceField>

            {/* Consent Log için: Transaction ID'ye göre Consent Log listesine filtreli link */}
            {/* Bu daha karmaşık, şimdilik ConsentLog ID'sini Transaction'a ekleyip onu gösterebiliriz */}
            {/* Veya ConsentLog listesinde transactionId ile filtreleme yaparız. */}
            {/* Şimdilik bu alanı yoruma alalım veya transaction.consentLogId varsa onu gösterelim */}
            {/* <TextField source="consentLogId" label="Onay Log ID" /> */}


            <DateField source="createdAt" label="Oluşturulma Tarihi" showTime />
            <DateField source="updatedAt" label="Güncellenme Tarihi" showTime />
            
            <FunctionField label="Form Verileri" render={record => <JsonDataField source="formDataSnapshot" record={record} />} />
            <FunctionField 
                label="Fatura Bilgileri" 
                render={record => record.billingInfoSnapshot ? <JsonDataField source="billingInfoSnapshot" record={record} /> : "Girilmemiş"} 
            />

            <TextField source="errorMessage" label="Hata Mesajı" emptyText="-" /> {/* allowEmpty yerine emptyText */}
        </SimpleShowLayout>
    </Show>
);