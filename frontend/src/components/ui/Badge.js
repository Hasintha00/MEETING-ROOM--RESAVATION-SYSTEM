import * as React from "react"
import { Chip } from '@mui/material'

function Badge({ className, variant = "default", children, ...props }) {
  const getColor = () => {
    switch(variant) {
      case "success": return "success";
      case "destructive": return "error";
      case "warning": return "warning";
      case "secondary": return "default";
      case "outline": return "default";
      default: return "primary";
    }
  };

  const getVariant = () => {
    return variant === "outline" ? "outlined" : "filled";
  };

  return (
    <Chip
      label={children}
      color={getColor()}
      variant={getVariant()}
      size="small"
      sx={{
        borderRadius: 3,
        fontWeight: 500,
        fontSize: '0.75rem',
        height: 'auto',
        '& .MuiChip-label': {
          padding: '4px 8px',
          display: 'flex',
          alignItems: 'center',
          gap: 0.5
        }
      }}
      {...props}
    />
  )
}

export { Badge }
