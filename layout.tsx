import './globals.css'

export const metadata = {
  title: 'AI Fitness Coach',
  description: 'Your personalized AI fitness assistant',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}