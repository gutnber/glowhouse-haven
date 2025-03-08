
import { TopNavigation } from "@/components/layout/TopNavigation"
import { ContactForm } from "@/components/contact/ContactForm"
import { useAuthSession } from "@/hooks/useAuthSession"

export default function Contact() {
  const session = useAuthSession()
  
  return (
    <div className="flex flex-col min-h-screen">
      <TopNavigation session={session} />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-center">Get in Touch</h1>
          <p className="text-center text-gray-700 mb-8">
            Have questions or want to learn more about our properties? We're here to help!
          </p>
          
          <ContactForm />
        </div>
      </main>
      
      {/* Removed Footer component from here */}
    </div>
  )
}
