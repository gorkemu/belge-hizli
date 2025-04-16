  import React, { useState, useEffect } from 'react';
  import axios from 'axios';
  import { Link } from 'react-router-dom';
  import styles from './TemplateList.module.css';

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

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
          setError('Failed to load templates');
          setLoading(false);
        });
    }, []);

    if (loading) return <div>Yükleniyor...</div>;
    if (error) return <div>Hata: {error}</div>;

    return (
      <div className={styles.templateList}>
        {templates.map(template => (
          <div key={template._id} className={styles.templateCard}>
            <h3 className={styles.cardTitle}>{template.name}</h3>
            <p className={styles.cardDescription}>{template.description}</p>
            <Link to={`/templates/${template._id}`} className={styles.cardLink}>
              Görüntüle
            </Link>
          </div>
        ))}
      </div>
    );
  }

  export default TemplateList;