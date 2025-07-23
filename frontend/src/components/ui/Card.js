import * as React from "react"
import { Paper, Box, Typography } from '@mui/material'

const Card = React.forwardRef(({ className, children, onClick, sx, ...props }, ref) => (
  <Paper
    ref={ref}
    elevation={1}
    onClick={onClick}
    sx={{
      borderRadius: 2,
      overflow: 'hidden',
      cursor: onClick ? 'pointer' : 'default',
      transition: 'all 0.2s ease-in-out',
      '&:hover': onClick ? {
        boxShadow: 3,
      } : {},
      ...sx
    }}
    {...props}
  >
    {children}
  </Paper>
))
Card.displayName = "Card"

const CardHeader = React.forwardRef(({ className, children, ...props }, ref) => (
  <Box
    ref={ref}
    sx={{ p: 3, pb: 1.5 }}
    {...props}
  >
    {children}
  </Box>
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef(({ className, children, ...props }, ref) => (
  <Typography
    ref={ref}
    variant="h6"
    component="h3"
    sx={{ fontWeight: 600, mb: 0.5 }}
    {...props}
  >
    {children}
  </Typography>
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef(({ className, children, ...props }, ref) => (
  <Typography
    ref={ref}
    variant="body2"
    color="text.secondary"
    {...props}
  >
    {children}
  </Typography>
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef(({ className, children, ...props }, ref) => (
  <Box ref={ref} sx={{ p: 3, pt: 0 }} {...props}>
    {children}
  </Box>
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef(({ className, children, ...props }, ref) => (
  <Box
    ref={ref}
    sx={{ display: 'flex', alignItems: 'center', p: 3, pt: 0 }}
    {...props}
  >
    {children}
  </Box>
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
