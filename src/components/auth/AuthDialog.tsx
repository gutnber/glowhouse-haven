import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"

interface AuthDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function AuthDialog({ isOpen, onClose }: AuthDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { toast } = useToast()
  const navigate = useNavigate()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    console.log("Attempting authentication:", { isSignUp, email })

    try {
      const authAction = isSignUp 
        ? () => supabase.auth.signUp({
            email,
            password,
            options: { emailRedirectTo: window.location.origin }
          })
        : () => supabase.auth.signInWithPassword({ email, password })

      const { data, error } = await authAction()
      console.log(`${isSignUp ? 'Sign up' : 'Sign in'} response:`, { data, error })

      if (error) {
        if (error.message === "Invalid login credentials") {
          throw new Error("Invalid email or password. Please try again.")
        }
        throw error
      }

      if (isSignUp) {
        toast({
          title: "Success",
          description: "Please check your email to verify your account",
        })
      } else {
        if (!data.session) {
          throw new Error("No session returned after login")
        }
        toast({
          title: "Success",
          description: "Successfully logged in",
        })
        onClose()
        navigate("/")
      }
    } catch (error) {
      console.error("Authentication error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Authentication failed",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isSignUp ? "Create an account" : "Welcome back"}</DialogTitle>
          <DialogDescription>
            {isSignUp
              ? "Enter your email below to create your account"
              : "Enter your email below to sign in to your account"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleAuth} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <div className="space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Loading..." : isSignUp ? "Sign Up" : "Sign In"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}