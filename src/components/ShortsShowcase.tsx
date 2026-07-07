import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Monitor, Film, Music, Gamepad, Youtube, Twitch, Globe, Twitter, Instagram } from 'lucide-react';
import ReactPlayer from 'react-player';
import api from '../utils/api';

const ReactPlayerAny = ReactPlayer as any;

interface Video {
  id: number;
  title: string;
  platform: string;
  views: string;
  thumbnail: string;
  video_url: string;
  color: string;
  icon: React.ReactNode;
}

const initialVideos: Video[] = [
  {
    id: 1,
    title: 'Cinematic Travel Vlog',
    platform: 'YouTube',
    views: '1.5M',
    thumbnail: 'https://images.unsplash.com/photo-1476610182048-b716b8518aae?q=80&w=2059&auto=format&fit=crop',
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-beautiful-beach-and-ocean-4009-large.mp4',
    color: 'from-blue-500 to-cyan-500',
    icon: <Film className="w-5 h-5" />,
  },
  {
    id: 2,
    title: 'Tech Review: iPhone 15',
    platform: 'YouTube',
    views: '850K',
    thumbnail: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=2080&auto=format&fit=crop',
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-hands-typing-on-a-laptop-keyboard-close-up-1731-large.mp4',
    color: 'from-blue-600 to-indigo-600',
    icon: <Monitor className="w-5 h-5" />,
  },
  {
    id: 3,
    title: 'Urban Exploration',
    platform: 'Vimeo',
    views: '420K',
    thumbnail: 'https://images.unsplash.com/photo-1449824913929-2b3a3e3571d5?q=80&w=2071&auto=format&fit=crop',
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-people-walking-in-a-busy-street-at-night-3395-large.mp4',
    color: 'from-purple-500 to-pink-500',
    icon: <Film className="w-5 h-5" />,
  },
  {
    id: 4,
    title: 'Music Video Production',
    platform: 'YouTube',
    views: '2.1M',
    thumbnail: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?q=80&w=2070&auto=format&fit=crop',
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-concert-lights-and-people-cheering-at-a-festival-42967-large.mp4',
    color: 'from-red-500 to-orange-500',
    icon: <Music className="w-5 h-5" />,
  },
  {
    id: 5,
    title: 'Gaming Championship',
    platform: 'Twitch',
    views: '3.5M',
    thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop',
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-young-man-playing-a-video-game-with-headphones-40998-large.mp4',
    color: 'from-green-500 to-emerald-500',
    icon: <Gamepad className="w-5 h-5" />,
  },
  {
    id: 6,
    title: 'Nature Documentary',
    platform: 'YouTube',
    views: '950K',
    thumbnail: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=2000&auto=format&fit=crop',
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4',
    color: 'from-green-600 to-teal-600',
    icon: <Film className="w-5 h-5" />,
  },
];

