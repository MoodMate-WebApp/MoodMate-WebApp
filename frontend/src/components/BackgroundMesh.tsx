import { motion } from 'framer-motion';

export default function BackgroundMesh() {
  return (
    <div className="fixed inset-0 -z-30 overflow-hidden pointer-events-none bg-black">
      {/* Primary Neural Glows */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.05, 0.15, 0.05],
          x: ['-20%', '20%', '-20%'],
          y: ['-20%', '20%', '-20%']
        }}
        transition={{ repeat: Infinity, duration: 20, ease: "easeInOut" }}
        className="absolute top-0 -left-1/4 w-[80vw] h-[80vw] rounded-full bg-primary-600/10 blur-[120px]"
      />
      <motion.div 
        animate={{ 
          scale: [1.2, 1, 1.2],
          opacity: [0.05, 0.15, 0.05],
          x: ['20%', '-20%', '20%'],
          y: ['20%', '-20%', '20%']
        }}
        transition={{ repeat: Infinity, duration: 25, ease: "easeInOut" }}
        className="absolute bottom-0 -right-1/4 w-[80vw] h-[80vw] rounded-full bg-accent-600/10 blur-[120px]"
      />

      {/* Subtle Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.03]" 
        style={{ 
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} 
      />

      {/* Interactive Mesh Dots (Abstract) */}
      <div className="absolute inset-0">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              x: [Math.random() * 100 + '%', Math.random() * 100 + '%'],
              y: [Math.random() * 100 + '%', Math.random() * 100 + '%'],
              opacity: [0, 0.1, 0]
            }}
            transition={{
              repeat: Infinity,
              duration: 15 + Math.random() * 10,
              ease: "linear"
            }}
            className="absolute w-1 h-1 bg-white rounded-full blur-[2px]"
          />
        ))}
      </div>
    </div>
  );
}
