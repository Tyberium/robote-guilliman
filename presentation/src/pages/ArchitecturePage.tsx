import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Stack, Title, Text, Group, Button, Box, SimpleGrid } from '@mantine/core'
import { IconArrowRight, IconArrowDown } from '@tabler/icons-react'

interface PipelineStep {
  id: number
  label: string
  sublabel: string
  icon: string
  color: string
  detail: string
  branch?: { condition: string; result: string; resultColor: string }
}

const STEPS: PipelineStep[] = [
  {
    id: 1,
    label: 'Player Query',
    sublabel: 'Natural language input',
    icon: '💬',
    color: '#E8D5A3',
    detail: 'Any WH40K rules question, e.g. "What happens when a unit fails a Battle-shock test?"',
  },
  {
    id: 2,
    label: 'Edition Guard',
    sublabel: 'Regex + zero LLM cost',
    icon: '🛡️',
    color: '#EF5350',
    detail: 'Regex checks for "9th edition", "10th ed", "old rules" etc. Returns "What sort of heresy is this?" instantly — no Vertex AI call made.',
    branch: {
      condition: 'Legacy edition detected?',
      result: '"What sort of heresy is this?" ⚔️',
      resultColor: '#EF5350',
    },
  },
  {
    id: 3,
    label: 'Cache Lookup',
    sublabel: 'SHA-256 keyed, Firestore',
    icon: '⚡',
    color: '#FFD700',
    detail: 'Query is normalised (strip, lowercase) then SHA-256 hashed. Hits the Firestore chat_history collection. Cache hit skips both embedding and LLM.',
    branch: {
      condition: 'Seen this question before?',
      result: 'Return cached answer instantly',
      resultColor: '#FFD700',
    },
  },
  {
    id: 4,
    label: 'text-embedding-004',
    sublabel: '768-dim vector · Vertex AI',
    icon: '🧮',
    color: '#2196F3',
    detail: 'Google\'s text-embedding-004 model encodes the query with RETRIEVAL_QUERY task type. Produces a 768-dimensional float vector representing semantic meaning.',
  },
  {
    id: 5,
    label: 'Firestore Vector Search',
    sublabel: 'COSINE · top-k=8 chunks',
    icon: '🔍',
    color: '#9C27B0',
    detail: 'Native Firestore find_nearest() call with COSINE distance. Returns the 8 most semantically similar rule chunks from 156 ingested documents. No external vector DB needed.',
  },
  {
    id: 6,
    label: 'Gemini 2.5 Flash-Lite',
    sublabel: 'Grounded generation · temp 0.3',
    icon: '🤖',
    color: '#4CAF50',
    detail: 'System prompt enforces the Primarch persona, requires [Rule XX.XX] citations, and instructs the model to refuse if context is insufficient. Temperature 0.3 for consistent, factual output.',
  },
  {
    id: 7,
    label: 'Answer + Citations',
    sublabel: 'Write back to cache',
    icon: '📜',
    color: '#C9A84C',
    detail: 'Structured response with the answer text, cached flag, and context_chunks array showing rule numbers, page, section, and a 180-char preview. Answer is written to cache for future hits.',
  },
]

function PipelineNode({
  step,
  isActive,
  delay,
}: {
  step: PipelineStep
  isActive: boolean
  delay: number
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        animation: `fadeInUp 0.5s ease both`,
        animationDelay: `${delay}s`,
      }}
    >
      {/* Branch label */}
      {step.branch && (
        <Box
          sx={{
            background: 'rgba(10, 8, 20, 0.7)',
            border: '1px dashed rgba(201, 168, 76, 0.3)',
            borderRadius: '8px',
            padding: '8px 16px',
            marginBottom: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Text size="xs" sx={{ color: 'rgba(232, 213, 163, 0.5)' }}>
            {step.branch.condition}
          </Text>
          <IconArrowRight size={12} color="rgba(232, 213, 163, 0.3)" />
          <Text size="xs" sx={{ color: step.branch.resultColor, fontFamily: '"Share Tech Mono", monospace' }}>
            {step.branch.result}
          </Text>
        </Box>
      )}

      {/* Main node */}
      <Box
        sx={{
          background: isActive
            ? `rgba(10, 8, 20, 0.95)`
            : 'rgba(10, 8, 20, 0.7)',
          border: `1.5px solid ${isActive ? step.color : step.color + '44'}`,
          borderRadius: '14px',
          padding: '18px 24px',
          width: '100%',
          maxWidth: 480,
          boxShadow: isActive ? `0 0 24px ${step.color}30` : 'none',
          transition: 'all 0.4s ease',
          cursor: 'default',
        }}
      >
        <Group spacing="md">
          <Text sx={{ fontSize: '1.8rem', lineHeight: 1 }}>{step.icon}</Text>
          <Box sx={{ flex: 1 }}>
            <Group position="apart" mb={2}>
              <Text
                sx={{
                  fontFamily: '"Cinzel", serif',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  color: isActive ? step.color : 'rgba(232, 213, 163, 0.85)',
                  transition: 'color 0.4s ease',
                }}
              >
                {step.label}
              </Text>
              <Text
                size="xs"
                sx={{
                  fontFamily: '"Share Tech Mono", monospace',
                  color: `${step.color}88`,
                  fontSize: '0.7rem',
                }}
              >
                {step.sublabel}
              </Text>
            </Group>
            <Text size="xs" sx={{ color: 'rgba(232, 213, 163, 0.55)', lineHeight: 1.6 }}>
              {step.detail}
            </Text>
          </Box>
        </Group>
      </Box>
    </Box>
  )
}

