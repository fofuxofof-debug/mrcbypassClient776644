'use client'

import type { LicenseKey } from '@/lib/types'
import { getDaysRemaining, formatDate, formatDuration } from '@/lib/keys'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Eye, Copy, Loader2, MoreHorizontal, RotateCcw, Ban, Link2, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

function StatusBadge({ licenseKey }: { licenseKey: LicenseKey }) {
  const now = new Date()
  const isExpired = licenseKey.expires_at ? new Date(licenseKey.expires_at) <= now : false
  // Logic: Banned -> Banned, Expired -> Expired, Active + HWID -> ON, Active + No HWID -> OFF, Pure Active -> Pending
  let status: 'on' | 'off' | 'expired' | 'banned' | 'pending' = 'pending'

  if (licenseKey.status === 'banned') {
    status = 'banned'
  } else if (isExpired) {
    status = 'expired'
  } else if (!licenseKey.expires_at) {
    status = 'pending'
  } else if (licenseKey.status === 'active') {
    status = licenseKey.hwid ? 'on' : 'off'
  }

  const config = {
    on: { label: 'ON', className: 'text-green-500', dot: 'bg-green-500' },
    off: { label: 'OFF', className: 'text-neutral-500', dot: 'bg-neutral-500' },
    expired: { label: 'Expirada', className: 'text-warning', dot: 'bg-warning' },
    banned: { label: 'Banida', className: 'text-destructive', dot: 'bg-destructive' },
    pending: { label: 'Aguardando Ativação', className: 'text-blue-500', dot: 'bg-blue-500' },
  }

  const c = config[status]
  return (
    <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${c.className}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${c.dot} ${status === 'on' ? 'animate-pulse' : ''}`} />
      {c.label}
    </div>
  )
}

export function KeysTable({
  keys,
  isLoading,
  onMutate,
}: {
  keys: LicenseKey[]
  isLoading: boolean
  onMutate: () => void
}) {
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key)
    toast.success('Key copiada!')
  }

  const handleDeleteKey = async (id: string) => {
    setProcessingId(id)
    try {
      const res = await fetch(`/api/keys/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
      toast.success('Key excluída com sucesso!')
      onMutate()
    } catch (err) {
      toast.error('Erro ao excluir key')
    } finally {
      setProcessingId(null)
      setDeleteConfirmId(null)
    }
  }

  const handleResetHWID = async (id: string) => {
    setProcessingId(id)
    try {
      const res = await fetch(`/api/keys/${id}/hwids`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Reset failed')
      toast.success('HWID resetado com sucesso!')
      onMutate()
    } catch (err) {
      toast.error('Erro ao resetar HWID')
    } finally {
      setProcessingId(null)
    }
  }

  const handleBanUser = async (id: string, currentStatus: string) => {
    if (currentStatus === 'banned') return
    setProcessingId(id)
    try {
      const res = await fetch(`/api/keys/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'banned' }),
      })
      if (!res.ok) throw new Error('Ban failed')
      toast.success('Usuário banido!')
      onMutate()
    } catch (err) {
      toast.error('Erro ao banir usuário')
    } finally {
      setProcessingId(null)
    }
  }

  const handleLinkDiscord = async (id: string) => {
    setProcessingId(id)
    try {
      const res = await fetch(`/api/keys/${id}/link-discord`, { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Link failed')
      toast.success(`Discord vinculado: ${data.username}`)
      onMutate()
    } catch (err: any) {
      toast.error(err.message || 'Erro ao vincular Discord')
    } finally {
      setProcessingId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    )
  }

  if (keys.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
          <Eye className="h-6 w-6 text-neutral-600" />
        </div>
        <p className="text-sm font-medium text-neutral-500">Nenhuma key encontrada no sistema</p>
      </div>
    )
  }

  return (
    <div className="grid gap-3">
      {keys.map((key) => (
        <div
          key={key.id}
          className="group relative flex items-center justify-between rounded-2xl border border-white/5 bg-[#0a0a0a] p-4 transition-all duration-300 hover:border-white/10 hover:bg-[#0c0c0c]"
        >
          {/* Status Indicator Bar */}
          <div className={`absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 rounded-r-full transition-colors ${key.status === 'banned' ? 'bg-destructive' : 'bg-white/10 group-hover:bg-white/40'}`} />

          <div className="flex items-center gap-6 flex-1">
            {/* Main Info */}
            <div className="min-w-[220px]">
              <h3 className="text-base font-bold text-white transition-colors">
                {key.label || 'Sem Nome'}
              </h3>
              <p className="text-[10px] font-medium text-neutral-600 mt-0.5 uppercase tracking-wider">
                {formatDate(key.created_at)}
              </p>
            </div>

            {/* Access Key */}
            <div className="flex-[2]">
              <div className="flex items-center gap-2 group/key">
                <code className="text-xs font-mono text-neutral-400 bg-white/5 px-3 py-1.5 rounded-md border border-white/5 w-full block truncate">
                  {key.key}
                </code>
                <button
                  onClick={() => copyKey(key.key)}
                  className="opacity-0 group-hover/key:opacity-100 text-neutral-600 hover:text-white transition-all p-1"
                >
                  <Copy className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Duration */}
            <div className="text-right px-6">
              <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-tighter mb-1">Duração</p>
              <span className="text-xs font-bold text-white bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
                {formatDuration(key.duration_seconds)}
              </span>
            </div>

            {/* Status Badge */}
            <div className="min-w-[120px]">
              <StatusBadge licenseKey={key} />
            </div>
          </div>

          {/* Actions */}
          <div className="ml-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10 text-neutral-500 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-[#0f0f0f] border-white/5 rounded-2xl p-2 min-w-[180px] shadow-2xl backdrop-blur-xl">
                <DropdownMenuItem
                  onClick={() => handleResetHWID(key.id)}
                  className="flex items-center gap-3 text-xs font-bold text-neutral-400 hover:bg-white/5 hover:text-white cursor-pointer rounded-xl py-3 px-4 transition-all"
                >
                  <RotateCcw className="h-4 w-4" />
                  Resetar HWID
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleBanUser(key.id, key.status)}
                  className="flex items-center gap-3 text-xs font-bold text-destructive hover:bg-destructive/10 cursor-pointer rounded-xl py-3 px-4 transition-all"
                  disabled={key.status === 'banned'}
                >
                  <Ban className="h-4 w-4" />
                  Banir Usuário
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/5 my-2" />
                <DropdownMenuItem
                  onClick={() => handleLinkDiscord(key.id)}
                  className="flex items-center gap-3 text-xs font-bold text-neutral-400 hover:bg-white/5 hover:text-white cursor-pointer rounded-xl py-3 px-4 transition-all"
                  disabled={!key.discord_id}
                >
                  <Link2 className="h-4 w-4" />
                  Vincular Discord
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/5 my-2" />
                <DropdownMenuItem
                  onClick={() => setDeleteConfirmId(key.id)}
                  className="flex items-center gap-3 text-xs font-bold text-destructive hover:bg-destructive/10 cursor-pointer rounded-xl py-3 px-4 transition-all"
                >
                  <Trash2 className="h-4 w-4" />
                  Excluir Key
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}

      <AlertDialog open={!!deleteConfirmId} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
        <AlertDialogContent className="bg-[#0f0f0f] border-white/5 rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Excluir Key?</AlertDialogTitle>
            <AlertDialogDescription className="text-neutral-500">
              Esta ação não pode ser desfeita. A key e todos os seus dados serão removidos permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/5 border-none text-white hover:bg-white/10 rounded-xl">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteConfirmId && handleDeleteKey(deleteConfirmId)}
              className="bg-destructive text-white hover:bg-destructive/90 rounded-xl"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
