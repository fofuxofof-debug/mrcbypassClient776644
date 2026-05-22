'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function login(prevState: any, formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    // Hardcoded credentials with roles
    const users = [
        { email: 'mrcfof@gmail.com', password: '1964f', role: 'admin', name: 'Mrcfof' },
        { email: 'mrcrlq', password: '1964f', role: 'admin', name: 'Mrcrlq' }, // username as email field for simplicity
        { email: 'insano', password: 'insano23', role: 'limited', name: 'Insano' }
    ];

    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        // Set session cookie with user details
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        const cookieStore = await cookies()

        const sessionData = JSON.stringify({
            id: user.email,
            name: user.name,
            email: user.email,
            role: user.role
        });

        cookieStore.set('mrcClient_session', sessionData, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            expires: expiresAt,
            sameSite: 'lax',
            path: '/',
        })

        redirect('/dashboard')
    }

    return {
        error: 'Invalid credentials.',
    }
}

export async function logout() {
    const cookieStore = await cookies()
    cookieStore.delete('mrcClient_session')
    redirect('/login')
}
