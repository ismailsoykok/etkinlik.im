const PrivacyPolicyPage = () => {
  const handleBack = () => {
    window.history.back();
  };

  return (
    <section className="w-full max-w-6xl mx-auto pb-12">
      {/* Back Button */}
      <div className="mb-6">
        <button
          onClick={handleBack}
          type="button"
          className="group inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-md border border-white/60 text-gray-700 text-sm font-bold shadow-sm hover:bg-white hover:text-primary hover:shadow transition-all duration-300 cursor-pointer"
        >
          <svg
            className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          <span>Geri Dön / Ana Sayfa</span>
        </button>
      </div>

      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">Yasal</p>
        <h1 className="mt-2 text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
          Gizlilik Politikası
        </h1>
        <p className="mt-2 max-w-3xl text-gray-500 font-medium leading-relaxed">
          etkinlik.im platformunu kullanırken paylaştığınız kişisel verilerinizin korunması, işlenmesi,
          güvenliği ve 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamındaki haklarınız hakkında
          kapsamlı bilgilendirme rehberi.
        </p>

        {/* Quick Highlights / Badges */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Son Güncelleme: 3 Ağustos 2026
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.002z" />
            </svg>
            KVKK Uyumlu Metin
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 text-xs font-bold">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
            etkinlikin@gmail.com
          </span>
        </div>
      </div>

      {/* Sections Container */}
      <div className="space-y-6">
        {/* Card 1: Giriş ve Veri Sorumlusu */}
        <div className="bg-white/80 backdrop-blur-md border border-white/60 rounded-3xl elevation-2 p-6 md:p-8 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
              </svg>
            </div>
            <h2 className="text-xl md:text-2xl font-extrabold text-gray-900">
              1. Giriş ve Veri Sorumlusu
            </h2>
          </div>

          <div className="space-y-4 text-gray-600 font-medium text-sm md:text-base leading-relaxed">
            <p>
              Bu Gizlilik Politikası, <strong className="text-gray-800">etkinlik.im</strong> ("Platform", "Biz")
              tarafından yönetilen web sitesi, mobil arayüzler ve dijital servisleri ziyaret eden ve kullanan
              tüm bireylerin ("Kullanıcı", "Siz") kişisel verilerinin korunmasını amaçlamaktadır. Platformumuz,
              kişisel verilerinizin gizliliğine ve güvenliğine en üst düzeyde önem vermekte; tüm süreçlerini
              6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") ve ilgili ikincil mevzuata tam uygunluk
              ilkesi doğrultusunda yürütmektedir.
            </p>
            <p>
              Veri sorumlusu sıfatıyla hareket eden etkinlik.im, platform üzerinden toplanan verilerin hangi
              amaçlarla işlendiğini, kimlere ve hangi şartlarla aktarılabileceğini, veri toplama yöntemlerini
              ve KVKK'nın 11. maddesi uyarınca veri sahiplerinin sahip olduğu yasal hakları şeffaf bir şekilde
              açıklamayı hedeflemektedir.
            </p>
            <p>
              Platformumuzu ziyaret ederek, kayıt olarak veya sunulan etkinlik ve harita servislerinden
              yararlanarak işbu Gizlilik Politikası'nda belirtilen ilke ve koşulları okuduğunuzu, anladığınızı
              ve kabul ettiğinizi beyan etmiş olursunuz. Politika hükümlerini kabul etmemeniz halinde platformumuzu
              kullanmayı sonlandırmanız gerekmektedir.
            </p>
          </div>
        </div>

        {/* Card 2: Toplanan Veriler */}
        <div className="bg-white/80 backdrop-blur-md border border-white/60 rounded-3xl elevation-2 p-6 md:p-8 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 5.625c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
              </svg>
            </div>
            <h2 className="text-xl md:text-2xl font-extrabold text-gray-900">
              2. Toplanan Veriler ve Veri Kaynakları
            </h2>
          </div>

          <div className="space-y-4 text-gray-600 font-medium text-sm md:text-base leading-relaxed">
            <p>
              etkinlik.im, sunduğu hizmetlerin kapsamına bağlı olarak kullanıcılarından çeşitli kişisel ve teknik
              veriler toplamaktadır. Toplanan veri kategorileri aşağıdaki gibidir:
            </p>
            <p>
              <strong className="text-gray-900">a) Kimlik ve Hesap Bilgileri:</strong> Üyelik kaydı yaparken veya
              profilinizi güncellerken belirttiğiniz ad, soyad, kullanıcı adı, e-posta adresi, profil fotoğrafı
              ve güvenli biçimde şifrelenmiş kimlik doğrulama parolası verileri toplanmaktadır.
            </p>
            <p>
              <strong className="text-gray-900">b) Konum ve Coğrafi Veriler:</strong> Yakınınızdaki sosyal, sanatsal
              ve kültürel etkinlikleri keşfedebilmeniz, etkinlikleri harita üzerinde görüntüleyebilmeniz ve rota bilgisi
              alabilmeniz amacıyla; cihazınızın GPS sinyali, IP adresi veya Wi-Fi erişim noktası üzerinden sağlanan
              hassas ya da yaklaşık konum verileriniz işlenmektedir. Konum bilgileri yalnızca izniniz dahilinde alınır.
            </p>
            <p>
              <strong className="text-gray-900">c) Etkinlik ve İçerik Bilgileri:</strong> Platform üzerinde oluşturduğunuz
              etkinlik başlıkları, açıklamaları, etkinlik tarih ve saatleri, mekan adresi ve konum koordinatları,
              yüklediğiniz görseller ve dokümanlar ile kaydettiğiniz veya paylaştığınız etkinlik verileri.
            </p>
            <p>
              <strong className="text-gray-900">d) Teknik ve Kullanım Günlükleri:</strong> 5651 sayılı Kanun uyarınca
              toplanması yasal zorunluluk olan IP adresiniz, cihaz modeliniz, işletim sistemi sürümünüz, tarayıcı türünüz,
              ziyaret ettiğiniz sayfalar, tıklama hareketleri, erişim tarih/saat damgaları ve sistem günlük (log) verileri.
            </p>
          </div>
        </div>

        {/* Card 3: Verilerin Kullanım Amacı */}
        <div className="bg-white/80 backdrop-blur-md border border-white/60 rounded-3xl elevation-2 p-6 md:p-8 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zm-7.5-9.816l1.732 2.508m-3.232-1.782L5.25 14.25m6.878-10.39L12 2.25l1.872 1.61M4.75 6.75l2.5-1.5M19.25 6.75l-2.5-1.5" />
              </svg>
            </div>
            <h2 className="text-xl md:text-2xl font-extrabold text-gray-900">
              3. Verilerin İşlenme Amaçları
            </h2>
          </div>

          <div className="space-y-4 text-gray-600 font-medium text-sm md:text-base leading-relaxed">
            <p>
              Toplanan kişisel verileriniz, KVKK'nın 5. ve 6. maddelerinde belirtilen kişisel veri işleme şartları
              ve amaçları dahilinde aşağıdaki hususlar doğrultusunda işlenmektedir:
            </p>
            <p>
              <strong className="text-gray-900">• Platform Hizmetlerinin Sunulması:</strong> Kullanıcı hesabınızın
              oluşturulması, oturum yönetimi, etkinlik ekleme, düzenleme, silme, harita üzerinde gösterim ve etkinlik
              paylaşımı gibi temel işlevlerin kesintisiz yerine getirilmesi.
            </p>
            <p>
              <strong className="text-gray-900">• Konum Bazlı Etkinlik Keşfi ve Haritalama:</strong> Bulunduğunuz konuma
              en yakın etkinliklerin akıllı harita algoritmaları ve Google Maps entegrasyonu ile listelenmesi, mesafe
              filtreleme imkanı sunulması ve bölgesel Etkinlik akışlarının özelleştirilmesi.
            </p>
            <p>
              <strong className="text-gray-900">• Hesap Güvenliği ve Siber Koruma:</strong> Platformun siber saldırılara,
              yetkisiz erişimlere ve olası dolandırıcılık vakalarına karşı korunması, kimlik doğrulama adımlarının
              yürütülmesi ve sistem bütünlüğünün temini.
            </p>
            <p>
              <strong className="text-gray-900">• Performans Analizi ve Hizmet Geliştirme:</strong> Kullanıcı deneyimini
              artırmak, arayüz tasarımlarını iyileştirmek, teknik altyapı hatalarını saptamak ve platform kullanım
              istatistiklerini anonim olarak analiz etmek.
            </p>
            <p>
              <strong className="text-gray-900">• Yasal Yükümlülüklerin İfası:</strong> 5651 sayılı İnternet Kanunu ve
              ilgili mevzuat uyarınca erişim kayıtlarının saklanması, mahkemeler ve yetkili kamu kurumlarından gelen
              yasal bilgi/belge taleplerinin karşılanması.
            </p>
          </div>
        </div>

        {/* Card 4: Çerez Politikası */}
        <div className="bg-white/80 backdrop-blur-md border border-white/60 rounded-3xl elevation-2 p-6 md:p-8 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18zM9.75 9.75c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm4.5 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-6 4.5s1.5 1.5 3.75 1.5 3.75-1.5 3.75-1.5" />
              </svg>
            </div>
            <h2 className="text-xl md:text-2xl font-extrabold text-gray-900">
              4. Çerez (Cookie) Politikası ve Yönetimi
            </h2>
          </div>

          <div className="space-y-4 text-gray-600 font-medium text-sm md:text-base leading-relaxed">
            <p>
              Çerezler (Cookies), platformumuzu ziyaret ettiğinizde cihazınıza yerleştirilen küçük metin dosyalarıdır.
              etkinlik.im, kullanıcı deneyimini zenginleştirmek, oturum sürekliliğini sağlamak ve site performansını
              ölçmek amacıyla çerez ve benzeri izleme teknolojileri kullanır.
            </p>
            <p>
              <strong className="text-gray-900">Kullanılan Çerez Türleri:</strong>
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>
                <strong className="text-gray-800">Zorunlu Çerezler:</strong> Platformun temel işlevlerinin (oturum açma,
                güvenli alanlara erişim, form doldurma) çalışması için teknik olarak gereklidir. Bu çerezler engellenemez.
              </li>
              <li>
                <strong className="text-gray-800">İşlevsel ve Tercih Çerezleri:</strong> Dil seçiminiz, arama geçmişiniz
                veya harita yakınlaştırma seviyeniz gibi kişisel tercihlerinizi hatırlamamızı sağlar.
              </li>
              <li>
                <strong className="text-gray-800">Analitik ve Performans Çerezleri:</strong> Ziyaretçi sayılarını,
                sayfa dolaşım sürelerini ve en çok ilgi gören etkinlik türlerini anonim olarak analiz etmemize yardımcı olur.
              </li>
            </ul>
            <p>
              Kullanıcılar, tarayıcı ayarlarını (Google Chrome, Mozilla Firefox, Safari, Microsoft Edge vb.) değiştirerek
              çerezleri reddetme, engelleme veya mevcut çerezleri silme hakkına sahiptir. Ancak zorunlu çerezlerin
              kapatılması durumunda platformun bazı özellikleri tam performansla çalışmayabilir.
            </p>
          </div>
        </div>

        {/* Card 5: Üçüncü Taraf Hizmetler */}
        <div className="bg-white/80 backdrop-blur-md border border-white/60 rounded-3xl elevation-2 p-6 md:p-8 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18ptM12 3v18m9-9H3" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 20a10.5 10.5 0 010-16m6 16a10.5 10.5 0 000-16" />
              </svg>
            </div>
            <h2 className="text-xl md:text-2xl font-extrabold text-gray-900">
              5. Üçüncü Taraf Hizmetler (Google Maps & AdSense)
            </h2>
          </div>

          <div className="space-y-4 text-gray-600 font-medium text-sm md:text-base leading-relaxed">
            <p>
              etkinlik.im, platform deneyimini zenginleştirmek ve hizmet sunabilmek için güvenilir üçüncü taraf
              servis sağlayıcıları ile entegre bir biçimde çalışmaktadır:
            </p>
            <p>
              <strong className="text-gray-900">a) Google Maps Harita Servisi:</strong> Etkinliklerin harita üzerinde
              görselleştirilmesi, dinamik konum işaretçilerinin oluşturulması ve yakınlık aramaları için Google Maps API
              servisleri kullanılmaktadır. Google Maps kullanımı esnasında Google, harita etkileşimleriniz ve cihaz
              konum verileriniz dahil belirli bilgileri toplayabilir. Bu veriler
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-bold ml-1">
                Google Gizlilik Politikası
              </a>'na tabidir.
            </p>
            <p>
              <strong className="text-gray-900">b) Google AdSense ve Reklam Ağı:</strong> Platformumuzun ücretsiz
              hizmet sunmaya devam edebilmesi amacıyla Google AdSense reklam ağı entegrasyonu bulunmaktadır. Google ve
              üçüncü taraf reklam sağlayıcıları, ilgi alanlarınıza göre reklamlar sunmak amacıyla çerezlerden ve web
              işaretçilerinden (web beacons) faydalanabilir.
            </p>
            <p>
              <strong className="text-gray-900">c) IP Coğrafi Konum (Geolocation) Servisleri:</strong> Cihazınızda hassas
              GPS konum izni verilmediği senaryolarda, bulunduğunuz ili veya bölgeyi yaklaşık olarak tespit edebilmek
              amacıyla IP tabanlı coğrafi konum servislerinden faydalanılabilir. Bu sorgular anonimleştirilerek işlenir.
            </p>
          </div>
        </div>

        {/* Card 6: Veri Güvenliği */}
        <div className="bg-white/80 backdrop-blur-md border border-white/60 rounded-3xl elevation-2 p-6 md:p-8 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </div>
            <h2 className="text-xl md:text-2xl font-extrabold text-gray-900">
              6. Veri Güvenliği Standartları ve Saklama Süreleri
            </h2>
          </div>

          <div className="space-y-4 text-gray-600 font-medium text-sm md:text-base leading-relaxed">
            <p>
              etkinlik.im, kişisel verilerinizin gizliliğini, bütünlüğünü ve güvenliğini sağlamayı en yüksek öncelik
              olarak benimsemektedir. Verilerinizin yetkisiz kişilerin eline geçmesini, kaybolmasını, suiistimal edilmesini
              veya değiştirilmesini önlemek amacıyla sektör standardı idari ve teknik tedbirler uygulanmaktadır.
            </p>
            <p>
              Platform üzerindeki tüm ağ trafiği 256-bit SSL/TLS şifreleme sertifikaları ile koruma altındadır. Veritabanlarımız
              ve sunucularımız, güncel güvenlik duvarları (firewall), sızma engelleme sistemleri ve kısıtlı erişim yetki
              matrisleri ile korunur. Parolalarınız veritabanında geriye dönüştürülemeyen güçlü kriptografik algoritmalardan
              (hashing) geçirilerek saklanmaktadır.
            </p>
            <p>
              Kişisel verileriniz, işlenme amacının devam ettiği süre boyunca ve ilgili yasal mevzuatta (özellikle 5651 sayılı
              Kanun kapsamındaki log saklama yükümlülükleri) öngörülen zamanaşımı süreleri boyunca muhafaza edilir. Sürenin
              dolması veya verinin işlenme amacının ortadan kalkması durumunda verileriniz KVKK standartlarına uygun olarak
              silinir, yok edilir veya anonimleştirilir.
            </p>
          </div>
        </div>

        {/* Card 7: Kullanıcı Hakları (KVKK) */}
        <div className="bg-white/80 backdrop-blur-md border border-white/60 rounded-3xl elevation-2 p-6 md:p-8 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.5H5.25A2.25 2.25 0 003 6.75v10.5a2.25 2.25 0 002.25 2.25h13.5A2.25 2.25 0 0021 17.25V6.75A2.25 2.25 0 0018.75 4.5z" />
              </svg>
            </div>
            <h2 className="text-xl md:text-2xl font-extrabold text-gray-900">
              7. Kullanıcı Hakları (KVKK 11. Madde Kapsamında)
            </h2>
          </div>

          <div className="space-y-4 text-gray-600 font-medium text-sm md:text-base leading-relaxed">
            <p>
              6698 sayılı KVKK'nın 11. maddesi uyarınca, veri sahibi olarak platformumuza başvurarak aşağıdaki
              haklarınızı her zaman kullanabilirsiniz:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              {[
                'Kişisel verilerinizin işlenip işlenmediğini öğrenme,',
                'Kişisel verileriniz işlenmişse buna ilişkin bilgi talep etme,',
                'Kişisel verilerin işlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme,',
                'Yurt içinde veya yurt dışında kişisel verilerin aktarıldığı üçüncü kişileri bilme,',
                'Kişisel verilerin eksik veya yanlış işlenmiş olması halinde bunların düzeltilmesini isteme,',
                'KVKK 7. maddesinde öngörülen şartlar çerçevesinde kişisel verilerin silinmesini veya yok edilmesini isteme,',
                'Düzeltme, silme ve yok edilme işlemlerinin verilerin aktarıldığı üçüncü kişilere bildirilmesini isteme,',
                'İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme,',
                'Kişisel verilerin kanuna aykırı olarak işlenmesi sebebiyle zarara uğramanız halinde zararın giderilmesini talep etme.',
              ].map((right, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3.5 rounded-2xl bg-gray-50/80 border border-gray-100 text-xs md:text-sm font-semibold text-gray-700">
                  <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                    ✓
                  </span>
                  <span>{right}</span>
                </div>
              ))}
            </div>

            <p className="pt-2">
              KVKK kapsamındaki haklarınıza ilişkin taleplerinizi e-posta yoluyla <strong className="text-primary font-bold">etkinlikin@gmail.com</strong> adresine
              iletebilirsiniz. Başvurularınız, talebin niteliğine göre en kısa sürede ve en geç 30 (otuz) gün içinde ücretsiz olarak sonuçlandırılacaktır.
            </p>
          </div>
        </div>

        {/* Card 8: İletişim ve Bilgilendirme */}
        <div className="bg-white/80 backdrop-blur-md border border-white/60 rounded-3xl elevation-2 p-6 md:p-8 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </div>
            <h2 className="text-xl md:text-2xl font-extrabold text-gray-900">
              8. İletişim ve Politika Güncellemeleri
            </h2>
          </div>

          <div className="space-y-4 text-gray-600 font-medium text-sm md:text-base leading-relaxed">
            <p>
              Gizlilik Politikamız, mevzuat değişikliklerine ve platformumuzun yeni özelliklerine paralel olarak zaman zaman
              güncellenebilir. Güncellenen politika metni, yayınlandığı tarihten itibaren platform üzerinde geçerlilik kazanır.
              Değişikliklerden haberdar olmak için bu sayfayı periyodik olarak kontrol etmeniz önerilir.
            </p>

            <div className="mt-4 p-6 rounded-2xl bg-gradient-to-br from-primary/5 via-primary/10 to-transparent border border-primary/20">
              <h3 className="text-base font-extrabold text-gray-900 mb-2">İletişim Kanalımız</h3>
              <p className="text-sm text-gray-600 mb-4">
                Gizlilik politikası, veri koruma süreçlerimiz veya KVKK başvurularınız için bizimle doğrudan iletişime geçebilirsiniz:
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm font-bold text-gray-800">
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">E-posta:</span>
                  <a href="mailto:etkinlikin@gmail.com" className="text-primary hover:underline">
                    etkinlikin@gmail.com
                  </a>
                </div>
                <div className="hidden sm:block text-gray-300">|</div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">Platform:</span>
                  <span className="text-gray-900">etkinlik.im</span>
                </div>
                <div className="hidden sm:block text-gray-300">|</div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">Son Güncelleme:</span>
                  <span className="text-gray-900">3 Ağustos 2026</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrivacyPolicyPage;
