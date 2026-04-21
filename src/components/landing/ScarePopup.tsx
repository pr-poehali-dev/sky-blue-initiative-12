import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ScarePopup() {
  const [showWarning, setShowWarning] = useState(false)
  const [showBSOD, setShowBSOD] = useState(false)
  const [bsodCount, setBsodCount] = useState(3)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setShowWarning(true)
      setDismissed(false)
    }, 120000)

    const timer = setTimeout(() => {
      setShowWarning(true)
    }, 3000)

    return () => {
      clearInterval(interval)
      clearTimeout(timer)
    }
  }, [])

  const handleClose = () => {
    setShowWarning(false)
    setDismissed(true)
    setTimeout(() => {
      setShowBSOD(true)
      setBsodCount(3)
      const countdown = setInterval(() => {
        setBsodCount(prev => {
          if (prev <= 1) {
            clearInterval(countdown)
            setTimeout(() => setShowBSOD(false), 500)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }, 20000)
  }

  const handleFix = () => {
    setShowWarning(false)
    setDismissed(false)
  }

  return (
    <>
      {/* Попап-страшилка */}
      <AnimatePresence>
        {showWarning && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-neutral-950 border-2 border-red-600 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl shadow-red-950 relative overflow-hidden"
              initial={{ scale: 0.8, opacity: 0, y: -40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 280, damping: 22 }}
            >
              {/* Мигающая полоска сверху */}
              <motion.div
                className="absolute top-0 left-0 right-0 h-1 bg-red-600"
                animate={{ opacity: [1, 0.2, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              />

              <div className="flex items-start gap-4 mb-4">
                <motion.div
                  className="text-5xl shrink-0"
                  animate={{ rotate: [-5, 5, -5] }}
                  transition={{ duration: 0.4, repeat: Infinity }}
                >
                  ☠️
                </motion.div>
                <div>
                  <p className="text-red-500 text-xs font-bold tracking-widest uppercase mb-1">Критическая угроза</p>
                  <h2 className="text-white text-xl font-black leading-tight">
                    ВАШ КОМПЬЮТЕР ЗАРАЖЁН!
                  </h2>
                </div>
              </div>

              <div className="bg-red-950/40 border border-red-900 rounded-xl p-4 mb-5 text-sm text-neutral-300 space-y-1">
                <p>🔴 Обнаружено вирусов: <span className="text-red-400 font-bold">9 999</span></p>
                <p>🔴 Похищено паролей: <span className="text-red-400 font-bold">∞</span></p>
                <p>🔴 Угроза системе: <span className="text-red-400 font-bold">МАКСИМАЛЬНАЯ</span></p>
                <p>🔴 Время до краша: <span className="text-red-400 font-bold animate-pulse">скоро™</span></p>
              </div>

              <p className="text-neutral-500 text-xs mb-5">
                Немедленно устраните угрозу с помощью Сигма Антивирус™ PRO или ваш компьютер будет уничтожен.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={handleFix}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl text-sm transition-colors"
                >
                  🛡️ Устранить сейчас
                </button>
                <button
                  onClick={handleClose}
                  className="px-4 text-neutral-600 hover:text-neutral-400 text-sm transition-colors"
                >
                  Игнорировать
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Синий экран смерти */}
      <AnimatePresence>
        {showBSOD && (
          <motion.div
            className="fixed inset-0 z-[200] bg-[#0000AA] flex flex-col items-center justify-center p-10 font-mono"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
          >
            <div className="max-w-2xl w-full text-white space-y-4">
              <div className="bg-white text-[#0000AA] text-center text-xl font-bold px-4 py-1 inline-block mb-4">
                Windows
              </div>

              <p className="text-lg">
                A problem has been detected and Windows has been shut down to prevent damage to your computer.
              </p>

              <p className="text-lg font-bold mt-4">
                SIGMA_ANTIVIRUS_THREAT_DETECTED
              </p>

              <div className="mt-6 space-y-1 text-sm">
                <p>If this is the first time you've seen this stop error screen, restart your computer. If this screen appears again, follow these steps:</p>
                <p className="mt-3">Install <span className="font-bold">Сигма Антивирус™ PRO</span> immediately.</p>
                <p>Or just restart and hope for the best.</p>
              </div>

              <div className="mt-8 text-sm space-y-1 text-neutral-300">
                <p>Technical information:</p>
                <p>*** STOP: 0x000000СИ (0xГМА, 0xАНТИВИРУС, 0xСИГМА, 0xПРО)</p>
              </div>

              <motion.p
                className="mt-10 text-lg"
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                Перезагрузка через {bsodCount}...
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}