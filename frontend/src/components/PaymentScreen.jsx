import React from 'react';
import styles from './PaymentScreen.module.css';

function PaymentScreen({ paymentDetails, onPaymentSuccess, onPaymentCancel }) {
    return (
        <div className={styles.paymentContainer}>
            <h3>Ödeme Ekranı</h3>
            <p>Ödeme işlemini gerçekleştirmek için lütfen aşağıdaki bilgileri kontrol edin.</p>
            <p>Tutar: {paymentDetails.amount} {paymentDetails.currency}</p>
            <p>E-posta: {paymentDetails.email}</p>
            <p>Gerçek ödeme entegrasyonu buraya yapılacak (Stripe, PayPal vb.).</p>
            <div className={styles.buttonGroup}>
                <button type="button" onClick={() => onPaymentSuccess({ transactionId: 'TEST_TRANSACTION_ID' })}>
                    Ödemeyi Tamamla
                </button>
                <button type="button" onClick={onPaymentCancel}>İptal</button>
            </div>
        </div>
    );
}

export default PaymentScreen;