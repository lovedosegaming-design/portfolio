import { motion } from 'motion/react';
import { Mail, Send, MapPin, Phone } from 'lucide-react';

export default function Contact() {
  return (
    <section id="contact" className="py-24 bg-soft-bg relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-soft-bg to-soft-bg -z-10" />
      
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-4xl font-bold mb-4 text-primary-text">Let's Create <br /><span className="text-gradient">Something Amazing</span></h2>
            <p className="text-secondary-text text-lg leading-relaxed">
              Ready to take your content to the next level? Fill out the form below or reach out directly.
              I'm currently accepting new projects for Q4 2024.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4 group">
                <div className="p-4 rounded-xl bg-card-bg border border-light-border group-hover:bg-primary/10 transition-colors">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-primary-text">Email Me</h4>
                  <p className="text-secondary-text">workforanurag46@gmail.com</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 group">
                <div className="p-4 rounded-xl bg-card-bg border border-light-border group-hover:bg-accent/10 transition-colors">
                  <Phone className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h4 className="font-bold text-primary-text">Call Me</h4>
                  <p className="text-secondary-text">+1 (555) 123-4567</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 group">
                <div className="p-4 rounded-xl bg-card-bg border border-light-border group-hover:bg-primary-dark/10 transition-colors">
                  <MapPin className="w-6 h-6 text-primary-dark" />
                </div>
                <div>
                  <h4 className="font-bold text-primary-text">Location</h4>
                  <p className="text-secondary-text">UP, India</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-3xl bg-card-bg border border-light-border shadow-xl backdrop-blur-md"
          >
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-secondary-text">Name</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full px-4 py-3 rounded-xl bg-soft-bg border border-light-border focus:border-primary focus:outline-none text-primary-text transition-colors placeholder:text-muted-text"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-secondary-text">Email</label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 rounded-xl bg-soft-bg border border-light-border focus:border-primary focus:outline-none text-primary-text transition-colors placeholder:text-muted-text"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-secondary-text">Project Type</label>
                <select className="w-full px-4 py-3 rounded-xl bg-soft-bg border border-light-border focus:border-primary focus:outline-none text-primary-text transition-colors appearance-none">
                  <option>YouTube Video Editing</option>
                  <option>Shorts / Reels</option>
                  <option>Full Channel Management</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-secondary-text">Message</label>
                <textarea
                  rows={4}
                  placeholder="Tell me about your project..."
                  className="w-full px-4 py-3 rounded-xl bg-soft-bg border border-light-border focus:border-primary focus:outline-none text-primary-text transition-colors resize-none placeholder:text-muted-text"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all flex items-center justify-center gap-2"
              >
                Send Message
                <Send size={18} />
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
