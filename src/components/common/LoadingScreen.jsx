import { motion } from 'framer-motion'

export default function LoadingScreen({ label = 'Preparing your health view…' }) {
  return (
    <div className="grid min-h-[40vh] place-items-center">
      <div className="text-center">
        <motion.div
          className="mx-auto h-10 w-10 rounded-full border-2 border-line border-t-teal"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 0.9, ease: 'linear' }}
          aria-hidden="true"
        />
        <p className="mt-4 text-sm text-muted">{label}</p>
      </div>
    </div>
  )
}
