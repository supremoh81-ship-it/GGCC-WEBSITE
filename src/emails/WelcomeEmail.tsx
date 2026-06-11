import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import * as React from 'react'

interface WelcomeEmailProps {
  firstName: string
  dashboardUrl: string
}

export default function WelcomeEmail({
  firstName = 'Friend',
  dashboardUrl = 'https://ggcc.church/member/dashboard',
}: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to the GGCC family, {firstName}!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={headerTitle}>Greater Grace Christian Center</Heading>
          </Section>

          <Section style={content}>
            <Heading style={welcomeTitle}>Welcome to the Family, {firstName}!</Heading>

            <Text style={bodyText}>
              We are so glad you are here. GGCC is more than a church. It is a family committed to
              knowing God deeply and serving the world boldly.
            </Text>

            <Text style={bodyText}>
              As a member you now have access to our full sermon library, live prayer wall,
              event registration, giving portal, and much more. Your faith journey just got
              a powerful community behind it.
            </Text>

            <Section style={{ textAlign: 'center', margin: '32px 0' }}>
              <Button href={dashboardUrl} style={button}>
                Explore Your Dashboard
              </Button>
            </Section>

            <Text style={bodyText}>
              Here are a few things to get you started:
            </Text>

            <Section style={listBox}>
              {[
                'Watch our latest Sunday message',
                'Submit your first prayer request',
                'Register for an upcoming event',
                'Explore our ministry teams',
              ].map((item) => (
                <Text key={item} style={listItem}>
                  <span style={{ color: '#C9A84C', marginRight: '8px' }}>•</span>
                  {item}
                </Text>
              ))}
            </Section>

            <Text style={bodyText}>
              If you have any questions, our team is always here to help at
              <span style={{ color: '#C9A84C' }}> connect@ggcc.church</span>.
            </Text>

            <Text style={{ ...bodyText, marginTop: '24px' }}>
              In faith and grace,
              <br />
              <strong style={{ color: '#ffffff' }}>The GGCC Team</strong>
            </Text>
          </Section>

          <Section style={footer}>
            <Text style={footerText}>
              Greater Grace Christian Center | 1 Grace Boulevard, Houston, TX 77001
            </Text>
            <Text style={footerText}>
              You received this email because you created a GGCC account.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const main: React.CSSProperties = {
  backgroundColor: '#0A1628',
  fontFamily: "'Inter', -apple-system, sans-serif",
}

const container: React.CSSProperties = {
  maxWidth: '560px',
  margin: '0 auto',
  backgroundColor: '#0F2347',
  borderRadius: '16px',
  overflow: 'hidden',
}

const header: React.CSSProperties = {
  background: 'linear-gradient(135deg, #0A1628, #0F2347)',
  padding: '28px 40px',
  textAlign: 'center',
  borderBottom: '1px solid rgba(201, 168, 76, 0.2)',
}

const headerTitle: React.CSSProperties = {
  color: '#C9A84C',
  fontSize: '20px',
  fontWeight: '700',
  margin: '0',
}

const content: React.CSSProperties = {
  padding: '32px 40px',
}

const welcomeTitle: React.CSSProperties = {
  color: '#ffffff',
  fontSize: '24px',
  fontWeight: '700',
  marginBottom: '16px',
}

const bodyText: React.CSSProperties = {
  color: 'rgba(255,255,255,0.65)',
  fontSize: '14px',
  lineHeight: '1.65',
  margin: '0 0 14px 0',
}

const button: React.CSSProperties = {
  backgroundColor: '#C9A84C',
  color: '#0A1628',
  borderRadius: '10px',
  padding: '12px 32px',
  fontSize: '14px',
  fontWeight: '700',
  textDecoration: 'none',
}

const listBox: React.CSSProperties = {
  backgroundColor: 'rgba(255,255,255,0.04)',
  borderRadius: '10px',
  padding: '16px 20px',
  margin: '12px 0 20px 0',
}

const listItem: React.CSSProperties = {
  color: 'rgba(255,255,255,0.7)',
  fontSize: '13px',
  margin: '4px 0',
}

const footer: React.CSSProperties = {
  backgroundColor: 'rgba(0,0,0,0.3)',
  padding: '20px 40px',
  textAlign: 'center',
  borderTop: '1px solid rgba(255,255,255,0.06)',
}

const footerText: React.CSSProperties = {
  color: 'rgba(255,255,255,0.35)',
  fontSize: '11px',
  margin: '3px 0',
}
