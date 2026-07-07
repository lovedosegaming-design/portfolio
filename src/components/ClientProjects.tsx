import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Youtube, Instagram, Twitter, Users, Twitch, Globe, Play, X } from 'lucide-react';
import ReactPlayer from 'react-player';
import api from '../utils/api';

const ReactPlayerAny = ReactPlayer as any;

interface Client {
  id: string;
  name: string;
  platform: string;
  views: string;
  subscribers: number;
  avatar: string;
  videoUrl?: string;
  thumbnail?: string;
  videos?: Array<{ id: string; url: string; thumbnail?: string; title: string; views: number }>;
}

const initialClients: Client[] = [
  {
    id: '1',
    name: 'TechFlow Reviews',
    platform: 'YouTube',
    views: '12.5M',
    subscribers: 850000,
    avatar: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=200&auto=format&fit=crop',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-typing-on-a-laptop-keyboard-close-up-1731-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=2080&auto=format&fit=crop',
  },
  {
    id: '2',
    name: '@sarah_lifestyle',
    platform: 'Instagram',
    views: '8.2M',
    subscribers: 420000,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-running-on-a-treadmill-at-the-gym-44169-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: '3',
    name: 'Gaming Nexus',
    platform: 'YouTube',
    views: '45M',
    subscribers: 2100000,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-man-playing-a-video-game-with-headphones-40998-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: '5',
    name: 'Travel with Mike',
    platform: 'YouTube',
    views: '5.6M',
    subscribers: 125000,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-beautiful-beach-and-ocean-4009-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1476610182048-b716b8518aae?q=80&w=2059&auto=format&fit=crop',
  },
  {
    id: '6',
    name: '@urban_explorer',
    platform: 'Instagram',
    views: '2.1M',
    subscribers: 85000,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-people-walking-in-a-busy-street-at-night-3395-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1449824913929-2b3a3e3571d5?q=80&w=2071&auto=format&fit=crop',
  },
  {
    id: '7',
    name: 'Crypto Insights',
    platform: 'YouTube',
    views: '1.8M',
    subscribers: 95000,
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&auto=format&fit=crop',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-typing-on-a-laptop-keyboard-close-up-1731-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=1000&auto=format&fit=crop',
  },
];

