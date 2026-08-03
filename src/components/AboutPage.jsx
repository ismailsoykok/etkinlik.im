import React from 'react';

const AboutPage = () => {
  const stats = [
    {
      value: '81 İl',
      label: 'Konum Desteği',
      desc: 'Türkiye’nin dört bir yanındaki etkinlikler',
      tone: 'text-primary',
      bg: 'bg-primary/10',
      border: 'hover:border-primary/30',
    },
    {
      value: '10.000+',
      label: 'Keşfedilen Etkinlik',
      desc: 'Topluluk tarafından oluşturulan içerik',
      tone: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'hover:border-emerald-500/30',
    },
    {
      value: '%100',
      label: 'Ücretsiz Platform',
      desc: 'Herkes için açık ve erişilebilir',
      tone: 'text-amber-500',
      bg: 'bg-amber-50',
      border: 'hover:border-amber-500/30',
    },
    {
      value: '7/24',
      label: 'Canlı Harita',
      desc: 'Anlık konum ve rota yönlendirmesi',
      tone: 'text-sky-600',
      bg: 'bg-sky-50',
      border: 'hover:border-sky-500/30',
    },
  ];

  const features = [
    {
      title: 'Harita Üzerinde Etkinlik Keşfi',
      description: 'Gelişmiş interaktif haritamız sayesinde çevrenizdeki veya hedeflediğiniz şehirdeki etkinlikleri anlık olarak harita üzerinde görselleştirin.',
      icon: (
        <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      ),
    },
    {
      title: 'Etkinlik Oluşturma ve Paylaşma',
      description: 'Kendi konser, atölye, spor veya akademik etkinliğinizi saniyeler içinde planlayın; kapak görseli ve detayları ekleyerek geniş kitlelere ulaştırın.',
      icon: (
        <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      ),
    },
    {
      title: 'Konum Tabanlı Akıllı Arama',
      description: 'Mevcut konumunuzu kullanarak yakınınızdaki aktiviteleri filtreleyin. Mesafe, kategori ve tarihe göre sizin için en uygun buluşmayı bulun.',
      icon: (
        <svg className="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
        </svg>
      ),
    },
    {
      title: 'Dosya ve Görsel Paylaşımı',
      description: 'Etkinliğinize ait bilet kılavuzları, PDF sunumları, harita krokileri veya tanıtım afişlerini katılımcılarla tek bir alanda güvenle paylaşın.',
      icon: (
        <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94a3 3 0 114.243 4.243L8.587 18.312a1.5 1.5 0 11-2.122-2.122l8.954-8.955" />
        </svg>
      ),
    },
    {
      title: 'Kişisel Etkinlik Yönetimi',
      description: 'Oluşturduğunuz ve katıldığınız etkinlikleri kullanıcı panelinizden kolayca takip edin, tarihlerini düzenleyin veya güncelleyin.',
      icon: (
        <svg className="w-6 h-6 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5" />
        </svg>
      ),
    },
    {
      title: 'Topluluk Bağlantısı & Sosyalleşme',
      description: 'Ortak ilgi alanlarına sahip insanlarla bir araya gelin, sosyal çevrenizi genişletin ve şehrinizdeki canlı hayata katılım sağlayın.',
      icon: (
        <svg className="w-6 h-6 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
        </svg>
      ),
    },
  ];

  const steps = [
    {
      step: '01',
      title: 'Keşfet & Haritayı İncele',
      desc: 'Bulunduğunuz konumu seçin veya harita üzerinde gezinerek yakınınızdaki konser, festival, atölye ve buluşmaları listeleyin.',
    },
    {
      step: '02',
      title: 'Etkinliğini Oluştur',
      desc: 'Organizasyonunuzu başlık, açıklama, başlama zamanı ve konum bilgileriyle tanımlayarak yayına alın.',
    },
    {
      step: '03',
      title: 'Dosya ve Detayları Paylaş',
      desc: 'Katılımcıların ihtiyaç duyacağı sunum, bilet, adres haritası veya görselleri etkinliğinize ekleyin.',
    },
    {
      step: '04',
      title: 'Katıl ve Deneyimle',
      desc: 'Etkinlik günü konum tarifini takip ederek etkinlik alanına ulaşın, yeni insanlarla tanışıp keyifli vakit geçirin.',
    },
  ];

  const advantages = [
    {
      title: 'Anlık Konum Odaklılık',
      text: 'Karmaşık listelerle vakit kaybetmeden çevrenizdeki etkinlikleri doğrudan haritada görün.',
    },
    {
      title: 'Tamamen Şeffaf ve Ücretsiz',
      text: 'Gizli ücretler yok. Etkinlik eklemek, keşfetmek ve materyal indirmek herkese açık ve ücretsizdir.',
    },
    {
      title: 'Hızlı ve Modern Arayüz',
      text: 'Tüm mobil cihazlar ve masaüstü bilgisayarlarla %100 uyumlu, yüksek performanslı cam tasarımı.',
    },
    {
      title: 'Güvenli İçerik ve Dosyalar',
      text: 'Yüklenen dosyalar ve etkinlik detayları güvenli sunucularda barındırılır ve anında erişilebilir.',
    },
  ];

  const faqs = [
    {
      question: 'etkinlik.in kullanmak ücretli midir?',
      answer: 'Hayır, etkinlik.in platformunda etkinlik keşfetmek, yeni etkinlik oluşturmak ve dosya paylaşmak tamamen ücretsizdir.',
    },
    {
      question: 'Platformda ne tür etkinlikler paylaşılabilir?',
      answer: 'Konser, tiyatro, atölye çalışmaları, akademik konferanslar, spor buluşmaları, yazılım ve teknoloji meet-up’ları gibi her türlü sosyal ve kültürel etkinlik paylaşılabilir.',
    },
    {
      question: 'Etkinliklerime nasıl dosya ekleyebilirim?',
      answer: 'Etkinlik oluştururken veya düzenleme sayfasından PDF, görsel veya tanıtım materyallerini yükleyerek katılımcıların indirmesini sağlayabilirsiniz.',
    },
    {
      question: 'Konum bilgisini paylaşmak zorunlu mu?',
      answer: 'Etkinliğin haritada doğru görüntülenebilmesi ve yakınındaki kullanıcılar tarafından bulunabilmesi için konum bilgisi eklemek önerilir.',
    },
  ];

  return (
    <section className="w-full max-w-6xl mx-auto pb-12">
      {/* Back Button */}
      <button
        onClick={() => window.history.back()}
        type="button"
        className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-bold text-gray-700 bg-white/80 backdrop-blur-md border border-white/60 rounded-full hover:bg-white hover:text-primary transition-all duration-200 shadow-sm cursor-pointer"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        Geri Dön
      </button>

      {/* Page Header */}
      <div className="mb-10">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">Kurumsal</p>
        <h1 className="mt-2 text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight">Hakkımızda</h1>
        <p className="mt-3 max-w-3xl text-base md:text-lg text-gray-600 font-medium leading-relaxed">
          etkinlik.in, çevrenizdeki etkinlikleri keşfetmenizi, kendi etkinliklerinizi kolayca oluşturup paylaşmanızı ve topluluğunuzla etkileşim kurmanızı sağlayan yenilikçi, konum tabanlı bir etkinlik platformudur.
        </p>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`bg-white/80 backdrop-blur-md border border-white/60 rounded-3xl p-5 elevation-2 hover:scale-[1.02] ${stat.border} transition-all duration-300 flex flex-col justify-between`}
          >
            <div>
              <span className={`inline-flex px-3 py-1 text-xs font-extrabold rounded-full ${stat.bg} ${stat.tone} mb-3`}>
                {stat.label}
              </span>
              <p className={`text-3xl md:text-4xl font-extrabold ${stat.tone}`}>{stat.value}</p>
            </div>
            <p className="mt-2 text-xs text-gray-500 font-bold">{stat.desc}</p>
          </div>
        ))}
      </div>

      {/* Mission & Vision Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="bg-white/80 backdrop-blur-md border border-white/60 rounded-3xl p-8 elevation-2 hover:elevation-3 transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full pointer-events-none" />
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900">Misyonumuz</h2>
          </div>
          <p className="text-gray-600 font-medium leading-relaxed">
            Türkiye genelinde insanların sosyal, kültürel, akademik ve eğlence odaklı etkinliklere erişimini kolaylaştırmak; konum tabanlı modern teknolojimizle şehirlerdeki toplumsal etkileşimi ve sosyal yaşam kalitesini artırmaktır.
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-md border border-white/60 rounded-3xl p-8 elevation-2 hover:elevation-3 transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/20 rounded-bl-full pointer-events-none" />
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900">Vizyonumuz</h2>
          </div>
          <p className="text-gray-600 font-medium leading-relaxed">
            Konum tabanlı etkinlik keşfi ve paylaşımında bölgenin en güvenilir, kapsamlı ve tercih edilen dijital platformu olmak; fiziksel dünyadaki buluşmaları dijital kolaylıkla harmanlayan sürdürülebilir bir etkinlik ekosistemi inşa etmektir.
          </p>
        </div>
      </div>

      {/* Platform Features Section */}
      <div className="mb-12">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">Neler Sunuyoruz?</p>
          <h2 className="mt-2 text-3xl font-extrabold text-gray-900 tracking-tight">Platform Özellikleri</h2>
          <p className="mt-2 text-gray-500 font-medium text-sm">
            etkinlik.in, hem organizatörler hem de katılımcılar için tasarlanmış güçlü araçlar sunar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat) => (
            <div
              key={feat.title}
              className="bg-white/80 backdrop-blur-md border border-white/60 rounded-3xl p-6 elevation-2 hover:elevation-4 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-4">
                  {feat.icon}
                </div>
                <h3 className="text-lg font-extrabold text-gray-900 mb-2">{feat.title}</h3>
                <p className="text-sm text-gray-600 font-medium leading-relaxed">{feat.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How it Works Section */}
      <div className="mb-12">
        <div className="bg-white/80 backdrop-blur-md border border-white/60 rounded-3xl p-8 elevation-2">
          <div className="mb-8">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">Adım Adım</p>
            <h2 className="mt-1 text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">Nasıl Çalışır?</h2>
            <p className="mt-1 text-sm text-gray-500 font-medium">
              etkinlik.in platformunda etkinlik bulmak ve oluşturmak oldukça basittir.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s) => (
              <div key={s.step} className="relative p-5 rounded-2xl bg-gray-50/70 border border-gray-100 flex flex-col justify-between">
                <div>
                  <span className="text-3xl font-black text-primary/30 block mb-2">{s.step}</span>
                  <h4 className="text-base font-extrabold text-gray-900 mb-2">{s.title}</h4>
                  <p className="text-xs text-gray-600 font-medium leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Advantages Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white rounded-3xl p-8 shadow-xl flex flex-col justify-between">
          <div>
            <span className="inline-flex px-3 py-1 text-xs font-black rounded-full bg-primary/20 text-primary mb-4">
              Neden Biz?
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight mb-4">Neden etkinlik.in?</h2>
            <p className="text-gray-300 font-medium text-sm leading-relaxed mb-6">
              Etkinlik aramak veya düzenlemek hiç bu kadar kolay olmamıştı. Harita tabanlı altyapımız ve kullanıcı dostu araçlarımızla fark yaratıyoruz.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {advantages.map((adv) => (
              <div key={adv.title} className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
                <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  ✓
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-white">{adv.title}</h4>
                  <p className="text-xs text-gray-400 font-medium">{adv.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div className="bg-white/80 backdrop-blur-md border border-white/60 rounded-3xl p-8 elevation-2 flex flex-col justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-1">Bilgi Bankası</p>
            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-6">Sıkça Sorulan Sorular</h2>
            <div className="space-y-4">
              {faqs.map((faq) => (
                <div key={faq.question} className="p-4 rounded-2xl bg-gray-50/80 border border-gray-100">
                  <h4 className="text-sm font-extrabold text-gray-900 mb-1">{faq.question}</h4>
                  <p className="text-xs text-gray-600 font-medium leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-white/80 backdrop-blur-md border border-white/60 rounded-3xl p-8 elevation-2 text-center">
        <span className="inline-flex px-4 py-1.5 text-xs font-black rounded-full bg-primary/10 text-primary mb-3">
          İletişim & Destek
        </span>
        <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">Bize Ulaşın</h2>
        <p className="mt-2 text-sm text-gray-500 font-medium max-w-xl mx-auto">
          Sorularınız, önerileriniz veya iş birliği talepleriniz için resmi kanallarımız üzerinden bizimle iletişime geçebilirsiniz.
        </p>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto">
          <a
            href="https://instagram.com/etkinlik.in"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-pink-500/10 to-rose-500/10 border border-pink-200/50 hover:scale-[1.02] transition-transform duration-200 group"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center shadow-md">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </div>
            <div className="text-left">
              <span className="text-[10px] font-black uppercase text-gray-400 block">Instagram</span>
              <span className="text-sm font-extrabold text-gray-800 group-hover:text-primary transition-colors">
                @etkinlik.in
              </span>
            </div>
          </a>

          <a
            href="mailto:etkinlikin@gmail.com"
            className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-primary/10 border border-primary/20 hover:scale-[1.02] transition-transform duration-200 group"
          >
            <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-md shadow-primary/20">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </div>
            <div className="text-left">
              <span className="text-[10px] font-black uppercase text-gray-400 block">E-posta</span>
              <span className="text-sm font-extrabold text-gray-800 group-hover:text-primary transition-colors">
                etkinlikin@gmail.com
              </span>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
};

export default AboutPage;
