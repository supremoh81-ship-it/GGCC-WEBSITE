import {
  Music, BookOpen, Heart, Globe, Baby,
  Video, Shield, Star, Mic2, Sparkles, Wallet,
  HandHeart, Crown, Briefcase,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface Ministry {
  slug: string
  name: string
  description: string
  icon: LucideIcon
  color: string
  featured: boolean
}

export const ALL_MINISTRIES: Ministry[] = [
  {
    slug: 'worship',
    name: 'Worship Ministry',
    description:
      "Leading the congregation in dynamic, contemporary worship that includes praise, worship songs, hymns, and spiritual songs. We create an atmosphere where people encounter God's presence through music and corporate worship.",
    icon: Music,
    color: '#C9A84C',
    featured: false,
  },
  {
    slug: 'business-fellowship',
    name: 'Business Fellowship',
    description:
      'A community of Christian professionals and entrepreneurs committed to integrating faith with business. We provide fellowship, mentorship, and support as we seek to honor God through excellence in our work and influence.',
    icon: Briefcase,
    color: '#F59E0B',
    featured: true,
  },
  {
    slug: 'ministry-team',
    name: 'Ministry Team',
    description:
      'Core leaders and workers dedicated to facilitating all aspects of church ministry. We support the pastoral team in fulfilling the vision of restoration, discipleship, and empowerment.',
    icon: Crown,
    color: '#E8C97A',
    featured: false,
  },
  {
    slug: 'bible-study',
    name: 'Bible Study',
    description:
      "Deepening believers' understanding of God's Word through systematic study and teaching. We explore Scripture to build strong foundations in faith and Christian living.",
    icon: BookOpen,
    color: '#56B87D',
    featured: false,
  },
  {
    slug: 'prayer-warriors',
    name: 'Prayer Warriors',
    description:
      "Intercessors committed to praying for the church, leaders, and the community. We believe in the power of prayer to transform lives and advance God's kingdom.",
    icon: Heart,
    color: '#E85D75',
    featured: false,
  },
  {
    slug: 'evangelism',
    name: 'Evangelism and Outreach',
    description:
      "Reaching the lost and unchurched through personal evangelism, community programs, and invitational events. We share the gospel and invite people into God's family.",
    icon: Globe,
    color: '#9B72CF',
    featured: true,
  },
  {
    slug: 'media',
    name: 'Media and Technical Units',
    description:
      'Managing sound, lighting, video, cameras, and all technical aspects of our services. We ensure excellence in presentation so the message reaches people clearly.',
    icon: Video,
    color: '#3BBFBD',
    featured: true,
  },
  {
    slug: 'men-of-valor',
    name: 'Men of Valor',
    description:
      'A group of men committed to spiritual growth, leadership development, and serving the church and community with integrity and strength.',
    icon: Shield,
    color: '#4A90D9',
    featured: true,
  },
  {
    slug: 'sisters-with-purpose',
    name: 'Sisters With Purpose',
    description:
      'Women united in faith, fellowship, and purpose. We support, encourage, and empower one another while serving the church and impacting our communities.',
    icon: Star,
    color: '#F06292',
    featured: true,
  },
  {
    slug: 'choir',
    name: 'Choir Units',
    description:
      'Singers and musicians who lead worship and perform special music during services. We express our faith through harmonious, Spirit-filled performances.',
    icon: Mic2,
    color: '#F0A500',
    featured: true,
  },
  {
    slug: 'sanctuary-keeping',
    name: 'Sanctuary Keeping',
    description:
      'Maintaining the cleanliness, order, and beauty of our worship space. We ensure our meeting place reflects excellence and glorifies God.',
    icon: Sparkles,
    color: '#26A69A',
    featured: false,
  },
  {
    slug: 'childrens',
    name: "Children's Ministry",
    description:
      "Nurturing and discipling children in God's Word through age-appropriate teaching, activities, and Christian education. We build strong foundations of faith in the next generation.",
    icon: Baby,
    color: '#FF7043',
    featured: false,
  },
  {
    slug: 'finance',
    name: 'Finance',
    description:
      'Managing church resources with integrity and transparency. We handle tithes, offerings, and budgets to support the vision and mission of Grace for Greatness.',
    icon: Wallet,
    color: '#2ECC71',
    featured: false,
  },
  {
    slug: 'welfare',
    name: 'Welfare Units',
    description:
      "Caring for members in need through assistance, support, and compassion. We embody God's love by helping those facing hardship and providing community care.",
    icon: HandHeart,
    color: '#AB47BC',
    featured: false,
  },
]

const FEATURED_SLUGS = [
  'business-fellowship',
  'evangelism',
  'media',
  'choir',
  'men-of-valor',
  'sisters-with-purpose',
] as const

export const FEATURED_MINISTRIES = FEATURED_SLUGS.map(
  (slug) => ALL_MINISTRIES.find((m) => m.slug === slug)!
)
