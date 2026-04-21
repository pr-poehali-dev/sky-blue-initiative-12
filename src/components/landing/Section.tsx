import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { SectionProps } from "@/types"

export default function Section({ id, title, subtitle, content, isActive, showButton, buttonText }: SectionProps) {
  const [showInput, setShowInput] = useState(false)
  const [threat, setThreat] = useState("")
  const [deleted, setDeleted] = useState(false)

  const handleDelete = () => {
    if (!threat.trim()) return
    setDeleted(true)
    setTimeout(() => {
      setDeleted(false)
      setThreat("")
      setShowInput(false)
    }, 2500)
  }

  return (
    <section id={id} className="relative h-screen w-full snap-start flex flex-col justify-center p-8 md:p-16 lg:p-24">
      {subtitle && (
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          {subtitle}
        </motion.div>
      )}
      <motion.h2
        className="text-4xl md:text-6xl lg:text-[5rem] xl:text-[6rem] font-bold leading-[1.1] tracking-tight max-w-4xl text-white"
        initial={{ opacity: 0, y: 50 }}
        animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
      >
        {title}
      </motion.h2>
      {content && (
        <motion.p
          className="text-lg md:text-xl lg:text-2xl max-w-2xl mt-6 text-neutral-400"
          initial={{ opacity: 0, y: 50 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {content}
        </motion.p>
      )}
      {showButton && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 md:mt-16 flex flex-col gap-4 max-w-md"
        >
          <Button
            variant="outline"
            size="lg"
            className="text-red-500 bg-transparent border-red-500 hover:bg-red-600 hover:text-white transition-colors animate-pulse w-fit"
            onClick={() => { setShowInput(true); setDeleted(false) }}
          >
            {buttonText}
          </Button>

          <AnimatePresence>
            {showInput && !deleted && (
              <motion.div
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-3"
              >
                <p className="text-neutral-400 text-sm">Введите название угрозы для удаления:</p>
                <div className="flex gap-2">
                  <Input
                    value={threat}
                    onChange={(e) => setThreat(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleDelete()}
                    placeholder="например: вирус, троян, шпион..."
                    className="bg-transparent border-red-800 text-white placeholder:text-neutral-600 focus-visible:ring-red-500"
                  />
                  <Button
                    onClick={handleDelete}
                    className="bg-red-600 hover:bg-red-700 text-white border-0 shrink-0"
                  >
                    Удалить
                  </Button>
                </div>
              </motion.div>
            )}

            {deleted && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 text-green-400 text-sm font-medium"
              >
                ✅ «{threat}» успешно уничтожен! Ваш компьютер в безопасности. Наверное.
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </section>
  )
}
