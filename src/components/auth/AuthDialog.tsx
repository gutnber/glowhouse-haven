
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { KeyRound } from "lucide-react"

interface AuthDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function AuthDialog({ isOpen, onClose }: AuthDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [isPasswordReset, setIsPasswordReset] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [showEmailConfirmationNeeded, setShowEmailConfirmationNeeded] = useState(false)
  const [showPasswordResetSent, setShowPasswordResetSent] = useState(false)
  const { toast } = useToast()
  const navigate = useNavigate()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setShowEmailConfirmationNeeded(false)
    console.log("Attempting authentication:", { isSignUp, email })

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
            emailRedirectTo: window.location.origin,
          },
        })

        if (error) throw error

        console.log('Sign up response:', data)
        setShowSuccessMessage(true)
        toast({
          title: "Success",
          description: "Successfully signed up! Please check your email to verify your account.",
        })
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) {
          if (error.message.includes("Email not confirmed")) {
            setShowEmailConfirmationNeeded(true)
            throw new Error("Please confirm your email address before signing in.")
          }
          if (error.message === "Invalid login credentials") {
            throw new Error("Invalid email or password. Please try again.")
          }
          throw error
        }

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

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}`,
      })
      
      if (error) throw error
      
      setShowPasswordResetSent(true)
      toast({
        title: "Success",
        description: "Password reset email sent. Please check your inbox.",
      })
    } catch (error) {
      console.error("Password reset error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send password reset email",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setEmail("")
    setPassword("")
    setFullName("")
    setShowSuccessMessage(false)
    setShowEmailConfirmationNeeded(false)
    setShowPasswordResetSent(false)
  }

  const toggleAuthMode = (e?: React.MouseEvent) => {
    if (e) e.preventDefault() // Prevent default to avoid page navigation
    setIsSignUp(!isSignUp)
    setIsPasswordReset(false)
    resetForm()
  }

  const togglePasswordReset = (e?: React.MouseEvent) => {
    if (e) e.preventDefault() // Prevent default to avoid page navigation
    setIsPasswordReset(!isPasswordReset)
    resetForm()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isPasswordReset 
              ? "Reset Your Password" 
              : isSignUp 
                ? "Create an account" 
                : "Welcome back"}
          </DialogTitle>
          <DialogDescription>
            {isPasswordReset
              ? "Enter your email address and we'll send you a link to reset your password"
              : isSignUp
                ? "Enter your details below to create your account"
                : "Enter your email below to sign in to your account"}
          </DialogDescription>
        </DialogHeader>

        {showSuccessMessage ? (
          <div className="space-y-4 pt-4">
            <Alert>
              <AlertDescription>
                Account created successfully! Please check your email to verify your account.
              </AlertDescription>
            </Alert>
            <Button
              type="button"
              className="w-full"
              onClick={(e) => {
                e.preventDefault() // Prevent default to avoid page navigation
                setIsSignUp(false)
                setShowSuccessMessage(false)
              }}
            >
              Sign In Now
            </Button>
          </div>
        ) : showEmailConfirmationNeeded ? (
          <div className="space-y-4 pt-4">
            <Alert>
              <AlertDescription>
                Please confirm your email address before signing in. Check your inbox for the confirmation email.
              </AlertDescription>
            </Alert>
            <Button
              type="button"
              className="w-full"
              onClick={(e) => {
                e.preventDefault() // Prevent default to avoid page navigation
                setShowEmailConfirmationNeeded(false)
              }}
            >
              Try Again
            </Button>
          </div>
        ) : showPasswordResetSent ? (
          <div className="space-y-4 pt-4">
            <Alert>
              <AlertDescription>
                Password reset link has been sent to your email. Please check your inbox and follow the instructions.
              </AlertDescription>
            </Alert>
            <Button
              type="button"
              className="w-full"
              onClick={(e) => {
                e.preventDefault() // Prevent default to avoid page navigation
                setIsPasswordReset(false)
                setShowPasswordResetSent(false)
              }}
            >
              Back to Sign In
            </Button>
          </div>
        ) : isPasswordReset ? (
          <form onSubmit={handlePasswordReset} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="reset-email">Email</Label>
              <Input
                id="reset-email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Sending..." : "Send Reset Link"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={togglePasswordReset}
              >
                Back to Sign In
              </Button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleAuth} className="space-y-4 pt-4">
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
            )}
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
              {!isSignUp && (
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full flex items-center justify-center gap-2 text-orange-400 hover:text-orange-500 hover:bg-orange-500/10"
                  onClick={togglePasswordReset}
                >
                  <KeyRound className="h-4 w-4" />
                  Forgot your password?
                </Button>
              )}
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={toggleAuthMode}
              >
                {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
