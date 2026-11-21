import React, { useState } from 'react';
import { CheckCircle2, Clock, Mail } from 'lucide-react';
import { ALL_CLASS_LEVELS } from '../../data/demoData';
import type { ContactInquiry } from '../../types/school';
import { validateContactInquiry } from '../../utils/schoolLogic';

const INITIAL_FORM: ContactInquiry = {
  fullName: '',
  email: '',
  phone: '',
  classApplying: 'Class 1',
  subject: '',
  message: '',
};

export const ContactPage: React.FC = () => {
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
    setSubmittedRef(`MCA-ENQ-${Math.floor(10000 + Math.random() * 89999)}`);
    setForm(INITIAL_FORM);
  };

  return (
    <div className="bg-white text-slate-900">
      <section className="bg-[#0F2859] text-white py-14 border-b border-[#D4AF37]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-xs font-semibold tracking-wide text-[#D4AF37]">
            Admissions &amp; Campus Office
          </div>
          <h1 className="mt-2 font-display text-3xl sm:text-4xl font-bold tracking-tight">
            Contact Miraculous Children Academy
          </h1>
          <p className="mt-3 text-slate-200 text-base max-w-2xl leading-relaxed">
            Reach our admissions office for Nursery to Class 10 seat availability, campus visits, or parent support inquiries.
          </p>
        </div>
      </section>

      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Campus Directory */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-xl border border-slate-200 bg-[#F8FAFC] space-y-5">
              <h2 className="font-display text-2xl font-bold text-[#0F2859]">
                Admissions &amp; Office Desk
              </h2>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#9E701B] shrink-0 mt-0.5" aria-hidden="true" />
                <div className="text-sm">
                  <div className="font-semibold text-[#0F2859]">Official Email</div>
                  <div className="text-slate-600 mt-0.5">admissions@miraculousacademy.edu.in</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#9E701B] shrink-0 mt-0.5" aria-hidden="true" />
                <div className="text-sm">
                  <div className="font-semibold text-[#0F2859]">Office Hours</div>
                  <div className="text-slate-600 mt-0.5 tabular-nums">
                    Monday – Saturday · 08:30 AM – 03:00 PM
                  </div>
                </div>
              </div>

              <p className="pt-3 border-t border-slate-200 text-xs text-slate-600 leading-relaxed">
                Please submit your questions using the enquiry form alongside, and our admissions office will follow up promptly.
              </p>
            </div>
          </div>

          {/* Admissions / Contact Form */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-xl border border-slate-200 bg-white">
              <h2 className="font-display text-2xl font-bold text-[#0F2859]">
                Admissions &amp; General Enquiry Form
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Complete the form below and our Admissions Coordinator will respond within one working day.
              </p>

              {submittedRef && (
                <div
                  role="status"
                  className="mt-5 p-4 rounded-xl bg-[#F0F4FB] border border-[#0F2859]/25 flex items-start gap-3"
                >
                  <CheckCircle2 className="w-5 h-5 text-[#0F2859] shrink-0 mt-0.5" aria-hidden="true" />
                  <div className="text-sm">
                    <div className="font-semibold text-[#0F2859]">
                      Enquiry Recorded (Demo Reference: <span className="font-mono">{submittedRef}</span>)
                    </div>
                    <p className="text-slate-600 mt-0.5">
                      Thank you for contacting Miraculous Children Academy. In production, this inquiry routes directly to the school admissions queue.
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-fullname" className="block text-xs font-semibold text-[#0F2859] mb-1.5">
                      Parent / Guardian Full Name
                    </label>
                    <input
                      id="contact-fullname"
                      type="text"
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                      placeholder="e.g. Priya Menon"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2859]/25 focus:border-[#0F2859]"
                    />
                    {errors.fullName && (
                      <p className="mt-1 text-xs text-red-700">{errors.fullName}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="contact-phone" className="block text-xs font-semibold text-[#0F2859] mb-1.5">
                      Contact Phone Number
                    </label>
                    <input
                      id="contact-phone"
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="10-digit mobile number"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2859]/25 focus:border-[#0F2859]"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-xs text-red-700">{errors.phone}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-email" className="block text-xs font-semibold text-[#0F2859] mb-1.5">
                      Email Address
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="name@example.com"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2859]/25 focus:border-[#0F2859]"
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-700">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="contact-class" className="block text-xs font-semibold text-[#0F2859] mb-1.5">
                      Class Applying For
                    </label>
                    <select
                      id="contact-class"
                      value={form.classApplying}
                      onChange={(e) =>
                        setForm({ ...form, classApplying: e.target.value as ContactInquiry['classApplying'] })
                      }
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#0F2859]/25 focus:border-[#0F2859]"
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
                  <label htmlFor="contact-subject" className="block text-xs font-semibold text-[#0F2859] mb-1.5">
                    Subject
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    placeholder="e.g. Admission Enquiry for 2027–28 Session"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2859]/25 focus:border-[#0F2859]"
                  />
                  {errors.subject && (
                    <p className="mt-1 text-xs text-red-700">{errors.subject}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-xs font-semibold text-[#0F2859] mb-1.5">
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Share your questions regarding admissions, transport, or curriculum..."
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2859]/25 focus:border-[#0F2859]"
                  />
                  {errors.message && (
                    <p className="mt-1 text-xs text-red-700">{errors.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 rounded-lg bg-[#0F2859] text-white text-sm font-semibold hover:bg-[#17387A] transition-colors cursor-pointer"
                >
                  Submit Enquiry
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
