import {
  Html, Head, Body, Container, Section, Heading, Text, Hr, Preview
} from '@react-email/components'

interface Props {
  firstName: string
  prayerTitle: string
  isAnonymous: boolean
}

export function PrayerConfirmation({ firstName, prayerTitle, isAnonymous }: Props) {
  return (
    <Html>
      <Head />
      <Preview>Your prayer request has been received</Preview>
      <Body style={{ backgroundColor: '#0A1628', fontFamily: 'Inter, sans-serif', margin: 0 }}>
        <Container style={{ maxWidth: 580, margin: '0 auto', padding: '40px 20px' }}>
          <Section style={{ textAlign: 'center', marginBottom: 32 }}>
            <Text style={{ color: '#C9A84C', fontSize: 13, fontWeight: 600, letterSpacing: 4, textTransform: 'uppercase', margin: 0 }}>
              Greater Grace Christian Center
            </Text>
          </Section>

          <Section style={{ backgroundColor: '#0F2347', borderRadius: 16, padding: '40px 36px', border: '1px solid rgba(201,168,76,0.2)' }}>
            <Section style={{ textAlign: 'center', marginBottom: 24 }}>
              <Text style={{ fontSize: 40, margin: 0 }}>🙏</Text>
            </Section>

            <Heading style={{ color: '#ffffff', fontSize: 26, fontWeight: 700, margin: '0 0 8px', textAlign: 'center' }}>
              We&apos;re Praying With You
            </Heading>
            <Text style={{ color: '#94A3B8', fontSize: 15, textAlign: 'center', margin: '0 0 32px' }}>
              {firstName}, your prayer has been received
            </Text>

            <Section style={{ backgroundColor: 'rgba(201,168,76,0.05)', borderRadius: 12, padding: '24px', border: '1px solid rgba(201,168,76,0.15)', marginBottom: 28 }}>
              <Text style={{ color: '#64748B', fontSize: 12, margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: 2 }}>Prayer Request</Text>
              <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: 600, margin: 0 }}>{prayerTitle}</Text>
              {isAnonymous && (
                <>
                  <Hr style={{ borderColor: 'rgba(255,255,255,0.08)', margin: '16px 0' }} />
                  <Text style={{ color: '#94A3B8', fontSize: 13, margin: 0 }}>
                    Your request is shared anonymously on the prayer wall.
                  </Text>
                </>
              )}
            </Section>

            <Text style={{ color: '#94A3B8', fontSize: 14, lineHeight: 1.8, margin: '0 0 20px' }}>
              Our prayer team has been notified and will intercede on your behalf. The community of GGCC stands with you in faith.
            </Text>

            <Section style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: '20px', borderLeft: '3px solid #C9A84C', marginBottom: 24 }}>
              <Text style={{ color: '#C9A84C', fontSize: 13, fontStyle: 'italic', margin: 0, lineHeight: 1.7 }}>
                &ldquo;Therefore I tell you, whatever you ask in prayer, believe that you have received it, and it will be yours.&rdquo;
              </Text>
              <Text style={{ color: '#64748B', fontSize: 12, margin: '8px 0 0' }}>Mark 11:24</Text>
            </Section>

            <Text style={{ color: '#94A3B8', fontSize: 14, lineHeight: 1.6, margin: 0 }}>
              You can view your prayer on our{' '}
              <span style={{ color: '#C9A84C' }}>Prayer Wall</span>{' '}
              and see how many people are interceding with you.
            </Text>
          </Section>

          <Text style={{ color: '#475569', fontSize: 12, textAlign: 'center', marginTop: 32 }}>
            Greater Grace Christian Center · connect@ggcc.church
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export default PrayerConfirmation
