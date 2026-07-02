import { useState } from 'react'
import {
  Container,
  Stack,
  Title,
  Text,
  Group,
  Button,
  Box,
  Textarea,
  Badge,
  Loader,
  SimpleGrid,
} from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { IconSend, IconRefresh } from '@tabler/icons-react'

const API_URL = 'https://roboto-guilliman-wifsng2koa-ew.a.run.app'

interface ContextChunk {
  page: number | null
  section_hint: string | null
  rule_number: string | null
  source: string | null
  has_figure: boolean
  preview: string
}

interface AskResponse {
  answer: string
  cached: boolean
  context_chunks: ContextChunk[]
}

const EXAMPLE_QUERIES = [
  {
    label: 'Battle-shock',
    query: 'What happens when a unit fails a Battle-shock test?',
    description: 'Core mechanic — shows cited rule number',
    color: '#C9A84C',
  },
  {
    label: 'Heresy refusal ⚔️',
    query: 'How did coherency work in 9th edition?',
    description: 'Edition guard — zero LLM cost',
    color: '#EF5350',
  },
  {
    label: 'TWIN-LINKED',
    query: 'What does the TWIN-LINKED keyword do?',
    description: 'Tests Unicode normalisation in parser',
    color: '#2196F3',
  },
  {
    label: 'Fight phase',
    query: 'How does the Fight phase work?',
    description: 'Multi-step rules — tests top-k retrieval',
    color: '#9C27B0',
  },
]

