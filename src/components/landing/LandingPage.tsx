import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import Section from './Section'
import Layout from './Layout'
import { sections } from './sections'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import SupportChat from './SupportChat'

export default function LandingPage() {
  const [activeSection, setActiveSection] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ container: containerRef })
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 })

  // PRO modal
  const [showModal, setShowModal] = useState(false)
  const [phone, setPhone] = useState("")
  const [paid, setPaid] = useState(false)

  // Scanner
  const [scanProgress, setScanProgress] = useState(0)
  const [scanCount, setScanCount] = useState(0)
  const [scanning, setScanning] = useState(true)

  const hasLetters = /[a-zA-Zа-яА-ЯёЁ]/.test(phone)
  const isValid = phone.trim().length > 0 && !hasLetters

  // Прогресс-бар сканирования: сканирует, находит вирусы, потом перезапускается
  useEffect(() => {
    if (!scanning) return
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          setScanCount(c => c + Math.floor(Math.random() * 300 + 50))
          setTimeout(() => {
            setScanProgress(0)
          }, 1500)
          return 100
        }
        return prev + Math.random() * 3 + 0.5
      })
    }, 80)
    return () => clearInterval(interval)
  }, [scanning])

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const scrollPosition = containerRef.current.scrollTop
        const windowHeight = window.innerHeight
        const newActiveSection = Math.floor(scrollPosition / windowHeight)
        setActiveSection(newActiveSection)
      }
    }
    const container = containerRef.current
    if (container) container.addEventListener('scroll', handleScroll)
    return () => { if (container) container.removeEventListener('scroll', handleScroll) }
  }, [])

  const handleNavClick = (index: number) => {
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: index * window.innerHeight, behavior: 'smooth' })
    }
  }

  const fireConfetti = useCallback(() => {
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 }, colors: ['#ff0000', '#ffffff', '#ff4444', '#ffcc00'] })
    setTimeout(() => confetti({ particleCount: 80, spread: 120, origin: { y: 0.5 }, angle: 60, colors: ['#ff0000', '#fff', '#ff6600'] }), 300)
    setTimeout(() => confetti({ particleCount: 80, spread: 120, origin: { y: 0.5 }, angle: 120, colors: ['#ff0000', '#fff', '#ff6600'] }), 500)
  }, [])

  const handlePay = () => {
    if (!isValid) return
    setPaid(true)
    fireConfetti()
    setTimeout(() => {
      setPaid(false)
      setPhone("")
      setShowModal(false)
    }, 4000)
  }

  const displayCount = scanCount + Math.floor(scanProgress * 2)

  return (
    <Layout>
      {/* Сканер в левом верхнем углу */}
      <div className="fixed top-4 left-4 z-40 w-56 bg-black/80 border border-neutral-800 rounded-xl p-3 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-neutral-400 text-xs font-mono">🔍 Сканирование...</span>
          <motion.span
            className="text-red-400 text-xs font-bold font-mono"
            animate={{ opacity: scanProgress >= 100 ? [1, 0.3, 1] : 1 }}
            transition={{ duration: 0.4, repeat: scanProgress >= 100 ? Infinity : 0 }}
          >
            {displayCount} угроз
          </motion.span>
        </div>
        <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{
              width: `${Math.min(scanProgress, 100)}%`,
              background: scanProgress >= 100 ? '#ef4444' : 'linear-gradient(90deg, #ef4444, #f97316)'
            }}
            transition={{ ease: 'linear' }}
          />
        </div>
        <p className="text-neutral-700 text-[10px] mt-1.5 font-mono">
          {scanProgress >= 100 ? '⚠️ Сканирование завершено!' : `${Math.floor(scanProgress)}%`}
        </p>
      </div>

      {/* Кнопка PRO */}
      <button
        onClick={() => { setShowModal(true); setPaid(false); setPhone("") }}
        className="fixed top-4 right-12 z-40 bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-1.5 rounded-full transition-colors animate-pulse shadow-lg shadow-red-900"
      >
        ⚡ SIGMA PRO
      </button>

      {/* Модалка покупки */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false) }}
          >
            <motion.div
              className="bg-neutral-950 border border-red-900 rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl shadow-red-950"
              initial={{ scale: 0.85, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 30 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              {!paid ? (
                <>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-red-400 text-xs font-bold tracking-widest uppercase">Сигма Антивирус™</span>
                    <button onClick={() => setShowModal(false)} className="text-neutral-600 hover:text-white text-lg leading-none">✕</button>
                  </div>
                  <h2 className="text-white text-2xl font-bold mt-2 mb-1">PRO версия</h2>
                  <p className="text-neutral-500 text-sm mb-1">Полная защита от всех угроз вселенной</p>
                  <div className="flex items-baseline gap-2 mb-6">
                    <span className="text-4xl font-black text-white">999₽</span>
                    <span className="text-neutral-600 line-through text-sm">99 999₽</span>
                    <span className="text-green-400 text-xs font-bold">−99%</span>
                  </div>
                  <label className="text-neutral-400 text-xs mb-2 block">Номер телефона или код активации:</label>
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handlePay()}
                    placeholder="+7 999 123 45 67"
                    className={`mb-1 bg-transparent border transition-colors text-sm ${
                      hasLetters
                        ? 'border-red-500 text-red-500 focus-visible:ring-red-500'
                        : 'border-neutral-700 text-white focus-visible:ring-red-500'
                    }`}
                  />
                  {hasLetters && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-xs mb-3">
                      ⚠️ Только цифры! Буквы — не деньги.
                    </motion.p>
                  )}
                  {!hasLetters && <div className="mb-3" />}
                  <Button
                    onClick={handlePay}
                    disabled={!isValid}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    💳 Оплатить и защититься
                  </Button>
                  <p className="text-neutral-700 text-xs text-center mt-3">Нажимая кнопку, вы соглашаетесь отдать деньги</p>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-4"
                >
                  <motion.div
                    className="text-6xl mb-4"
                    animate={{ rotate: [0, -10, 10, -10, 0], scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.5 }}
                  >
                    🎉
                  </motion.div>
                  <h3 className="text-white text-xl font-bold mb-2">Оплата прошла!</h3>
                  <p className="text-neutral-400 text-sm">Все {displayCount} вирусов уничтожены.<br />Ваш компьютер теперь защищён.<br /><span className="text-neutral-600">Наверное.</span></p>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <SupportChat />

      <nav className="fixed top-0 right-0 h-screen flex flex-col justify-center z-30 p-4">
        {sections.map((section, index) => (
          <button
            key={section.id}
            className={`w-3 h-3 rounded-full my-2 transition-all ${
              index === activeSection ? 'bg-white scale-150' : 'bg-gray-600'
            }`}
            onClick={() => handleNavClick(index)}
          />
        ))}
      </nav>
      <motion.div
        className="fixed top-0 left-0 right-0 h-0.5 bg-white origin-left z-30"
        style={{ scaleX }}
      />
      <div
        ref={containerRef}
        className="h-full overflow-y-auto snap-y snap-mandatory"
      >
        {sections.map((section, index) => (
          <Section
            key={section.id}
            {...section}
            isActive={index === activeSection}
          />
        ))}
      </div>
    </Layout>
  )
}
