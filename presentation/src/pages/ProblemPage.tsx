import { useNavigate } from 'react-router-dom'
import { Container, Stack, Title, Text, Group, Button, Box, SimpleGrid, ThemeIcon } from '@mantine/core'
import {
  IconAlertTriangle,
  IconBook,
  IconBrandOpenai,
  IconArrowRight,
  IconCheck,
  IconX,
} from '@tabler/icons-react'

function GlassCard({ children, accent = '#C9A84C' }: { children: React.ReactNode; accent?: string }) {
  return (
    <Box
      sx={{
        background: 'rgba(10, 8, 20, 0.8)',
        backdropFilter: 'blur(12px)',
        border: `1px solid ${accent}2a`,
        borderRadius: '16px',
        padding: '28px',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 8px 32px ${accent}18`,
        },
      }}
    >
      {children}
    </Box>
  )
}

function PainPoint({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <GlassCard accent="#8B0000">
      <Group spacing="md" mb="sm">
        <ThemeIcon
          size={40}
          radius="md"
          sx={{ background: 'rgba(139, 0, 0, 0.2)', border: '1px solid rgba(139, 0, 0, 0.4)' }}
        >
          {icon}
        </ThemeIcon>
        <Text sx={{ fontFamily: '"Cinzel", serif', fontWeight: 700, color: '#E8D5A3', fontSize: '1rem' }}>
          {title}
        </Text>
      </Group>
      <Text size="sm" sx={{ color: 'rgba(232, 213, 163, 0.65)', lineHeight: 1.7 }}>
        {description}
      </Text>
    </GlassCard>
  )
}

function ComparisonRow({ label, generic, roboto }: { label: string; generic: boolean; roboto: boolean }) {
  return (
    <Group position="apart" py="xs" sx={{ borderBottom: '1px solid rgba(201, 168, 76, 0.08)' }}>
      <Text size="sm" sx={{ color: 'rgba(232, 213, 163, 0.8)', flex: 1 }}>{label}</Text>
      <Group spacing="xl">
        <Box sx={{ width: 80, textAlign: 'center' }}>
          {generic ? (
            <IconCheck size={18} color="#4CAF50" />
          ) : (
            <IconX size={18} color="#EF5350" />
          )}
        </Box>
        <Box sx={{ width: 80, textAlign: 'center' }}>
          {roboto ? (
            <IconCheck size={18} color="#4CAF50" />
          ) : (
            <IconX size={18} color="#EF5350" />
          )}
        </Box>
      </Group>
    </Group>
  )
}

export default function ProblemPage() {
  const navigate = useNavigate()

  return (
    <Container size="lg" py={60}>
      <Stack spacing="xl">

        <Stack spacing="sm" align="center" mb="xl">
          <Text
            sx={{
              fontFamily: '"Cinzel", serif',
              fontSize: '0.75rem',
              color: 'rgba(201, 168, 76, 0.6)',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
            }}
          >
            The Challenge
          </Text>
          <Title
            order={1}
            sx={{
              fontFamily: '"Cinzel", serif',
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              textAlign: 'center',
              background: 'linear-gradient(135deg, #FFD700 0%, #C9A84C 60%, #FFE59A 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Rules That Could Fill a Tome
          </Title>
          <Text
            size="lg"
            sx={{ color: 'rgba(232, 213, 163, 0.7)', textAlign: 'center', maxWidth: 620 }}
          >
            Warhammer 40K 11th edition ships with 24 chapters and over 400 individually numbered
            rules — and that's just the core book.
          </Text>
        </Stack>

        {/* Pain points grid */}
        <SimpleGrid cols={3} spacing="lg" breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
          <PainPoint
            icon={<IconBook size={20} color="#EF5350" />}
            title="Edition Chaos"
            description="9th, 10th, and 11th editions have fundamentally different rules. Searching online returns mixed results. Players get confused — and so does ChatGPT."
          />
          <PainPoint
            icon={<IconAlertTriangle size={20} color="#EF5350" />}
            title="Mid-Game Disputes"
            description="Rules questions arise at the worst moment — during a match. Flipping through a 200-page PDF on your phone to cite rule 14.03.2 kills the game's momentum."
          />
          <PainPoint
            icon={<IconBrandOpenai size={20} color="#EF5350" />}
            title="Generic AI Hallucinates"
            description="Ask GPT-4 about WH40K rules and it confidently invents mechanics, blends editions, and cites rules that don't exist. Useless (and annoying) mid-game."
          />
        </SimpleGrid>

        {/* Scale context */}
        <GlassCard>
          <Title order={3} sx={{ fontFamily: '"Cinzel", serif', color: '#C9A84C', marginBottom: '16px', fontSize: '1.1rem' }}>
            The Scale of the Problem
          </Title>
          <SimpleGrid cols={4} spacing="md" breakpoints={[{ maxWidth: 'sm', cols: 2 }]}>
            {[
              { value: '24', label: 'Rule chapters in core book' },
              { value: '400+', label: 'Numbered rule entries' },
              { value: '3', label: 'Active editions (9th, 10th, 11th)' },
              { value: '72+', label: 'Official GW PDFs available' },
            ].map((stat) => (
              <Box key={stat.label} sx={{ textAlign: 'center' }}>
                <Text
                  sx={{
                    fontFamily: '"Cinzel", serif',
                    fontSize: '2rem',
                    fontWeight: 900,
                    color: '#FFD700',
                    lineHeight: 1,
                    marginBottom: '6px',
                  }}
                >
                  {stat.value}
                </Text>
                <Text size="xs" sx={{ color: 'rgba(232, 213, 163, 0.6)' }}>
                  {stat.label}
                </Text>
              </Box>
            ))}
          </SimpleGrid>
        </GlassCard>

        {/* Comparison table */}
        <GlassCard>
          <Title order={3} sx={{ fontFamily: '"Cinzel", serif', color: '#C9A84C', marginBottom: '20px', fontSize: '1.1rem' }}>
            Why Not Just Use ChatGPT?
          </Title>

          {/* Header */}
          <Group position="apart" mb="md">
            <Text size="xs" sx={{ color: 'rgba(232, 213, 163, 0.5)', flex: 1, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Capability
            </Text>
            <Group spacing="xl">
              <Text size="xs" sx={{ width: 80, textAlign: 'center', color: 'rgba(150, 180, 230, 0.7)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Generic AI
              </Text>
              <Text size="xs" sx={{ width: 80, textAlign: 'center', color: '#FFD700', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: '"Cinzel", serif' }}>
                Roboto G.
              </Text>
            </Group>
          </Group>

          <ComparisonRow label="Answers WH40K rules questions" generic={true} roboto={true} />
          <ComparisonRow label="Cites specific rule numbers (e.g. 09.01)" generic={false} roboto={true} />
          <ComparisonRow label="Enforces 11th edition only" generic={false} roboto={true} />
          <ComparisonRow label="Refuses to answer without evidence" generic={false} roboto={true} />
          <ComparisonRow label="Grounded in official GW PDFs" generic={false} roboto={true} />
          <ComparisonRow label="Diagram-aware (captions figures)" generic={false} roboto={true} />
          <ComparisonRow label="Costs £0 per query after setup" generic={false} roboto={true} />
        </GlassCard>

        <Group position="center" mt="md">
          <Button
            size="lg"
            rightIcon={<IconArrowRight size={18} />}
            onClick={() => navigate('/architecture')}
            sx={{
              background: 'linear-gradient(135deg, #C9A84C 0%, #8B6914 100%)',
              color: '#08080f',
              fontWeight: 700,
              '&:hover': {
                background: 'linear-gradient(135deg, #FFD700 0%, #C9A84C 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 24px rgba(201, 168, 76, 0.4)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            See How We Solved It
          </Button>
        </Group>

      </Stack>
    </Container>
  )
}
