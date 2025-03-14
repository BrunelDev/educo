"use client"
import { usePathname } from "next/navigation"

export function Pathname() {
  const path = usePathname()

  return (
      {path}
  )
}
