
import { MapPin, Phone } from "lucide-react";

interface FooterContactInfoProps {
  phone: string | null;
  address: string | null;
}

export function FooterContactInfo({ phone, address }: FooterContactInfoProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-primary-foreground border-b border-gray-700 pb-2">Contact Us</h3>
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
          <p className="text-gray-300 text-sm">{address}</p>
        </div>
        <div className="flex items-center gap-3">
          <Phone className="h-5 w-5 text-primary flex-shrink-0" />
          <a href={`tel:${phone}`} className="text-gray-300 hover:text-white text-sm">
            {phone}
          </a>
        </div>
      </div>
    </div>
  );
}
