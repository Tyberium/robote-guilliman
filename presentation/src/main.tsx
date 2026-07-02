import React from 'react'
import ReactDOM from 'react-dom/client'
import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        colorScheme: 'dark',
        colors: {
          gold: [
            '#FFF8DC',
            '#FFE59A',
            '#FFD700',
            '#E6C200',
            '#C9A84C',
            '#AD8C36',
            '#8B6914',
            '#6B4F0A',
            '#4A3507',
            '#2D2004',
          ],
          brand: [
            '#E3F2FD',
            '#BBDEFB',
            '#90CAF9',
            '#64B5F6',
            '#42A5F5',
            '#2196F3',
            '#1E88E5',
            '#1976D2',
            '#1565C0',
            '#0D47A1',
          ],
          crimson: [
            '#FFEBEE',
            '#FFCDD2',
            '#EF9A9A',
            '#E57373',
            '#EF5350',
            '#C62828',
            '#B71C1C',
            '#8B0000',
            '#6B0000',
            '#4A0000',
          ],
        },
        primaryColor: 'gold',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        headings: {
          fontFamily: '"Cinzel", "Trajan Pro", "Times New Roman", serif',
          fontWeight: 700,
        },
        globalStyles: () => ({
          body: {
            background: '#08080f',
          },
        }),
      }}
    >
        <Notifications position="top-right" />
        <App />
    </MantineProvider>
  </React.StrictMode>,
)
