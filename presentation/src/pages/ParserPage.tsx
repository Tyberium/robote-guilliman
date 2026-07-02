import { useNavigate } from 'react-router-dom'
import { Container, Stack, Title, Text, Group, Button, Box, SimpleGrid, Badge } from '@mantine/core'
import { IconArrowRight } from '@tabler/icons-react'

function GlassCard({ children, accent = '#C9A84C' }: { children: React.ReactNode; accent?: string }) {
  return (
    <Box
      sx={{
        background: 'rgba(10, 8, 20, 0.8)',
        backdropFilter: 'blur(12px)',
        border: `1px solid ${accent}2a`,
        borderRadius: '16px',
        padding: '28px',
      }}
    >
      {children}
    </Box>
  )
}

const RAW_PDF_TEXT = `BATTLE-SHOCK TESTS
Some effects require a unit to take a Battle-shock
test. A Battle-shock test is taken as follows:

Roll 2D6: if the result is equal to or greater than
the unit's Leadership characteristic, the test is
passed; otherwise, the test is failed.

MORALE CHECKS
(This section is for 10th edition and refers to the
old Morale phase mechanic. The Battleshock phase
has replaced it entirely.)

                            9
Warhammer 40,000 Core Rules 2023 © Games Workshop

BATTLE-SHOCK TESTS
Some effects require a unit to take a Battle-shock
test. A Battle-shock test is taken as follows:

Roll 2D6: if...  [DUPLICATE - flowchart sidebar]`

const STRUCTURED_CHUNK = `{
  "rule_number": "09.01",
  "text": "BATTLE-SHOCK TESTS\\n\\nSome effects require a unit to take a Battle-shock test. A Battle-shock test is taken as follows:\\n\\nRoll 2D6: if the result is equal to or greater than the unit's Leadership characteristic, the test is passed; otherwise, the test is failed.",
  "page": 31,
  "section_hint": "BATTLE-SHOCK TESTS",
  "parser_profile": "core_rules_11th",
  "chunk_type": "rule",
  "has_figure": true,
  "figure_description": "Diagram showing D6 dice roll process with pass/fail outcomes and Leadership threshold comparison",
  "source": "core_rules_11th",
  "chunk_index": 42
}`

const PARSER_CODE = `# Detect rule number header patterns:
# "TITLE 09.01" or "[TWIN‑LINKED] 24.38"

RULE_PATTERN = re.compile(
    r'^(?P<title>[A-Z][A-Z0-9 ,\\-–—()\'\"]+?)\\s+'
    r'(?P<rule>\\d{2}\\.\\d{2,3})\\s*$',
    re.MULTILINE
)

# Normalise Unicode non-breaking hyphens in keywords
text = text.replace('\\u2011', '-')

# Dedupe policy: one chunk per rule_number.
# Prefer later page (glossary > flowchart),
# then longer body text.
if rule_number in seen:
    existing = seen[rule_number]
    if (chunk.page > existing.page or
        len(chunk.text) > len(existing.text)):
        seen[rule_number] = chunk
else:
    seen[rule_number] = chunk`

