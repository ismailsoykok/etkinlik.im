import { useState } from 'react';
import { authService } from '../../api/authService';

const Login = ({ onNavigateToRegister, onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Backend'e istek atılır (authService daha önce oluşturduğumuz servis)
      await authService.login(username, password);
      if (onLoginSuccess) onLoginSuccess(username);
    } catch (err) {
      setError('Giriş başarısız. Kullanıcı adı veya şifre hatalı olabilir.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl border border-white/60 overflow-hidden relative z-10">
      <div className="p-10 sm:p-12">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">Giriş Yap</h2>
          <p className="mt-3 text-base text-gray-500">
            etkinlik<span className="text-secondary font-bold">.im</span> dünyasına tekrar hoş geldin.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-7">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2.5">Kullanıcı Adı</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-5 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-gray-50 focus:bg-white text-base"
              placeholder="Kullanıcı adınızı girin"
              required
            />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2.5">
              <label className="block text-sm font-bold text-gray-700">Şifre</label>
              <a href="#" className="text-xs font-bold text-primary hover:text-primary/80 transition-colors">Şifremi Unuttum</a>
            </div>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-gray-50 focus:bg-white text-base"
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary text-white font-extrabold py-3.5 px-5 rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:transform-none text-base"
          >
            {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>

        <div className="mt-10 text-center border-t border-gray-100 pt-8">
          <p className="text-sm text-gray-600 font-medium">
            Hesabın yok mu?{' '}
            <button 
              onClick={onNavigateToRegister}
              className="font-extrabold text-secondary hover:text-secondary/80 transition-colors"
            >
              Hemen Kayıt Ol
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
