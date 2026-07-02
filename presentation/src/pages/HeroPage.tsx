import { useNavigate } from 'react-router-dom'
import { Container, Stack, Title, Text, Group, Button, Badge, SimpleGrid, Box } from '@mantine/core'

interface StatCardProps {
  value: string
  label: string
  color?: string
}

function StatCard({ value, label, color = '#C9A84C' }: StatCardProps) {
  return (
    <Box
      sx={{
        background: 'rgba(10, 8, 20, 0.75)',
        backdropFilter: 'blur(12px)',
        border: `1px solid ${color}33`,
        borderRadius: '12px',
        padding: '24px 20px',
        textAlign: 'center',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 8px 32px ${color}22`,
        },
      }}
    >
      <Text
        sx={{
          fontFamily: '"Cinzel", serif',
          fontSize: '2.2rem',
          fontWeight: 900,
          background: `linear-gradient(135deg, ${color} 0%, #FFD700 100%)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          lineHeight: 1.1,
          marginBottom: '8px',
        }}
      >
        {value}
      </Text>
      <Text size="sm" sx={{ color: 'rgba(232, 213, 163, 0.7)', letterSpacing: '0.05em' }}>
        {label}
      </Text>
    </Box>
  )
}

export default function HeroPage() {
  const navigate = useNavigate()

  return (
    <Container size="lg" py={80}>
      <Stack spacing={0} align="center">

        {/* Eyebrow badge */}
        <Badge
          size="lg"
          variant="outline"
          sx={{
            borderColor: 'rgba(201, 168, 76, 0.5)',
            color: '#C9A84C',
            letterSpacing: '0.15em',
            fontFamily: '"Cinzel", serif',
            fontSize: '0.65rem',
            marginBottom: '32px',
            animation: 'fadeInUp 0.6s ease both',
          }}
        >
          Personal Project Show &amp; Tell
        </Badge>

        {/* Main title */}
        <Title
          order={1}
          sx={{
            fontFamily: '"Cinzel", serif',
            fontSize: 'clamp(3rem, 8vw, 6rem)',
            fontWeight: 900,
            textAlign: 'center',
            background: 'linear-gradient(135deg, #FFD700 0%, #C9A84C 40%, #FFE59A 70%, #FFD700 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '0.08em',
            lineHeight: 1.05,
            marginBottom: '12px',
            animation: 'fadeInUp 0.7s ease both',
            animationDelay: '0.1s',
            textShadow: 'none',
          }}
        >
          ROBOTO GUILLIMAN
        </Title>

        {/* Subtitle */}
        <Text
          sx={{
            fontFamily: '"Cinzel", serif',
            fontSize: 'clamp(0.9rem, 2.5vw, 1.3rem)',
            color: 'rgba(232, 213, 163, 0.85)',
            textAlign: 'center',
            letterSpacing: '0.2em',
            marginBottom: '16px',
            animation: 'fadeInUp 0.7s ease both',
            animationDelay: '0.2s',
          }}
        >
          AI Rules Arbiter · Warhammer 40,000 11th Edition
        </Text>

        {/* Tagline */}
        <Text
          sx={{
            fontSize: '1rem',
            color: 'rgba(150, 180, 230, 0.8)',
            textAlign: 'center',
            fontStyle: 'italic',
            marginBottom: '48px',
            animation: 'fadeInUp 0.7s ease both',
            animationDelay: '0.3s',
          }}
        >
          "For the Emperor's Ruleset — RAG-powered, citation-first, heresy-resistant."
        </Text>

        {/* CTA Buttons */}
        <Group spacing="md" sx={{ marginBottom: '64px', animation: 'fadeInUp 0.7s ease both', animationDelay: '0.4s' }}>
          <Button
            size="lg"
            onClick={() => navigate('/architecture')}
            sx={{
              background: 'linear-gradient(135deg, #C9A84C 0%, #8B6914 100%)',
              color: '#08080f',
              fontWeight: 700,
              letterSpacing: '0.05em',
              border: 'none',
              '&:hover': {
                background: 'linear-gradient(135deg, #FFD700 0%, #C9A84C 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 24px rgba(201, 168, 76, 0.4)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            How It Works
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate('/demo')}
            sx={{
              borderColor: 'rgba(201, 168, 76, 0.5)',
              color: '#C9A84C',
              fontWeight: 700,
              letterSpacing: '0.05em',
              '&:hover': {
                background: 'rgba(201, 168, 76, 0.1)',
                borderColor: '#FFD700',
                color: '#FFD700',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            ⚡ Live Demo
          </Button>
        </Group>

        {/* Stats */}
        <SimpleGrid
          cols={4}
          spacing="lg"
          breakpoints={[{ maxWidth: 'sm', cols: 2 }]}
          sx={{ width: '100%', animation: 'fadeInUp 0.7s ease both', animationDelay: '0.5s' }}
        >
          <StatCard value="156" label="Rule chunks ingested" />
          <StatCard value="72" label="GW PDFs synced" color="#64B5F6" />
          <StatCard value="£0.40" label="Vision captioning cost" color="#4CAF50" />
          <StatCard value="0" label="Hallucination tolerance" color="#EF5350" />
        </SimpleGrid>

        {/* Divider with quote */}
        <Box
          mt={72}
          sx={{
            width: '100%',
            textAlign: 'center',
            borderTop: '1px solid rgba(201, 168, 76, 0.15)',
            paddingTop: '40px',
            animation: 'fadeInUp 0.7s ease both',
            animationDelay: '0.6s',
          }}
        >
          <Text
            sx={{
              fontFamily: '"Cinzel", serif',
              fontSize: '0.8rem',
              color: 'rgba(201, 168, 76, 0.5)',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              marginBottom: '12px',
            }}
          >
            Tech Stack
          </Text>
          <Group position="center" spacing="xl">
            {[
              { label: 'FastAPI', color: '#2196F3' },
              { label: 'Gemini 2.5 Flash-Lite', color: '#4CAF50' },
              { label: 'Firestore Vector Search', color: '#FF9800' },
              { label: 'Cloud Run', color: '#2196F3' },
              { label: 'text-embedding-004', color: '#9C27B0' },
              { label: 'Python 3.13', color: '#FFD700' },
            ].map((tech) => (
              <Text
                key={tech.label}
                size="sm"
                sx={{ color: tech.color, fontFamily: '"Share Tech Mono", monospace', opacity: 0.8 }}
              >
                {tech.label}
              </Text>
            ))}
          </Group>
        </Box>

      </Stack>
    </Container>
  )
}
