
import { Card, CardContent } from "@/components/ui/card"

export function LogoSettingsLoader() {
  return (
    <Card>
      <CardContent className="p-6 flex justify-center items-center min-h-[100px]">
        <div className="animate-pulse">Loading logo settings...</div>
      </CardContent>
    </Card>
  )
}
