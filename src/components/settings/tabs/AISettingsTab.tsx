
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Eye, EyeOff, Bot, Key } from "lucide-react"
import { AISettings, AI_PROVIDERS } from "@/types/ai-settings"

interface AISettingsTabProps {
  settings: AISettings | null
  onSettingsUpdate: (settings: AISettings) => Promise<void>
  isLoading: boolean
}

export function AISettingsTab({ settings, onSettingsUpdate, isLoading }: AISettingsTabProps) {
  const [localSettings, setLocalSettings] = useState<AISettings>({
    provider: 'deepseek',
    deepseek_api_key: '',
    openai_api_key: '',
    model: 'deepseek-chat'
  })
  const [showDeepSeekKey, setShowDeepSeekKey] = useState(false)
  const [showOpenAIKey, setShowOpenAIKey] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (settings) {
      setLocalSettings(settings)
    }
  }, [settings])

  const handleProviderChange = (provider: 'deepseek' | 'openai') => {
    const selectedProvider = AI_PROVIDERS.find(p => p.id === provider)
    const defaultModel = selectedProvider?.models[0]?.id || ''
    
    setLocalSettings(prev => ({
      ...prev,
      provider,
      model: defaultModel
    }))
  }

  const handleSave = async () => {
    try {
      await onSettingsUpdate(localSettings)
      toast({
        title: "Configuración guardada",
        description: "La configuración de IA se ha actualizado correctamente",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar la configuración",
        variant: "destructive",
      })
    }
  }

  const selectedProvider = AI_PROVIDERS.find(p => p.id === localSettings.provider)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          Configuración de Asistente de IA
        </CardTitle>
        <CardDescription>
          Configura los modelos de IA y claves API para el asistente inmobiliario
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Provider Selection */}
        <div className="space-y-2">
          <Label htmlFor="provider">Proveedor de IA</Label>
          <Select 
            value={localSettings.provider} 
            onValueChange={handleProviderChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un proveedor" />
            </SelectTrigger>
            <SelectContent>
              {AI_PROVIDERS.map((provider) => (
                <SelectItem key={provider.id} value={provider.id}>
                  {provider.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Model Selection */}
        <div className="space-y-2">
          <Label htmlFor="model">Modelo</Label>
          <Select 
            value={localSettings.model} 
            onValueChange={(value) => setLocalSettings(prev => ({ ...prev, model: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un modelo" />
            </SelectTrigger>
            <SelectContent>
              {selectedProvider?.models.map((model) => (
                <SelectItem key={model.id} value={model.id}>
                  <div className="flex flex-col">
                    <span>{model.name}</span>
                    {model.description && (
                      <span className="text-xs text-muted-foreground">{model.description}</span>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* DeepSeek API Key */}
        <div className="space-y-2">
          <Label htmlFor="deepseek-key" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            Clave API de DeepSeek
          </Label>
          <div className="relative">
            <Input
              id="deepseek-key"
              type={showDeepSeekKey ? "text" : "password"}
              value={localSettings.deepseek_api_key || ''}
              onChange={(e) => setLocalSettings(prev => ({ 
                ...prev, 
                deepseek_api_key: e.target.value 
              }))}
              placeholder="sk-..."
              className="pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowDeepSeekKey(!showDeepSeekKey)}
            >
              {showDeepSeekKey ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* OpenAI API Key */}
        <div className="space-y-2">
          <Label htmlFor="openai-key" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            Clave API de OpenAI
          </Label>
          <div className="relative">
            <Input
              id="openai-key"
              type={showOpenAIKey ? "text" : "password"}
              value={localSettings.openai_api_key || ''}
              onChange={(e) => setLocalSettings(prev => ({ 
                ...prev, 
                openai_api_key: e.target.value 
              }))}
              placeholder="sk-..."
              className="pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowOpenAIKey(!showOpenAIKey)}
            >
              {showOpenAIKey ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Save Button */}
        <Button 
          onClick={handleSave} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? "Guardando..." : "Guardar Configuración"}
        </Button>

        {/* Info */}
        <div className="text-sm text-muted-foreground space-y-1">
          <p>• Las claves API se almacenan de forma segura y encriptada</p>
          <p>• Necesitas al menos una clave API configurada para usar el asistente</p>
          <p>• El modelo seleccionado se usará para todas las conversaciones</p>
        </div>
      </CardContent>
    </Card>
  )
}
