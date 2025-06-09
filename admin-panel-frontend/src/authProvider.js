// admin-panel-frontend/src/authProvider.js
// import { AuthProvider } from 'react-admin'; // Bu import JavaScript'te gerekmeyebilir,
                                             // react-admin objenin şeklini anlar.
                                             // Ama kalsa da zararı olmaz.

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// const authProvider: AuthProvider = { // <-- HATALI SATIRDI
const authProvider = { // <-- DOĞRU SATIR (Tip tanımlaması kaldırıldı)
    // Kullanıcı giriş yaptığında çağrılır
    login: async ({ username, password }) => {
        const request = new Request(`${API_URL}/admin/login`, {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: new Headers({ 'Content-Type': 'application/json' }),
        });
        try {
            const response = await fetch(request);
            if (response.status < 200 || response.status >= 300) {
                // Hata durumunda response.json() çalışmayabilir veya farklı bir formatta olabilir.
                // Önce text olarak alıp, sonra parse etmeyi deneyebiliriz.
                let errorMsg = 'Giriş başarısız oldu. Sunucu hatası.';
                try {
                    const errorBody = await response.json();
                    errorMsg = errorBody.message || `Giriş başarısız: ${response.statusText}`;
                } catch (e) {
                    errorMsg = `Giriş başarısız: ${response.statusText}`;
                }
                throw new Error(errorMsg);
            }
            const auth = await response.json();
            if (!auth.token) {
                throw new Error('Giriş yanıtında token bulunamadı.');
            }
            localStorage.setItem('admin_token', auth.token);
            // localStorage.setItem('admin_user', JSON.stringify(auth.user || { username: username, id: 'admin' }));
            return Promise.resolve();
        } catch (error) {
            console.error("Login error details:", error);
            // Hata mesajını kullanıcıya daha anlaşılır hale getirebiliriz.
            // React Admin, login formunda bu hatayı gösterecektir.
            throw new Error(error.message || 'Giriş sırasında bir sorun oluştu.');
        }
    },

    logout: () => {
        localStorage.removeItem('admin_token');
        // localStorage.removeItem('admin_user');
        return Promise.resolve();
    },

    checkError: ({ status }) => {
        if (status === 401 || status === 403) {
            localStorage.removeItem('admin_token');
            // localStorage.removeItem('admin_user');
            return Promise.reject({ message: false }); // redirectTo'yu React Admin kendi halleder
        }
        return Promise.resolve();
    },

    checkAuth: () => {
        return localStorage.getItem('admin_token')
            ? Promise.resolve()
            : Promise.reject({ redirectTo: '/login' }); // Giriş yapılmamışsa login'e yönlendir
    },

    getPermissions: () => {
        // Şimdilik tüm giriş yapan kullanıcılar 'admin' yetkisine sahip.
        // Daha karmaşık roller için token'ı decode edip rolü oradan alabilirsiniz.
        return localStorage.getItem('admin_token') ? Promise.resolve('admin') : Promise.reject();
    },

    getIdentity: () => {
        // Kullanıcı kimliğini (isim, avatar vb.) göstermek için.
        // Token'dan decode edilebilir veya localStorage'da saklanan bir user objesinden alınabilir.
        const token = localStorage.getItem('admin_token');
        if (token) {
            // Basit bir örnek, normalde token'ı decode edip içinden kullanıcı adını alırsınız.
            // Ya da login sırasında kullanıcı bilgilerini de localStorage'a kaydedebilirsiniz.
            // const user = JSON.parse(localStorage.getItem('admin_user'));
            // if (user) return Promise.resolve({ id: user.id, fullName: user.username });
            return Promise.resolve({ id: 'admin', fullName: 'Admin' });
        }
        return Promise.reject(new Error('Kullanıcı kimliği alınamadı.'));
    }
};

export default authProvider;