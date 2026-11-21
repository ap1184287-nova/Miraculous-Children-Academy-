import React, { useId, useState, useEffect } from 'react';
import { Check, Palette, RotateCcw } from 'lucide-react';
import type { LanguageCode } from '../../types/school';
import {
  BRAND_COLOR_PRESETS,
  computeContrastWithWhite,
  DEFAULT_PRIMARY_COLOR,
  normalizeHexColor,
} from '../../utils/schoolLogic';

interface BrandColorPickerCardProps {
  lang: LanguageCode;
  currentColor: string;
  onChangeColor: (nextHex: string) => void;
  onResetDefault: () => void;
}

export const BrandColorPickerCard: React.FC<BrandColorPickerCardProps> = ({
  lang,
  currentColor,
  onChangeColor,
  onResetDefault,
}) => {
  const pickerId = useId();
  const hexInputId = useId();
  const normalized = normalizeHexColor(currentColor, DEFAULT_PRIMARY_COLOR);
  const [hexDraft, setHexDraft] = useState(normalized);

  useEffect(() => {
    setHexDraft(normalized);
  }, [normalized]);

  const contrastRatio = computeContrastWithWhite(normalized);
  const isAccessibleContrast = contrastRatio >= 4.5;
  const isDefaultRoyal = normalized === DEFAULT_PRIMARY_COLOR;

  const handleHexChange = (raw: string) => {
    setHexDraft(raw.toUpperCase());
    if (/^#?[0-9A-Fa-f]{6}$/.test(raw.trim())) {
      onChangeColor(normalizeHexColor(raw));
    }
  };

  return (
    <section
      aria-label={lang === 'hi' ? 'ब्रांड थीम कलर पिकर' : 'Brand Theme Color Picker'}
      className="p-6 rounded-xl bg-white border border-slate-200 space-y-4"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div
            className="w-10 h-10 rounded-lg bg-royal-900 text-[#D4AF37] flex items-center justify-center shrink-0"
            aria-hidden="true"
          >
            <Palette className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display text-lg font-bold text-royal-900">
              {lang === 'hi' ? 'प्रमुख ब्रांड रंग (Brand Theme Color)' : 'Primary Brand Color'}
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              {lang === 'hi'
                ? 'रंग चुनते ही पूरी वेबसाइट (हेडर, फुटर, बटन, लोगो और पोर्टल) तुरंत अपडेट हो जाएगा।'
                : 'Choose a custom shade or preset—changes apply live across headers, buttons, crest, and footer.'}
            </p>
          </div>
        </div>

        {!isDefaultRoyal && (
          <button
            type="button"
            onClick={onResetDefault}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-royal-900 hover:bg-royal-50 transition-colors cursor-pointer shrink-0 self-start sm:self-center"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            {lang === 'hi' ? 'रॉयल ब्लू रीसेट करें' : 'Reset to Royal Blue'}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center pt-2 border-t border-slate-100">
        {/* Custom Native Picker + Hex Input */}
        <div className="md:col-span-5 flex items-center gap-3">
          <label htmlFor={pickerId} className="sr-only">
            {lang === 'hi' ? 'ब्रांड रंग चुनें' : 'Pick primary brand color'}
          </label>
          <input
            id={pickerId}
            type="color"
            value={normalized}
            onChange={(e) => onChangeColor(normalizeHexColor(e.target.value))}
            className="w-12 h-11 p-1 rounded-lg border border-slate-300 bg-white cursor-pointer shrink-0"
          />
          <div className="flex-1 min-w-0">
            <label
              htmlFor={hexInputId}
              className="block text-[11px] font-semibold text-slate-500 mb-1"
            >
              {lang === 'hi' ? 'हेक्स कोड (Hex Shade)' : 'Custom Hex Shade'}
            </label>
            <input
              id={hexInputId}
              type="text"
              value={hexDraft}
              maxLength={7}
              onChange={(e) => handleHexChange(e.target.value)}
              placeholder="#0F2859"
              className="w-full px-3 py-1.5 rounded-lg border border-slate-300 font-mono text-sm text-royal-900 focus:outline-none focus:ring-2 focus:ring-royal-900/25 focus:border-royal-900"
            />
          </div>
        </div>

        {/* Preset Swatches */}
        <div className="md:col-span-7 space-y-1.5">
          <div className="text-[11px] font-semibold text-slate-500">
            {lang === 'hi' ? 'त्वरित स्कूल थीम शेड्स' : 'Curated School Color Presets'}
          </div>
          <div className="flex flex-wrap gap-2">
            {BRAND_COLOR_PRESETS.map((preset) => {
              const selected = normalized === preset.hex;
              return (
                <button
                  key={preset.hex}
                  type="button"
                  onClick={() => onChangeColor(preset.hex)}
                  aria-pressed={selected}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
                    selected
                      ? 'border-royal-900 bg-royal-50 text-royal-900'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className="w-4 h-4 rounded flex items-center justify-center border border-black/15 shrink-0"
                    style={{ backgroundColor: preset.hex }}
                  >
                    {selected && <Check className="w-3 h-3 text-white" />}
                  </span>
                  <span>{lang === 'hi' ? preset.labelHi : preset.labelEn}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Live Preview & Contrast Check */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-3 border-t border-slate-100 text-xs">
        <div className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="inline-block w-3.5 h-3.5 rounded-sm bg-royal-900 border border-black/10"
          />
          <span className="text-slate-600">
            {lang === 'hi' ? 'सक्रिय थीम:' : 'Active Brand Shade:'}{' '}
            <strong className="font-mono text-royal-900">{normalized}</strong>
          </span>
        </div>
        <div className={isAccessibleContrast ? 'text-emerald-700 font-medium' : 'text-amber-700 font-medium'}>
          {isAccessibleContrast
            ? lang === 'hi'
              ? `सफेद टेक्स्ट के साथ स्पष्ट कंट्रास्ट (${contrastRatio}:1)`
              : `Readable white-text contrast (${contrastRatio}:1 WCAG AA)`
            : lang === 'hi'
            ? `कम कंट्रास्ट (${contrastRatio}:1) — गहरा रंग चुनें`
            : `Low white-text contrast (${contrastRatio}:1) — darker shade recommended`}
        </div>
      </div>
    </section>
  );
};
