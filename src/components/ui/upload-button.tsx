import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { type ButtonProps } from "@/components/ui/button"

export interface UploadButtonProps
  extends Omit<ButtonProps, "onChange"> {
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const UploadButton = React.forwardRef<HTMLButtonElement, UploadButtonProps>(
  ({ className, onChange, children, ...props }, ref) => {
    const inputRef = React.useRef<HTMLInputElement>(null)

    const handleClick = () => {
      inputRef.current?.click()
    }

    return (
      <Button
        ref={ref}
        className={cn(className)}
        onClick={handleClick}
        {...props}
      >
        <input
          type="file"
          className="hidden"
          ref={inputRef}
          onChange={onChange}
          accept="image/*"
        />
        {children}
      </Button>
    )
  }
)
UploadButton.displayName = "UploadButton"

export { UploadButton }