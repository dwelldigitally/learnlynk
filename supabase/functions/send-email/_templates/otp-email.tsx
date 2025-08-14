import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Section,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface OTPEmailProps {
  otp: string
  name?: string
}

export const OTPEmail = ({ otp, name }: OTPEmailProps) => (
  <Html>
    <Head />
    <Preview>Your Learnlynk verification code: {otp}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Email Verification</Heading>
        <Text style={text}>Hello {name || 'there'},</Text>
        <Text style={text}>Welcome to Learnlynk! Please use the verification code below to verify your email address:</Text>
        
        <Section style={codeContainer}>
          <Text style={codeText}>{otp}</Text>
        </Section>
        
        <Text style={text}>This code will expire in 10 minutes.</Text>
        <Text style={text}>If you didn't create an account with Learnlynk, please ignore this email.</Text>
        
        <Text style={footer}>
          This is an automated message, please do not reply to this email.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default OTPEmail

const main = {
  backgroundColor: '#ffffff',
  fontFamily: 'Arial, sans-serif',
}

const container = {
  paddingLeft: '20px',
  paddingRight: '20px',
  margin: '0 auto',
  maxWidth: '600px',
}

const h1 = {
  color: '#333',
  fontFamily: 'Arial, sans-serif',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0 20px 0',
  padding: '0',
  textAlign: 'center' as const,
}

const text = {
  color: '#333',
  fontFamily: 'Arial, sans-serif',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '16px 0',
}

const codeContainer = {
  background: '#f5f5f5',
  padding: '20px',
  textAlign: 'center' as const,
  margin: '20px 0',
  borderRadius: '8px',
}

const codeText = {
  color: '#2563eb',
  fontSize: '32px',
  fontWeight: 'bold',
  letterSpacing: '4px',
  margin: '0',
  fontFamily: 'monospace',
}

const footer = {
  color: '#666',
  fontFamily: 'Arial, sans-serif',
  fontSize: '14px',
  lineHeight: '22px',
  marginTop: '20px',
  textAlign: 'center' as const,
  borderTop: '1px solid #eee',
  paddingTop: '20px',
}