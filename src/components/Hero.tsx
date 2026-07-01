import { motion } from 'motion/react';
import { TrendingUp, Users, Award } from 'lucide-react';
import ThreeDTilt from './ThreeDTilt';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Video/Gradient */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-main-bg/80 z-10 backdrop-blur-[2px]" />
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-40"
          poster="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44c?q=80&w=2070&auto=format&fit=crop"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-abstract-technology-network-background-3162-large.mp4" type="video/mp4" />
        </video>
      </div>

      <div className="container mx-auto px-6 relative z-20 grid lg:grid-cols-2 gap-12 items-center">
        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 border border-light-border backdrop-blur-md shadow-sm">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-sm font-medium text-secondary-text">Available for new projects</span>
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-bold leading-tight tracking-tight text-primary-text">
            Crafting Visual <br />
            <span className="text-gradient">
              Masterpiece
            </span>
          </h1>
          
          <p className="text-xl text-secondary-text max-w-lg leading-relaxed">
            Professional Video Editor & Content Strategist helping creators and brands tell compelling stories that drive engagement and growth.
          </p>
        </motion.div>

        {/* Floating Stats Cards */}
        <div className="relative h-[600px] hidden lg:block">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="absolute top-10 right-10 z-10"
          >
            <ThreeDTilt max={15} scale={1.04} className="w-72 glass-card p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-xl bg-primary/10 text-primary">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-secondary-text">Million views</p>
                  <h3 className="text-2xl font-bold text-primary-text">15M+</h3>
                </div>
              </div>
              <div className="h-2 bg-light-border rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "85%" }}
                  transition={{ delay: 1, duration: 1.5 }}
                  className="h-full bg-gradient-to-r from-primary to-accent"
                />
              </div>
            </ThreeDTilt>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -30, y: 50 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="absolute top-1/2 left-0 z-10"
          >
            <ThreeDTilt max={15} scale={1.04} className="w-64 glass-card p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-accent/10 text-accent">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-secondary-text">Subscribers</p>
                  <h3 className="text-2xl font-bold text-primary-text">500K+</h3>
                </div>
              </div>
            </ThreeDTilt>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="absolute bottom-20 right-20 z-10"
          >
            <ThreeDTilt max={15} scale={1.04} className="w-64 glass-card p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary-dark/10 text-primary-dark">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-secondary-text">Project complete</p>
                  <h3 className="text-2xl font-bold text-primary-text">320+</h3>
                </div>
              </div>
            </ThreeDTilt>
          </motion.div>
          
          {/* Abstract decorative elements */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] -z-10 animate-pulse" />
        </div>
      </div>
    </section>
  );
}
