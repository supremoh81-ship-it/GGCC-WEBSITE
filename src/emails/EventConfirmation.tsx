import {
  Html, Head, Body, Container, Section, Heading, Text, Hr, Link, Preview
} from '@react-email/components'

interface Props {
  firstName: string
  eventTitle: string
  eventDate: string
  eventTime: string
  eventLocation: string
  eventType: 'IN_PERSON' | 'ONLINE' | 'HYBRID'
  onlineUrl?: string
  confirmationCode: string
}

export function EventConfirmation({
  firstName,
  eventTitle,
  eventDate,
  eventTime,
  eventLocation,
  eventType,
  onlineUrl,
  confirmationCode,
}: Props) {
  return (
    <Html>
      <Head />
      <Preview>You're registered: {eventTitle}</Preview>
      <Body style={{ backgroundColor: '#100B16', fontFamily: 'Inter, sans-serif', margin: 0 }}>
        <Container style={{ maxWidth: 580, margin: '0 auto', padding: '40px 20px' }}>
          {/* Header */}
          <Section style={{ textAlign: 'center', marginBottom: 32 }}>
            <Text style={{ color: '#C9A84C', fontSize: 13, fontWeight: 600, letterSpacing: 4, textTransform: 'uppercase', margin: 0 }}>
              Greater Grace Christian Center
            </Text>
          </Section>

          {/* Card */}
          <Section style={{ backgroundColor: '#1C1422', borderRadius: 16, padding: '40px 36px', border: '1px solid rgba(201,168,76,0.2)' }}>
            {/* Icon */}
            <Section style={{ textAlign: 'center', marginBottom: 24 }}>
              <Text style={{ fontSize: 40, margin: 0 }}>🎉</Text>
            </Section>

            <Heading style={{ color: '#ffffff', fontSize: 26, fontWeight: 700, margin: '0 0 8px', textAlign: 'center' }}>
              You&apos;re Registered!
            </Heading>
            <Text style={{ color: '#94A3B8', fontSize: 15, textAlign: 'center', margin: '0 0 32px' }}>
              Hi {firstName}, your spot is confirmed for
            </Text>

            {/* Event details */}
            <Section style={{ backgroundColor: 'rgba(201,168,76,0.05)', borderRadius: 12, padding: '24px', border: '1px solid rgba(201,168,76,0.15)', marginBottom: 28 }}>
              <Text style={{ color: '#C9A84C', fontSize: 18, fontWeight: 700, margin: '0 0 16px' }}>{eventTitle}</Text>
              <Hr style={{ borderColor: 'rgba(255,255,255,0.08)', margin: '0 0 16px' }} />
              <table style={{ width: '100%' }}>
                <tbody>
                  <tr>
                    <td style={{ color: '#64748B', fontSize: 13, paddingBottom: 8 }}>Date</td>
                    <td style={{ color: '#ffffff', fontSize: 13, fontWeight: 600, textAlign: 'right', paddingBottom: 8 }}>{eventDate}</td>
                  </tr>
                  <tr>
                    <td style={{ color: '#64748B', fontSize: 13, paddingBottom: 8 }}>Time</td>
                    <td style={{ color: '#ffffff', fontSize: 13, fontWeight: 600, textAlign: 'right', paddingBottom: 8 }}>{eventTime}</td>
                  </tr>
                  {eventType !== 'ONLINE' && (
                    <tr>
                      <td style={{ color: '#64748B', fontSize: 13, paddingBottom: 8 }}>Location</td>
                      <td style={{ color: '#ffffff', fontSize: 13, fontWeight: 600, textAlign: 'right', paddingBottom: 8 }}>{eventLocation}</td>
                    </tr>
                  )}
                  {(eventType === 'ONLINE' || eventType === 'HYBRID') && onlineUrl && (
                    <tr>
                      <td style={{ color: '#64748B', fontSize: 13, paddingBottom: 8 }}>Join Online</td>
                      <td style={{ textAlign: 'right', paddingBottom: 8 }}>
                        <Link href={onlineUrl} style={{ color: '#C9A84C', fontSize: 13, fontWeight: 600 }}>Join Link</Link>
                      </td>
                    </tr>
                  )}
                  <tr>
                    <td style={{ color: '#64748B', fontSize: 13 }}>Confirmation</td>
                    <td style={{ color: '#C9A84C', fontSize: 13, fontWeight: 700, textAlign: 'right', fontFamily: 'monospace', letterSpacing: 2 }}>{confirmationCode}</td>
                  </tr>
                </tbody>
              </table>
            </Section>

            <Text style={{ color: '#94A3B8', fontSize: 14, lineHeight: 1.6, margin: '0 0 24px' }}>
              Please save this email and bring your confirmation code to the event. We look forward to seeing you!
            </Text>

            <Section style={{ textAlign: 'center' }}>
              <Link
                href={`${process.env.NEXT_PUBLIC_APP_URL || 'https://ggcc.church'}/events`}
                style={{ display: 'inline-block', backgroundColor: '#C9A84C', color: '#100B16', fontWeight: 700, fontSize: 14, borderRadius: 10, padding: '14px 32px', textDecoration: 'none' }}
              >
                View Event Details
              </Link>
            </Section>
          </Section>

          {/* Footer */}
          <Text style={{ color: '#475569', fontSize: 12, textAlign: 'center', marginTop: 32 }}>
            Greater Grace Christian Center · connect@ggcc.church
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export default EventConfirmation
