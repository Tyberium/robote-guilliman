import { useNavigate, useLocation } from 'react-router-dom'
import { Header, Group, Tabs, Text } from '@mantine/core'

const TABS = [
  { value: '/', label: 'Home' },
  { value: '/problem', label: 'The Problem' },
  { value: '/architecture', label: 'How It Works' },
  { value: '/parser', label: 'Under the Hood' },
  { value: '/demo', label: '⚡ Live Demo' },
  { value: '/stack', label: 'Stack & Roadmap' },
]

export default function Navigation() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <Header
      height={64}
      px="md"
      sx={{
        background: 'rgba(8, 8, 15, 0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(201, 168, 76, 0.2)',
        boxShadow: '0 2px 20px rgba(0, 0, 0, 0.5)',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
      }}
    >
      <Group position="apart" sx={{ height: '100%' }}>
        <Group spacing="xs" sx={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
          <Text
            sx={{
              fontFamily: '"Cinzel", serif',
              fontWeight: 900,
              fontSize: '1.1rem',
              background: 'linear-gradient(135deg, #FFD700 0%, #C9A84C 60%, #FFE59A 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '0.05em',
            }}
          >
            ⚔️ ROBOTO GUILLIMAN
          </Text>
        </Group>

        <Tabs
          value={location.pathname}
          onTabChange={(value) => navigate(value as string)}
          variant="pills"
          sx={{
            '.mantine-Tabs-tabsList': {
              gap: '4px',
              border: 'none',
            },
          }}
        >
          <Tabs.List>
            {TABS.map((tab) => (
              <Tabs.Tab
                key={tab.value}
                value={tab.value}
                sx={(theme) => ({
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  color: location.pathname === tab.value
                    ? '#FFD700'
                    : 'rgba(232, 213, 163, 0.7)',
                  background: location.pathname === tab.value
                    ? 'rgba(201, 168, 76, 0.15)'
                    : 'transparent',
                  border: location.pathname === tab.value
                    ? '1px solid rgba(201, 168, 76, 0.35)'
                    : '1px solid transparent',
                  '&:hover': {
                    background: 'rgba(201, 168, 76, 0.1)',
                    color: '#FFD700',
                  },
                  transition: 'all 0.2s ease',
                  padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                })}
              >
                {tab.label}
              </Tabs.Tab>
            ))}
          </Tabs.List>
        </Tabs>
      </Group>
    </Header>
  )
}
