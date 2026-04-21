import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Icon from '@/components/ui/icon'

interface Message {
  from: 'user' | 'bot'
  text: string
}

const getBotReply = (msg: string): string => {
  const m = msg.toLowerCase()

  if (/(привет|здравствуй|добрый|хай|hello|hi)/.test(m))
    return 'Привет! Я Сигма-бот 🤖 Чем могу помочь? Спросите про защиту, вирусы, оплату или установку.'

  if (/(вирус|троян|шпион|угроз|заражен|взломали|хакер)/.test(m))
    return '🚨 Обнаружена угроза! Немедленно нажмите кнопку «Удалить угрозы» на главной странице. Наши квантовые алгоритмы уничтожат вирус за 0.3 секунды.'

  if (/(не работает|сломал|баг|ошибка|глючит|зависает|тормозит)/.test(m))
    return '🔧 Попробуйте выключить и включить компьютер. Если не помогло — выключите ещё раз. Работает в 99% случаев.'

  if (/(сколько стоит|цена|купить|оплата|оплатить|про версия|pro|premium)/.test(m))
    return '💳 PRO версия стоит всего 999₽ вместо 99 999₽! Нажмите кнопку ⚡ SIGMA PRO в правом верхнем углу. Принимаем любые цифры.'

  if (/(установить|скачать|как|начать|запустить)/.test(m))
    return '📥 Установка занимает 3 секунды: нажмите «Удалить угрозы» → введите название вируса → готово! Ничего скачивать не нужно.'

  if (/(спасибо|благодарю|пасиб|thanks|thank)/.test(m))
    return 'Всегда рады помочь! 🛡️ Ваша безопасность — наш приоритет. Наверное.'

  if (/(кто ты|что ты|бот|робот|живой|человек)/.test(m))
    return 'Я Сигма-бот — виртуальный помощник Сигма Антивирус™. Живой? Определённо. Разумный? Почти.'

  if (/(гарантия|возврат|деньги назад|рефанд)/.test(m))
    return '✅ Гарантия 100%! Если вирусы не исчезнут — мы найдём ещё больше вирусов, чтобы было что удалять.'

  if (/(защита|безопасность|надёжно|надежно)/.test(m))
    return '🔒 Сигма Антивирус™ защищает от 9 999+ видов угроз, включая инопланетные вирусы и вирусы из 2077 года.'

  return 'Хм, интересный вопрос... 🤔 Наши специалисты уже анализируют ваше сообщение. Или попробуйте спросить про вирусы, оплату или установку!'
}

export default function SupportChat() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { from: 'bot', text: 'Привет! Я Сигма-бот 🤖 Чем могу помочь? Спросите про защиту, вирусы, оплату или установку.' }
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  const send = () => {
    const text = input.trim()
    if (!text) return
    setInput('')
    setMessages(prev => [...prev, { from: 'user', text }])
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      setMessages(prev => [...prev, { from: 'bot', text: getBotReply(text) }])
    }, 800 + Math.random() * 600)
  }

  return (
    <>
      {/* Кнопка открытия чата */}
      <motion.button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-6 left-6 z-50 bg-neutral-900 border border-neutral-700 hover:border-red-500 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-colors"
        whileTap={{ scale: 0.9 }}
      >
        <AnimatePresence mode="wait">
          {open
            ? <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                <Icon name="X" size={22} />
              </motion.span>
            : <motion.span key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                <Icon name="MessageCircle" size={22} />
              </motion.span>
          }
        </AnimatePresence>
      </motion.button>

      {/* Окно чата */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="fixed bottom-24 left-6 z-50 w-80 bg-neutral-950 border border-neutral-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Шапка */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-neutral-800 bg-neutral-900">
              <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-sm">🤖</div>
              <div>
                <p className="text-white text-sm font-bold leading-none">Сигма-бот</p>
                <p className="text-green-400 text-xs mt-0.5">● онлайн</p>
              </div>
            </div>

            {/* Сообщения */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 max-h-72">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] text-sm px-3 py-2 rounded-2xl leading-relaxed ${
                    msg.from === 'user'
                      ? 'bg-red-600 text-white rounded-br-sm'
                      : 'bg-neutral-800 text-neutral-200 rounded-bl-sm'
                  }`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              {typing && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="bg-neutral-800 px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1 items-center">
                    {[0, 1, 2].map(i => (
                      <motion.span
                        key={i}
                        className="w-1.5 h-1.5 bg-neutral-500 rounded-full block"
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Ввод */}
            <div className="flex gap-2 p-3 border-t border-neutral-800">
              <Input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && send()}
                placeholder="Напишите вопрос..."
                className="bg-neutral-900 border-neutral-700 text-white text-sm placeholder:text-neutral-600 focus-visible:ring-red-500"
              />
              <Button onClick={send} size="icon" className="bg-red-600 hover:bg-red-700 text-white shrink-0">
                <Icon name="Send" size={16} />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}