import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/LanguageContext"

const NotFound = () => {
  const navigate = useNavigate()
  const { t } = useLanguage()

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-4">{t('404Title')}</h1>
      <p className="text-lg text-muted-foreground mb-8">{t('404Description')}</p>
      <Button 
        onClick={() => navigate('/')}
        className="bg-gradient-to-r from-orange-700 to-orange-900 hover:from-orange-800 hover:to-orange-950"
      >
        {t('backToHome')}
      </Button>
    </div>
  )
}

export default NotFound