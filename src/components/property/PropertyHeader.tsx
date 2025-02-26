
import { ChevronLeft, MapPin, Pencil, MessageCircle } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useIsAdmin } from "@/hooks/useIsAdmin"

interface PropertyHeaderProps {
  id: string
  name: string
  address: string
}

export const PropertyHeader = ({ id, name, address }: PropertyHeaderProps) => {
  const { isAdmin } = useIsAdmin()

  const handleWhatsAppClick = () => {
    const message = `Hi! I'm interested in the property: ${name} at ${address}`
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/526461961667?text=${encodedMessage}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <div className="flex justify-between items-center">
      <div className="space-y-1">
        <Button variant="ghost" asChild className="-ml-4">
          <Link to="/properties">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Properties
          </Link>
        </Button>
        <h1 className="text-4xl font-bold">{name}</h1>
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="h-4 w-4" />
          {address}
        </div>
      </div>
      <div className="flex gap-2">
        <Button onClick={handleWhatsAppClick} variant="secondary">
          <MessageCircle className="mr-2 h-4 w-4" />
          Contact via WhatsApp
        </Button>
        {isAdmin && (
          <Button asChild>
            <Link to={`/properties/${id}/edit`}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit Property
            </Link>
          </Button>
        )}
      </div>
    </div>
  )
}
