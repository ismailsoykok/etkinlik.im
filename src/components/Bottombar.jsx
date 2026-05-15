const Bottombar = () => {
  return (
    <footer className="bg-white border-t border-gray-100 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          
          <div className="flex items-center gap-1 text-xl font-bold">
            <span className="text-primary">etkinlik</span>
            <span className="text-secondary">.im</span>
          </div>
          
          <div className="flex flex-wrap justify-center space-x-6 text-sm text-gray-500 font-medium">
            <a href="#" className="hover:text-primary transition-colors">Hakkımızda</a>
            <a href="#" className="hover:text-primary transition-colors">İletişim</a>
            <a href="#" className="hover:text-primary transition-colors">Gizlilik Politikası</a>
            <a href="#" className="hover:text-primary transition-colors">Kullanım Koşulları</a>
          </div>
          
          <p className="text-xs text-gray-400 font-medium">
            &copy; {new Date().getFullYear()} etkinlik.im. Tüm hakları saklıdır.
          </p>

        </div>
      </div>
    </footer>
  );
};

export default Bottombar;
