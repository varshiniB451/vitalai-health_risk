import { motion } from 'framer-motion'

const variants = {
  primary:
    'bg-navy text-white hover:bg-navy-800 shadow-[0_10px_24px_-12px_rgba(11,31,58,0.55)]',
  teal: 'bg-teal text-white hover:bg-teal-500 shadow-[0_10px_24px_-12px_rgba(13,155,138,0.5)]',
  ghost: 'bg-white/80 text-navy border border-line hover:bg-white',
  outline: 'border border-navy/15 text-navy hover:border-teal hover:text-teal bg-transparent',
  danger: 'bg-alert text-white hover:opacity-90',
  soft: 'bg-teal/10 text-teal hover:bg-teal/15',
}

const sizes = {
  sm: 'h-9 px-3.5 text-sm',
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-6 text-[15px]',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
  ...props
}) {
  return (
    <motion.button
      type={type}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:pointer-events-none ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  )
}