export default function ParserPage() {
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
            Domain-Specific Engineering
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
            The Ingestion Engine
          </Title>
          <Text
            size="md"
            sx={{ color: 'rgba(232, 213, 163, 0.7)', textAlign: 'center', maxWidth: 600 }}
          >
            Generic PDF chunking produces garbage. GW's numbered rule scheme enables something much better: one semantically complete chunk per rule number.
          </Text>
        </Stack>

        {/* Stats row */}
        <SimpleGrid cols={4} spacing="md" breakpoints={[{ maxWidth: 'sm', cols: 2 }]}>
          {[
            { value: '156', label: 'Rule chunks', sublabel: 'core rules alone', color: '#C9A84C' },
            { value: '~680', label: 'Avg chars/chunk', sublabel: 'vs 1200 naive', color: '#2196F3' },
            { value: '0', label: 'Contamination flags', sublabel: 'after 3-pass audit', color: '#4CAF50' },
            { value: '23', label: 'Pages vision-captioned', sublabel: '@ ~£0.40 total', color: '#9C27B0' },
          ].map((s) => (
            <Box
              key={s.label}
              sx={{
                background: 'rgba(10, 8, 20, 0.75)',
                border: `1px solid ${s.color}33`,
                borderRadius: '12px',
                padding: '20px',
                textAlign: 'center',
              }}
            >
              <Text
                sx={{
                  fontFamily: '"Cinzel", serif',
                  fontSize: '1.8rem',
                  fontWeight: 900,
                  color: s.color,
                  lineHeight: 1.1,
                }}
              >
                {s.value}
              </Text>
              <Text size="sm" sx={{ color: 'rgba(232, 213, 163, 0.8)', marginTop: '4px' }}>
                {s.label}
              </Text>
              <Text size="xs" sx={{ color: 'rgba(232, 213, 163, 0.4)', marginTop: '2px' }}>
                {s.sublabel}
              </Text>
            </Box>
          ))}
        </SimpleGrid>

        {/* Before / After */}
        <SimpleGrid cols={2} spacing="lg" breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
          <Stack spacing="sm">
            <Group spacing="xs">
              <Badge color="red" variant="light" sx={{ fontFamily: '"Cinzel", serif', letterSpacing: '0.1em' }}>
                BEFORE
              </Badge>
              <Text size="sm" sx={{ color: 'rgba(232, 213, 163, 0.5)' }}>
                Raw PDF text extraction
              </Text>
            </Group>
            <Box
              sx={{
                background: 'rgba(20, 5, 5, 0.8)',
                border: '1px solid rgba(139, 0, 0, 0.35)',
                borderRadius: '12px',
                padding: '20px',
                fontFamily: '"Share Tech Mono", monospace',
                fontSize: '0.72rem',
                color: 'rgba(255, 180, 180, 0.75)',
                lineHeight: 1.7,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                minHeight: 280,
              }}
            >
              {RAW_PDF_TEXT}
            </Box>
            <Stack spacing="4px">
              {[
                '❌ Footer text bleeds into content',
                '❌ Duplicate chunks from flowchart sidebars',
                '❌ Wrong edition content mixed in',
                '❌ No rule number metadata',
              ].map((item) => (
                <Text key={item} size="xs" sx={{ color: 'rgba(239, 83, 80, 0.7)' }}>
                  {item}
                </Text>
              ))}
            </Stack>
          </Stack>

          <Stack spacing="sm">
            <Group spacing="xs">
              <Badge color="green" variant="light" sx={{ fontFamily: '"Cinzel", serif', letterSpacing: '0.1em' }}>
                AFTER
              </Badge>
              <Text size="sm" sx={{ color: 'rgba(232, 213, 163, 0.5)' }}>
                Core rules parser output
              </Text>
            </Group>
            <Box
              sx={{
                background: 'rgba(5, 20, 10, 0.8)',
                border: '1px solid rgba(76, 175, 80, 0.3)',
                borderRadius: '12px',
                padding: '20px',
                fontFamily: '"Share Tech Mono", monospace',
                fontSize: '0.72rem',
                color: 'rgba(180, 255, 190, 0.8)',
                lineHeight: 1.7,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                minHeight: 280,
              }}
            >
              {STRUCTURED_CHUNK}
            </Box>
            <Stack spacing="4px">
              {[
                '✅ Exact rule number as primary key',
                '✅ Figure description from vision model',
                '✅ Clean text — no footers or duplicates',
                '✅ Page + section for human verification',
              ].map((item) => (
                <Text key={item} size="xs" sx={{ color: 'rgba(76, 175, 80, 0.7)' }}>
                  {item}
                </Text>
              ))}
            </Stack>
          </Stack>
        </SimpleGrid>

        {/* Parser highlights */}
        <SimpleGrid cols={2} spacing="lg" breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
          {/* Code snippet */}
          <GlassCard accent="#2196F3">
            <Text
              sx={{
                fontFamily: '"Cinzel", serif',
                color: '#2196F3',
                fontWeight: 700,
                fontSize: '0.9rem',
                marginBottom: '12px',
              }}
            >
              Core Parser Logic
            </Text>
            <Box
              sx={{
                background: 'rgba(5, 10, 25, 0.9)',
                borderRadius: '10px',
                padding: '16px',
                fontFamily: '"Share Tech Mono", monospace',
                fontSize: '0.68rem',
                color: 'rgba(180, 210, 255, 0.85)',
                lineHeight: 1.7,
                whiteSpace: 'pre-wrap',
                overflowX: 'auto',
              }}
            >
              {PARSER_CODE}
            </Box>
          </GlassCard>

          {/* 3-pass audit */}
          <Stack spacing="md">
            <GlassCard accent="#9C27B0">
              <Text
                sx={{
                  fontFamily: '"Cinzel", serif',
                  color: '#9C27B0',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  marginBottom: '12px',
                }}
              >
                Three-Pass Quality Audit
              </Text>
              <Stack spacing="sm">
                {[
                  {
                    pass: 'P2',
                    label: 'Contamination scan',
                    before: '51 flagged',
                    after: '0 flagged',
                    color: '#EF5350',
                  },
                  {
                    pass: 'P3',
                    label: 'Unicode normalisation',
                    before: 'TWIN‑LINKED broken',
                    after: 'TWIN-LINKED clean',
                    color: '#FFD700',
                  },
                  {
                    pass: 'P4',
                    label: 'Coverage verification',
                    before: 'gaps in 17/24',
                    after: '156/156 present',
                    color: '#4CAF50',
                  },
                ].map((item) => (
                  <Box
                    key={item.pass}
                    sx={{
                      display: 'flex',
                      gap: '12px',
                      alignItems: 'flex-start',
                    }}
                  >
                    <Badge
                      sx={{
                        background: `${item.color}22`,
                        color: item.color,
                        border: `1px solid ${item.color}44`,
                        fontFamily: '"Share Tech Mono", monospace',
                        minWidth: 32,
                        flexShrink: 0,
                      }}
                    >
                      {item.pass}
                    </Badge>
                    <Box sx={{ flex: 1 }}>
                      <Text size="xs" sx={{ color: 'rgba(232, 213, 163, 0.8)', fontWeight: 600, marginBottom: '2px' }}>
                        {item.label}
                      </Text>
                      <Group spacing="xs">
                        <Text size="xs" sx={{ color: '#EF5350', fontFamily: '"Share Tech Mono", monospace' }}>
                          {item.before}
                        </Text>
                        <Text size="xs" sx={{ color: 'rgba(232, 213, 163, 0.3)' }}>→</Text>
                        <Text size="xs" sx={{ color: '#4CAF50', fontFamily: '"Share Tech Mono", monospace' }}>
                          {item.after}
                        </Text>
                      </Group>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </GlassCard>

            <GlassCard accent="#C9A84C">
              <Text
                sx={{
                  fontFamily: '"Cinzel", serif',
                  color: '#C9A84C',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  marginBottom: '12px',
                }}
              >
                Vision Enrichment
              </Text>
              <Text size="sm" sx={{ color: 'rgba(232, 213, 163, 0.65)', lineHeight: 1.7, marginBottom: '12px' }}>
                23 diagram-heavy pages were captioned with Gemini 2.5 Pro Vision at ingest time. A
                <Text component="span" sx={{ color: '#FFD700', fontFamily: '"Share Tech Mono", monospace' }}> diagram_score</Text> (drawing count + image count ÷ text ratio) identifies candidates.
                Captions are stored in <Text component="span" sx={{ color: '#FFD700', fontFamily: '"Share Tech Mono", monospace' }}>page_captions.json</Text> and merged at ingest — making visual rules
                searchable as natural text.
              </Text>
              <Text size="xs" sx={{ color: 'rgba(201, 168, 76, 0.5)', fontFamily: '"Share Tech Mono", monospace' }}>
                Total cost: ~£0.40 (one-time) · never repeated
              </Text>
            </GlassCard>
          </Stack>
        </SimpleGrid>

        <Group position="center" mt="md">
          <Button
            size="lg"
            rightIcon={<IconArrowRight size={18} />}
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
            ⚡ See It Live
          </Button>
        </Group>

      </Stack>
    </Container>
  )
}
