import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const Index = () => {
  return (
    <div className="space-y-4">
      <h1 className="text-4xl font-bold">Welcome to Your App</h1>
      <p className="text-muted-foreground">This is your new application homepage.</p>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>Learn how to use your new application</CardDescription>
          </CardHeader>
          <CardContent>
            <Button>Learn More</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Features</CardTitle>
            <CardDescription>Explore what you can do</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="secondary">Explore</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Documentation</CardTitle>
            <CardDescription>Read the full documentation</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline">Read Docs</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Index