export default function ArchitecturePage() {
  const navigate = useNavigate()
  const [activeStep, setActiveStep] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const runAnimation = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setActiveStep(0)
    STEPS.forEach((_, i) => {
      setTimeout(() => {
        setActiveStep(i + 1)
        if (i === STEPS.length - 1) {
          setTimeout(() => {
            setIsAnimating(false)
            setActiveStep(0)
          }, 1500)
        }
      }, i * 700)
    })
  }

  useEffect(() => {
    const timer = setTimeout(runAnimation, 600)
    return () => clearTimeout(timer)
  }, [])

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
            System Design
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
            The RAG Pipeline
          </Title>
          <Text
            size="md"
            sx={{ color: 'rgba(232, 213, 163, 0.7)', textAlign: 'center', maxWidth: 560 }}
          >
            Retrieval-Augmented Generation — grounding LLM answers in official GW source material with full citation traceability.
          </Text>
        </Stack>

        <SimpleGrid cols={2} spacing="xl" breakpoints={[{ maxWidth: 'md', cols: 1 }]}>
          {/* Pipeline column */}
          <Stack spacing="sm">
            {STEPS.map((step, i) => (
              <Box key={step.id}>
                <PipelineNode
                  step={step}
                  isActive={activeStep === step.id}
                  delay={i * 0.08}
                />
                {i < STEPS.length - 1 && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', margin: '4px 0' }}>
                    <IconArrowDown
                      size={16}
                      color={`rgba(201, 168, 76, ${activeStep > i + 1 ? 0.6 : 0.2})`}
                      style={{ transition: 'color 0.4s ease' }}
                    />
                  </Box>
                )}
              </Box>
            ))}
          </Stack>

          {/* Side panel */}
          <Stack spacing="md">
            {/* Key design decisions */}
            <Box
              sx={{
                background: 'rgba(10, 8, 20, 0.8)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(201, 168, 76, 0.2)',
                borderRadius: '16px',
                padding: '24px',
                animation: 'fadeInUp 0.5s ease both',
                animationDelay: '0.4s',
              }}
            >
              <Title order={4} sx={{ fontFamily: '"Cinzel", serif', color: '#C9A84C', marginBottom: '16px', fontSize: '1rem' }}>
                Design Decisions
              </Title>
              <Stack spacing="md">
                {[
                  {
                    title: 'Why Firestore native vectors?',
                    body: 'No additional infrastructure cost. Firestore vector search is free tier eligible, co-located with the metadata, and avoids Pinecone/Weaviate complexity.',
                    color: '#9C27B0',
                  },
                  {
                    title: 'Why cache with SHA-256?',
                    body: 'Rules questions repeat a lot — especially common ones like Battle-shock. The cache eliminates 100% of embedding + LLM cost on repeated queries.',
                    color: '#FFD700',
                  },
                  {
                    title: 'Why temperature 0.3?',
                    body: 'Rules answers must be precise, not creative. Low temperature keeps the model close to the retrieved context and reduces drift from canonical text.',
                    color: '#4CAF50',
                  },
                  {
                    title: 'Why top-k=8 chunks?',
                    body: 'Empirically balanced: enough context for multi-step rules (e.g. modifiers + actions) without hitting token limits or introducing irrelevant chunks.',
                    color: '#2196F3',
                  },
                ].map((item) => (
                  <Box key={item.title}>
                    <Text
                      size="sm"
                      sx={{
                        fontWeight: 700,
                        color: item.color,
                        marginBottom: '4px',
                        fontFamily: '"Cinzel", serif',
                        fontSize: '0.8rem',
                      }}
                    >
                      {item.title}
                    </Text>
                    <Text size="xs" sx={{ color: 'rgba(232, 213, 163, 0.6)', lineHeight: 1.6 }}>
                      {item.body}
                    </Text>
                  </Box>
                ))}
              </Stack>
            </Box>

            {/* Replay button */}
            <Button
              variant="outline"
              onClick={runAnimation}
              disabled={isAnimating}
              sx={{
                borderColor: 'rgba(201, 168, 76, 0.4)',
                color: '#C9A84C',
                '&:hover': { background: 'rgba(201, 168, 76, 0.1)', borderColor: '#FFD700', color: '#FFD700' },
                '&:disabled': { opacity: 0.4 },
              }}
            >
              {isAnimating ? '⚙️ Processing query...' : '▶ Replay animation'}
            </Button>

            <Button
              size="lg"
              rightIcon={<IconArrowRight size={18} />}
              onClick={() => navigate('/parser')}
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
              Under the Hood →
            </Button>
          </Stack>
        </SimpleGrid>

      </Stack>
    </Container>
  )
}
