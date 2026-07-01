import { Video, Twitter, Instagram, Youtube, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-dark-slate border-t border-light-border/10 py-12">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-md shadow-primary/20">
                <Video className="text-white w-4 h-4" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">Lumina</span>
            </div>
            <p className="text-muted-text max-w-sm">
              Premium video editing and content strategy for creators who demand excellence.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-white mb-4">Services</h4>
            <ul className="space-y-2 text-muted-text text-sm">
              <li><a href="#" className="hover:text-accent transition-colors">YouTube Editing</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Shorts & Reels</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Thumbnail Design</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Channel Management</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Connect</h4>
            <div className="flex gap-4">
              <a href="#" className="p-2 rounded-full bg-white/5 hover:bg-white/10 hover:text-blue-400 transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="p-2 rounded-full bg-white/5 hover:bg-white/10 hover:text-pink-400 transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" className="p-2 rounded-full bg-white/5 hover:bg-white/10 hover:text-red-500 transition-colors">
                <Youtube size={18} />
              </a>
              <a href="#" className="p-2 rounded-full bg-white/5 hover:bg-white/10 hover:text-blue-600 transition-colors">
                <Linkedin size={18} />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-text">
          <p>&copy; {new Date().getFullYear()} Lumina Portfolio. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
