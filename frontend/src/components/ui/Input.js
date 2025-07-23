import * as React from "react"
import { TextField } from '@mui/material'

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <TextField
      type={type}
      ref={ref}
      variant="outlined"
      fullWidth
      size="medium"
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: 2,
        }
      }}
      {...props}
    />
  )
})
Input.displayName = "Input"

export { Input }
