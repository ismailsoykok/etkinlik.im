import React from 'react';

const TermsPage = () => {
  const sections = [
    {
      id: 'giris',
      icon: (
        <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: '1. Giriş ve Genel Hükümler',
      content: [
        'Bu Kullanım Koşulları ("Sözleşme"), etkinlik.im ("Platform", "Şirket", "Biz") tarafından sağlanan tüm hizmetlerin, web sitesinin, mobil uygulamaların ve bağlantılı servislerin kullanım şartlarını ve kurallarını düzenlemektedir. Platformumuzu ziyaret eden, üye olan veya sunulan hizmetlerden herhangi bir şekilde yararlanan her birey veya tüzel kişi ("Kullanıcı", "Siz") bu Sözleşme hükümlerini eksiksiz kabul etmiş sayılır.',
        'Sözleşme şartlarını kabul etmiyorsanız, lütfen platformumuzu ve sunulan hizmetleri kullanmayı derhal sonlandırınız. Platformda sunulan her türlü içerik, araç, özellik ve servis bu kullanım koşullarına tabidir. etkinlik.im, bu koşulları dilediği zaman önceden bildirimde bulunmaksızın güncelleme veya değiştirme hakkını saklı tutar. Kullanıcılar, yapılan değişiklikleri takip etmekle yükümlüdür.',
      ],
    },
    {
      id: 'hizmet-tanimi',
      icon: (
        <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
      ),
      title: '2. Hizmet Tanımı ve Kapsamı',
      content: [
        'etkinlik.im, kullanıcıların bulundukları konuma yakın veya belirledikleri şehir ve kategorilerdeki sosyal, kültürel, sanatsal, akademik, sportif ve eğlence odaklı etkinlikleri keşfetmelerini, yeni etkinlikler oluşturmalarını, diğer kullanıcılarla paylaşmalarını ve katılım organizasyonları yapmalarını sağlayan dijital bir etkinlik keşif ve paylaşım platformudur.',
        'Platform, kullanıcılar arasında bilgi paylaşımını ve sosyal etkileşimi kolaylaştıran bir aracı hizmet sağlayıcı (5651 sayılı Kanun uyarınca) konumundadır. Etkinliklerin fiziksel olarak düzenlenmesi, bilet satışı, mekan temini, organizasyon güvenliği veya etkinlik akışı aksini açıkça belirtmediğimiz sürece doğrudan etkinlik.im sorumluluğunda değildir.',
        'Platform üzerinde gösterilen konum bazlı harita servisleri, akıllı arama filtreleri, etkinlik takvimi ve bildirim sistemleri kullanıcı deneyimini iyileştirmek amacıyla sunulmakta olup, bu servislerin kesintisiz veya %100 hatasız çalışacağı garanti edilmemektedir.',
      ],
    },
    {
      id: 'hesap-olusturma',
      icon: (
        <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      title: '3. Hesap Oluşturma ve Sorumluluklar',
      content: [
        'Platformun sunduğu bazı gelişmiş özelliklerden (etkinlik oluşturma, düzenleme, favorilere ekleme, özel erişimli içerikler vb.) faydalanabilmek için geçerli ve aktif bir kullanıcı hesabı oluşturmanız gerekmektedir. Hesap oluştururken verdiğiniz ad, soyad, e-posta adresi ve diğer iletişim bilgilerinin doğru, güncel ve eksiksiz olduğunu taahhüt etmektesiniz.',
        'Hesabınızın güvenliğini sağlamak, giriş bilgilerinizi ve şifrenizi gizli tutmak tamamen sizin sorumluluğunuzdadır. Hesabınız üzerinden gerçekleşen tüm işlemler ve etkinlikler doğrudan tarafınıza atfedilir. Şifrenizin yetkisiz kişilerce öğrenildiğini veya hesabınıza izinsiz erişim sağlandığını fark etmeniz halinde derhal etkinlikin@gmail.com adresi üzerinden bizimle iletişime geçmeniz gerekmektedir.',
        'Yanıltıcı, sahte, başkasına ait kimlik bilgileriyle veya tek bir kişi tarafından birden fazla spam amaçlı hesap oluşturulması kesinlikle yasaktır. Tespit edilen sahte, usulsüz ve kural dışı hesaplar önceden bildirimde bulunulmaksızın askıya alınabilir veya kalıcı olarak silinebilir.',
      ],
    },
    {
      id: 'kullanici-yukumlulukleri',
      icon: (
        <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: '4. Kullanıcı Yükümlülükleri ve Davranış Kuralları',
      content: [
        'Kullanıcılar, etkinlik.im platformunu kullanırken Türkiye Cumhuriyeti yasalarına, genel ahlak ve adap kurallarına ve işbu Kullanım Koşullarına uymakla yükümlüdür. Platformun güvenliğini tehdit edecek, altyapısına zarar verici aşırı yük bindirecek veya diğer kullanıcıların hizmetten yararlanmasını engelleyecek her türlü eylemden kaçınılmalıdır.',
        'Platformun veya altyapısında kullanılan yazılımların tersine mühendislik (reverse engineering) yöntemleriyle incelenmesi, kaynak kodlarının çıkarılmaya çalışılması, otomatik tarama (bot, crawler, scraper) araçları ile veri çekilmesi veya sisteme yetkisiz erişim girişimleri kesinlikle yasaktır.',
        'Başka kullanıcıların kişisel verilerini rızaları olmaksızın toplamak, depolamak, işlemek veya reklam/spam amacıyla kullanmak yasaktır. Herhangi bir kullanıcının huzurunu bozacak, taciz edecek, kişilik haklarına saldırıda bulunacak veya tehdit oluşturacak davranışlarda bulunan hesaplar hakkında yasal süreç başlatılabilir.',
      ],
    },
    {
      id: 'etkinlik-paylasim-kurallari',
      icon: (
        <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      title: '5. Etkinlik Paylaşım Kuralları',
      content: [
        'Kullanıcılar tarafından oluşturulan veya paylaşılan tüm etkinlik içeriklerinin (başlık, açıklama, tarih, saat, konum, görsel ve bağlantılar) doğru, güncel ve yasalara uygun olması gerekmektedir. Gerçekleşmeyecek, aldatıcı, yanıltıcı veya dolandırıcılık amacı taşıyan etkinliklerin paylaşılması kesinlikle yasaktır.',
        'Yasa dışı bahis, kumar, uyuşturucu madde kullanımı, şiddet teşviki, nefret söylemi, ırkçılık, ayrımcılık veya yetkili makamlardan izin alınmamış kanun dışı toplanma amaçlı etkinliklerin platformda paylaşılması yasaktır. Bu tür etkinlikler fark edildiği anda derhal kaldırılır ve yayınlayan hesap hakkında gerekli adımlar atılır.',
        'Etkinlik oluşturan kullanıcı, etkinliğin gerçekleşeceği mekanın ve zamanın doğruluğundan, katılım şartlarından ve üçüncü kişilerin uğrayabileceği zararlardan bizzat sorumludur. etkinlik.im, kullanıcılar tarafından yayınlanan etkinliklerin içeriğini önceden denetleme veya onaylama yükümlülüğünde değildir.',
      ],
    },
    {
      id: 'icerik-politikasi',
      icon: (
        <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      title: '6. İçerik Politikası ve Telif Hakları',
      content: [
        'Kullanıcılar, platforma yükledikleri metin, fotoğraf, afiş, logo, broşür ve diğer materyallerin fikri mülkiyet haklarına sahip olduklarını veya bu materyalleri kullanma yetkilerinin bulunduğunu kabul ve taahhüt ederler. Başkalarına ait telif hakkı içeren görsel veya metinlerin izinsiz kullanımı yasaktır.',
        'Platforma yüklediğiniz içeriklerin mülkiyeti size ait kalmakla birlikte; etkinlik.im’e bu içerikleri platform üzerinde görüntüleme, yayma, yeniden biçimlendirme, arama sonuçlarında indeksleme, tanıtım materyallerinde kullanma ve veritabanında saklama konusunda dünya çapında, telifsiz, münhasır olmayan bir kullanım lisansı vermiş olursunuz.',
        'Telif hakkı ihlali iddiasında bulunmak isteyen hak sahipleri, ihlale konu içerik ve hak sahipliği belgeleri ile birlikte etkinlikin@gmail.com e-posta adresi üzerinden telif hakkı bildiriminde bulunabilirler. Haklı görülen bildirimlerde ilgili içerik en kısa sürede platformdan kaldırılır.',
      ],
    },
    {
      id: 'fikri-mulkiyet',
      icon: (
        <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
        </svg>
      ),
      title: '7. Fikri Mülkiyet Hakları',
      content: [
        'etkinlik.im markası, logosu, alan adı, web sitesi tasarımı, veritabanı mimarisi, yazılım kodları, arayüz öğeleri, grafikler ve platforma ait tüm özgün içerikler etkinlik.im’in mülkiyetinde olup Türkiye Cumhuriyeti ve uluslararası fikri mülkiyet mevzuatı ile korunmaktadır.',
        'Önceden açık ve yazılı iznimiz olmaksızın etkinlik.im markasının, logosunun veya platform içeriklerinin kopyalanması, çoğaltılması, dağıtılması, tersine mühendisliğe tabi tutulması veya ticari amaçlarla kullanılması kesinlikle yasaktır.',
      ],
    },
    {
      id: 'sorumluluk-sinirlandirmasi',
      icon: (
        <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      title: '8. Sorumluluk Sınırlandırması',
      content: [
        'etkinlik.im, platformda yer alan bilgilerin, etkinlik tarihlerinin, fiyatların veya konum verilerinin doğruluğunu, güncelliğini ve eksiksizliğini garanti etmez. Etkinliklerin iptal edilmesi, ertelenmesi, mekan değişikliği yapılması veya organizatörlerin eylemlerinden dolayı doğabilecek doğrudan ya da dolaylı zararlardan etkinlik.im sorumlu tutulamaz.',
        'Platformun kullanımı sırasında meydana gelebilecek veri kayıplarından, teknik arızalardan, erişim kesintilerinden, siber saldırılardan veya üçüncü şahısların yetkisiz müdahalelerinden doğan zararlardan Şirketimiz sorumlu tutulamaz. Hizmet "olduğu gibi" (as is) ve "mevcut olduğu şekliyle" (as available) sunulmaktadır.',
        'Kullanıcılar arasındaki iletişim, anlaşma veya fiziki buluşmalardan kaynaklanan uyuşmazlıklardan tamamen ilgili taraflar sorumludur. etkinlik.im kullanıcılar arası uyuşmazlıklarda arabulucu veya hakem rolü üstlenmez.',
      ],
    },
    {
      id: 'hizmet-degisiklikleri',
      icon: (
        <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
      title: '9. Hizmet Değişiklikleri ve Kesintiler',
      content: [
        'etkinlik.im, platform üzerinden sunulan hizmetleri, özellikleri, arayüzü veya veritabanı yapısını dilediği zaman değiştirme, yeni özellikler ekleme, bazı servisleri ücretli hale getirme, geçici olarak durdurma veya tamamen sonlandırma hakkını saklı tutar.',
        'Sistem bakımı, altyapı güncellemeleri, güvenlik düzeltmeleri veya mücbir sebepler (doğal afet, siber saldırı, şebeke arızaları vb.) nedeniyle platforma erişimde yaşanabilecek geçici kesintilerden dolayı kullanıcıların uğrayabileceği aksaklıklardan Şirket sorumlu tutulamaz.',
      ],
    },
    {
      id: 'hesap-feshi',
      icon: (
        <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
        </svg>
      ),
      title: '10. Hesap Fesih Koşulları',
      content: [
        'Kullanıcılar diledikleri zaman hesaplarını kapatarak veya platformu kullanmayı bırakarak işbu Kullanım Koşullarını feshedebilirler. Hesap kapatma talebi sonrası kullanıcıya ait kişisel veriler Kişisel Verilerin Korunması Politikamıza uygun olarak işlenir veya silinir.',
        'Kullanıcının işbu Kullanım Koşullarına, topluluk kurallarına veya yasal mevzuata aykırı hareket ettiğinin tespit edilmesi durumunda, etkinlik.im önceden haber vermeksizin kullanıcının hesabını askıya alma, içeriklerini silme veya hesabını kalıcı olarak kapatma hakkına sahiptir.',
      ],
    },
    {
      id: 'uygulanacak-hukuk',
      icon: (
        <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
        </svg>
      ),
      title: '11. Uygulanacak Hukuk ve Yetkili Mahkeme',
      content: [
        'İşbu Kullanım Koşullarının uygulanmasında, yorumlanmasında ve platformun kullanımından doğabilecek her türlü uyuşmazlığın çözümünde Türkiye Cumhuriyeti Kanunları uygulanacaktır.',
        'Taraflar arasında işbu Sözleşmeden kaynaklanabilecek her türlü uyuşmazlığın çözümünde İstanbul Çağlayan (Merkez) Mahkemeleri ve İcra Daireleri münhasıran yetkilidir.',
      ],
    },
    {
      id: 'iletisim',
      icon: (
        <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: '12. İletişim Bilgileri',
      content: [
        'Kullanım Koşulları, telif hakkı bildirimleri veya platformla ilgili her türlü soru, görüş ve talepleriniz için aşağıdaki iletişim adresi üzerinden bizimle iletişime geçebilirsiniz:',
      ],
      contactEmail: 'etkinlikin@gmail.com',
    },
  ];

  const highlights = [
    { label: 'Hizmet Türü', value: 'Etkinlik Keşif ve Paylaşım' },
    { label: 'Uygulanacak Hukuk', value: 'T.C. Kanunları' },
    { label: 'Yetkili Mahkeme', value: 'İstanbul Mahkemeleri' },
    { label: 'Resmi İletişim', value: 'etkinlikin@gmail.com' },
  ];

  return (
    <section className="w-full max-w-6xl mx-auto pb-12">
      {/* Back Button */}
      <button
        type="button"
        onClick={() => window.history.back()}
        className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-white/80 backdrop-blur-md border border-white/60 text-sm font-extrabold text-gray-700 hover:bg-white hover:text-primary transition-all duration-300 shadow-sm cursor-pointer hover:scale-105 active:scale-95"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        Geri Dön
      </button>

      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">Yasal</p>
        <h1 className="mt-2 text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
          Kullanım Koşulları
        </h1>
        <p className="mt-2 max-w-3xl text-gray-500 font-medium leading-relaxed">
          etkinlik.im platformunu kullanmadan önce lütfen bu Kullanım Koşullarını dikkatlice okuyunuz. Platformumuza erişerek veya hizmetlerimizden yararlanarak işbu Sözleşme hükümlerini kabul etmiş sayılırsınız.
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-black">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Son Güncelleme: 3 Ağustos 2026
          </span>
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-xs font-black">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Yürürlükte
          </span>
        </div>
      </div>

      {/* Top Highlights Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {highlights.map((item) => (
          <div
            key={item.label}
            className="bg-white/80 backdrop-blur-md border border-white/60 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300"
          >
            <p className="text-xs font-black uppercase tracking-wider text-gray-400">{item.label}</p>
            <p className="mt-1 text-sm font-extrabold text-gray-800 truncate">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Main Content Sections */}
      <div className="space-y-6">
        {sections.map((section) => (
          <article
            key={section.id}
            id={section.id}
            className="bg-white/80 backdrop-blur-md border border-white/60 rounded-3xl p-6 md:p-8 elevation-2 hover:elevation-3 transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                {section.icon}
              </div>
              <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight">
                {section.title}
              </h2>
            </div>

            <div className="space-y-4 text-gray-600 text-sm md:text-base font-medium leading-relaxed">
              {section.content.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}

              {section.contactEmail && (
                <div className="mt-4 inline-flex items-center gap-3 p-4 rounded-2xl bg-primary/5 border border-primary/20 w-full sm:w-auto">
                  <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-bold shrink-0">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase text-gray-400">E-Posta Adresi</p>
                    <a
                      href={`mailto:${section.contactEmail}`}
                      className="text-base font-black text-primary hover:underline"
                    >
                      {section.contactEmail}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </article>
        ))}
      </div>

      {/* Footer Info Box */}
      <div className="mt-8 bg-gradient-to-r from-primary/10 via-emerald-500/10 to-secondary/10 border border-white/80 rounded-3xl p-6 text-center backdrop-blur-md">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-1">etkinlik.im Yasal Haklar</p>
        <p className="text-sm font-semibold text-gray-600">
          İşbu Kullanım Koşulları metninin tüm hakları saklıdır. Çoğaltılması veya kopyalanması yasaktır.
        </p>
      </div>
    </section>
  );
};

export default TermsPage;
