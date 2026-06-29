import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Row,
  Column,
  Section,
  Text,
} from '@react-email/components'
import * as React from 'react'

interface DonationReceiptProps {
  donorName: string
  amount: string
  fund: string
  frequency: string
  date: string
  donationId: string
  receiptUrl?: string
}

export default function DonationReceipt({
  donorName = 'Valued Donor',
  amount = '$50.00',
  fund = 'General Offering',
  frequency = 'One-Time',
  date = new Date().toLocaleDateString(),
  donationId = 'DON-000001',
}: DonationReceiptProps) {
  return (
    <Html>
      <Head />
      <Preview>Your donation receipt from Greater Grace Christian Center</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={headerTitle}>Greater Grace Christian Center</Heading>
            <Text style={headerSubtitle}>Donation Receipt</Text>
          </Section>

          {/* Body */}
          <Section style={content}>
            <Text style={greeting}>Dear {donorName},</Text>
            <Text style={bodyText}>
              Thank you for your generous gift to Greater Grace Christian Center. Your faithfulness
              is making an eternal difference in lives around the world.
            </Text>

            <Section style={receiptBox}>
              <Heading as="h3" style={receiptTitle}>Giving Summary</Heading>
              <Hr style={divider} />
              <Row>
                <Column style={labelCell}>
                  <Text style={receiptLabel}>Donation ID</Text>
                </Column>
                <Column style={valueCell}>
                  <Text style={receiptValue}>{donationId}</Text>
                </Column>
              </Row>
              <Row>
                <Column style={labelCell}>
                  <Text style={receiptLabel}>Amount</Text>
                </Column>
                <Column style={valueCell}>
                  <Text style={{ ...receiptValue, color: '#C9A84C', fontWeight: '700' }}>{amount}</Text>
                </Column>
              </Row>
              <Row>
                <Column style={labelCell}>
                  <Text style={receiptLabel}>Fund</Text>
                </Column>
                <Column style={valueCell}>
                  <Text style={receiptValue}>{fund}</Text>
                </Column>
              </Row>
              <Row>
                <Column style={labelCell}>
                  <Text style={receiptLabel}>Frequency</Text>
                </Column>
                <Column style={valueCell}>
                  <Text style={receiptValue}>{frequency}</Text>
                </Column>
              </Row>
              <Row>
                <Column style={labelCell}>
                  <Text style={receiptLabel}>Date</Text>
                </Column>
                <Column style={valueCell}>
                  <Text style={receiptValue}>{date}</Text>
                </Column>
              </Row>
            </Section>

            <Text style={bodyText}>
              This receipt confirms your tax-deductible contribution. Please retain it for your
              records. GGCC is a registered 501(c)(3) nonprofit organization.
            </Text>

            <Section style={{ textAlign: 'center', marginTop: '32px' }}>
              <Button
                href={`${process.env.NEXT_PUBLIC_APP_URL || 'https://ggcc.church'}/member/my-giving`}
                style={button}
              >
                View Giving History
              </Button>
            </Section>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Greater Grace Christian Center | 1 Grace Boulevard, Houston, TX 77001
            </Text>
            <Text style={footerText}>
              Questions? Email us at <span style={{ color: '#C9A84C' }}>giving@ggcc.church</span>
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
  background: 'linear-gradient(135deg, #0A1628 0%, #0F2347 100%)',
  padding: '32px 40px',
  textAlign: 'center',
  borderBottom: '1px solid rgba(201, 168, 76, 0.2)',
}

const headerTitle: React.CSSProperties = {
  color: '#C9A84C',
  fontSize: '22px',
  fontWeight: '700',
  margin: '0 0 4px 0',
}

const headerSubtitle: React.CSSProperties = {
  color: 'rgba(255,255,255,0.6)',
  fontSize: '13px',
  margin: '0',
}

const content: React.CSSProperties = {
  padding: '32px 40px',
}

const greeting: React.CSSProperties = {
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  marginBottom: '8px',
}

const bodyText: React.CSSProperties = {
  color: 'rgba(255,255,255,0.65)',
  fontSize: '14px',
  lineHeight: '1.6',
}

const receiptBox: React.CSSProperties = {
  backgroundColor: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(201, 168, 76, 0.15)',
  borderRadius: '12px',
  padding: '20px 24px',
  margin: '24px 0',
}

const receiptTitle: React.CSSProperties = {
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: '600',
  margin: '0 0 12px 0',
}

const divider: React.CSSProperties = {
  borderColor: 'rgba(255,255,255,0.1)',
  margin: '0 0 16px 0',
}

const labelCell: React.CSSProperties = { width: '40%' }
const valueCell: React.CSSProperties = { width: '60%', textAlign: 'right' }

const receiptLabel: React.CSSProperties = {
  color: 'rgba(255,255,255,0.5)',
  fontSize: '13px',
  margin: '4px 0',
}

const receiptValue: React.CSSProperties = {
  color: '#ffffff',
  fontSize: '13px',
  fontWeight: '500',
  margin: '4px 0',
}

const button: React.CSSProperties = {
  backgroundColor: '#C9A84C',
  color: '#0A1628',
  borderRadius: '10px',
  padding: '12px 28px',
  fontSize: '14px',
  fontWeight: '700',
  textDecoration: 'none',
}

const footer: React.CSSProperties = {
  backgroundColor: 'rgba(0,0,0,0.3)',
  padding: '24px 40px',
  textAlign: 'center',
  borderTop: '1px solid rgba(255,255,255,0.06)',
}

const footerText: React.CSSProperties = {
  color: 'rgba(255,255,255,0.4)',
  fontSize: '11px',
  margin: '4px 0',
}
