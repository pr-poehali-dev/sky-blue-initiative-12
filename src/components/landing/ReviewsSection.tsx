import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const API = "https://functions.poehali.dev/93a4d36d-a60d-44a4-916a-7cd061d82e35"

interface Review {
  id: number
  name: string
  text: string
  stars: number
  created_at: string
}

function Stars({ value, onChange }: { value: number; onChange?: (v: number) => void }) {
  const [hover, setHover] = useState(0)
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(s => (
        <button
          key={s}
          type="button"
          onClick={() => onChange?.(s)}
          onMouseEnter={() => onChange && setHover(s)}
          onMouseLeave={() => onChange && setHover(0)}
          className={`text-2xl transition-transform ${onChange ? 'cursor-pointer hover:scale-125' : 'cursor-default'}`}
        >
          <span className={(hover || value) >= s ? 'text-yellow-400' : 'text-neutral-700'}>★</span>
        </button>
      ))}
    </div>
  )
}

export default function ReviewsSection({ isActive }: { isActive: boolean }) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [name, setName] = useState("")
  const [text, setText] = useState("")
  const [stars, setStars] = useState(5)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const fetchReviews = async () => {
    const res = await fetch(API)
    const data = await res.json()
    setReviews(JSON.parse(data))
  }

  useEffect(() => { fetchReviews() }, [])

  const submit = async () => {
    if (!name.trim() || !text.trim()) return
    setSending(true)
    await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, text, stars })
    })
    setSent(true)
    setSending(false)
    setName("")
    setText("")
    setStars(5)
    await fetchReviews()
    setTimeout(() => setSent(false), 3000)
  }

  return (
    <section className="relative h-screen w-full snap-start flex flex-col justify-center p-8 md:p-16 overflow-hidden">
      <motion.h2
        className="text-4xl md:text-6xl font-bold text-white mb-8"
        initial={{ opacity: 0, y: 50 }}
        animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
      >
        Отзывы
      </motion.h2>

      <div className="flex flex-col lg:flex-row gap-8 h-full max-h-[70vh] overflow-hidden">
        {/* Лента отзывов */}
        <motion.div
          className="flex-1 overflow-y-auto space-y-4 pr-2"
          initial={{ opacity: 0, x: -30 }}
          animate={isActive ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <AnimatePresence>
            {reviews.map((r) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-neutral-900 border border-neutral-800 rounded-xl p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-semibold text-sm">{r.name}</span>
                  <Stars value={r.stars} />
                </div>
                <p className="text-neutral-400 text-sm leading-relaxed">{r.text}</p>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Форма */}
        <motion.div
          className="w-full lg:w-80 shrink-0 bg-neutral-900 border border-neutral-800 rounded-2xl p-6 flex flex-col gap-4 self-start"
          initial={{ opacity: 0, x: 30 }}
          animate={isActive ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 className="text-white font-bold text-lg">Оставить отзыв</h3>

          <div>
            <label className="text-neutral-500 text-xs mb-1 block">Ваше имя</label>
            <Input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Иван Иванов"
              className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-600 focus-visible:ring-red-500"
            />
          </div>

          <div>
            <label className="text-neutral-500 text-xs mb-1 block">Отзыв</label>
            <Textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Расскажите о вашем опыте..."
              rows={3}
              className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-600 focus-visible:ring-red-500 resize-none"
            />
          </div>

          <div>
            <label className="text-neutral-500 text-xs mb-2 block">Оценка</label>
            <Stars value={stars} onChange={setStars} />
          </div>

          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div
                key="sent"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-green-400 text-sm font-medium text-center py-2"
              >
                ✅ Спасибо за отзыв!
              </motion.div>
            ) : (
              <motion.div key="btn" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Button
                  onClick={submit}
                  disabled={sending || !name.trim() || !text.trim()}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold disabled:opacity-30"
                >
                  {sending ? '⏳ Отправляю...' : '📨 Отправить'}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
