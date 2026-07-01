import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Quote, Send, User, Plus } from 'lucide-react';

const initialReviews = [
  {
    id: 1,
    client: 'Sarah Jenkins',
    role: 'Lifestyle Vlogger',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
    rating: 5,
    text: "Absolutely transformed my channel. The retention rate skyrocketed after hiring him! He understands pacing and storytelling perfectly.",
  },
  {
    id: 2,
    client: 'Mike Ross',
    role: 'Tech Reviewer',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    rating: 5,
    text: "Professional, fast, and incredibly creative. Best editor I have worked with. He turned my raw footage into a cinematic masterpiece.",
  },
  {
    id: 3,
    client: 'Jessica Lee',
    role: 'Fitness Coach',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    rating: 5,
    text: "Great communication and amazing edits. Highly recommended for lifestyle content. My engagement has doubled since we started working together.",
  },
  {
    id: 4,
    client: 'David Chen',
    role: 'Gaming Streamer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    rating: 5,
    text: "The montage editing is next level. My viewers keep asking who edits my videos now. Worth every penny!",
  },
  {
    id: 5,
    client: 'Emily Watson',
    role: 'Travel Influencer',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop',
    rating: 4,
    text: "Captured the vibe of my trips perfectly. The color grading was exactly what I was looking for.",
  },
];

export default function Reviews() {
  const [reviews, setReviews] = useState(initialReviews);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isScrolling = useRef(false);

  // Form State
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleWheel = (e: WheelEvent) => {
    if (isScrolling.current) return;
    e.preventDefault();
    isScrolling.current = true;

    if (e.deltaY > 0) {
      setActiveIndex((prev) => (prev + 1) % reviews.length);
    } else {
      setActiveIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
    }

    setTimeout(() => {
      isScrolling.current = false;
    }, 200);
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
  }, [reviews.length]); // Re-bind if reviews change

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate network request
    setTimeout(() => {
      const newReview = {
        id: reviews.length + 1,
        client: name,
        role: role || 'Client',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
        rating: rating,
        text: reviewText,
      };

      setReviews([...reviews, newReview]);
      setName('');
      setRole('');
      setReviewText('');
      setRating(5);
      setIsSubmitting(false);
      setShowSuccess(true);
      
      // Auto scroll to the new review
      setActiveIndex(reviews.length);

      setTimeout(() => setShowSuccess(false), 3000);
    }, 1000);
  };

  const getPosition = (index: number) => {
    const total = reviews.length;
    let offset = (index - activeIndex);
    while (offset > total / 2) offset -= total;
    while (offset < -total / 2) offset += total;

    // Carousel Logic: No Blur, just Scale and X position
    const spacing = 420; // Width + Gap
    const scale = offset === 0 ? 1 : 0.85;
    const opacity = offset === 0 ? 1 : 0.6;
    const zIndex = offset === 0 ? 10 : 10 - Math.abs(offset);
    
    // Limit visible items for performance and aesthetics
    if (Math.abs(offset) > 2) {
      return { x: offset * spacing, scale: 0.5, opacity: 0, zIndex: 0, display: 'none' };
    }

    return { 
      x: offset * spacing, 
      scale, 
      opacity, 
      zIndex,
      display: 'block'
    };
  };

  return (
    <section className="py-24 bg-soft-bg relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-soft-bg to-soft-bg -z-10" />
      
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4 text-primary-text">Client <span className="text-gradient">Testimonials</span></h2>
          <p className="text-secondary-text max-w-2xl mx-auto">
            Scroll to see what creators and brands are saying about my work.
          </p>
        </motion.div>

        {/* Carousel Section */}
        <div 
          ref={containerRef}
          className="relative h-[400px] flex items-center justify-center mb-24"
        >
          {reviews.map((review, index) => {
            const pos = getPosition(index);
            
            return (
              <motion.div
                key={review.id}
                animate={{
                  x: pos.x,
                  scale: pos.scale,
                  opacity: pos.opacity,
                  zIndex: pos.zIndex,
                }}
                transition={{ duration: 0.4, type: "spring", stiffness: 100, damping: 20 }}
                className="absolute w-[380px] p-8 rounded-2xl bg-card-bg border border-light-border backdrop-blur-sm"
                style={{ 
                  display: pos.display,
                  boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.1)'
                }}
                onClick={() => setActiveIndex(index)}
              >
                <Quote className="absolute top-6 right-6 text-light-border w-10 h-10" />
                
                <div className="flex items-center gap-4 mb-6">
                  <img
                    src={review.avatar}
                    alt={review.client}
                    className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
                  />
                  <div>
                    <h4 className="font-bold text-primary-text">{review.client}</h4>
                    <p className="text-xs text-secondary-text">{review.role}</p>
                  </div>
                </div>

                <div className="flex gap-1 mb-4 text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={16} 
                      fill={i < review.rating ? "currentColor" : "none"} 
                      className={i < review.rating ? "text-yellow-500" : "text-gray-600"}
                    />
                  ))}
                </div>

                <p className="text-secondary-text leading-relaxed italic">
                  "{review.text}"
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Add Review Section */}
        <div className="max-w-xl mx-auto">
          <div className="p-1 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20">
            <div className="bg-card-bg/90 backdrop-blur-xl rounded-[14px] p-6 border border-light-border shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-full bg-primary/20 text-primary">
                  <Plus size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-primary-text">Leave a Review</h3>
                  <p className="text-secondary-text text-xs">Share your experience working with me.</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-secondary-text">Your Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-text" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-soft-bg border border-light-border focus:border-primary focus:outline-none text-primary-text text-sm transition-colors placeholder:text-muted-text"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-secondary-text">Your Review</label>
                  <textarea
                    required
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    rows={3}
                    placeholder="Tell us about your experience..."
                    className="w-full px-4 py-2.5 rounded-lg bg-soft-bg border border-light-border focus:border-primary focus:outline-none text-primary-text text-sm transition-colors resize-none placeholder:text-muted-text"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-lg bg-gradient-to-r from-primary to-accent text-white text-sm font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Posting...' : 'Post Review'}
                  <Send size={16} />
                </motion.button>

                <AnimatePresence>
                  {showSuccess && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-3 rounded-lg bg-green-500/20 border border-green-500/50 text-green-200 text-center text-xs"
                    >
                      Review posted successfully! Scroll up to see it.
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
