
import { TopNavigation } from "@/components/layout/TopNavigation"
import { ContactForm } from "@/components/contact/ContactForm"
import { useAuthSession } from "@/hooks/useAuthSession"
import { useLanguage } from "@/contexts/LanguageContext"

export default function Contact() {
  const session = useAuthSession()
  const { t, language } = useLanguage()
  
  return (
    <div className="flex flex-col min-h-screen">
      <TopNavigation session={session} />
      <main className="flex-1 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 pt-16">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-gradient-to-r from-orange-900 via-orange-800 to-orange-900 p-8 rounded-xl border border-orange-500/30 shadow-xl">
            <h1 className="text-3xl font-bold mb-6 text-center text-white border-b border-orange-500/30 pb-4">
              {language === 'es' ? 'Contáctenos' : 'Get in Touch'}
            </h1>
            <p className="text-center text-orange-200 mb-8">
              {language === 'es' 
                ? '¿Tiene preguntas o desea obtener más información sobre nuestras propiedades? ¡Estamos aquí para ayudarle!'
                : 'Have questions or want to learn more about our properties? We\'re here to help!'}
            </p>
            
            <ContactForm />
          </div>
        </div>
      </main>
    </div>
  )
}
