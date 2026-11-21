import React, { useState } from 'react';
import { CheckCircle2, Clock, ExternalLink, Mail, MapPin, Phone } from 'lucide-react';
import { ALL_CLASS_LEVELS } from '../../data/demoData';
import { TRANSLATIONS } from '../../data/i18n';
import type {
  ContactInquiry,
  ContactMessageRecord,
  LanguageCode,
  SiteContentConfig,
} from '../../types/school';
import { validateContactInquiry } from '../../utils/schoolLogic';

interface ContactPageProps {
  lang: LanguageCode;
  siteConfig: SiteContentConfig;
  onAddInquiry: (record: ContactMessageRecord) => void;
}

const INITIAL_FORM: ContactInquiry = {
  fullName: '',
  email: '',
  phone: '',
  classApplying: 'Class 1',
  subject: '',
  message: '',
};

const GOOGLE_MAPS_DIRECT_URL =
  'https://www.google.com/maps/search/?api=1&query=Nikhura%2C+Buxar%2C+Bihar%2C+India';

export const ContactPage: React.FC<ContactPageProps> = ({
  lang,
  siteConfig,
  onAddInquiry,
}) => {
  const t = TRANSLATIONS[lang];
  const [form, setForm] = useState<ContactInquiry>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof ContactInquiry, string>>>({});
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateContactInquiry(form);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }
    setErrors({});
    const refNo = `MCA-ENQ-${Math.floor(10000 + Math.random() * 89999)}`;
    onAddInquiry({
      ...form,
      id: `inq-${Date.now()}`,
      referenceNo: refNo,
      submittedAt: new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
    });
    setSubmittedRef(refNo);
    setForm(INITIAL_FORM);
  };

  return (
    <div className="bg-white text-slate-900">
      <section className="bg-royal-900 text-white py-14 border-b border-[#D4AF37]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-xs font-semibold tracking-wide text-[#D4AF37]">
            {t.contact.kicker}
          </div>
          <h1 className="mt-2 font-display text-3xl sm:text-4xl font-bold tracking-tight">
            {t.contact.title}
          </h1>
          <p className="mt-3 text-slate-200 text-base max-w-2xl leading-relaxed">
            {t.contact.subtitle}
          </p>
        </div>
      </section>

      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Campus Directory & Zero-Budget Location Link */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-xl border border-slate-200 bg-[#F8FAFC] space-y-5">
              <h2 className="font-display text-2xl font-bold text-royal-900">
                {t.contact.deskTitle}
              </h2>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#9E701B] shrink-0 mt-0.5" aria-hidden="true" />
                <div className="text-sm">
                  <div className="font-semibold text-royal-900">{t.contact.addressLabel}</div>
                  <div className="text-slate-700 mt-0.5 leading-relaxed">
                    {lang === 'hi' ? siteConfig.addressHi : siteConfig.address}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#9E701B] shrink-0 mt-0.5" aria-hidden="true" />
                <div className="text-sm">
                  <div className="font-semibold text-royal-900">{t.contact.phoneLabel}</div>
                  <div className="text-slate-700 mt-0.5 tabular-nums">{siteConfig.phone}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#9E701B] shrink-0 mt-0.5" aria-hidden="true" />
                <div className="text-sm">
                  <div className="font-semibold text-royal-900">{t.contact.emailLabel}</div>
                  <div className="text-slate-700 mt-0.5 break-all">{siteConfig.email}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#9E701B] shrink-0 mt-0.5" aria-hidden="true" />
                <div className="text-sm">
                  <div className="font-semibold text-royal-900">{t.contact.hoursLabel}</div>
                  <div className="text-slate-700 mt-0.5 tabular-nums">{siteConfig.officeHours}</div>
                </div>
              </div>
            </div>

            {/* Zero-Budget Google Maps Direct Link Card (No Paid API Keys) */}
            <div className="p-6 rounded-xl border border-slate-200 bg-white space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-royal-900 text-[#D4AF37] flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-royal-900">
                    {t.contact.mapsTitle}
                  </h3>
                  <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                    {t.contact.mapsDescription}
                  </p>
                </div>
              </div>
              <a
                href={GOOGLE_MAPS_DIRECT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg bg-royal-900 text-white text-xs font-semibold hover:bg-royal-800 transition-colors"
              >
                {t.contact.openInMaps}
                <ExternalLink className="w-3.5 h-3.5 text-[#D4AF37]" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Contact / Admissions Form */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-xl border border-slate-200 bg-white">
              <h2 className="font-display text-2xl font-bold text-royal-900">
                {t.contact.formTitle}
              </h2>
              <p className="mt-1 text-sm text-slate-600">{t.contact.formSubtitle}</p>

              {submittedRef && (
                <div
                  role="status"
                  className="mt-5 p-4 rounded-xl bg-royal-50 border border-royal-900/25 flex items-start gap-3"
                >
                  <CheckCircle2 className="w-5 h-5 text-royal-900 shrink-0 mt-0.5" aria-hidden="true" />
                  <div className="text-sm">
                    <div className="font-semibold text-royal-900">
                      {lang === 'hi' ? 'संदेश दर्ज हो गया' : 'Enquiry Recorded'} (Ref:{' '}
                      <span className="font-mono">{submittedRef}</span>)
                    </div>
                    <p className="text-slate-600 mt-0.5">
                      {lang === 'hi'
                        ? 'आपका संदेश स्कूल के डेमो इनबॉक्स में सेव कर लिया गया है।'
                        : 'Your inquiry has been saved to the school Admin Panel inbox.'}
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="contact-fullname"
                      className="block text-xs font-semibold text-royal-900 mb-1.5"
                    >
                      {lang === 'hi' ? 'अभिभावक / विद्यार्थी का नाम' : 'Parent / Guardian Full Name'}
                    </label>
                    <input
                      id="contact-fullname"
                      type="text"
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                      placeholder="e.g. Rajesh Tiwari"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-royal-900/25 focus:border-royal-900"
                    />
                    {errors.fullName && (
                      <p className="mt-1 text-xs text-red-700">{errors.fullName}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="contact-phone"
                      className="block text-xs font-semibold text-royal-900 mb-1.5"
                    >
                      {lang === 'hi' ? 'मोबाइल नंबर' : 'Contact Phone Number'}
                    </label>
                    <input
                      id="contact-phone"
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="10-digit mobile number"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-royal-900/25 focus:border-royal-900"
                    />
                    {errors.phone && <p className="mt-1 text-xs text-red-700">{errors.phone}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="contact-email"
                      className="block text-xs font-semibold text-royal-900 mb-1.5"
                    >
                      {lang === 'hi' ? 'ईमेल पता' : 'Email Address'}
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="name@example.com"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-royal-900/25 focus:border-royal-900"
                    />
                    {errors.email && <p className="mt-1 text-xs text-red-700">{errors.email}</p>}
                  </div>

                  <div>
                    <label
                      htmlFor="contact-class"
                      className="block text-xs font-semibold text-royal-900 mb-1.5"
                    >
                      {lang === 'hi' ? 'कक्षा चुनें' : 'Class Applying For'}
                    </label>
                    <select
                      id="contact-class"
                      value={form.classApplying}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          classApplying: e.target.value as ContactInquiry['classApplying'],
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-royal-900/25 focus:border-royal-900"
                    >
                      {ALL_CLASS_LEVELS.map((cls) => (
                        <option key={cls} value={cls}>
                          {cls}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="contact-subject"
                    className="block text-xs font-semibold text-royal-900 mb-1.5"
                  >
                    {lang === 'hi' ? 'विषय' : 'Subject'}
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    placeholder="e.g. Admission Enquiry for 2026–27 Session"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-royal-900/25 focus:border-royal-900"
                  />
                  {errors.subject && <p className="mt-1 text-xs text-red-700">{errors.subject}</p>}
                </div>

                <div>
                  <label
                    htmlFor="contact-message"
                    className="block text-xs font-semibold text-royal-900 mb-1.5"
                  >
                    {lang === 'hi' ? 'संदेश' : 'Message'}
                  </label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Share your questions regarding admissions, transport, or curriculum..."
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-royal-900/25 focus:border-royal-900"
                  />
                  {errors.message && <p className="mt-1 text-xs text-red-700">{errors.message}</p>}
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 rounded-lg bg-royal-900 text-white text-sm font-semibold hover:bg-royal-800 transition-colors cursor-pointer"
                >
                  {t.contact.submitBtn}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
