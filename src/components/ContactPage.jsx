import { useState } from 'react';

const faqItems = [
  {
    id: 1,
    question: 'Etkinlik nasıl oluşturulur?',
    answer: 'Üst menüde veya ana sayfada bulunan "Etkinlik Ekle" butonuna tıklayarak etkinlik başlığı, tarihi, konumu ve açıklamasını doldurup kolayca etkinlik oluşturabilirsiniz.'
  },
  {
    id: 2,
    question: 'Etkinlikler nasıl keşfedilir?',
    answer: 'Ana sayfadaki interaktif haritayı inceleyebilir, arama çubuğuna anahtar kelimeler yazabilir ya da "Yaklaşan Etkinlikler" ve "Keşfet" seçenekleriyle çevrenizdeki etkinlikleri bulabilirsiniz.'
  },
  {
    id: 3,
    question: 'Etkinliğimi nasıl paylaşabilirim?',
    answer: 'Etkinlik detay sayfasında yer alan paylaşım butonları ile etkinliğinizin bağlantısını kopyalayabilir veya doğrudan sosyal medya platformlarında paylaşabilirsiniz.'
  },
  {
    id: 4,
    question: 'Konum izni neden gerekli?',
    answer: 'Konum izni, size en yakın ve çevrenizde gerçekleşen etkinlikleri harita üzerinde doğru şekilde gösterebilmemiz ve mesafe bazlı arama yapabilmeniz için gereklidir.'
  },
  {
    id: 5,
    question: 'Hesabımı nasıl silebilirim?',
    answer: 'Profilinizdeki hesap ayarları bölümünden veya destek ekibimizle etkinlikin@gmail.com adresi üzerinden iletişime geçerek hesap silme talebinde bulunabilirsiniz.'
  },
  {
    id: 6,
    question: 'Etkinlik bilgilerini düzenleyebilir miyim?',
    answer: 'Evet, "Etkinliklerim" sayfasından oluşturduğunuz etkinliklerin yanındaki "Düzenle" butonuna basarak etkinlik detaylarını istediğiniz zaman güncelleyebilirsiniz.'
  }
];

const ContactPage = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (id) => {
    setOpenFaq(prev => (prev === id ? null : id));
  };

  return (
    <section className="w-full max-w-6xl mx-auto pb-12">
      {/* Back Button */}
      <div className="mb-6">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-md border border-white/60 text-sm font-bold text-gray-700 hover:text-primary hover:bg-white transition-all shadow-sm group cursor-pointer"
        >
          <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Geri Dön
        </button>
      </div>

      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">Kurumsal</p>
        <h1 className="mt-2 text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
          İletişim
        </h1>
        <p className="mt-2 max-w-2xl text-gray-500 font-medium">
          Sorularınız, geri bildirimleriniz veya iş birliği talepleriniz için bizimle iletişime geçebilir, sıkça sorulan soruları inceleyebilirsiniz.
        </p>
      </div>

      {/* Contact Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Email Card */}
        <div className="bg-white/80 backdrop-blur-md border border-white/60 rounded-3xl p-6 elevation-2 hover:elevation-4 transition-all duration-300 flex flex-col justify-between group">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </div>
            <h3 className="text-xl font-extrabold text-gray-900 mb-1">E-posta İletişim</h3>
            <p className="text-sm text-gray-500 font-medium mb-4">
              Görüş, öneri veya destek talepleriniz için e-posta yoluyla ulaşabilirsiniz.
            </p>
          </div>
          <div>
            <a
              href="mailto:etkinlikin@gmail.com"
              className="inline-flex items-center gap-2 text-sm font-extrabold text-primary hover:text-primary/80 transition-colors group-hover:translate-x-1 transition-transform"
            >
              <span>etkinlikin@gmail.com</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </a>
          </div>
        </div>

        {/* Instagram Card */}
        <div className="bg-white/80 backdrop-blur-md border border-white/60 rounded-3xl p-6 elevation-2 hover:elevation-4 transition-all duration-300 flex flex-col justify-between group">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
            </div>
            <h3 className="text-xl font-extrabold text-gray-900 mb-1">Instagram</h3>
            <p className="text-sm text-gray-500 font-medium mb-4">
              Sosyal medyada bizi takip edin, etkinlik gelişmelerini kaçırmayın.
            </p>
          </div>
          <div>
            <a
              href="https://instagram.com/etkinlik.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-extrabold text-amber-600 hover:text-amber-700 transition-colors group-hover:translate-x-1 transition-transform"
            >
              <span>@etkinlik.in</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </a>
          </div>
        </div>

        {/* Destek & Çalışma Saatleri Card */}
        <div className="bg-white/80 backdrop-blur-md border border-white/60 rounded-3xl p-6 elevation-2 hover:elevation-4 transition-all duration-300 flex flex-col justify-between group">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-extrabold text-gray-900 mb-1">Destek Saatleri</h3>
            <p className="text-sm text-gray-500 font-medium mb-4">
              Haftanın her günü 09:00 - 20:00 saatleri arasında iletilerinize yanıt veriyoruz.
            </p>
          </div>
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              7/24 Geri Bildirim Açık
            </span>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white/80 backdrop-blur-md border border-white/60 rounded-3xl p-6 sm:p-8 elevation-2">
        <div className="mb-8">
          <span className="text-xs font-black uppercase tracking-[0.22em] text-primary">Destek</span>
          <h2 className="mt-1 text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
            Sıkça Sorulan Sorular
          </h2>
          <p className="mt-2 text-gray-500 text-sm font-medium">
            Platform kullanımı hakkında merak edilen tüm detaylar
          </p>
        </div>

        <div className="space-y-4">
          {faqItems.map((item) => {
            const isOpen = openFaq === item.id;
            return (
              <div
                key={item.id}
                className="rounded-2xl border border-gray-100 bg-gray-50/70 overflow-hidden transition-all duration-300 hover:border-primary/20"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(item.id)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left font-extrabold text-gray-800 hover:text-primary transition-colors cursor-pointer"
                >
                  <span className="text-base md:text-lg pr-4">{item.question}</span>
                  <div className={`w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-500 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 bg-primary/10 text-primary' : ''}`}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </div>
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-sm text-gray-600 font-medium leading-relaxed border-t border-gray-200/50">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ContactPage;
