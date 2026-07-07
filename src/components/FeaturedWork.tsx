import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Music, Instagram, Youtube, Monitor, Zap, Camera, Smile, ShoppingBag, Coffee, PenTool, Twitch, Globe, Twitter } from 'lucide-react';
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
    title: 'Viral Dance Challenge',
    platform: 'TikTok',
    views: '2.5M',
    thumbnail: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1000&auto=format&fit=crop',
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-girl-dancing-in-front-of-a-colorful-wall-39758-large.mp4',
    color: 'from-pink-500 to-rose-500',
    icon: <Music className="w-5 h-5" />,
  },
  {
    id: 2,
    title: 'Cinematic B-Roll',
    platform: 'Instagram',
    views: '850K',
    thumbnail: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1000&auto=format&fit=crop',
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-man-runs-past-ground-level-shot-32809-large.mp4',
    color: 'from-purple-500 to-orange-500',
    icon: <Instagram className="w-5 h-5" />,
  },
  {
    id: 3,
    title: 'Tech Unboxing',
    platform: 'YouTube',
    views: '1.2M',
    thumbnail: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=1000&auto=format&fit=crop',
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-opening-a-gift-box-slow-motion-39656-large.mp4',
    color: 'from-red-500 to-red-600',
    icon: <Youtube className="w-5 h-5" />,
  },
  {
    id: 4,
    title: 'Fitness Motivation',
    platform: 'Instagram',
    views: '450K',
    thumbnail: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1000&auto=format&fit=crop',
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-woman-running-on-a-treadmill-at-the-gym-44169-large.mp4',
    color: 'from-purple-500 to-orange-500',
    icon: <Instagram className="w-5 h-5" />,
  },
  {
    id: 5,
    title: 'Gaming Highlights',
    platform: 'TikTok',
    views: '3.1M',
    thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1000&auto=format&fit=crop',
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-young-man-playing-a-video-game-with-headphones-40998-large.mp4',
    color: 'from-pink-500 to-rose-500',
    icon: <Music className="w-5 h-5" />,
  },
  {
    id: 6,
    title: 'Travel Mini-Vlog',
    platform: 'Instagram',
    views: '600K',
    thumbnail: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop',
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-city-traffic-at-night-11-large.mp4',
    color: 'from-blue-500 to-teal-500',
    icon: <Monitor className="w-5 h-5" />,
  },
  {
    id: 7,
    title: 'Product Teaser',
    platform: 'TikTok',
    views: '1.8M',
    thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop',
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-woman-holding-a-pair-of-headphones-900-large.mp4',
    color: 'from-yellow-500 to-orange-500',
    icon: <ShoppingBag className="w-5 h-5" />,
  },
  {
    id: 8,
    title: 'Behind the Scenes',
    platform: 'Instagram',
    views: '320K',
    thumbnail: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1000&auto=format&fit=crop',
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-photographer-taking-pictures-of-a-woman-in-the-street-34415-large.mp4',
    color: 'from-gray-500 to-slate-500',
    icon: <Camera className="w-5 h-5" />,
  },
  {
    id: 9,
    title: 'Comedy Skit',
    platform: 'TikTok',
    views: '5.2M',
    thumbnail: 'https://images.unsplash.com/photo-1524253482453-3fed8d2fe12b?q=80&w=1000&auto=format&fit=crop',
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-friends-laughing-and-talking-in-a-cafe-4646-large.mp4',
    color: 'from-green-400 to-emerald-500',
    icon: <Smile className="w-5 h-5" />,
  },
  {
    id: 10,
    title: 'Fashion Lookbook',
    platform: 'Instagram',
    views: '900K',
    thumbnail: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1000&auto=format&fit=crop',
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-woman-modeling-a-floral-dress-in-a-garden-39769-large.mp4',
    color: 'from-pink-400 to-purple-400',
    icon: <Zap className="w-5 h-5" />,
  },
  {
    id: 11,
    title: 'Recipe Quickie',
    platform: 'TikTok',
    views: '2.8M',
    thumbnail: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1000&auto=format&fit=crop',
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-chef-preparing-a-salad-in-a-kitchen-4076-large.mp4',
    color: 'from-orange-400 to-red-400',
    icon: <Coffee className="w-5 h-5" />,
  },
  {
    id: 12,
    title: 'DIY Hack',
    platform: 'YouTube',
    views: '1.5M',
    thumbnail: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?q=80&w=1000&auto=format&fit=crop',
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-person-drawing-on-a-tablet-with-a-stylus-4098-large.mp4',
    color: 'from-blue-400 to-indigo-400',
    icon: <PenTool className="w-5 h-5" />,
  },
];

