
interface CopyrightSectionProps {
  company: string | null;
}

export function CopyrightSection({ company }: CopyrightSectionProps) {
  const companyName = company || "Inma Soluciones Inmobiliarias";
  
  return (
    <div className="text-center text-gray-400 text-sm mt-10 pt-6 border-t border-gray-800">
      <p>© {new Date().getFullYear()} {companyName}. All rights reserved.</p>
    </div>
  );
}
