import { Key, CheckCircle, XCircle, Ban, Monitor, Activity } from 'lucide-react'
import type { DashboardStats } from '@/lib/types'

const stats = [
  {
    key: 'total_keys' as const,
    label: 'Total de Keys',
    icon: Key,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    key: 'active_keys' as const,
    label: 'Keys Ativas',
    icon: CheckCircle,
    color: 'text-success',
    bgColor: 'bg-success/10',
  },
  {
    key: 'expired_keys' as const,
    label: 'Keys Expiradas',
    icon: XCircle,
    color: 'text-warning',
    bgColor: 'bg-warning/10',
  },
  {
    key: 'banned_keys' as const,
    label: 'Keys Banidas',
    icon: Ban,
    color: 'text-destructive',
    bgColor: 'bg-destructive/10',
  },
  {
    key: 'total_hwids' as const,
    label: 'Dispositivos',
    icon: Monitor,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    key: 'recent_auths' as const,
    label: 'Auths Recentes',
    icon: Activity,
    color: 'text-success',
    bgColor: 'bg-success/10',
  },
]

export function StatsCards({ stats: data }: { stats: DashboardStats }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat) => (
        <div
          key={stat.key}
          className="rounded-3xl border border-white/5 bg-[#0f0f0f] p-6 transition-all duration-500 hover:bg-white/5 hover:border-white/10 group"
        >
          <div className="flex items-center gap-5">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-black border border-white/5 transition-colors group-hover:border-white/10 ${stat.bgColor}`}
            >
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-1">{stat.label}</p>
              <p className="text-3xl font-black text-white tracking-tighter">{data[stat.key]}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
