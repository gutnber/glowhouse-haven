import { useLanguage } from "@/contexts/LanguageContext"

export const WelcomeSection = () => {
  const { t } = useLanguage()
  
  return (
    <div className="text-center space-y-6 py-16 px-8 rounded-2xl bg-gradient-to-r from-white/10 to-transparent backdrop-blur-sm border border-white/10 max-w-6xl mx-auto">
      <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white via-white/90 to-white/70">
        {t('welcome')}
      </h1>
      <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
        {t('subscribe')}
      </p>
    </div>
  )
}