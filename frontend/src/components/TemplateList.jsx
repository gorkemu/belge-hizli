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
  const [searchTerm, setSearchTerm] = useState(''); // <-- YENİ ARAMA STATE'İ

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

  // ---- YENİ: Arama terimine göre şablonları filtrele ----
  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  // ---- YENİ SON ----

  if (loading) return <div className={styles.loadingMessage}>Şablonlar Yükleniyor...</div>;
  if (error) return <div className={styles.errorMessage}>Hata: {error}</div>;

  return (
    // Ana konteyner
    <div className={styles.listPageContainer}>

      {/* ---- BİLGİLENDİRME BÖLÜMÜ ---- */}
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
      {/* ---- BİLGİLENDİRME BÖLÜMÜ SONU ---- */}

      {/* ---- YENİ: Arama Çubuğu ---- */}
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Şablon ara (isim veya açıklamaya göre)..."
          className={styles.searchInput}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // State'i güncelle
        />
         {/* Arama ikonunu ekleyebiliriz */}
         <span className={styles.searchIcon}>🔍</span>
      </div>
      {/* ---- YENİ SON ---- */}

      {/* Filtrelenmiş listeyi map et */}
      {filteredTemplates.length > 0 ? (
        // <div className={styles.templateList}> <-- Mevcut grid yapısı aynı
        <div className={`${styles.templateList} ${styles.modernGrid}`}> {/* Modern grid için yeni class ekleyebiliriz */}
          {filteredTemplates.map(template => ( // templates yerine filteredTemplates kullan
            // ---- KART İÇERİĞİNİ SADELEŞTİR (Sonraki Adım İçin Hazırlık) ----
            <div key={template._id} className={styles.templateCard}>
               {/* <IconPlaceholder label="📄" /> İkonu buraya alabiliriz */}
              <h3 className={styles.cardTitle}>{template.name}</h3>
              {/* Açıklama kaldırıldı/gizlendi (şimdilik yorumda kalsın) */}
              {/* <p className={styles.cardDescription}>{template.description}</p> */}

              {/* --- Hover'da görünecekler (şimdilik normal görünsün) --- */}
              <div className={styles.cardHoverContent}>
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
               {/* --- Hover Sonu --- */}
            </div>
             // ---- KART İÇERİĞİ SONU ----
          ))}
        </div>
      ) : (
        // Arama sonucu bulunamazsa farklı mesaj göster
        <div className={styles.noTemplatesMessage}>
          Aradığınız kriterlere uygun şablon bulunamadı.
        </div>
      )}
    </div>
  );
}

export default TemplateList;