export default function ShortsShowcase() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isScrolling = useRef(false);



  const handleWheel = (e: WheelEvent) => {
    if (isScrolling.current) return;
    e.preventDefault();
    isScrolling.current = true;

    if (e.deltaY > 0) {
      setActiveIndex((prev) => (prev + 1) % videos.length);
    } else {
      setActiveIndex((prev) => (prev - 1 + videos.length) % videos.length);
    }

    setTimeout(() => {
      isScrolling.current = false;
    }, 500);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
    }
    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel);
      }
    };
  }, [videos.length]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await api.get('/projects');
        const longVideos = res.data
          .filter((p: any) => p.category === 'Long Video' && p.likes !== 0)
          .sort((a: any, b: any) => (a.client_name || '').localeCompare(b.client_name || ''))
          .map((p: any) => ({
            id: p.id,
            title: p.title,
            platform: p.platform,
            views: (p.views || 0).toLocaleString(),
            thumbnail: p.thumbnail_url,
            video_url: p.video_url,
            color: 'from-blue-500 to-cyan-500',
            icon: getPlatformIcon(p.platform)
          }));
        setVideos(longVideos.length > 0 ? longVideos : initialVideos);
      } catch (error) {
        console.error('Failed to fetch videos', error);
        setVideos(initialVideos);
      }
    };
    fetchVideos();
  }, []);

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'youtube':
        return <Youtube className="w-5 h-5" />;
      case 'instagram':
        return <Instagram className="w-5 h-5" />;
      case 'tiktok':
        return <Music className="w-5 h-5" />;
      case 'twitch':
        return <Twitch className="w-5 h-5" />;
      case 'twitter':
      case 'x':
        return <Twitter className="w-5 h-5" />;
      default:
        return <Globe className="w-5 h-5" />;
    }
  };



  const getPosition = (index: number) => {
    const total = videos.length;
    let offset = (index - activeIndex);
    while (offset > total / 2) offset -= total;
    while (offset < -total / 2) offset += total;

    if (offset === 0) return { x: 0, scale: 1, zIndex: 10, blur: 0, opacity: 1, rotateY: 0 };
    if (offset === 1) return { x: 600, scale: 0.8, zIndex: 5, blur: 4, opacity: 0.6, rotateY: -15 };
    if (offset === -1) return { x: -600, scale: 0.8, zIndex: 5, blur: 4, opacity: 0.6, rotateY: 15 };
    if (offset === 2) return { x: 900, scale: 0.6, zIndex: 2, blur: 8, opacity: 0.3, rotateY: -30 };
    if (offset === -2) return { x: -900, scale: 0.6, zIndex: 2, blur: 8, opacity: 0.3, rotateY: 30 };
    return { x: 0, scale: 0.5, zIndex: 1, blur: 10, opacity: 0, rotateY: 0 };
  };

  return (
    <section className="py-24 bg-dark-slate relative overflow-hidden min-h-[900px] flex flex-col justify-center">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-light-border/10 to-transparent" />
      
      <div className="container mx-auto px-6 mb-12 text-center relative z-20">
        <h2 className="text-4xl font-bold mb-4 text-white">Long <span className="text-gradient">Video Content</span></h2>
        <p className="text-muted-text max-w-2xl mx-auto mb-8">
          Scroll to explore our collection of cinematic long-form content.
        </p>


      </div>

      <div 
        ref={containerRef} 
        className="relative h-[600px] w-full flex items-center justify-center perspective-[2000px]"
      >
        {videos.map((video, index) => {
          const pos = getPosition(index);
          const isCenter = index === activeIndex;
          const isHovered = index === hoveredIndex;
          const shouldPlay = isCenter || isHovered;

          return (
            <motion.div
              key={video.id}
              animate={{
                x: pos.x,
                scale: pos.scale,
                zIndex: pos.zIndex,
                opacity: pos.opacity,
                filter: `blur(${pos.blur}px)`,
                rotateY: pos.rotateY,
              }}
              transition={{ duration: 0.6, type: "spring", stiffness: 100, damping: 20 }}
              className="absolute w-[800px] aspect-video rounded-2xl overflow-hidden bg-dark-card shadow-2xl border border-light-border/20 cursor-pointer hover:border-accent/50 transition-colors"
              style={{ transformStyle: 'preserve-3d' }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => setActiveIndex(index)}
            >
              <div className="w-full h-full relative">
                {shouldPlay ? (
                  <ReactPlayerAny
                    url={video.video_url}
                    width="100%"
                    height="100%"
                    playing={true}
                    muted={true}
                    loop={true}
                    controls={false}
                    config={{
                      file: {
                        attributes: {
                          style: { objectFit: 'cover', width: '100%', height: '100%' }
                        }
                      }
                    }}
                  />
                ) : (
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                )}

                {/* Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none transition-opacity duration-300 ${shouldPlay ? 'opacity-40' : 'opacity-80'}`} />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-8 pointer-events-none">
                  <div className="flex items-center justify-between mb-2">
                    <div className={`p-2 rounded-full bg-gradient-to-br ${video.color} shadow-lg`}>
                      {video.icon}
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10">
                      <span className="text-xs font-medium text-gray-300">{video.platform}</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-2 drop-shadow-lg text-white">{video.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-300">
                    <span className="font-mono">{video.views} Views</span>
                    <div className="flex items-center gap-1">
                      <Play size={14} fill="currentColor" />
                      <span>Watch Now</span>
                    </div>
                  </div>
                </div>

                {/* Play Button Overlay (only when not playing) */}
                {!shouldPlay && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform">
                      <Play className="w-8 h-8 text-white fill-current ml-1" />
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
