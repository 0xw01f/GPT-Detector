import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'AI Text Detector',
  description: `This is an AI-powered tool designed to identify text written by AI models like ChatGPT. With the increasing prevalence of AI-generated content, it's crucial to distinguish between human and AI-written text. The detector uses advanced natural language processing techniques to analyze and recognize patterns unique to AI-generated content.`,
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
