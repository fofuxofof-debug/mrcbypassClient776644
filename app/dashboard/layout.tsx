import React from "react"
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { DashboardShell } from '@/components/dashboard-shell'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const session = cookieStore.get('mrcClient_session')

  if (!session) {
    redirect('/login')
  }

  let user;

  try {
    user = JSON.parse(session.value);
  } catch (e) {
    // Fallback for old sessions or invalid data
    user = {
      id: 'admin',
      email: 'admin@mrcClient.com',
      role: 'admin',
      user_metadata: { name: 'Admin' }
    };
  }

  return <DashboardShell user={user as any}>{children}</DashboardShell>
}
