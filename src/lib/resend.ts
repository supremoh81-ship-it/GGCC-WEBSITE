import { Resend } from 'resend'

export const resend = new Resend(process.env.RESEND_API_KEY)

export const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? 'noreply@ggcc.church'
export const FROM_NAME = process.env.RESEND_FROM_NAME ?? 'GGCC Church'
export const FROM = `${FROM_NAME} <${FROM_EMAIL}>`
