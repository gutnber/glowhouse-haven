
import { Home, Mail } from "lucide-react";

export function FooterQuickLinks() {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-primary-foreground border-b border-gray-700 pb-2">Quick Links</h3>
      <ul className="space-y-2">
        <li>
          <a href="/" className="text-gray-300 hover:text-white flex items-center gap-2 group">
            <Home className="h-4 w-4 text-primary" />
            <span className="group-hover:translate-x-1 transition-transform">Home</span>
          </a>
        </li>
        <li>
          <a href="/properties" className="text-gray-300 hover:text-white flex items-center gap-2 group">
            <Home className="h-4 w-4 text-primary" />
            <span className="group-hover:translate-x-1 transition-transform">Properties</span>
          </a>
        </li>
        <li>
          <a href="/contact" className="text-gray-300 hover:text-white flex items-center gap-2 group">
            <Mail className="h-4 w-4 text-primary" />
            <span className="group-hover:translate-x-1 transition-transform">Contact Us</span>
          </a>
        </li>
      </ul>
    </div>
  );
}
