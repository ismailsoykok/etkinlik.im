import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { taskService, parseTaskDetail } from '../api/taskService';
import { toast } from 'react-toastify';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const defaultCenter = [41.0082, 28.9784];
const dayLabels = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
const timeOptions = Array.from({ length: 32 }, (_, index) => {
  const totalMinutes = 8 * 60 + index * 30;
  const hours = String(Math.floor(totalMinutes / 60)).padStart(2, '0');
  const minutes = String(totalMinutes % 60).padStart(2, '0');

  return `${hours}:${minutes}`;
});

function parseCoordinate(value) {
  if (value === '') return null;

  const coordinate = Number(value);
  return Number.isFinite(coordinate) ? coordinate : null;
}

function formatDateValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function getCalendarDays(monthDate) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const firstGridDay = new Date(firstDay);
  const mondayOffset = (firstDay.getDay() + 6) % 7;

  firstGridDay.setDate(firstDay.getDate() - mondayOffset);

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(firstGridDay);
    date.setDate(firstGridDay.getDate() + index);

    return {
      date,
      value: formatDateValue(date),
      isCurrentMonth: date.getMonth() === month,
      day: date.getDate(),
    };
  });
}

function formatDateForDisplay(value) {
  if (!value) return '';
  
  return new Date(`${value}T12:00:00`).toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function formatDateFull(value) {
  if (!value) return '';
  
  return new Date(`${value}T12:00:00`).toLocaleDateString('tr-TR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function convertTo12Hour(time24) {
  if (!time24) return '';
  const [hours, minutes] = time24.split(':');
  const h = parseInt(hours, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${minutes} ${ampm}`;
}

function LocationPicker({ position, onSelect }) {
  useMapEvents({
    click(event) {
      onSelect({
        latitude: Number(event.latlng.lat.toFixed(6)),
        longitude: Number(event.latlng.lng.toFixed(6)),
      });
    },
  });

  if (position.latitude == null || position.longitude == null) return null;

  return <Marker position={[position.latitude, position.longitude]} />;
}

function MapCenterUpdater({ position }) {
  const map = useMap();

  useEffect(() => {
    if (position.latitude != null && position.longitude != null) {
      map.setView([position.latitude, position.longitude], Math.max(map.getZoom(), 13));
    }
  }, [map, position.latitude, position.longitude]);

  return null;
}

const initialForm = {
  title: '',
  description: '',
  latitude: '',
  longitude: '',
  startDate: '',
  visibility: 'PUBLIC',
  files: [],
};

const AddEventPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [form, setForm] = useState(initialForm);
  const [dateTime, setDateTime] = useState({ date: '', time: '' });
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [timeOpen, setTimeOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(() => new Date());
  const [submitState, setSubmitState] = useState({ loading: false, error: null, success: null });

  useEffect(() => {
    if (!isEdit) return;

    let ignore = false;
    const fetchEvent = async () => {
      try {
        setSubmitState(prev => ({ ...prev, loading: true, error: null }));
        const rawTask = await taskService.getTaskById(id);
        if (!ignore) {
          const parsedDetail = parseTaskDetail(rawTask);
          const loc = rawTask.location ?? {};
          const latVal = loc.latitude ?? loc.lat ?? rawTask.latitude ?? rawTask.lat ?? '';
          const lngVal = loc.longitude ?? loc.lon ?? rawTask.longitude ?? rawTask.lng ?? rawTask.lon ?? '';

          let descVal = rawTask.description ?? rawTask.desc ?? '';
          if (!descVal && parsedDetail.desc && parsedDetail.desc !== 'Aciklama eklenmemis.' && parsedDetail.desc !== 'Etkinlik açıklaması bulunmuyor.') {
            descVal = parsedDetail.desc;
          }

          setForm({
            title: rawTask.title ?? '',
            description: descVal,
            latitude: latVal !== '' ? String(latVal) : '',
            longitude: lngVal !== '' ? String(lngVal) : '',
            visibility: rawTask.visibility ?? 'PUBLIC',
            files: parsedDetail.files || [],
          });

          if (rawTask.startDate) {
            let d = '';
            let t = '';
            if (typeof rawTask.startDate === 'string') {
              const parts = rawTask.startDate.split(/[T ]/);
              if (parts[0]) {
                d = parts[0];
                t = parts[1] ? parts[1].substring(0, 5) : '00:00';
              }
            } else if (Array.isArray(rawTask.startDate)) {
              const [yr, mo, dy, hr, mn] = rawTask.startDate;
              const year = String(yr);
              const month = String(mo).padStart(2, '0');
              const day = String(dy).padStart(2, '0');
              d = `${year}-${month}-${day}`;
              
              const hours = String(hr ?? 0).padStart(2, '0');
              const minutes = String(mn ?? 0).padStart(2, '0');
              t = `${hours}:${minutes}`;
            }

            if (d && t) {
              setDateTime({ date: d, time: t });
            }
          }
          setSubmitState(prev => ({ ...prev, loading: false }));
        }
      } catch (err) {
        console.error('Etkinlik yükleme hatası:', err);
        if (!ignore) {
          setSubmitState({
            loading: false,
            error: 'Etkinlik verileri yüklenirken bir hata oluştu.',
            success: null,
          });
        }
      }
    };

    fetchEvent();
    return () => {
      ignore = true;
    };
  }, [id, isEdit]);

  const selectedPosition = useMemo(() => ({
    latitude: parseCoordinate(form.latitude),
    longitude: parseCoordinate(form.longitude),
  }), [form.latitude, form.longitude]);
  const calendarDays = useMemo(() => getCalendarDays(calendarMonth), [calendarMonth]);
  const monthLabel = calendarMonth.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (event) => {
    setForm(prev => ({ ...prev, files: Array.from(event.target.files ?? []) }));
  };

  const updateStartDate = (nextDateTime) => {
    setDateTime(nextDateTime);
    setForm(prev => ({
      ...prev,
      startDate: nextDateTime.date && nextDateTime.time ? `${nextDateTime.date}T${nextDateTime.time}` : '',
    }));
  };

  const handleDateSelect = (value) => {
    updateStartDate({ ...dateTime, date: value });
    setCalendarOpen(false);
  };

  const handleTimeSelect = (value) => {
    updateStartDate({ ...dateTime, time: value });
    setTimeOpen(false);
  };

  const changeCalendarMonth = (amount) => {
    setCalendarMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + amount, 1));
  };

  const handleLocationSelect = ({ latitude, longitude }) => {
    setForm(prev => ({
      ...prev,
      latitude: String(latitude),
      longitude: String(longitude),
    }));
  };

  const [locating, setLocating] = useState(false);

  const handleUseCurrentLocation = () => {
    setLocating(true);

    const useIpFallback = async () => {
      try {
        const res = await fetch("https://ipapi.co/json/");
        const ipData = await res.json();
        if (ipData.latitude && ipData.longitude) {
          const lat = Number(ipData.latitude.toFixed(6));
          const lng = Number(ipData.longitude.toFixed(6));
          setForm(prev => ({
            ...prev,
            latitude: String(lat),
            longitude: String(lng),
          }));
        } else {
          throw new Error("Invalid IP geo coordinates");
        }
      } catch (ipError) {
        console.error("IP geolocation failed:", ipError);
        toast.error("Konumunuz tespit edilemedi. Lütfen koordinatları haritaya tıklayarak veya elle girin.");
      } finally {
        setLocating(false);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = Number(position.coords.latitude.toFixed(6));
          const lng = Number(position.coords.longitude.toFixed(6));
          setForm(prev => ({
            ...prev,
            latitude: String(lat),
            longitude: String(lng),
          }));
          setLocating(false);
        },
        (error) => {
          console.warn("Tarayıcı konum servisi başarısız oldu, IP konumuna geçiliyor...", error);
          useIpFallback();
        },
        { enableHighAccuracy: true, timeout: 4000 }
      );
    } else {
      useIpFallback();
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!dateTime.date || !dateTime.time) {
      setSubmitState({
        loading: false,
        error: 'Lütfen etkinlik tarihini ve saatini seçin.',
        success: null,
      });
      return;
    }

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      latitude: Number(form.latitude),
      longitude: Number(form.longitude),
      startDate: `${dateTime.date}T${dateTime.time}`,
      visibility: form.visibility,
      files: form.files,
    };

    setSubmitState({ loading: true, error: null, success: null });

    try {
      if (isEdit) {
        const updatedTask = await taskService.updateTask(id, payload);
        setSubmitState({ loading: false, error: null, success: updatedTask });
        setTimeout(() => {
          navigate(`/events/${id}`);
        }, 1500);
      } else {
        const createdTask = await taskService.createTask(payload);
        setSubmitState({ loading: false, error: null, success: createdTask });
        setTimeout(() => {
          navigate('/my-events');
        }, 1500);
      }
    } catch (error) {
      console.error(isEdit ? 'Etkinlik güncelleme hatası:' : 'Etkinlik oluşturma hatası:', error);
      if (error.response?.data) {
        console.error('Backend Hata Detayı:', error.response.data);
      }
      setSubmitState({
        loading: false,
        error: isEdit 
          ? `Etkinlik güncellenirken bir hata oluştu: ${error.response?.data?.message || error.message}` 
          : 'Etkinlik oluşturulurken bir hata oluştu.',
        success: null,
      });
    }
  };

  return (
    <section className="w-full max-w-[1500px] mx-auto pb-12 px-4">
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 pb-6">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.25em] text-primary">
              {isEdit ? 'Etkinlik Düzenleme' : 'Yeni etkinlik'}
            </p>
            <h1 className="mt-2 text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
              {isEdit ? 'Etkinliği Düzenle' : 'Etkinlik Ekle'}
            </h1>
          </div>
          <div className="hidden sm:flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="group/cancel inline-flex items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-8 py-4 text-base font-black text-gray-700 shadow-sm hover:bg-gray-50 hover:text-primary hover:border-gray-300 hover:scale-[1.03] active:scale-95 transition-all duration-300"
            >
              <svg className="w-5 h-5 transition-transform duration-300 group-hover/cancel:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              İptal
            </button>
            <button
              type="submit"
              disabled={submitState.loading}
              className="group/save inline-flex items-center justify-center gap-2.5 rounded-full bg-primary px-8 py-4 text-base font-black text-white shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 hover:scale-[1.03] active:scale-95 transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <svg className="w-5 h-5 transition-transform duration-500 group-hover/save:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                {isEdit ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                )}
              </svg>
              {submitState.loading ? 'Kaydediliyor...' : isEdit ? 'Değişiklikleri Kaydet' : 'Etkinliği Kaydet'}
            </button>
          </div>
        </div>

        {/* Mobil için sticky butonlar */}
        <div className="sticky top-3 z-20 sm:hidden flex items-center gap-3 bg-white/95 backdrop-blur-xl border border-white/60 rounded-2xl px-4 py-3 shadow-lg">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 group/cancel inline-flex items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-3.5 text-sm font-black text-gray-700 shadow-sm hover:bg-gray-50 hover:text-primary hover:border-gray-300 active:scale-95 transition-all duration-300"
          >
            <svg className="w-4 h-4 transition-transform duration-300 group-hover/cancel:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            İptal
          </button>
          <button
            type="submit"
            disabled={submitState.loading}
            className="flex-1 group/save inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3.5 text-sm font-black text-white shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 active:scale-95 transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <svg className="w-4 h-4 transition-transform duration-500 group-hover/save:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              {isEdit ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              )}
            </svg>
            {submitState.loading ? 'Kaydediliyor...' : isEdit ? 'Kaydet' : 'Kaydet'}
          </button>
        </div>

        {submitState.success && (
          <div className="rounded-2xl border border-primary/20 bg-primary/5 px-6 py-4 text-sm font-bold text-gray-700 shadow-sm">
            {isEdit ? 'Etkinlik başarıyla güncellendi. Yönlendiriliyorsunuz...' : 'Etkinlik başarıyla oluşturuldu. Yönlendiriliyorsunuz...'}
          </div>
        )}

        {submitState.error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-4 text-sm font-bold text-red-600 shadow-sm">
            {submitState.error}
          </div>
        )}

        {/* 2-COLUMN STRETCH LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-6 items-stretch w-full">
          
          {/* LEFT COLUMN: GENEL BİLGİLER */}
          <div className="bg-white/80 backdrop-blur-md border border-white/60 rounded-3xl elevation-2 p-8 flex flex-col gap-6 h-full justify-between">
            <div className="flex flex-col gap-6">
              <h2 className="text-2xl font-black text-gray-900 border-b border-gray-100 pb-4 mb-2">Genel Bilgiler</h2>
              
              <div className="grid grid-cols-1 gap-6">
                <label className="group flex flex-col gap-2">
                  <span className="text-base font-extrabold text-gray-700 transition-all duration-300 group-focus-within:text-primary group-focus-within:translate-x-0.5">Başlık</span>
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleInputChange}
                    required
                    placeholder="Etkinliğinize harika bir başlık yazın..."
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-6 py-4.5 text-base font-medium text-gray-800 outline-none transition-all duration-300 hover:border-gray-300 hover:bg-gray-50/50 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 focus:scale-[1.002]"
                  />
                </label>

                <label className="group flex flex-col gap-2">
                  <span className="text-base font-extrabold text-gray-700 transition-all duration-300 group-focus-within:text-primary group-focus-within:translate-x-0.5">Açıklama</span>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    placeholder="Etkinliğinizin detaylarını, katılımcıların ne beklemesi gerektiğini buraya yazın..."
                    className="w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 px-6 py-4.5 text-base font-medium text-gray-800 outline-none transition-all duration-300 hover:border-gray-300 hover:bg-gray-50/50 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 focus:scale-[1.002]"
                  />
                </label>
              </div>

              {/* Tarih ve Saat */}
              <div className="pt-6 border-t border-gray-100">
                <p className="text-xs font-black uppercase tracking-wider text-gray-400 mb-4">Tarih ve Saat</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Tarih Seçici */}
                  <div className="flex flex-col gap-3.5 bg-gray-50/50 border border-gray-100 rounded-2xl p-5">
                    <div className="flex items-center">
                      <svg className="w-6 h-6 text-primary me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M4 10h16m-8-3V4M7 7V4m10 3V4M5 20h14a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Zm3-7h.01v.01H8V13Zm4 0h.01v.01H12V13Zm4 0h.01v.01H16V13Zm-8 4h.01v.01H8V17Zm4 0h.01v.01H12V17Zm4 0h.01v.01H16V17Z"/>
                      </svg>
                      <span className="text-heading text-lg font-bold text-gray-800">{formatDateForDisplay(dateTime.date) || 'Tarih seçilmedi'}</span>
                    </div>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => {
                          setCalendarOpen(open => !open);
                          setTimeOpen(false);
                        }}
                        className="inline-flex items-center justify-center w-full text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 hover:text-gray-900 focus:ring-4 focus:ring-primary/10 font-bold leading-5 rounded-xl text-base px-6 py-4.5 focus:outline-none transition-all"
                      >
                        Tarih Seç
                      </button>

                      {calendarOpen && (
                        <div className="absolute left-0 top-[calc(100%+0.5rem)] z-40 w-full max-w-[340px] rounded-2xl border border-white/60 bg-white/95 backdrop-blur-xl p-5 shadow-2xl elevation-3">
                          <div className="mb-4 flex items-center justify-between">
                            <button
                              type="button"
                              onClick={() => changeCalendarMonth(-1)}
                              className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
                              aria-label="Önceki ay"
                            >
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                              </svg>
                            </button>
                            <p className="text-sm font-extrabold text-gray-900 capitalize">{monthLabel}</p>
                            <button
                              type="button"
                              onClick={() => changeCalendarMonth(1)}
                              className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
                              aria-label="Sonraki ay"
                            >
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                              </svg>
                            </button>
                          </div>

                          <div className="grid grid-cols-7 gap-1 text-center">
                            {dayLabels.map(day => (
                              <span key={day} className="py-2 text-[10px] font-black uppercase text-gray-400">{day}</span>
                            ))}
                            {calendarDays.map(day => {
                              const isSelected = day.value === dateTime.date;
                              const todayStr = formatDateValue(new Date());
                              const isPast = day.value < todayStr;
                              const isToday = day.value === todayStr;

                              return (
                                <button
                                  key={day.value}
                                  type="button"
                                  disabled={isPast}
                                  onClick={() => handleDateSelect(day.value)}
                                  className={`flex aspect-square items-center justify-center rounded-xl text-sm font-extrabold transition-all ${
                                    isPast
                                      ? 'text-gray-300/50 cursor-not-allowed opacity-30'
                                      : isSelected
                                        ? 'bg-primary text-white shadow-md shadow-primary/20 scale-105'
                                        : day.isCurrentMonth
                                          ? 'text-gray-700 hover:bg-gray-100 hover:scale-105'
                                          : 'text-gray-300'
                                  } ${isToday && !isSelected ? 'ring-2 ring-primary/25' : ''}`}
                                >
                                  {day.day}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Saat Seçici */}
                  <div className="flex flex-col gap-3.5 bg-gray-50/50 border border-gray-100 rounded-2xl p-5">
                    <div className="flex items-center">
                      <svg className="w-6 h-6 text-primary me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                      </svg>
                      <span className="text-heading text-lg font-bold text-gray-800">{dateTime.time ? convertTo12Hour(dateTime.time) : 'Saat seçilmedi'}</span>
                    </div>
                    <input
                      type="time"
                      value={dateTime.time}
                      onChange={(e) => updateStartDate({ ...dateTime, time: e.target.value })}
                      className="block w-full px-6 py-4 bg-white border border-gray-200 text-gray-800 font-bold text-base rounded-xl focus:ring-primary focus:border-primary shadow-sm outline-none transition-all"
                    />
                  </div>

                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-100">
                <label className="group flex flex-col gap-2">
                  <span className="text-base font-extrabold text-gray-700 transition-all duration-300 group-focus-within:text-primary group-focus-within:translate-x-0.5">Görünürlük</span>
                  <select
                    name="visibility"
                    value={form.visibility}
                    onChange={handleInputChange}
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-6 py-4.5 text-base font-bold text-gray-800 outline-none transition-all duration-300 hover:border-gray-300 hover:bg-gray-50/50 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
                  >
                    <option value="PUBLIC">PUBLIC (Herkes Görebilir)</option>
                    <option value="PRIVATE">PRIVATE (Gizli Etkinlik)</option>
                  </select>
                </label>

                <label className="group flex flex-col gap-2.5" htmlFor="multiple_files">
                  <span className="text-base font-extrabold text-gray-700 transition-all duration-300 group-focus-within:text-primary group-focus-within:translate-x-0.5">Medya ve Dosyalar</span>
                  <input
                    id="multiple_files"
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="block w-full cursor-pointer rounded-2xl border border-gray-200 bg-gray-50 px-6 py-4 text-base font-medium text-gray-700 outline-none transition-all duration-300 file:mr-4 file:rounded-xl file:border-0 file:bg-primary file:px-5 file:py-2 file:text-xs file:font-black file:text-white file:transition-all hover:file:scale-105 active:file:scale-95 hover:bg-gray-100 shadow-sm focus:border-primary"
                  />
                  {form.files.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {form.files.map(file => (
                        <span key={`${file.name}-${file.size}`} className="rounded-full bg-primary/10 px-4 py-1.5 text-xs font-black text-primary">
                          {file.name}
                        </span>
                      ))}
                    </div>
                  )}
                </label>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: KONUM VE HARİTA (HEIGHT MATCHED) */}
          <div className="bg-white/80 backdrop-blur-md border border-white/60 rounded-3xl elevation-2 p-8 flex flex-col gap-6 h-full">
            <div className="flex flex-col gap-2 border-b border-gray-100 pb-4 mb-2">
              <h2 className="text-2xl font-black text-gray-900">Konum ve Harita</h2>
              <p className="text-gray-400 text-sm font-medium">Harita üzerinden tıklayarak konum seçin</p>
            </div>

            <div className="flex flex-col gap-4">
              <button
                type="button"
                onClick={handleUseCurrentLocation}
                disabled={locating}
                className="w-full px-6 py-4 bg-primary text-white font-black text-base rounded-2xl shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className={`w-5 h-5 ${locating ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {locating ? 'Konum Alınıyor...' : 'Şu Anki Konumumu Kullan'}
              </button>

              <div className="grid grid-cols-2 gap-4">
                <label className="group flex flex-col gap-1.5">
                  <span className="text-xs font-black text-gray-400 uppercase tracking-wider">Enlem (Lat)</span>
                  <input
                    type="number"
                    name="latitude"
                    value={form.latitude}
                    onChange={handleInputChange}
                    required
                    step="any"
                    placeholder="Enlem"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-bold text-gray-800 outline-none transition-all duration-300 hover:border-gray-300 hover:bg-gray-50/50 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
                  />
                </label>

                <label className="group flex flex-col gap-1.5">
                  <span className="text-xs font-black text-gray-400 uppercase tracking-wider">Boylam (Lng)</span>
                  <input
                    type="number"
                    name="longitude"
                    value={form.longitude}
                    onChange={handleInputChange}
                    required
                    step="any"
                    placeholder="Boylam"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-bold text-gray-800 outline-none transition-all duration-300 hover:border-gray-300 hover:bg-gray-50/50 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
                  />
                </label>
              </div>
            </div>

            {/* HARİTA (DYNAMIC FLEX HEIGHT MATCHED) */}
            <div className="flex-1 min-h-[320px] rounded-2xl overflow-hidden border border-white/60 shadow-inner relative z-0">
              <MapContainer
                center={selectedPosition.latitude != null && selectedPosition.longitude != null
                  ? [selectedPosition.latitude, selectedPosition.longitude]
                  : defaultCenter}
                zoom={selectedPosition.latitude != null && selectedPosition.longitude != null ? 13 : 10}
                scrollWheelZoom
                className="w-full h-full"
                style={{
                  height: '100%',
                  width: '100%',
                  filter: 'hue-rotate(-10deg) saturate(1.25) contrast(1.05) brightness(1.04)',
                }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://carto.com/">Carto</a>'
                  url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                />
                <MapCenterUpdater position={selectedPosition} />
                <LocationPicker position={selectedPosition} onSelect={handleLocationSelect} />
              </MapContainer>
            </div>
          </div>
          
        </div>
      </form>
    </section>
  );
};

export default AddEventPage;
