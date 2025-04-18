// frontend/src/components/TemplateList.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styles from './TemplateList.module.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'; // Portu 8080 olarak güncelledim

// İkonlar için basit yer tutucu (HomePage'deki ile aynı olabilir veya özelleşebilir)
const IconPlaceholder = ({ label }) => <div className={styles.stepIcon}>{label}</div>;

function TemplateList() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/templates`)
      .then(response => {
        setTemplates(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching templates:', error);
        // Kullanıcıya daha anlamlı hata mesajı gösterebiliriz
        let errorMessage = 'Şablonlar yüklenirken bir hata oluştu.';
        if (error.response) {
          errorMessage = `Sunucu hatası: ${error.response.status}`;
        } else if (error.request) {
          errorMessage = 'Sunucuya ulaşılamadı. Ağ bağlantınızı kontrol edin.';
        }
        setError(errorMessage);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className={styles.loadingMessage}>Şablonlar Yükleniyor...</div>;
  if (error) return <div className={styles.errorMessage}>Hata: {error}</div>;

  return (
    // Ana konteyner
    <div className={styles.listPageContainer}>

      {/* ---- YENİ BİLGİLENDİRME BÖLÜMÜ ---- */}
      <div className={styles.listHeader}>
        <div className={styles.headerText}>
          <h2>Belgenizi Kolayca Oluşturun</h2>
          <p>
            Sadece 3 adımda profesyonel belgeniz hazır: İhtiyacınız olan şablonu seçin,
            yönlendirmelerle formu doldurun ve PDF olarak anında indirin.
          </p>
          <p className={styles.disclaimer}>
            Şablonlarımız genel kullanıma uygun olarak hazırlanmıştır, özel durumlar için
            profesyonel danışmanlık almanız önerilir.
          </p>
        </div>
        <div className={styles.headerIcons}>
          <div className={styles.stepItem}>
            <IconPlaceholder label="🔍" />
            <span>Seç</span>
          </div>
          <div className={styles.stepSeparator}>→</div> {/* Ayırıcı */}
          <div className={styles.stepItem}>
            <IconPlaceholder label="✍️" />
            <span>Doldur</span>
          </div>
          <div className={styles.stepSeparator}>→</div> {/* Ayırıcı */}
          <div className={styles.stepItem}>
            <IconPlaceholder label="📄" />
            <span>İndir</span>
          </div>
        </div>
      </div>
      {/* ---- YENİ BİLGİLENDİRME BÖLÜMÜ SONU ---- */}


      {/* ---- MEVCUT ŞABLON LİSTESİ ---- */}
      {templates.length > 0 ? (
        <div className={styles.templateList}>
          {templates.map(template => (
            <div key={template._id} className={styles.templateCard}>
              <h3 className={styles.cardTitle}>{template.name}</h3>
              <p className={styles.cardDescription}>{template.description}</p>
              {/* Opsiyonel: Fiyatı ekleyelim */}
              {template.price > 0 && (
                <p className={styles.cardPrice}>{template.price} TL</p>
              )}
               {template.price === 0 && (
                <p className={styles.cardPrice}>Ücretsiz</p>
              )}
              <Link to={`/templates/${template._id}`} className={styles.cardLink}>
                Görüntüle ve Doldur
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.noTemplatesMessage}>Gösterilecek şablon bulunamadı.</div>
      )}
      {/* ---- MEVCUT ŞABLON LİSTESİ SONU ---- */}

    </div>
  );
}

export default TemplateList;