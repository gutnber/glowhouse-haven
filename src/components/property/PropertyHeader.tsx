import { ChevronLeft, MapPin, Pencil, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useIsAdmin } from "@/hooks/useIsAdmin";
interface PropertyHeaderProps {
  id: string;
  name: string;
  address: string;
}
export const PropertyHeader = ({
  id,
  name,
  address
}: PropertyHeaderProps) => {
  const {
    isAdmin
  } = useIsAdmin();
  // WhatsApp functionality moved to PropertyProfile.tsx
  // to be placed below the contact form
  return <div className="flex justify-between items-center">
      <div className="space-y-1 mt-2">
        <Button variant="ghost" asChild className="-ml-4 text-white hover:text-white hover:bg-white/10">
          <Link to="/properties">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Properties
          </Link>
        </Button>
        <h1 className="text-4xl font-bold my-[7px] text-white">{name}</h1>
        <div className="flex items-center gap-2 text-white">
          <MapPin className="h-4 w-4" />
          {address}
        </div>
      </div>
      <div className="flex gap-2">
        {isAdmin && <Button asChild>
            <Link to={`/properties/${id}/edit`}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit Property
            </Link>
          </Button>}
      </div>
    </div>;
}