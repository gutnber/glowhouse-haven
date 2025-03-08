
import { Card, CardContent } from "@/components/ui/card"

export function FooterSettingsLoader() {
  return (
    <Card>
      <CardContent className="p-6 flex justify-center items-center min-h-[200px]">
        <div className="animate-pulse">Loading footer settings...</div>
      </CardContent>
    </Card>
  )
}
