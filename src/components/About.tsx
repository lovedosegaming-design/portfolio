import { motion } from 'motion/react';
import { Check } from 'lucide-react';
import ThreeDTilt from './ThreeDTilt';
import editorPhoto from '../editor-photo.jpg';

const skills = [
  { name: 'Premiere Pro', level: 95 },
  { name: 'DaVinci Resolve', level: 90 },
  { name: 'After Effects', level: 85 },
  { name: 'Photoshop', level: 80 },
  { name: 'Sound Design', level: 75 },
];

export default function About() {
  return (
    <section id="about" className="py-24 bg-main-bg relative">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <ThreeDTilt scale={1.05} max={15}>
              <div className="aspect-square rounded-2xl overflow-hidden transition-all duration-500 shadow-2xl border border-light-border">
                <img
                  src={editorPhoto}
                  alt="Meet the Editor"
                  className="w-full h-full object-cover"
                />
              </div>
            </ThreeDTilt>
            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-primary/20 rounded-full blur-[80px] -z-10" />
            <div className="absolute -top-6 -left-6 w-48 h-48 bg-accent/20 rounded-full blur-[80px] -z-10" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-4xl font-bold mb-4 text-primary-text">Meet the <span className="text-gradient">Editor</span></h2>
            <p className="text-secondary-text leading-relaxed text-lg">
              Hi, I'm Alex. I'm a professional video editor with over 5 years of experience crafting compelling narratives for brands and creators.
              I specialize in high-retention editing styles that keep viewers hooked from the first second to the last.
            </p>
            
            <div className="space-y-6">
              {skills.map((skill, index) => (
                <div key={skill.name}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-primary-text">{skill.name}</span>
                    <span className="text-sm font-medium text-secondary-text">{skill.level}%</span>
                  </div>
                  <div className="h-2 bg-light-border rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-4 pt-4">
              {['Fast Turnaround', 'Unlimited Revisions', '4K Export'].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-secondary-text">
                  <div className="p-1 rounded-full bg-accent/20 text-accent-dark">
                    <Check size={12} />
                  </div>
                  {item}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
