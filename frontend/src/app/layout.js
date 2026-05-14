import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export const metadata = {
  title: 'Mongolian Hunting Quest',
  description: 'Монголын зэрлэг амьтдын нэгдсэн платформ',
}

export default function RootLayout({ children }) {
  return (
    <html lang="mn">
      <body>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  )
}
