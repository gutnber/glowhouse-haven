
import { House, Play } from "lucide-react";
import { useRef, useState } from "react";
import { PropertyYouTubePlayer } from "@/components/property/PropertyYouTubePlayer";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { Tables } from "@/integrations/supabase/types";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PropertyMainMediaProps {
  property: Tables<'properties'>;
}

export const PropertyMainMedia = ({ property }: PropertyMainMediaProps) => {
  const { isAdmin } = useIsAdmin();
  const { toast } = useToast();
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({
    x: 50,
    y: 50
  });
  
  const updateImagePositionMutation = useMutation({
    mutationFn: async (position: string) => {
      const {
        error
      } = await supabase.from('properties').update({
        feature_image_position: position
      }).eq('id', property.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Image position updated successfully"
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update image position",
        variant: "destructive"
      });
    }
  });
  
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isAdmin) return;
    setIsDragging(true);
    e.preventDefault(); // Prevent image dragging
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current || !isAdmin) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width * 100;
    const y = (e.clientY - rect.top) / rect.height * 100;

    // Clamp values between 0 and 100
    const clampedX = Math.max(0, Math.min(100, x));
    const clampedY = Math.max(0, Math.min(100, y));
    setPosition({
      x: clampedX,
      y: clampedY
    });
  };
  
  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    // Convert position to CSS object-position format
    const positionString = `${position.x}% ${position.y}%`;
    updateImagePositionMutation.mutate(positionString);
  };
  
  return (
    <div className="relative rounded-xl overflow-hidden border border-orange-500/30 shadow-xl">
      {property.youtube_url ? (
        <div className="aspect-video w-full">
          <PropertyYouTubePlayer 
            youtubeUrl={property.youtube_url} 
            autoplay={property.youtube_autoplay} 
            muted={property.youtube_muted} 
            controls={property.youtube_controls} 
          />
        </div>
      ) : property.feature_image_url ? (
        <div ref={containerRef} className="relative" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
          <div className="w-full h-[500px] relative">
            <img 
              ref={imageRef} 
              src={property.feature_image_url} 
              alt={`${property.name} banner`} 
              className={`w-full h-full object-cover transition-all duration-200 ${isAdmin ? 'cursor-move' : ''}`} 
              style={{
                objectPosition: isDragging ? `${position.x}% ${position.y}%` : property.feature_image_position || '50% 50%'
              }} 
              onMouseDown={handleMouseDown} 
            />
          </div>
          {isAdmin && (
            <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {isDragging ? 'Release to save position' : 'Click and drag to adjust image position'}
            </div>
          )}
        </div>
      ) : (
        <div className="w-full h-[500px] bg-gradient-to-r from-orange-900/20 via-gray-800/30 to-orange-900/20 flex items-center justify-center">
          <House className="h-32 w-32 text-orange-500/50" />
        </div>
      )}
    </div>
  );
};
