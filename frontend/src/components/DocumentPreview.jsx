import React, { useEffect } from 'react'; // useEffect eklendi
import styles from './DocumentPreview.module.css';
import Handlebars from 'handlebars';

// --- YENİ DATE FORMAT HELPER ---
function formatDateHelper(dateString) {
  if (!dateString || typeof dateString !== 'string') return ''; // Geçersiz girdi kontrolü
  try {
    // ISO formatı (YYYY-MM-DD) veya benzeri varsayılır
    const date = new Date(dateString);
    // Tarih geçerli mi kontrol et
    if (isNaN(date.getTime())) return dateString; // Geçersizse orijinal string'i döndür

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Aylar 0'dan başlar
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  } catch (e) {
     console.error("Error formatting date:", dateString, e);
     return dateString; // Hata olursa orijinal string'i döndür
  }
}
// --- HELPER SONU ---

// Helper'ları kaydet (try-catch içinde)
try {
    Handlebars.registerHelper('math', /* ... */ ); // Mevcut helperlar
    Handlebars.registerHelper('eq', /* ... */ );
    Handlebars.registerHelper('each_with_index', /* ... */ );
    Handlebars.registerHelper('gt', /* ... */ );
    Handlebars.registerHelper('default', /* ... */ );
    Handlebars.registerHelper('formatDate', formatDateHelper); // <-- YENİ HELPER'I KAYDET
} catch (e) { /* ... */ }

// Handlebars helper'ları (Backend ile aynı olmalı)
try {
    Handlebars.registerHelper('math', function (lvalue, operator, rvalue) {
        lvalue = parseFloat(lvalue);
        rvalue = parseFloat(rvalue);
        return {
            '+': lvalue + rvalue, '-': lvalue - rvalue,
            '*': lvalue * rvalue, '/': lvalue / rvalue,
            '%': lvalue % rvalue
        }[operator];
    });

    Handlebars.registerHelper('eq', function (a, b) {
        // console.log(`Frontend eq: a=${a}, b=${b}, result=${String(a) == String(b)}`); // Debugging
        return String(a) == String(b);
    });

     // --- YENİ: each_with_index (backend'e de eklenebilir) ---
     // #each yerine index'e daha kolay erişim için (0'dan başlar)
     Handlebars.registerHelper('each_with_index', function(context, options) {
        let ret = "";
        if (context && context.length > 0) {
            for(let i=0; i<context.length; i++) {
                 // options.fn'e geçerken mevcut context'e index ekle
                 ret = ret + options.fn({...context[i], '@index': i});
            }
        } else {
            ret = options.inverse(this); // Eğer dizi boşsa {{else}} bloğunu çalıştır
        }
        return ret;
    });


     // --- YENİ: gt (greater than) helper ---
     Handlebars.registerHelper('gt', function (a, b) {
        return parseFloat(a) > parseFloat(b);
     });

     // --- YENİ: default value helper ---
     Handlebars.registerHelper('default', function (value, defaultValue) {
        return value !== undefined && value !== null && value !== '' ? value : defaultValue;
     });


} catch (e) {
    console.error("Handlebars helper kaydedilirken hata:", e);
    // Helper'lar zaten kayıtlıysa hata verebilir, bu genellikle sorun teşkil etmez.
}


// --- KALDIRILDI: transformFormDataForPreview fonksiyonu ---

function DocumentPreview({ templateContent, formData }) {

     // formData her değiştiğinde yeniden render etmeyi tetikle
     // Bu genellikle zaten olur ama karmaşık durumlarda yardımcı olabilir.
     useEffect(() => {
         // console.log("Preview formData güncellendi:", formData); // Debugging
     }, [formData]);


    if (!templateContent) {
        return <div className={styles.container}>Önizleme için şablon içeriği yükleniyor...</div>;
    }
    if (!formData) {
        return <div className={styles.container}>Önizleme için form verisi bekleniyor...</div>;
    }


    try {
        // --- DEĞİŞTİ: Dönüşüm kaldırıldı ---
        // console.log("Preview'a gelen Ham formData:", formData); // Debugging
        const template = Handlebars.compile(templateContent);
        const previewHtml = template(formData); // Ham formData doğrudan kullanılıyor
        // console.log("Frontend Oluşturulan HTML:", previewHtml.substring(0, 500)); // Debugging

        return (
            <div className={styles.container}>
                <h3 className={styles.previewTitle}>Önizleme</h3>
                {/* whiteSpace: 'pre-wrap' metin formatını korumak için önemli */}
                <div className={styles.previewArea} style={{ whiteSpace: 'pre-wrap' }} dangerouslySetInnerHTML={{ __html: previewHtml }} />
            </div>
        );
    } catch (error) {
        console.error("Handlebars şablonunu derlerken/işlerken hata oluştu (Frontend):", error);
        return (
            <div className={styles.container}>
                 <h3 className={styles.previewTitle}>Önizleme Hatası</h3>
                 <div className={styles.previewError}>
                    <p>Önizleme oluşturulurken bir hata oluştu.</p>
                     <p>Hata Mesajı: {error.message}</p>
                     <p><i>Lütfen şablon içeriğini (`content`) ve form verilerini kontrol edin. Handlebars sözdizimi hatalı olabilir.</i></p>
                </div>
             </div>
        );
    }
}

export default DocumentPreview;