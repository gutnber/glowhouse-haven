
import { useState } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface VideoSettingsProps {
  propertyId: string;
  initialSettings: {
    autoplay: boolean;
    muted: boolean;
    controls: boolean;
  };
  onSettingsChange: (settings: { 
    autoplay: boolean; 
    muted: boolean; 
    controls: boolean 
  }) => void;
}

export const VideoSettings = ({ 
  propertyId, 
  initialSettings,
  onSettingsChange
}: VideoSettingsProps) => {
  const { toast } = useToast();
  const [autoplay, setAutoplay] = useState<boolean>(initialSettings.autoplay);
  const [muted, setMuted] = useState<boolean>(initialSettings.muted);
  const [controls, setControls] = useState<boolean>(initialSettings.controls);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const updateVideoSettings = async () => {
    try {
      console.log('Saving video settings:', { autoplay, muted, controls });
      const { error } = await supabase
        .from('properties')
        .update({
          youtube_autoplay: autoplay,
          youtube_muted: muted,
          youtube_controls: controls
        })
        .eq('id', propertyId);

      if (error) throw error;

      setHasUnsavedChanges(false);
      toast({
        title: "Success",
        description: "Video settings saved successfully",
      });
    } catch (error) {
      console.error('Error saving video settings:', error);
      toast({
        title: "Error",
        description: "Failed to save video settings",
        variant: "destructive",
      });
    }
  };

  const handleSettingChange = (
    setting: 'youtube_autoplay' | 'youtube_muted' | 'youtube_controls',
    value: boolean
  ) => {
    setHasUnsavedChanges(true);
    
    let newSettings = { autoplay, muted, controls };
    
    switch (setting) {
      case 'youtube_autoplay':
        setAutoplay(value);
        newSettings.autoplay = value;
        break;
      case 'youtube_muted':
        setMuted(value);
        newSettings.muted = value;
        break;
      case 'youtube_controls':
        setControls(value);
        newSettings.controls = value;
        break;
    }
    
    onSettingsChange(newSettings);
  };

  return (
    <div className="mt-4 space-y-2 bg-background/50 p-4 rounded-lg">
      <div className="flex items-center justify-between">
        <span>Autoplay</span>
        <Switch 
          checked={autoplay}
          onCheckedChange={(checked) => {
            handleSettingChange('youtube_autoplay', checked);
          }}
        />
      </div>
      <div className="flex items-center justify-between">
        <span>Muted</span>
        <Switch 
          checked={muted}
          onCheckedChange={(checked) => {
            handleSettingChange('youtube_muted', checked);
          }}
        />
      </div>
      <div className="flex items-center justify-between">
        <span>Show Controls</span>
        <Switch 
          checked={controls}
          onCheckedChange={(checked) => {
            handleSettingChange('youtube_controls', checked);
          }}
        />
      </div>
      {hasUnsavedChanges && (
        <Button 
          onClick={updateVideoSettings}
          className="w-full mt-2"
          variant="secondary"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      )}
    </div>
  );
};
