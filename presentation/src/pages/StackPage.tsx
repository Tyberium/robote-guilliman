import { useNavigate } from 'react-router-dom'
import { Container, Stack, Title, Text, Group, Button, Box, SimpleGrid, Badge, Timeline } from '@mantine/core'
import { IconHome } from '@tabler/icons-react'

function GlassCard({ children, accent = '#C9A84C' }: { children: React.ReactNode; accent?: string }) {
  return (
    <Box
      sx={{
        background: 'rgba(10, 8, 20, 0.8)',
        backdropFilter: 'blur(12px)',
        border: `1px solid ${accent}2a`,
        borderRadius: '16px',
        padding: '28px',
        height: '100%',
      }}
    >
      {children}
    </Box>
  )
}

function LayerBadge({ label, color }: { label: string; color: string }) {
  return (
    <Badge
      sx={{
        background: `${color}15`,
        color: color,
        border: `1px solid ${color}35`,
        fontFamily: '"Share Tech Mono", monospace',
        fontSize: '0.72rem',
        padding: '6px 12px',
        height: 'auto',
        textTransform: 'none',
      }}
    >
      {label}
    </Badge>
  )
}

const ROADMAP_PHASES = [
  {
    phase: 'Phase 0',
    label: 'Core Rules RAG',
    status: 'done',
    items: ['156 rule chunks ingested', 'FastAPI on Cloud Run', 'Gemini 2.5 Flash-Lite', 'Firestore vector search'],
  },
  {
    phase: 'Phase 1',
    label: 'Multi-channel',
    status: 'done',
    items: ['WhatsApp via whapi.cloud', 'Discord bot', 'Shared ask_pipeline.py', 'Rate limiting + mention gating'],
  },
  {
    phase: 'Phase 2',
    label: 'Auth & Faction Packs',
    status: 'next',
    items: ['Firebase ID token auth', 'Ingest remaining 72 PDFs', 'Parser profiles per source type', 'Billing kill-switch'],
  },
  {
    phase: 'Phase 3',
    label: 'Hybrid Search',
    status: 'future',
    items: ['BM25 + vector re-ranking', 'Cross-encoder fine-tuning', 'Errata versioning', 'Automated errata alerts'],
  },
  {
    phase: 'Phase 4',
    label: 'Eval Harness',
    status: 'future',
    items: ['ragas evaluation framework', 'Faithfulness + context recall', 'Regression test suite', 'CI quality gates'],
  },
  {
    phase: 'Phase 5',
    label: 'Battleplan.uk',
    status: 'future',
    items: ['Frontend widget embed', 'User query history', 'Army-builder rules checks', 'Multiplayer dispute resolve'],
  },
]