export default function FeaturedWork() {
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
    }, 300); // Faster scroll response for shorts
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
  }, [videos.length]); // Re-bind listener when videos change

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await api.get('/projects');
        const shortVideos = res.data
          .filter((p: any) => p.category === 'Short Video' && p.likes !== 0)
          .sort((a: any, b: any) => (a.client_name || '').localeCompare(b.client_name || ''))
          .map((p: any) => ({
            id: p.id,
            title: p.title,
            platform: p.platform,
            views: (p.views || 0).toLocaleString(),
            thumbnail: p.thumbnail_url,
            video_url: p.video_url,
            color: 'from-pink-500 to-rose-500',
            icon: getPlatformIcon(p.platform)
          }));
        setVideos(shortVideos.length > 0 ? shortVideos : initialVideos);
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

    // Adjusted offsets for vertical video aspect ratio
    if (offset === 0) return { x: 0, scale: 1, zIndex: 10, blur: 0, opacity: 1, rotateY: 0 };
    if (offset === 1) return { x: 320, scale: 0.85, zIndex: 5, blur: 4, opacity: 0.6, rotateY: -15 };
    if (offset === -1) return { x: -320, scale: 0.85, zIndex: 5, blur: 4, opacity: 0.6, rotateY: 15 };
    if (offset === 2) return { x: 550, scale: 0.7, zIndex: 2, blur: 8, opacity: 0.3, rotateY: -30 };
    if (offset === -2) return { x: -550, scale: 0.7, zIndex: 2, blur: 8, opacity: 0.3, rotateY: 30 };
    return { x: 0, scale: 0.5, zIndex: 1, blur: 10, opacity: 0, rotateY: 0 };
  };

  return (
    <section id="work" className="py-24 bg-dark-slate relative overflow-hidden min-h-[900px] flex flex-col justify-center">
      <div className="container mx-auto px-6 mb-12 text-center relative z-20">
        <h2 className="text-4xl font-bold mb-4 text-white">Short <span className="text-gradient">Video Content</span></h2>
        <p className="text-muted-text max-w-2xl mx-auto mb-8">
          Scroll to play our collection of high-impact vertical videos.
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
              transition={{ duration: 0.5, type: "spring", stiffness: 120, damping: 20 }}
              className="absolute w-[300px] h-[540px] rounded-2xl overflow-hidden bg-dark-card shadow-2xl border border-light-border/20 cursor-pointer hover:border-accent/50 transition-colors"
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
                
                <div className={`absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none transition-opacity duration-300 ${shouldPlay ? 'opacity-40' : 'opacity-80'}`} />
                
                {/* Play Button Overlay (only when not playing) */}
                {!shouldPlay && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20">
                      <Play className="w-6 h-6 text-white fill-current ml-1" />
                    </div>
                  </div>
                )}

                <div className="absolute top-4 right-4 pointer-events-none">
                  <div className={`p-2 rounded-full bg-gradient-to-br ${video.color} shadow-lg`}>
                    {video.icon}
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 pointer-events-none">
                  <h3 className="text-xl font-bold mb-1 drop-shadow-lg text-white">{video.title}</h3>
                  <div className="flex items-center justify-between text-sm text-gray-300">
                    <span className="drop-shadow-md">{video.platform}</span>
                    <span className="font-mono drop-shadow-md">{video.views} Views</span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
