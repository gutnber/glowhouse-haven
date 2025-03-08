
interface CopyrightSectionProps {
  company: string | null;
}

export function CopyrightSection({ company }: CopyrightSectionProps) {
  return (
    <div className="text-center text-gray-400 text-sm mt-10 pt-6 border-t border-gray-800">
      <p>© {new Date().getFullYear()} {company || "Inma Soluciones Inmobiliarias"}. All rights reserved.</p>
    </div>
  );
}
