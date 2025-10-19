import { Box, Container, Typography } from '@mui/material'
import { Button } from './components/UI'
import './App.css'

// Example icon component
const UserAddIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3.41016 22C3.41016 18.13 7.26015 15 12.0002 15C12.9602 15 13.8902 15.13 14.7602 15.37" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M22 18C22 18.32 21.96 18.63 21.88 18.93C21.79 19.33 21.63 19.72 21.42 20.06C20.73 21.22 19.46 22 18 22C16.97 22 16.04 21.61 15.34 20.97C15.04 20.71 14.78 20.4 14.58 20.06C14.21 19.46 14 18.75 14 18C14 16.92 14.43 15.93 15.13 15.21C15.86 14.46 16.88 14 18 14C19.18 14 20.25 14.51 20.97 15.33C21.61 16.04 22 16.98 22 18Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M19.49 17.98H16.51" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M18 16.52V19.51" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

function App() {
  return (
    <Container maxWidth="md">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '3rem',
          py: 4,
        }}
      >
        <Typography variant="h1" component="h1" sx={{ textAlign: 'center' }}>
          Floow Design System
        </Typography>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            width: '100%',
            maxWidth: '29.125rem', // 466px from Figma
          }}
        >
          <Typography variant="h3" sx={{ textAlign: 'center', mb: 1 }}>
            Button Examples
          </Typography>

          {/* Primary Button - Log in */}
          <Button variant="primary" size="large" fullWidth>
            Log in
          </Button>

          {/* Secondary Button - Cancel */}
          <Button variant="secondary" size="large" fullWidth>
            Cancel
          </Button>

          {/* Outlined Button - Create an account */}
          <Button variant="outlined" size="large" fullWidth>
            Create an account
          </Button>

          {/* Primary with Icon - Add Member */}
          <Button variant="primary" size="large" fullWidth startIcon={<UserAddIcon />}>
            Add Member
          </Button>

          {/* Text Button */}
          <Button variant="text" size="medium">
            Cancel
          </Button>

          {/* Different sizes */}
          <Box sx={{ display: 'flex', gap: '1rem', justifyContent: 'center', mt: 2 }}>
            <Button variant="primary" size="small">
              Small
            </Button>
            <Button variant="primary" size="medium">
              Medium
            </Button>
            <Button variant="primary" size="large">
              Large
            </Button>
          </Box>

          {/* Disabled state */}
          <Button variant="primary" size="large" fullWidth disabled>
            Disabled
          </Button>
        </Box>

        <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary' }}>
          Run <code>npm run storybook</code> to view all components in Storybook
        </Typography>
      </Box>
    </Container>
  )
}

export default App