export default function StackPage() {
  const navigate = useNavigate()

  return (
    <Container size="lg" py={60}>
      <Stack spacing="xl">

        <Stack spacing="sm" align="center" mb="md">
          <Text
            sx={{
              fontFamily: '"Cinzel", serif',
              fontSize: '0.75rem',
              color: 'rgba(201, 168, 76, 0.6)',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
            }}
          >
            Infrastructure &amp; Roadmap
          </Text>
          <Title
            order={1}
            sx={{
              fontFamily: '"Cinzel", serif',
              fontSize: 'clamp(2rem, 5vw, 3.2rem)',
              textAlign: 'center',
              background: 'linear-gradient(135deg, #FFD700 0%, #C9A84C 60%, #FFE59A 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Stack &amp; What's Next
          </Title>
        </Stack>

        {/* Architecture overview */}
        <SimpleGrid cols={3} spacing="lg" breakpoints={[{ maxWidth: 'md', cols: 1 }]}>
          <GlassCard accent="#2196F3">
            <Text sx={{ fontFamily: '"Cinzel", serif', color: '#2196F3', fontWeight: 700, fontSize: '0.9rem', marginBottom: '16px' }}>
              ☁️ Cloud Architecture
            </Text>
            <Stack spacing="sm">
              {[
                { layer: 'Compute', items: ['Cloud Run v2', 'scale-to-zero', 'europe-west1', '256 MB / 1 vCPU'] },
                { layer: 'Storage', items: ['Firestore (Native)', '768-dim COSINE index', 'chat_history cache'] },
                { layer: 'AI', items: ['Gemini 2.5 Flash-Lite', 'text-embedding-004', 'Gemini 2.5 Pro (vision)'] },
                { layer: 'Registry', items: ['Artifact Registry', 'Docker multi-stage', 'Python 3.13-slim'] },
              ].map((group) => (
                <Box key={group.layer}>
                  <Text size="xs" sx={{ color: 'rgba(201, 168, 76, 0.6)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '4px', fontSize: '0.65rem' }}>
                    {group.layer}
                  </Text>
                  <Group spacing="xs">
                    {group.items.map((item) => (
                      <LayerBadge key={item} label={item} color="#2196F3" />
                    ))}
                  </Group>
                </Box>
              ))}
            </Stack>
          </GlassCard>

          <GlassCard accent="#4CAF50">
            <Text sx={{ fontFamily: '"Cinzel", serif', color: '#4CAF50', fontWeight: 700, fontSize: '0.9rem', marginBottom: '16px' }}>
              🔄 CI/CD Pipeline
            </Text>
            <Stack spacing="xs">
              {[
                { step: '1', label: 'Pull Request', desc: 'ruff lint + pytest (30+ tests)' },
                { step: '2', label: 'Merge to main', desc: 'OIDC Workload Identity → GCP (keyless!)' },
                { step: '3', label: 'Docker build', desc: 'Multi-stage, Poetry deps baked in' },
                { step: '4', label: 'Push image', desc: 'Artifact Registry, tagged with SHA' },
                { step: '5', label: 'pulumi up', desc: 'IaC deploys Cloud Run revision' },
                { step: '6', label: 'Health check', desc: '/health 200 → deployment complete' },
              ].map((s) => (
                <Group key={s.step} spacing="sm" noWrap>
                  <Box
                    sx={{
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      background: 'rgba(76, 175, 80, 0.2)',
                      border: '1px solid rgba(76, 175, 80, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Text size="xs" sx={{ color: '#4CAF50', fontWeight: 700 }}>
                      {s.step}
                    </Text>
                  </Box>
                  <Box>
                    <Text size="xs" sx={{ color: '#E8D5A3', fontWeight: 600 }}>{s.label}</Text>
                    <Text size="xs" sx={{ color: 'rgba(232, 213, 163, 0.5)' }}>{s.desc}</Text>
                  </Box>
                </Group>
              ))}
            </Stack>
          </GlassCard>

          <GlassCard accent="#C9A84C">
            <Text sx={{ fontFamily: '"Cinzel", serif', color: '#C9A84C', fontWeight: 700, fontSize: '0.9rem', marginBottom: '16px' }}>
              💰 Free Tier Design
            </Text>
            <Stack spacing="sm" mb="md">
              {[
                { item: 'Cloud Run requests', cost: '2M free/month', color: '#4CAF50' },
                { item: 'Firestore reads', cost: '50k free/day', color: '#4CAF50' },
                { item: 'text-embedding-004', cost: '~$0.000/1k tokens', color: '#4CAF50' },
                { item: 'Gemini Flash-Lite', cost: '~$0.001/query', color: '#FFD700' },
                { item: 'Vision captioning', cost: '£0.40 one-time', color: '#C9A84C' },
                { item: 'Load balancer', cost: 'None (direct URL)', color: '#4CAF50' },
              ].map((row) => (
                <Group key={row.item} position="apart">
                  <Text size="xs" sx={{ color: 'rgba(232, 213, 163, 0.65)' }}>{row.item}</Text>
                  <Text size="xs" sx={{ color: row.color, fontFamily: '"Share Tech Mono", monospace' }}>{row.cost}</Text>
                </Group>
              ))}
            </Stack>
            <Box
              sx={{
                borderTop: '1px solid rgba(201, 168, 76, 0.15)',
                paddingTop: '12px',
              }}
            >
              <Text size="xs" sx={{ color: 'rgba(201, 168, 76, 0.5)', fontStyle: 'italic' }}>
                Monthly cost at current scale: ~£0–2 depending on query volume
              </Text>
            </Box>

            <Box mt="lg">
              <Text sx={{ fontFamily: '"Cinzel", serif', color: '#C9A84C', fontWeight: 700, fontSize: '0.9rem', marginBottom: '12px' }}>
                📡 Channels
              </Text>
              <Group spacing="xs">
                <LayerBadge label="HTTP API" color="#2196F3" />
                <LayerBadge label="WhatsApp" color="#4CAF50" />
                <LayerBadge label="Discord" color="#9C27B0" />
                <LayerBadge label="battleplan.uk (soon)" color="#C9A84C" />
              </Group>
            </Box>
          </GlassCard>
        </SimpleGrid>

        {/* Roadmap */}
        <Box
          sx={{
            background: 'rgba(10, 8, 20, 0.8)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(201, 168, 76, 0.2)',
            borderRadius: '16px',
            padding: '32px',
          }}
        >
          <Text
            sx={{
              fontFamily: '"Cinzel", serif',
              color: '#C9A84C',
              fontWeight: 700,
              fontSize: '1rem',
              marginBottom: '24px',
            }}
          >
            📋 Roadmap
          </Text>

          <Timeline
            active={1}
            bulletSize={28}
            lineWidth={2}
            color="yellow"
            sx={{
              '.mantine-Timeline-itemBullet': {
                background: 'transparent',
              },
            }}
          >
            {ROADMAP_PHASES.map((phase) => (
              <Timeline.Item
                key={phase.phase}
                bullet={
                  <Text
                    size="xs"
                    sx={{
                      fontWeight: 700,
                      color: phase.status === 'done'
                        ? '#4CAF50'
                        : phase.status === 'next'
                          ? '#FFD700'
                          : 'rgba(232, 213, 163, 0.3)',
                    }}
                  >
                    {phase.status === 'done' ? '✓' : phase.status === 'next' ? '▶' : '○'}
                  </Text>
                }
                title={
                  <Group spacing="sm">
                    <Text
                      sx={{
                        fontFamily: '"Cinzel", serif',
                        fontSize: '0.85rem',
                        color: phase.status === 'done'
                          ? '#4CAF50'
                          : phase.status === 'next'
                            ? '#FFD700'
                            : 'rgba(232, 213, 163, 0.5)',
                        fontWeight: 700,
                      }}
                    >
                      {phase.phase}: {phase.label}
                    </Text>
                    <Badge
                      size="xs"
                      sx={{
                        background: phase.status === 'done'
                          ? 'rgba(76, 175, 80, 0.15)'
                          : phase.status === 'next'
                            ? 'rgba(255, 215, 0, 0.15)'
                            : 'rgba(232, 213, 163, 0.05)',
                        color: phase.status === 'done'
                          ? '#4CAF50'
                          : phase.status === 'next'
                            ? '#FFD700'
                            : 'rgba(232, 213, 163, 0.3)',
                        border: `1px solid ${phase.status === 'done' ? 'rgba(76, 175, 80, 0.3)' : phase.status === 'next' ? 'rgba(255, 215, 0, 0.3)' : 'rgba(232, 213, 163, 0.1)'}`,
                      }}
                    >
                      {phase.status === 'done' ? 'Shipped ✓' : phase.status === 'next' ? 'Up next' : 'Planned'}
                    </Badge>
                  </Group>
                }
              >
                <Group spacing="xs" mt={6}>
                  {phase.items.map((item) => (
                    <Text
                      key={item}
                      size="xs"
                      sx={{
                        color: phase.status === 'done'
                          ? 'rgba(76, 175, 80, 0.65)'
                          : phase.status === 'next'
                            ? 'rgba(255, 215, 0, 0.55)'
                            : 'rgba(232, 213, 163, 0.25)',
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        borderRadius: '6px',
                        padding: '2px 8px',
                      }}
                    >
                      {item}
                    </Text>
                  ))}
                </Group>
              </Timeline.Item>
            ))}
          </Timeline>
        </Box>

        {/* Closing */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, rgba(201, 168, 76, 0.08) 0%, rgba(10, 8, 20, 0.8) 100%)',
            border: '1px solid rgba(201, 168, 76, 0.2)',
            borderRadius: '16px',
            padding: '32px',
            textAlign: 'center',
          }}
        >
          <Text
            sx={{
              fontFamily: '"Cinzel", serif',
              fontSize: '1.4rem',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #FFD700 0%, #C9A84C 60%, #FFE59A 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: '12px',
            }}
          >
            "Knowledge is the greatest weapon."
          </Text>
          <Text size="sm" sx={{ color: 'rgba(232, 213, 163, 0.5)', fontStyle: 'italic', marginBottom: '24px' }}>
            — Roboute Guilliman, Primarch of the Ultramarines
          </Text>
          <Group position="center" spacing="md">
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              leftIcon={<IconHome size={16} />}
              sx={{
                borderColor: 'rgba(201, 168, 76, 0.35)',
                color: '#C9A84C',
                '&:hover': { background: 'rgba(201, 168, 76, 0.1)', borderColor: '#FFD700', color: '#FFD700' },
              }}
            >
              Back to Start
            </Button>
            <Button
              onClick={() => navigate('/demo')}
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
              ⚡ Back to Demo
            </Button>
          </Group>
        </Box>

      </Stack>
    </Container>
  )
}
