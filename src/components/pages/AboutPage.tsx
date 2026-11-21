import React from 'react';
import { Award, Compass, GraduationCap, History } from 'lucide-react';
import { SCHOOL_HISTORY_MILESTONES, SCHOOL_IMAGES } from '../../data/demoData';
import { TRANSLATIONS } from '../../data/i18n';
import type {
  LanguageCode,
  PageId,
  SiteContentConfig,
  TeacherProfile,
} from '../../types/school';
import { ImageWithFallback } from '../common/ImageWithFallback';

interface AboutPageProps {
  lang: LanguageCode;
  siteConfig: SiteContentConfig;
  teachers: TeacherProfile[];
  onNavigate: (page: PageId) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({
  lang,
  siteConfig,
  teachers,
  onNavigate,
}) => {
  const t = TRANSLATIONS[lang];

  return (
    <div className="bg-white text-slate-900">
      <section className="bg-royal-900 text-white py-14 border-b border-[#D4AF37]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-xs font-semibold tracking-wide text-[#D4AF37]">
            {t.about.kicker}
          </div>
          <h1 className="mt-2 font-display text-3xl sm:text-4xl font-bold tracking-tight max-w-2xl text-balance">
            {t.about.title}
          </h1>
          <p className="mt-4 text-slate-200 text-base max-w-2xl leading-relaxed">
            {t.about.subtitle}
          </p>
        </div>
      </section>

      <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Vision & Mission */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 rounded-xl border border-slate-200 bg-[#F8FAFC]">
            <Compass className="w-6 h-6 text-[#9E701B]" aria-hidden="true" />
            <h2 className="mt-4 font-display text-2xl font-bold text-royal-900">
              {t.about.visionTitle}
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
              {lang === 'hi'
                ? 'निखुरा, बक्सर एवं आसपास के सभी विद्यार्थियों में वैज्ञानिक दृष्टिकोण, मजबूत भाषा कौशल (हिंदी व अंग्रेजी), तथा नैतिक मूल्यों का विकास करना।'
                : 'To cultivate curious, articulate, and ethically grounded learners across Nikhura and Buxar equipped with strong literacy, scientific reasoning, and civic empathy.'}
            </p>
          </div>
          <div className="p-8 rounded-xl border border-slate-200 bg-[#F8FAFC]">
            <Award className="w-6 h-6 text-[#9E701B]" aria-hidden="true" />
            <h2 className="mt-4 font-display text-2xl font-bold text-royal-900">
              {t.about.missionTitle}
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
              {lang === 'hi'
                ? 'नर्सरी से कक्षा 10 तक एनसीईआरटी व सीबीएसई पाठ्यक्रम को छोटे वर्गों, प्रायोगिक शिक्षा, पुस्तकालय और डिजिटल स्टूडेंट कॉर्नर के माध्यम से हर बच्चे तक पहुँचाना।'
                : 'To deliver CBSE and NCERT curriculum from Nursery to Class 10 in attentive sections combining laboratory inquiry, library reading, athletics, and accessible digital resources.'}
            </p>
          </div>
        </div>

        {/* School History Timeline */}
        <div className="space-y-6">
          <div>
            <div className="text-xs font-semibold tracking-wide text-[#9E701B] flex items-center gap-1.5">
              <History className="w-4 h-4" aria-hidden="true" />
              {t.about.historyKicker}
            </div>
            <h2 className="mt-1.5 font-display text-3xl font-bold text-royal-900">
              {t.about.historyTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {SCHOOL_HISTORY_MILESTONES.map((step) => (
              <div
                key={step.year}
                className="p-6 rounded-xl border border-slate-200 bg-white flex flex-col justify-between"
              >
                <div>
                  <div className="font-mono text-lg font-bold text-[#9E701B] tabular-nums">
                    {step.year}
                  </div>
                  <h3 className="mt-2 font-display text-lg font-bold text-royal-900">
                    {lang === 'hi' ? step.titleHi : step.titleEn}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                    {lang === 'hi' ? step.detailHi : step.detailEn}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Principal's Message */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          <div className="lg:col-span-6 rounded-xl overflow-hidden border border-slate-200 aspect-[4/3] lg:aspect-auto">
            <ImageWithFallback
              src={SCHOOL_IMAGES.library}
              alt="Miraculous Children Academy Reference Library"
              fallbackTitle="Reference Library"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="lg:col-span-6 flex flex-col justify-center space-y-5">
            <div className="text-xs font-semibold tracking-wide text-[#9E701B]">
              {t.about.principalKicker}
            </div>
            <h2 className="font-display text-3xl font-bold text-royal-900">
              {t.about.principalTitle}
            </h2>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              {lang === 'hi' ? siteConfig.principalMessageHi : siteConfig.principalMessage}
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              {lang === 'hi' ? siteConfig.welcomeMessageHi : siteConfig.welcomeMessage}
            </p>
            <div className="pt-3 border-t border-slate-200">
              <div className="font-semibold text-royal-900">{siteConfig.principalName}</div>
              <div className="text-xs text-slate-500">{siteConfig.principalQualification}</div>
            </div>
          </div>
        </div>

        {/* Principal & Teachers Directory */}
        <div className="space-y-6">
          <div>
            <div className="text-xs font-semibold tracking-wide text-[#9E701B] flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4" aria-hidden="true" />
              {t.about.teachersKicker}
            </div>
            <h2 className="mt-1.5 font-display text-3xl font-bold text-royal-900">
              {t.about.teachersTitle}
            </h2>
            <p className="mt-1 text-sm text-slate-600">{t.about.teachersSubtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teachers.map((teacher) => (
              <div
                key={teacher.id}
                className="p-6 rounded-xl border border-slate-200 bg-[#F8FAFC] space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-display text-lg font-bold text-royal-900">
                      {lang === 'hi' ? teacher.nameHi || teacher.name : teacher.name}
                    </h3>
                    <div className="text-xs font-semibold text-[#9E701B]">
                      {lang === 'hi' ? teacher.roleHi || teacher.role : teacher.role}
                    </div>
                  </div>
                  <span className="text-xs font-mono text-slate-500 tabular-nums shrink-0">
                    {teacher.experienceYears} yrs
                  </span>
                </div>
                <dl className="pt-3 border-t border-slate-200/80 space-y-1.5 text-xs text-slate-600">
                  <div>
                    <dt className="inline font-semibold text-royal-900">
                      {lang === 'hi' ? 'योग्यता: ' : 'Qualification: '}
                    </dt>
                    <dd className="inline">{teacher.qualification}</dd>
                  </div>
                  <div>
                    <dt className="inline font-semibold text-royal-900">
                      {lang === 'hi' ? 'विषय: ' : 'Subjects: '}
                    </dt>
                    <dd className="inline">{teacher.subjects}</dd>
                  </div>
                  <div>
                    <dt className="inline font-semibold text-royal-900">
                      {lang === 'hi' ? 'कक्षाएं: ' : 'Classes: '}
                    </dt>
                    <dd className="inline">{teacher.classesHandled}</dd>
                  </div>
                </dl>
              </div>
            ))}
          </div>
        </div>

        <div className="p-8 rounded-xl bg-royal-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h3 className="font-display text-2xl font-bold">
              {lang === 'hi' ? siteConfig.admissionsBannerHi : siteConfig.admissionsBanner}
            </h3>
            <p className="mt-1 text-sm text-slate-200">
              {lang === 'hi' ? siteConfig.addressHi : siteConfig.address}
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('classes')}
              className="px-5 py-2.5 rounded-lg bg-white text-royal-900 text-sm font-semibold hover:bg-slate-100 transition-colors cursor-pointer"
            >
              {t.nav.classes}
            </button>
            <button
              type="button"
              onClick={() => onNavigate('contact')}
              className="px-5 py-2.5 rounded-lg bg-[#B88624] text-white text-sm font-semibold hover:bg-[#9E701B] transition-colors cursor-pointer"
            >
              {t.nav.contact}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
