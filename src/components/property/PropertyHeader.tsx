
import { ChevronLeft, MapPin, Pencil } from "lucide-react"
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

  return (
    <div className="pt-24">
      <Button variant="ghost" asChild className="-ml-4">
        <Link to="/properties">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Properties
        </Link>
      </Button>
      <div className="space-y-1 mt-4">
        <h1 className="text-4xl font-bold">{name}</h1>
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="h-4 w-4" />
          {address}
        </div>
      </div>
      {isAdmin && (
        <div className="mt-4">
          <Button asChild>
            <Link to={`/properties/${id}/edit`}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit Property
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
}
