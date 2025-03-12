
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface SEOProps {
  propertyId?: string;
}

export const SEO = ({ propertyId }: SEOProps) => {
  const location = useLocation();
  const { language, getMetaTags } = useLanguage();
  
  // Fetch property data if we're on a property page
  const { data: property } = useQuery({
    queryKey: ['property-seo', propertyId],
    queryFn: async () => {
      if (!propertyId) return null;
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', propertyId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!propertyId
  });

  useEffect(() => {
    // Get base meta tags for the current path
    let metaTags = getMetaTags(location.pathname);
    let title = metaTags.title;
    let description = metaTags.description;
    let keywords = metaTags.keywords;
    
    // If we have property data, customize the meta tags
    if (property && propertyId) {
      title = title.replace('{propertyName}', property.name || 'Property');
      description = description
        .replace('{propertyName}', property.name || 'Property')
        .replace('{bedrooms}', String(property.bedrooms || ''))
        .replace('{bathrooms}', String(property.bathrooms || ''))
        .replace('{area}', String(property.area || ''))
        .replace('{location}', property.address || '')
        .replace('{propertyType}', property.property_type || 'Property');
      
      keywords = keywords
        .replace('{location}', property.address || '')
        .replace('{propertyType}', property.property_type || 'Property');
    }
    
    // Update document title
    document.title = title;
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    }
    
    // Update meta keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', keywords);
    }
    
    // Update OG meta tags
    const metaOgTitle = document.querySelector('meta[property="og:title"]');
    const metaOgDescription = document.querySelector('meta[property="og:description"]');
    const metaTwitterTitle = document.querySelector('meta[property="twitter:title"]');
    const metaTwitterDescription = document.querySelector('meta[property="twitter:description"]');
    
    if (metaOgTitle) metaOgTitle.setAttribute('content', title);
    if (metaOgDescription) metaOgDescription.setAttribute('content', description);
    if (metaTwitterTitle) metaTwitterTitle.setAttribute('content', title);
    if (metaTwitterDescription) metaTwitterDescription.setAttribute('content', description);
    
    // Update OG URL
    const metaOgUrl = document.querySelector('meta[property="og:url"]');
    const metaTwitterUrl = document.querySelector('meta[property="twitter:url"]');
    const currentUrl = window.location.origin + location.pathname;
    
    if (metaOgUrl) metaOgUrl.setAttribute('content', currentUrl);
    if (metaTwitterUrl) metaTwitterUrl.setAttribute('content', currentUrl);
    
    // Update OG image if property has a feature image
    if (property && property.feature_image_url) {
      const metaOgImage = document.querySelector('meta[property="og:image"]');
      const metaTwitterImage = document.querySelector('meta[property="twitter:image"]');
      
      if (metaOgImage) metaOgImage.setAttribute('content', property.feature_image_url);
      if (metaTwitterImage) metaTwitterImage.setAttribute('content', property.feature_image_url);
    }
  }, [location.pathname, language, property, propertyId]);

  return null; // This component doesn't render anything
};
