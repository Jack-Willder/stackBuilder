import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'StackBuilder — Visual Full-Stack Builder',
  description:
    'Build full-stack web applications visually with a professional drag-and-drop canvas, logic editor, and code generator.',
  keywords: ['web development', 'visual builder', 'full-stack', 'code generator', 'low-code'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  )
}
