"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function LogoutPage() {
  const router = useRouter()

  useEffect(() => {
    const doLogout = async () => {
      try {
        const resp = await fetch('/api/auth/logout', { method: 'GET', credentials: 'include' })
      } catch (err) {
      } finally {
        router.replace('/login')
      }
    }

    doLogout()
  }, [router])

  return (
    <div>
      <p>Signing out…</p>
    </div>
  )
}
