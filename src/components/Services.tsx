import { motion } from 'motion/react';
import { Film, Scissors, Monitor, Zap, Music, PenTool } from 'lucide-react';

const services = [
  {
    icon: <Film className="w-8 h-8 text-primary" />,
    title: 'Long Form Editing',
    description: 'Engaging storytelling for YouTube videos, documentaries, and vlogs.',
  },
  {
    icon: <Zap className="w-8 h-8 text-accent" />,
    title: 'Shorts & Reels',
    description: 'High-energy vertical content optimized for TikTok, Instagram, and YouTube Shorts.',
  },
  {
    icon: <Monitor className="w-8 h-8 text-primary-dark" />,
    title: 'Content Strategy',
    description: 'Data-driven planning to maximize reach and audience retention.',
  },
  {
    icon: <Scissors className="w-8 h-8 text-accent-dark" />,
    title: 'Thumbnail Design',
    description: 'Click-worthy thumbnails that boost CTR and attract new viewers.',
  },
  {
    icon: <Music className="w-8 h-8 text-primary" />,
    title: 'Sound Design',
    description: 'Immersive audio mixing and sound effects to enhance the viewer experience.',
  },
  {
    icon: <PenTool className="w-8 h-8 text-accent" />,
    title: 'Motion Graphics',
    description: 'Custom animations and visual effects to add polish and professionalism.',
  },
];

export default function Services() {
  return (
    <section id="services" className="py-24 bg-soft-bg relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4 text-primary-text">Premium <span className="text-gradient">Services</span></h2>
          <p className="text-secondary-text max-w-2xl mx-auto">
            Comprehensive video production solutions tailored to your unique needs.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="p-8 rounded-2xl bg-white/70 backdrop-blur-sm border border-light-border hover:border-accent hover:shadow-xl transition-all group"
            >
              <div className="mb-6 p-4 rounded-xl bg-primary/5 w-fit group-hover:bg-primary/10 transition-colors">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors text-primary-text">{service.title}</h3>
              <p className="text-secondary-text leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
