import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { ALL_MINISTRIES } from '@/lib/data/ministries'
import { JoinUnitForm } from '@/components/ministries/JoinUnitForm'

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const m = ALL_MINISTRIES.find((x) => x.slug === slug)
  if (!m) return { title: 'Unit Not Found' }
  return { title: `Join ${m.name} | GGCC Ministries` }
}

export default async function JoinUnitPage({ params }: Props) {
  const { slug } = await params
  const ministry = ALL_MINISTRIES.find((m) => m.slug === slug)
  if (!ministry) notFound()

  return (
    <JoinUnitForm
      slug={ministry.slug}
      name={ministry.name}
      color={ministry.color}
    />
  )
}