function AnswerDisplay({ response, elapsed }: { response: AskResponse; elapsed: number }) {
  const isHeresy = response.answer.toLowerCase().includes('heresy')

  return (
    <Stack spacing="md">
      {/* Status bar */}
      <Group position="apart">
        <Group spacing="xs">
          {response.cached && (
            <Badge color="yellow" variant="light" sx={{ fontFamily: '"Share Tech Mono", monospace' }}>
              ⚡ Cached
            </Badge>
          )}
          <Badge
            color={isHeresy ? 'red' : 'green'}
            variant="light"
            sx={{ fontFamily: '"Share Tech Mono", monospace' }}
          >
            {isHeresy ? '🛡️ Edition Guard' : `✅ ${response.context_chunks.length} chunks retrieved`}
          </Badge>
          <Text size="xs" sx={{ color: 'rgba(232, 213, 163, 0.4)', fontFamily: '"Share Tech Mono", monospace' }}>
            {elapsed}ms
          </Text>
        </Group>
      </Group>

      {/* Answer */}
      <Box
        sx={{
          background: isHeresy ? 'rgba(20, 5, 5, 0.8)' : 'rgba(5, 15, 10, 0.8)',
          border: `1px solid ${isHeresy ? 'rgba(139, 0, 0, 0.4)' : 'rgba(76, 175, 80, 0.3)'}`,
          borderRadius: '12px',
          padding: '24px',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          fontSize: '0.9rem',
          color: isHeresy ? 'rgba(255, 180, 180, 0.85)' : 'rgba(200, 240, 210, 0.9)',
          lineHeight: 1.75,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        {isHeresy && (
          <Text
            sx={{
              fontFamily: '"Cinzel", serif',
              fontSize: '1.1rem',
              color: '#EF5350',
              marginBottom: '12px',
              fontWeight: 700,
            }}
          >
            ⚔️ HERESY DETECTED
          </Text>
        )}
        {response.answer}
      </Box>

      {/* Context chunks */}
      {response.context_chunks.length > 0 && (
        <Box>
          <Text
            size="xs"
            sx={{
              fontFamily: '"Cinzel", serif',
              color: 'rgba(201, 168, 76, 0.6)',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              marginBottom: '10px',
            }}
          >
            Retrieved Context Chunks
          </Text>
          <SimpleGrid cols={2} spacing="sm" breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
            {response.context_chunks.map((chunk, i) => (
              <Box
                key={i}
                sx={{
                  background: 'rgba(10, 8, 20, 0.7)',
                  border: '1px solid rgba(201, 168, 76, 0.15)',
                  borderRadius: '10px',
                  padding: '14px',
                }}
              >
                <Group position="apart" mb={6}>
                  <Group spacing="xs">
                    {chunk.rule_number && (
                      <Badge
                        size="sm"
                        sx={{
                          background: 'rgba(201, 168, 76, 0.15)',
                          color: '#C9A84C',
                          fontFamily: '"Share Tech Mono", monospace',
                          border: '1px solid rgba(201, 168, 76, 0.3)',
                        }}
                      >
                        Rule {chunk.rule_number}
                      </Badge>
                    )}
                    {chunk.has_figure && (
                      <Badge size="sm" color="grape" variant="light">
                        📊 diagram
                      </Badge>
                    )}
                  </Group>
                  {chunk.page && (
                    <Text size="xs" sx={{ color: 'rgba(232, 213, 163, 0.3)', fontFamily: '"Share Tech Mono", monospace' }}>
                      p.{chunk.page}
                    </Text>
                  )}
                </Group>
                {chunk.section_hint && (
                  <Text size="xs" sx={{ color: 'rgba(232, 213, 163, 0.6)', fontWeight: 600, marginBottom: '4px', fontFamily: '"Cinzel", serif', fontSize: '0.7rem' }}>
                    {chunk.section_hint}
                  </Text>
                )}
                <Text size="xs" sx={{ color: 'rgba(232, 213, 163, 0.5)', lineHeight: 1.5 }}>
                  {chunk.preview}
                </Text>
              </Box>
            ))}
          </SimpleGrid>
        </Box>
      )}
    </Stack>
  )
}

export default function DemoPage() {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [warming, setWarming] = useState(false)
  const [response, setResponse] = useState<AskResponse | null>(null)
  const [elapsed, setElapsed] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const warmUp = async () => {
    setWarming(true)
    try {
      await fetch(`${API_URL}/health`)
      showNotification({
        title: 'Service warm',
        message: 'Roboto Guilliman is online and ready.',
        color: 'green',
      })
    } catch {
      showNotification({
        title: 'Warm-up failed',
        message: 'Could not reach the API. Check network.',
        color: 'red',
      })
    }
    setWarming(false)
  }

  const ask = async (queryText: string) => {
    if (!queryText.trim()) return
    setLoading(true)
    setError(null)
    setResponse(null)
    const start = Date.now()
    try {
      const res = await fetch(`${API_URL}/v1/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: queryText.trim() }),
      })
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${await res.text()}`)
      }
      const data: AskResponse = await res.json()
      setElapsed(Date.now() - start)
      setResponse(data)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error'
      setError(msg)
      showNotification({
        title: 'Request failed',
        message: msg.includes('CORS') || msg.includes('fetch')
          ? 'CORS or network error. Ensure the API is deployed with CORS enabled.'
          : msg,
        color: 'red',
      })
    }
    setLoading(false)
  }

  const selectExample = (q: string) => {
    setQuery(q)
    setResponse(null)
    setError(null)
  }

  return (
    <Container size="lg" py={60}>
      <Stack spacing="xl">

        <Stack spacing="sm" align="center" mb="sm">
          <Text
            sx={{
              fontFamily: '"Cinzel", serif',
              fontSize: '0.75rem',
              color: 'rgba(201, 168, 76, 0.6)',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
            }}
          >
            Live API
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
            Ask the Arbiter
          </Title>
          <Text
            size="md"
            sx={{ color: 'rgba(232, 213, 163, 0.7)', textAlign: 'center', maxWidth: 540 }}
          >
            Live calls to{' '}
            <Text component="span" sx={{ fontFamily: '"Share Tech Mono", monospace', color: '#C9A84C', fontSize: '0.85em' }}>
              roboto-guilliman-wifsng2koa-ew.a.run.app
            </Text>
            {' '}— a real Cloud Run service.
          </Text>
        </Stack>

        {/* Warm-up note */}
        <Box
          sx={{
            background: 'rgba(33, 150, 243, 0.08)',
            border: '1px solid rgba(33, 150, 243, 0.25)',
            borderRadius: '10px',
            padding: '14px 20px',
          }}
        >
          <Group position="apart">
            <Text size="sm" sx={{ color: 'rgba(150, 200, 255, 0.8)' }}>
              💡 Cloud Run scales to zero — first request may take 5–15s to cold-start.
            </Text>
            <Button
              size="xs"
              variant="outline"
              onClick={warmUp}
              loading={warming}
              leftIcon={<IconRefresh size={14} />}
              sx={{
                borderColor: 'rgba(33, 150, 243, 0.4)',
                color: '#64B5F6',
                '&:hover': { background: 'rgba(33, 150, 243, 0.1)' },
              }}
            >
              Warm up service
            </Button>
          </Group>
        </Box>

        {/* Example queries */}
        <Box>
          <Text
            size="xs"
            sx={{
              fontFamily: '"Cinzel", serif',
              color: 'rgba(201, 168, 76, 0.6)',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              marginBottom: '10px',
            }}
          >
            Try These Examples
          </Text>
          <SimpleGrid cols={4} spacing="sm" breakpoints={[{ maxWidth: 'sm', cols: 2 }]}>
            {EXAMPLE_QUERIES.map((ex) => (
              <Box
                key={ex.label}
                onClick={() => selectExample(ex.query)}
                sx={{
                  background: query === ex.query ? `${ex.color}15` : 'rgba(10, 8, 20, 0.7)',
                  border: `1px solid ${query === ex.query ? ex.color + '50' : ex.color + '20'}`,
                  borderRadius: '10px',
                  padding: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    background: `${ex.color}10`,
                    borderColor: `${ex.color}40`,
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <Text size="sm" sx={{ color: ex.color, fontWeight: 700, marginBottom: '4px', fontFamily: '"Cinzel", serif', fontSize: '0.8rem' }}>
                  {ex.label}
                </Text>
                <Text size="xs" sx={{ color: 'rgba(232, 213, 163, 0.5)', lineHeight: 1.5 }}>
                  {ex.description}
                </Text>
              </Box>
            ))}
          </SimpleGrid>
        </Box>

        {/* Query input */}
        <Box>
          <Textarea
            value={query}
            onChange={(e) => setQuery(e.currentTarget.value)}
            placeholder="Ask a Warhammer 40,000 11th edition rules question..."
            minRows={3}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                void ask(query)
              }
            }}
            sx={{
              '.mantine-Textarea-input': {
                background: 'rgba(10, 8, 20, 0.8)',
                border: '1px solid rgba(201, 168, 76, 0.25)',
                color: '#E8D5A3',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                fontSize: '0.95rem',
                '&:focus': {
                  borderColor: 'rgba(201, 168, 76, 0.6)',
                  boxShadow: '0 0 0 2px rgba(201, 168, 76, 0.1)',
                },
                '&::placeholder': {
                  color: 'rgba(232, 213, 163, 0.3)',
                },
              },
            }}
          />
          <Group position="right" mt="sm">
            <Text size="xs" sx={{ color: 'rgba(232, 213, 163, 0.3)' }}>
              ⌘↵ to submit
            </Text>
            <Button
              leftIcon={loading ? <Loader size={16} color="white" /> : <IconSend size={16} />}
              disabled={loading || !query.trim()}
              onClick={() => void ask(query)}
              sx={{
                background: 'linear-gradient(135deg, #C9A84C 0%, #8B6914 100%)',
                color: '#08080f',
                fontWeight: 700,
                '&:hover': {
                  background: 'linear-gradient(135deg, #FFD700 0%, #C9A84C 100%)',
                },
                '&:disabled': { opacity: 0.5 },
              }}
            >
              {loading ? 'Consulting the codex...' : 'Submit to the Arbiter'}
            </Button>
          </Group>
        </Box>

        {/* Loading state */}
        {loading && (
          <Box
            sx={{
              textAlign: 'center',
              padding: '40px',
              background: 'rgba(10, 8, 20, 0.6)',
              borderRadius: '16px',
              border: '1px solid rgba(201, 168, 76, 0.15)',
            }}
          >
            <Loader color="yellow" size="lg" mb="md" />
            <Text sx={{ fontFamily: '"Cinzel", serif', color: '#C9A84C', fontSize: '1rem' }}>
              Consulting the Imperial Archives...
            </Text>
            <Text size="sm" sx={{ color: 'rgba(232, 213, 163, 0.5)', marginTop: '8px' }}>
              Embedding → Vector Search → Gemini 2.5 Flash-Lite
            </Text>
          </Box>
        )}

        {/* Error state */}
        {error && !loading && (
          <Box
            sx={{
              background: 'rgba(20, 5, 5, 0.8)',
              border: '1px solid rgba(139, 0, 0, 0.4)',
              borderRadius: '12px',
              padding: '20px',
            }}
          >
            <Text sx={{ color: '#EF5350', fontWeight: 700, marginBottom: '8px' }}>
              ⚠️ Request Failed
            </Text>
            <Text size="sm" sx={{ color: 'rgba(255, 180, 180, 0.7)', fontFamily: '"Share Tech Mono", monospace' }}>
              {error}
            </Text>
          </Box>
        )}

        {/* Response */}
        {response && !loading && (
          <Box
            sx={{
              background: 'rgba(10, 8, 20, 0.8)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(201, 168, 76, 0.2)',
              borderRadius: '16px',
              padding: '28px',
            }}
          >
            <AnswerDisplay response={response} elapsed={elapsed} />
          </Box>
        )}

      </Stack>
    </Container>
  )
}
