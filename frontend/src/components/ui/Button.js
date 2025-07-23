import * as React from "react"
import { Button as MuiButton } from '@mui/material'

const Button = React.forwardRef(({ className, variant = "contained", size = "medium", children, ...props }, ref) => {
  const muiVariant = variant === "outline" ? "outlined" : variant === "ghost" ? "text" : "contained";
  
  return (
    <MuiButton
      ref={ref}
      variant={muiVariant}
      size={size}
      sx={{
        textTransform: 'none',
        borderRadius: 2,
        fontWeight: 500,
        ...(variant === "destructive" && {
          backgroundColor: 'error.main',
          color: 'error.contrastText',
          '&:hover': {
            backgroundColor: 'error.dark',
          }
        })
      }}
      {...props}
    >
      {children}
    </MuiButton>
  )
})
Button.displayName = "Button"

export { Button }
