// frontend/src/components/TemplateList.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styles from './TemplateList.module.css';
// import { Helmet } from 'react-helmet-async'; // Helmet'i ileriki adımda ekleyeceğiz

// API Base URL'i backend rotası ile tutarlı olmalı
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api'; // <-- Port 5001 olarak varsayıldı, backend'e göre ayarlayın

// Basit ikon yer tutucusu (opsiyonel, kaldırılabilir)
// const IconPlaceholder = ({ label }) => <div className={styles.stepIcon}>{label}</div>; // Kullanılmadığı için yorum satırı

function TemplateList() {
	const [templates, setTemplates] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [searchTerm, setSearchTerm] = useState('');

	useEffect(() => {
		// API çağrısı path'i güncellendi
		axios.get(`${API_BASE_URL}/sablonlar`) // <-- API path'i güncellendi
			.then(response => {
				// console.log('Templates data fetched:', response.data); // Debugging
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

	// --- GÖRSEL YOLU OLUŞTURMA (Mevcut ID bazlı path korunuyor) ---
	// Şablon önizleme görsellerini template._id.webp formatında sakladığınızı varsayar.
	// Eğer slug bazlı kaydedecekseniz (örn: /template-previews/basit-borc-senedi.webp) burayı da güncellemelisiniz.
	const getPreviewImageUrl = (templateId) => {
		// public/template-previews klasöründeki resimlere ID ile erişim
		return `/template-previews/${templateId}.webp`; // veya .png, .jpg
	};


	return (
		<> {/* Fragment */}
			{/* ---- Sayfa Başlığı ve Meta Etiketleri ---- */}
			{/* Helmet kullanımı için bu etiketleri bir sonraki adımda Helmet bileşeni içine taşıyacağız. */}
			<title>Tüm Şablonlar - Belge Hızlı | Online Sözleşme Oluştur</title>
			<meta name="description" content="Kira sözleşmesi, iş sözleşmesi, freelancer anlaşması, dilekçe ve daha birçok hazır belge şablonu Belge Hızlı'da. Hemen seçin, doldurun, indirin." />
			<link rel="canonical" href="https://www.belgehizli.com/sablonlar" /> {/* <-- Canonical URL güncellendi */}
			{/* ---- Etiketler Sonu ---- */}

			<div className={styles.listPageContainer}>
				{/* Bil bilgilendirme Bölümü */}
				<div className={styles.listHeader}>
					<h2>Belgenizi Kolayca Oluşturun</h2>
					<p>İhtiyacınız olan şablonu seçin, formu doldurun ve PDF olarak anında indirin.</p>
					<p className={styles.disclaimer}>
						Şablonlarımız genel kullanıma uygundur, özel durumlar için profesyonel danışmanlık almanız önerilir.
					</p>
				</div>

				{/* Arama Çubuğu */}
				<div className={styles.searchContainer}>
					<input
						type="text"
						placeholder="Şablon ara (örn: kira, iş, dilekçe)..." // Placeholder güncellendi
						className={styles.searchInput}
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
				</div>

				{/* Şablon Listesi */}
				{filteredTemplates.length > 0 ? (
					<div className={styles.templateGrid}>
						{filteredTemplates.map(template => (
							<div key={template._id} className={styles.templateCard}>
								<div className={styles.cardImageContainer}>
									<img
										// Şablon önizleme görsellerinin hala ID ile erişildiğini varsaydık
										src={getPreviewImageUrl(template._id)} // <-- Görsel path'i ID kullanıyor
										alt={`${template.name} Önizleme`}
										className={styles.cardPreviewImage}
										loading="lazy"
										onError={(e) => { e.target.onerror = null; e.target.src = '/template-previews/placeholder.png'; }} // Hata durumunda placeholder
									/>
								</div>
								<div className={styles.cardContent}>
									<h3 className={styles.cardTitle}>{template.name}</h3>
									<p className={styles.cardDescription}>{template.description}</p>
								</div>
								<div className={styles.cardFooter}>
									{/* Link URL'i slug tabanlı yeni yapıya güncellendi */}
									{/* backend'den gelen template objesinin 'slug' alanı içerdiğinden emin olun */}
									<Link to={`/sablonlar/detay/${template.slug}`} className={styles.cardLink}> {/* <-- Link URL'i güncellendi */}
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
		</>
	);
}

export default TemplateList;