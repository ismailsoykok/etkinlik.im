import { useState } from 'react';
import { authService } from '../../api/authService';

const Register = ({ onNavigateToLogin, onRegisterSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Şifreler eşleşmiyor, lütfen kontrol edin.");
      return;
    }

    setLoading(true);
    setError('');

    try {
      await authService.register(username, password);
      // Kayıt başarılıysa otomatik login sayfasına yönlendir ya da giriş yap
      if (onRegisterSuccess) onRegisterSuccess();
    } catch (err) {
      setError('Kayıt başarısız oldu. Kullanıcı adı alınmış olabilir.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mt-10">
      <div className="p-8 sm:p-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Kayıt Ol</h2>
          <p className="mt-2 text-sm text-gray-500">
            Aramıza katıl ve etkinlikleri keşfetmeye başla.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kullanıcı Adı</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-gray-50 focus:bg-white"
              placeholder="Bir kullanıcı adı belirleyin"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Şifre</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-gray-50 focus:bg-white"
              placeholder="••••••••"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Şifreyi Onayla</label>
            <input 
              type="password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-gray-50 focus:bg-white"
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full mt-2 bg-primary text-white font-bold py-3 px-4 rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/30 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:transform-none"
          >
            {loading ? 'Hesap Oluşturuluyor...' : 'Hesap Oluştur'}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-gray-100 pt-6">
          <p className="text-sm text-gray-600">
            Zaten hesabın var mı?{' '}
            <button 
              onClick={onNavigateToLogin}
              className="font-bold text-secondary hover:text-secondary/80 transition-colors"
            >
              Giriş Yap
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
