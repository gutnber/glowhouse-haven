import { useLanguage } from "@/contexts/LanguageContext"

export const WelcomeSection = () => {
  const { t } = useLanguage()
  
  return (
    <div className="relative space-y-6 py-24 px-8">
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-orange-600/10 rounded-3xl backdrop-blur-xl border border-orange-500/10" />
      <div className="relative">
        <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-orange-600 text-center">
          {t('welcome')}
        </h1>
        <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed mt-6 text-center">
          {t('subscribe')}
        </p>
      </div>
    </div>
  )
}