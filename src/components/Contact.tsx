import { motion } from 'motion/react';
import { Mail, Send, MapPin } from 'lucide-react';

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
              
              <a href="https://wa.me/919115381919" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group cursor-pointer">
                <div className="p-4 rounded-xl bg-card-bg border border-light-border group-hover:bg-accent/10 transition-colors">
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6 text-accent"
                  >
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.717-1.456L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.963C16.388 2.016 13.91 1.01 11.279 1.01c-5.442 0-9.866 4.372-9.87 9.802 0 1.696.475 3.356 1.378 4.795l-.994 3.633 3.864-.993zm11.368-6.195c-.3-.15-1.774-.875-2.046-.975-.272-.1-.47-.15-.667.15-.198.3-.767.975-.94 1.175-.173.2-.347.225-.647.075-.3-.15-1.266-.467-2.41-1.485-.89-.794-1.49-1.775-1.665-2.075-.175-.3-.019-.463.13-.612.135-.133.3-.35.45-.525.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.525-.075-.15-.667-1.606-.913-2.2-.24-.575-.48-.497-.66-.505-.17-.008-.364-.01-.56-.01-.196 0-.517.074-.787.374-.27.3-1.033 1.01-1.033 2.463 0 1.453 1.056 2.858 1.203 3.058.147.2 2.078 3.176 5.035 4.453.703.304 1.253.486 1.68.621.708.226 1.353.194 1.86.118.56-.084 1.775-.726 2.022-1.428.247-.702.247-1.303.173-1.428-.075-.125-.272-.2-.572-.35z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-primary-text">WhatsApp</h4>
                  <p className="text-secondary-text group-hover:text-accent transition-colors">Chat on WhatsApp</p>
                </div>
              </a>
              
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
