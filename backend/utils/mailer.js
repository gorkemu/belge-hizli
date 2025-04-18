// backend/utils/mailer.js
const nodemailer = require('nodemailer');

// Ortam değişkenlerinden SMTP bilgilerini al
const emailHost = process.env.EMAIL_HOST;
const emailPort = process.env.EMAIL_PORT; // Port genellikle number olmalı
const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;
const emailFrom = process.env.EMAIL_FROM; // "İsim <adres>" formatında

// Gerekli değişkenler eksikse hata ver
if (!emailHost || !emailPort || !emailUser || !emailPass || !emailFrom) {
  console.error('Hata: E-posta yapılandırması için gerekli ortam değişkenleri eksik! (EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS, EMAIL_FROM)');
  // Production'da başlatmayı engelleyebilir veya bir flag ayarlayabiliriz.
  // Şimdilik sadece loglayalım. E-posta gönderimi çalışmayacak.
}

// Nodemailer transporter (taşıyıcı) objesini oluştur
// Transport objesi sadece gerekli bilgiler varsa oluşturulsun
let transporter = null;
if (emailHost && emailPort && emailUser && emailPass && emailFrom) {
    transporter = nodemailer.createTransport({
        host: emailHost,
        port: parseInt(emailPort, 10), // Port numarasını integer yap
        secure: parseInt(emailPort, 10) === 465, // Port 465 ise true, değilse (örn 587) false (STARTTLS kullanılır)
        auth: {
            user: emailUser,
            pass: emailPass,
        },
        // TLS ayarları (özellikle port 587 için gerekebilir)
        // tls: {
        //     ciphers:'SSLv3' // Bazı sunucular için gerekebilir
        //     // rejectUnauthorized: false // Eğer sertifika sorunu varsa (güvenli değil)
        // }
    });

    // Bağlantıyı doğrula (opsiyonel ama iyi pratik)
    transporter.verify(function(error, success) {
        if (error) {
            console.error("E-posta taşıyıcı bağlantı hatası:", error);
        } else {
            console.log("E-posta taşıyıcı başarıyla yapılandırıldı ve hazır.");
        }
    });

} else {
  console.warn("E-posta gönderimi devre dışı: Eksik yapılandırma.");
}


/**
 * PDF eki ile e-posta gönderir.
 * @param {string} to Alıcı e-posta adresi
 * @param {string} subject E-posta konusu
 * @param {string} text E-posta metin içeriği (opsiyonel)
 * @param {string} html E-posta HTML içeriği
 * @param {Buffer} pdfBuffer Eklenecek PDF dosyasının Buffer'ı
 * @param {string} pdfFilename Ekteki PDF dosyasının adı
 */
const sendPdfEmail = async (to, subject, text, html, pdfBuffer, pdfFilename) => {
  // Eğer transporter düzgün yapılandırılmadıysa işlem yapma
  if (!transporter) {
      console.error("E-posta gönderilemedi: Taşıyıcı yapılandırılamadı.");
      // Hata fırlatmak yerine sadece loglayıp devam edebiliriz ki ana işlem (PDF indirme) etkilenmesin.
      // throw new Error("E-posta gönderilemedi: Taşıyıcı yapılandırılamadı.");
      return; // Fonksiyondan çık
  }

  const mailOptions = {
      from: emailFrom, // Gönderen adresi (Secrets'tan gelen)
      to: to,          // Alıcı adresi
      subject: subject,  // Konu
      text: text,        // Düz metin versiyonu (opsiyonel)
      html: html,        // HTML versiyonu
      attachments: [
          {
              filename: pdfFilename, // Ekin adı
              content: pdfBuffer,    // PDF içeriği (Buffer)
              contentType: 'application/pdf' // İçerik tipi
          },
      ],
  };

  try {
      console.log(`Sending PDF email to ${to}...`);
      let info = await transporter.sendMail(mailOptions);
      console.log('Email sent successfully: %s', info.messageId);
      // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info)); // Sadece ethereal test hesapları için
  } catch (error) {
      console.error(`Error sending email to ${to}:`, error);
      // E-posta gönderim hatası ana işlemi durdurmamalı
      // throw error; // Hatayı tekrar fırlatma
  }
};

module.exports = { sendPdfEmail };