// frontend/src/components/TemplateList.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styles from './TemplateList.module.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'; 

// Basit ikon yer tutucusu (opsiyonel, kaldırılabilir)
const IconPlaceholder = ({ label }) => <div className={styles.stepIcon}>{label}</div>;

function TemplateList() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); 

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

  // ---- Arama terimine göre şablonları filtrele ----
  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  // --------

  if (loading) return <div className={styles.loadingMessage}>Şablonlar Yükleniyor...</div>;
  if (error) return <div className={styles.errorMessage}>Hata: {error}</div>;

  // --- GÖRSEL YOLU OLUŞTURMA (Örnek - Dosya adını slugify edilmiş isim varsayar) ---
  // VEYA template._id + '.png' kullanabilirsiniz.
  const getPreviewImageUrl = (templateId) => {
    // Varsayılan olarak placeholder göster, gerçek resim varsa onu kullan
    const imageUrl = `/template-previews/${templateId}.webp`; // veya .png, .jpg
    // İsteğe bağlı: Resmin var olup olmadığını kontrol etmek zor olabilir,
    // bu yüzden genellikle tüm resimleri oluşturduğunuzu varsayarsınız.
    // Eğer resim bulunamazsa tarayıcı kırık resim ikonu gösterir.
    // Hata yönetimi için <img onError={...}> eklenebilir.
    // Şimdilik basit tutalım:
     return imageUrl;
  
     // Veya daha güvenli: Placeholdera geri dön
     // const [imageExists, setImageExists] = useState(true); // Bu state yönetimi gerektirir
     // return imageExists ? imageUrl : '/template-previews/placeholder.png';
  
     // En basit başlangıç: ID'yi kullan
      // return `/template-previews/${templateId}.webp`;
  };
  
  
  

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

      {/* ---- Arama Çubuğu ---- */}
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Şablon ara (isim veya açıklamaya göre)..."
          className={styles.searchInput}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // State'i güncelle
        />
         {/* Arama ikonunu ekleyebiliriz */}
         {/* <span className={styles.searchIcon}>🔍</span> */}
      </div>
      {/* ---- Arama Çubuğu SON ---- */}

      {/* Şablon Listesi (Yeni Kart Yapısı) */}
      {filteredTemplates.length > 0 ? (
        <div className={styles.templateGrid}> {/* Class ismini değiştirdim */}
          {filteredTemplates.map(template => (
            <div key={template._id} className={styles.templateCard}>
              {/* ---- GÖRSEL BÖLÜMÜ ---- */}
              <div className={styles.cardImageContainer}>
                {/* Statik veya Dinamik Görsel */}
                <img
                  src={getPreviewImageUrl(template._id)} // ID'yi fonksiyona gönder
                  alt={`${template.name} Önizleme`}
                  className={styles.cardPreviewImage}
                  loading="lazy" // Lazy loading
                  // Hata durumunda placeholder gösterme:
                  onError={(e) => { e.target.onerror = null; e.target.src = '/template-previews/placeholder.png'; }}
                />
              </div>
              {/* ---- İÇERİK BÖLÜMÜ ---- */}
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{template.name}</h3>
                <p className={styles.cardDescription}>{template.description}</p>
              </div>
              {/* ---- FOOTER BÖLÜMÜ ---- */}
              <div className={styles.cardFooter}>
                <Link to={`/templates/${template._id}`} className={styles.cardLink}>
                  Şablonu Kullan
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.noTemplatesMessage}>
          Aradığınız kriterlere uygun şablon bulunamadı.
        </div>
      )}
    </div>
  );
}

export default TemplateList;
