import { motion } from 'framer-motion'

export default function Card({ children, className = '', hover = false, delay = 0, as = 'div', ...props }) {
  const Comp = motion[as] || motion.div
  return (
    <Comp
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
      whileHover={hover ? { y: -3 } : undefined}
      className={`rounded-[var(--radius-card)] border border-line bg-white shadow-[var(--shadow-soft)] ${className}`}
      {...props}
    >
      {children}
    </Comp>
  )
}