export default function ClientProjects() {
  const [clients, setClients] = useState<Client[]>([]);
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  


  // Video Playback State
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const [hoveredClient, setHoveredClient] = useState<string | null>(null);

  const platforms = useMemo(() => {
    const uniquePlatforms = Array.from(new Set(clients.map(c => c.platform)));
    return ['All', ...uniquePlatforms.sort()];
  }, [clients]);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await api.get('/projects');
        const clientStories = res.data.filter((p: any) => p.category === 'Client Story');
        
        if (clientStories.length > 0) {
          const grouped: Record<string, any> = {};
          
          clientStories.forEach((p: any) => {
            const name = p.client_name || p.title;
            if (!grouped[name]) {
              grouped[name] = {
                id: p.id,
                name,
                platform: p.platform,
                viewsSum: 0,
                subscribersMax: 0,
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
                videos: []
              };
            }
            grouped[name].videos.push({
              id: p.id,
              url: p.video_url,
              thumbnail: p.thumbnail_url || `https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1000&auto=format&fit=crop`,
              title: p.title || 'Client Video',
              views: p.views || 0
            });
            grouped[name].viewsSum += (p.views || 0);
            grouped[name].subscribersMax = Math.max(grouped[name].subscribersMax, p.views || 0);
          });
          
          const clientProjects = Object.values(grouped).map((c: any) => ({
            id: c.id,
            name: c.name,
            platform: c.platform,
            views: c.viewsSum.toLocaleString(),
            subscribers: c.subscribersMax,
            avatar: c.avatar,
            videoUrl: c.videos[0]?.url,
            thumbnail: c.videos[0]?.thumbnail,
            videos: c.videos
          }));
          
          setClients(clientProjects);
        } else {
          setClients(initialClients.map(c => ({
            ...c,
            videos: c.videoUrl ? [{ id: c.id, url: c.videoUrl, thumbnail: c.thumbnail, title: 'Featured Project', views: 50000 }] : []
          })));
        }
      } catch (error) {
        console.error('Failed to fetch clients', error);
        setClients(initialClients.map(c => ({
          ...c,
          videos: c.videoUrl ? [{ id: c.id, url: c.videoUrl, thumbnail: c.thumbnail, title: 'Featured Project', views: 50000 }] : []
        })));
      }
    };
    fetchClients();
  }, []);  const filteredClients = clients
    .filter(client => {
      const matchesFilter = filter === 'All' || client.platform === filter;
      const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => b.subscribers - a.subscribers);

  const formatSubscribers = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'youtube':
        return <Youtube size={16} className="text-red-500 flex-shrink-0" />;
      case 'instagram':
        return <Instagram size={16} className="text-pink-500 flex-shrink-0" />;
      case 'tiktok':
        return <Twitter size={16} className="text-black fill-white flex-shrink-0" />; // Using Twitter icon as placeholder for TikTok if needed, or custom SVG
      case 'twitter':
      case 'x':
        return <Twitter size={16} className="text-blue-400 flex-shrink-0" />;
      case 'twitch':
        return <Twitch size={16} className="text-purple-500 flex-shrink-0" />;
      default:
        return <Globe size={16} className="text-gray-400 flex-shrink-0" />;
    }
  };

  return (
    <section id="clients" className="py-24 bg-main-bg relative">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <h2 className="text-3xl font-bold mb-2 text-primary-text">Client <span className="text-gradient">Success Stories</span></h2>
            <p className="text-secondary-text">Top creators and brands I've worked with.</p>
          </div>
          
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input 
                  type="text" 
                  placeholder="Search clients..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-64 pl-10 pr-4 py-2 rounded-lg bg-soft-bg border border-light-border focus:border-primary focus:outline-none text-sm transition-colors text-primary-text placeholder:text-muted-text"
                />
              </div>
              <div className="flex items-center gap-2 p-1 rounded-lg bg-white/5 border border-white/10 w-full sm:w-auto overflow-x-auto">
                {platforms.map((platform) => (
                  <button
                    key={platform}
                    onClick={() => setFilter(platform)}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
                      filter === platform 
                        ? 'bg-primary text-white shadow-sm' 
                        : 'text-secondary-text hover:text-primary'
                    }`}
                  >
                    {platform}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          {/* Header */}
          <div className="grid grid-cols-12 gap-4 px-6 py-3 text-sm font-medium text-secondary-text border-b border-light-border">
            <div className="col-span-5 md:col-span-4">Client</div>
            <div className="col-span-3 md:col-span-3">Platform</div>
            <div className="col-span-4 md:col-span-3 text-right md:text-left">Total Subscribers</div>
            <div className="hidden md:block md:col-span-2 text-right">Total Views</div>
          </div>

          {/* Rows */}
          {filteredClients.map((client, index) => (
            <motion.div
              key={client.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              onMouseEnter={() => setHoveredClient(client.id)}
              onMouseLeave={() => setHoveredClient(null)}
              onClick={() => {
                if (client.videos && client.videos.length > 1) {
                  setHoveredClient(prev => prev === client.id ? null : client.id);
                } else if (client.videoUrl) {
                  setPlayingVideo(client.videoUrl);
                }
              }}
              className="group relative rounded-xl bg-white/50 backdrop-blur-sm border border-light-border hover:border-accent hover:shadow-lg transition-all cursor-pointer overflow-hidden"
            >
              <div className="grid grid-cols-12 gap-4 px-6 py-4 items-center relative z-10">
                <div className="col-span-5 md:col-span-4 flex items-center gap-4">
                  <img 
                    src={client.avatar} 
                    alt={client.name} 
                    className="w-10 h-10 rounded-full object-cover border border-light-border"
                  />
                  <div className="flex flex-col">
                    <span className="font-medium text-primary-text group-hover:text-primary transition-colors truncate">
                      {client.name}
                    </span>
                    {client.videoUrl && (
                      <span className="text-xs text-accent flex items-center gap-1 md:hidden">
                        <Play size={10} /> Watch Video
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="col-span-3 md:col-span-3 flex items-center gap-2 text-sm text-secondary-text">
                  {getPlatformIcon(client.platform)}
                  <span className="hidden sm:inline">{client.platform}</span>
                </div>

                <div className="col-span-4 md:col-span-3 flex items-center justify-end md:justify-start gap-2 text-primary-text font-medium">
                  <Users size={14} className="text-muted-text" />
                  {formatSubscribers(client.subscribers)}
                </div>

                <div className="hidden md:block md:col-span-2 text-right font-mono text-sm text-secondary-text">
                  {client.views}
                </div>
              </div>

              {/* Video Preview on Hover / Click */}
              <AnimatePresence>
                {hoveredClient === client.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="bg-soft-bg border-t border-light-border"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {client.videos && client.videos.length > 1 ? (
                      <div className="p-5 space-y-3">
                        <p className="text-xs font-bold uppercase tracking-wider text-secondary-text">Edited Projects ({client.videos.length})</p>
                        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                          {client.videos.map((vid) => (
                            <div 
                              key={vid.id}
                              onClick={() => setPlayingVideo(vid.url)}
                              className="flex items-center gap-3 p-2.5 rounded-xl bg-card-bg border border-light-border hover:border-accent transition-all cursor-pointer group/vid"
                            >
                              <div className="relative w-20 aspect-video rounded bg-black/50 overflow-hidden flex-shrink-0">
                                <img 
                                  src={vid.thumbnail || 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1000&auto=format&fit=crop'} 
                                  alt="Thumbnail" 
                                  className="w-full h-full object-cover opacity-80 group-hover/vid:opacity-100 transition-opacity"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <Play size={10} className="text-white fill-current ml-0.5" />
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-primary-text truncate group-hover/vid:text-accent transition-colors">
                                  {vid.title || 'Client Video'}
                                </p>
                                <p className="text-[10px] text-secondary-text mt-0.5">
                                  Click to watch video
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      client.thumbnail && (
                        <div className="p-4 flex gap-4 items-center cursor-pointer" onClick={() => client.videoUrl && setPlayingVideo(client.videoUrl)}>
                          <div className="relative w-48 aspect-video rounded-lg overflow-hidden bg-black/50 flex-shrink-0">
                            <img 
                              src={client.thumbnail} 
                              alt="Video thumbnail" 
                              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-10 h-10 rounded-full bg-white/40 backdrop-blur-sm flex items-center justify-center">
                                <Play size={20} className="text-white fill-current ml-1" />
                              </div>
                            </div>
                          </div>
                          <div className="text-sm text-secondary-text">
                            <p className="text-primary-text font-medium mb-1">Featured Project</p>
                            <p>Click to watch the full video edited for {client.name}</p>
                          </div>
                        </div>
                      )
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {playingVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
            onClick={() => setPlayingVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setPlayingVideo(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-white/20 transition-colors"
              >
                <X size={24} />
              </button>
              <ReactPlayerAny
                url={playingVideo}
                width="100%"
                height="100%"
                playing
                controls
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
