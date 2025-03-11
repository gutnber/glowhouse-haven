import { useLanguage } from "@/contexts/LanguageContext";
import { Building, CheckCircle, Compass, Eye, Heart, Shield, Users } from "lucide-react";
import GradientBackground from "@/components/background/GradientBackground";

export const InfoSections = () => {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-16 max-w-7xl mx-auto px-4">
      {/* Mission and Vision Section */}
      <div className="relative overflow-hidden rounded-3xl shadow-2xl">
        <div className="absolute inset-0 z-10">
          <GradientBackground 
            colors={[
              { r: 234, g: 88, b: 12, a: 0.5 }, // orange-600 with reduced opacity
              { r: 194, g: 65, b: 12, a: 0.4 }, // orange-700 with reduced opacity
              { r: 154, g: 52, b: 18, a: 0.3 }, // orange-800 with reduced opacity
              { r: 194, g: 65, b: 12, a: 0.4 }, // orange-700 with reduced opacity
            ]}
          />
        </div>
        <div className="relative z-20 p-8 md:p-12 flex flex-col md:flex-row gap-8 items-center">
          <div className="flex-1 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-500/30 rounded-full">
                <Compass className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-white">{t('mission')}</h3>
            </div>
            <p className="text-white/90 text-lg leading-relaxed">
              {t('missionText')}
            </p>
          </div>
          <div className="flex-1 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-500/30 rounded-full">
                <Eye className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-white">{t('vision')}</h3>
            </div>
            <p className="text-white/90 text-lg leading-relaxed">
              {t('visionText')}
            </p>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="relative overflow-hidden rounded-3xl shadow-2xl">
        <div className="absolute inset-0 z-10">
          <GradientBackground 
            colors={[
              { r: 217, g: 119, b: 6, a: 0.5 }, // yellow-600 with reduced opacity
              { r: 180, g: 83, b: 9, a: 0.4 }, // amber-700 with reduced opacity
              { r: 146, g: 64, b: 14, a: 0.3 }, // amber-800 with reduced opacity
              { r: 180, g: 83, b: 9, a: 0.4 }, // amber-700 with reduced opacity
            ]}
          />
        </div>
        <div className="relative z-20 p-8 md:p-12 space-y-8">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-white">{t('services')}</h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h4 className="text-2xl font-semibold text-white flex items-center gap-2">
                <Users className="h-6 w-6" /> {t('forOwners')}
              </h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-white shrink-0 mt-1" />
                  <span className="text-white/90 text-lg">{t('propertyMarketingSale')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-white shrink-0 mt-1" />
                  <span className="text-white/90 text-lg">{t('propertyMarketingRent')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-white shrink-0 mt-1" />
                  <span className="text-white/90 text-lg">{t('propertyManagementRent')}</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-6">
              <h4 className="text-2xl font-semibold text-white flex items-center gap-2">
                <Building className="h-6 w-6" /> {t('forBuyers')}
              </h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-white shrink-0 mt-1" />
                  <span className="text-white/90 text-lg">{t('propertyOfferSale')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-white shrink-0 mt-1" />
                  <span className="text-white/90 text-lg">{t('propertyOfferRent')}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="relative overflow-hidden rounded-3xl shadow-2xl">
        <div className="absolute inset-0 z-10">
          <GradientBackground 
            colors={[
              { r: 30, g: 58, b: 138, a: 0.5 }, // blue-900 with reduced opacity
              { r: 49, g: 46, b: 129, a: 0.4 }, // indigo-900 with reduced opacity
              { r: 67, g: 56, b: 202, a: 0.3 }, // indigo-600 with reduced opacity
              { r: 49, g: 46, b: 129, a: 0.4 }, // indigo-900 with reduced opacity
            ]}
          />
        </div>
        <div className="relative z-20 p-8 md:p-12 space-y-8">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-white">{t('benefits')}</h3>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-4 text-center">
              <div className="mx-auto p-4 bg-blue-500/30 rounded-full w-fit">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold text-white">{t('personalizedAttention')}</h4>
              <p className="text-white/90">
                {t('personalizedAttentionText')}
              </p>
            </div>
            
            <div className="space-y-4 text-center">
              <div className="mx-auto p-4 bg-blue-500/30 rounded-full w-fit">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold text-white">{t('tranquility')}</h4>
              <p className="text-white/90">
                {t('tranquilityText')}
              </p>
            </div>
            
            <div className="space-y-4 text-center">
              <div className="mx-auto p-4 bg-blue-500/30 rounded-full w-fit">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold text-white">{t('documentation')}</h4>
              <p className="text-white/90">
                {t('documentationText')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};