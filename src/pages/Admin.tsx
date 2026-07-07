import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Video, Settings, Trash2, LogOut, Plus, ExternalLink, Film, CheckCircle2, AlertCircle } from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

interface Project {
  id: string;
  title: string;
  client_name: string;
  platform: string;
  video_url?: string;
  views: number;
  likes?: number;
  category?: string;
}

export default function Admin() {
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('projects');
  const [projects, setProjects] = useState<Project[]>([]);

  // Slot States
  const [slotLinks, setSlotLinks] = useState<Record<string, string>>({});
  const [slotTitles, setSlotTitles] = useState<Record<string, string>>({});
  const [isAddingSlot, setIsAddingSlot] = useState<Record<string, boolean>>({});
  const [slotErrors, setSlotErrors] = useState<Record<string, string>>({});

  // Client Story Form State
  const [clientStoryLink, setClientStoryLink] = useState('');
  const [clientStoryName, setClientStoryName] = useState('');
  const [clientStoryPlatform, setClientStoryPlatform] = useState('YouTube');
  const [isAddingClientStory, setIsAddingClientStory] = useState(false);
  const [clientStoryError, setClientStoryError] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data);
    } catch (error) {
      console.error('Failed to fetch projects', error);
    }
  };

  const getProjectForSlot = (slotId: string, category: string) => {
    return projects.find(p => p.category === category && p.client_name === slotId);
  };

  const handleSaveSlot = async (slotId: string, category: string) => {
    const link = slotLinks[slotId];
    const userTitle = slotTitles[slotId] || '';
    if (!link) {
      setSlotErrors(prev => ({ ...prev, [slotId]: 'Please provide a link' }));
      return;
    }

    setIsAddingSlot(prev => ({ ...prev, [slotId]: true }));
    setSlotErrors(prev => ({ ...prev, [slotId]: '' }));

    try {
      let platform = 'YouTube';
      let detectedTitle = userTitle || 'New Video';
      const url = link.toLowerCase();

      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        platform = 'YouTube';
        if (!userTitle) detectedTitle = 'New YouTube Video';
      } else if (url.includes('instagram.com')) {
        platform = 'Instagram';
        if (!userTitle) detectedTitle = 'New Reel';
      } else if (url.includes('tiktok.com')) {
        platform = 'TikTok';
        if (!userTitle) detectedTitle = 'New TikTok';
      } else if (url.includes('twitch.tv')) {
        platform = 'Twitch';
        if (!userTitle) detectedTitle = 'Twitch Stream';
      } else {
        try {
          const domain = new URL(link).hostname;
          platform = domain.replace('www.', '').split('.')[0];
          platform = platform.charAt(0).toUpperCase() + platform.slice(1);
          if (!userTitle) detectedTitle = `New ${platform} Content`;
        } catch (e) {
          throw new Error('Invalid URL. Please provide a valid link.');
        }
      }

      const existingProject = projects.find(p => p.category === category && p.client_name === slotId);
      if (existingProject) {
        await api.delete(`/projects/${existingProject.id}`);
      }

      const newEntry = {
        title: detectedTitle,
        client_name: slotId,
        platform,
        video_url: link,
        thumbnail_url: `https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1000&auto=format&fit=crop`,
        views: Math.floor(Math.random() * 500000) + 10000,
        likes: 1,
        category: category
      };

      await api.post('/projects', newEntry);
      await fetchProjects();
      
      setSlotLinks(prev => ({ ...prev, [slotId]: '' }));
      setSlotTitles(prev => ({ ...prev, [slotId]: '' }));
    } catch (err: any) {
      setSlotErrors(prev => ({ ...prev, [slotId]: err.message }));
    } finally {
      setIsAddingSlot(prev => ({ ...prev, [slotId]: false }));
    }
  };

  const handleDeleteSlot = async (projectId: string) => {
    if (window.confirm('Are you sure you want to clear this slot?')) {
      try {
        await api.delete(`/projects/${projectId}`);
        fetchProjects();
      } catch (error) {
        console.error('Failed to clear slot', error);
      }
    }
  };

  const handleToggleVisibility = async (project: Project, category: string) => {
    try {
      const newVisibility = project.likes === 0 ? 1 : 0;
      await api.delete(`/projects/${project.id}`);

      const newEntry = {
        title: project.title,
        client_name: project.client_name,
        platform: project.platform,
        video_url: project.video_url,
        thumbnail_url: `https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1000&auto=format&fit=crop`,
        views: project.views,
        likes: newVisibility,
        category: category
      };

      await api.post('/projects', newEntry);
      fetchProjects();
    } catch (error) {
      console.error('Failed to toggle visibility', error);
    }
  };

  const handleSaveClientStory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientStoryLink || !clientStoryName) {
      setClientStoryError('Please provide both Client Name and Video Link');
      return;
    }

    setIsAddingClientStory(true);
    setClientStoryError('');

    try {
      let platform = clientStoryPlatform;
      const url = clientStoryLink.toLowerCase();

      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        platform = 'YouTube';
      } else if (url.includes('instagram.com')) {
        platform = 'Instagram';
      } else if (url.includes('tiktok.com')) {
        platform = 'TikTok';
      }

      const newEntry = {
        title: `${clientStoryName} Success Story`,
        client_name: clientStoryName,
        platform,
        video_url: clientStoryLink,
        thumbnail_url: `https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1000&auto=format&fit=crop`,
        views: Math.floor(Math.random() * 500000) + 10000,
        category: 'Client Story'
      };

      await api.post('/projects', newEntry);
      fetchProjects();
      
      setClientStoryLink('');
      setClientStoryName('');
    } catch (err: any) {
      setClientStoryError(err.message);
    } finally {
      setIsAddingClientStory(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this client story?')) {
      try {
        await api.delete(`/projects/${id}`);
        fetchProjects();
      } catch (error) {
        console.error('Failed to delete project', error);
      }
    }
  };

  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-soft-bg text-primary-text flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-light-border bg-card-bg/90 backdrop-blur-xl fixed h-full z-20 hidden md:block">
        <div className="p-6 border-b border-light-border">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-md shadow-primary/20">
              <Video className="text-white w-4 h-4" />
            </div>
            <span className="text-lg font-bold tracking-tight text-primary-text">Admin</span>
          </Link>
        </div>
        
        <nav className="p-4 space-y-2">
          {[
            { id: 'projects', icon: Video, label: 'Projects' },
            { id: 'settings', icon: Settings, label: 'Settings' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === item.id 
                  ? 'bg-primary/10 text-primary border border-primary/20' 
                  : 'text-secondary-text hover:bg-soft-bg hover:text-primary-text'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 w-full p-4 border-t border-light-border">
          <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-secondary-text hover:text-primary-text hover:bg-soft-bg transition-all">
            <LogOut size={18} />
            Back to Site
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-primary-text">Project Management</h1>
            <p className="text-secondary-text text-sm">Manage your portfolio and client work.</p>
          </div>

        </header>

        <div className="space-y-12">
          {/* Short Videos Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-2 border-b border-light-border">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Film size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-primary-text">Short Videos (Featured Work)</h2>
                <p className="text-xs text-secondary-text">Configure the 10 video slots visible on the main page.</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 10 }, (_, i) => `Short Slot ${i + 1}`).map(slotId => (
                <div 
                  key={slotId}
                  className={`p-5 rounded-2xl border transition-all ${
                    getProjectForSlot(slotId, 'Short Video') 
                      ? 'bg-card-bg border-primary/20 shadow-md shadow-primary/5' 
                      : 'bg-card-bg/50 border-light-border border-dashed'
                  }`}
                >
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-secondary-text">{slotId}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                      getProjectForSlot(slotId, 'Short Video') 
                        ? 'border-emerald-500/20 text-emerald-400 bg-emerald-500/10' 
                        : 'border-gray-500/20 text-gray-400 bg-gray-500/10'
                    }`}>
                      {getProjectForSlot(slotId, 'Short Video') ? (getProjectForSlot(slotId, 'Short Video')?.likes !== 0 ? 'Active' : 'Hidden') : 'Empty'}
                    </span>
                  </div>

                  {getProjectForSlot(slotId, 'Short Video') ? (
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-bold text-primary-text text-sm line-clamp-1">{getProjectForSlot(slotId, 'Short Video')?.title}</h4>
                        <a 
                          href={getProjectForSlot(slotId, 'Short Video')?.video_url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-xs text-primary hover:underline flex items-center gap-1 mt-1 break-all"
                        >
                          <ExternalLink size={12} className="flex-shrink-0" />
                          <span className="line-clamp-1">{getProjectForSlot(slotId, 'Short Video')?.video_url}</span>
                        </a>
                      </div>

                      <div className="flex items-center justify-between text-xs text-secondary-text pt-2 border-t border-light-border">
                        <span>Platform: <strong className="text-primary-text">{getProjectForSlot(slotId, 'Short Video')?.platform}</strong></span>
                        <span>Views: <strong className="text-primary-text">{getProjectForSlot(slotId, 'Short Video')?.views.toLocaleString()}</strong></span>
                      </div>

                      <div className="flex gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            const p = getProjectForSlot(slotId, 'Short Video');
                            if (p) {
                              setSlotLinks(prev => ({ ...prev, [slotId]: p.video_url || '' }));
                              setSlotTitles(prev => ({ ...prev, [slotId]: p.title }));
                            }
                          }}
                          className="flex-1 py-1.5 rounded-lg border border-light-border hover:bg-soft-bg text-xs font-medium text-secondary-text hover:text-primary-text transition-colors"
                        >
                          Change Link
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const p = getProjectForSlot(slotId, 'Short Video');
                            if (p) handleToggleVisibility(p, 'Short Video');
                          }}
                          className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                            getProjectForSlot(slotId, 'Short Video')?.likes !== 0
                              ? 'border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10 bg-emerald-500/5'
                              : 'border-amber-500/20 text-amber-400 hover:bg-amber-500/10 bg-amber-500/5'
                          }`}
                          title={getProjectForSlot(slotId, 'Short Video')?.likes !== 0 ? 'Hide from Site' : 'Show on Site'}
                        >
                          {getProjectForSlot(slotId, 'Short Video')?.likes !== 0 ? 'Visible' : 'Hidden'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const p = getProjectForSlot(slotId, 'Short Video');
                            if (p) handleDeleteSlot(p.id);
                          }}
                          className="p-1.5 rounded-lg border border-red-500/20 hover:bg-red-500/10 text-red-400 transition-colors"
                          title="Clear Slot"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSaveSlot(slotId, 'Short Video');
                      }} 
                      className="space-y-3"
                    >
                      <div>
                        <input
                          type="url"
                          required
                          placeholder="Video Link (YouTube, Instagram...)"
                          value={slotLinks[slotId] || ''}
                          onChange={(e) => setSlotLinks(prev => ({ ...prev, [slotId]: e.target.value }))}
                          className="w-full px-3 py-1.5 bg-soft-bg border border-light-border rounded-lg focus:border-primary focus:outline-none text-primary-text text-xs transition-colors placeholder:text-muted-text"
                        />
                      </div>
                      {slotErrors[slotId] && <p className="text-[10px] text-red-400">{slotErrors[slotId]}</p>}
                      <button
                        type="submit"
                        disabled={isAddingSlot[slotId]}
                        className="w-full py-1.5 rounded-lg bg-primary hover:bg-primary-dark text-white font-medium text-xs transition-colors disabled:opacity-50 shadow-sm"
                      >
                        {isAddingSlot[slotId] ? 'Saving...' : 'Save to Slot'}
                      </button>
                    </form>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Long Videos Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-2 border-b border-light-border">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Video size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-primary-text">Long Videos (Shorts Showcase)</h2>
                <p className="text-xs text-secondary-text">Configure the 10 video slots visible in the scroll showcase.</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 10 }, (_, i) => `Long Slot ${i + 1}`).map(slotId => (
                <div 
                  key={slotId}
                  className={`p-5 rounded-2xl border transition-all ${
                    getProjectForSlot(slotId, 'Long Video') 
                      ? 'bg-card-bg border-primary/20 shadow-md shadow-primary/5' 
                      : 'bg-card-bg/50 border-light-border border-dashed'
                  }`}
                >
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-secondary-text">{slotId}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                      getProjectForSlot(slotId, 'Long Video') 
                        ? 'border-emerald-500/20 text-emerald-400 bg-emerald-500/10' 
                        : 'border-gray-500/20 text-gray-400 bg-gray-500/10'
                    }`}>
                      {getProjectForSlot(slotId, 'Long Video') ? (getProjectForSlot(slotId, 'Long Video')?.likes !== 0 ? 'Active' : 'Hidden') : 'Empty'}
                    </span>
                  </div>

                  {getProjectForSlot(slotId, 'Long Video') ? (
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-bold text-primary-text text-sm line-clamp-1">{getProjectForSlot(slotId, 'Long Video')?.title}</h4>
                        <a 
                          href={getProjectForSlot(slotId, 'Long Video')?.video_url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-xs text-primary hover:underline flex items-center gap-1 mt-1 break-all"
                        >
                          <ExternalLink size={12} className="flex-shrink-0" />
                          <span className="line-clamp-1">{getProjectForSlot(slotId, 'Long Video')?.video_url}</span>
                        </a>
                      </div>

                      <div className="flex items-center justify-between text-xs text-secondary-text pt-2 border-t border-light-border">
                        <span>Platform: <strong className="text-primary-text">{getProjectForSlot(slotId, 'Long Video')?.platform}</strong></span>
                        <span>Views: <strong className="text-primary-text">{getProjectForSlot(slotId, 'Long Video')?.views.toLocaleString()}</strong></span>
                      </div>

                      <div className="flex gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            const p = getProjectForSlot(slotId, 'Long Video');
                            if (p) {
                              setSlotLinks(prev => ({ ...prev, [slotId]: p.video_url || '' }));
                              setSlotTitles(prev => ({ ...prev, [slotId]: p.title }));
                            }
                          }}
                          className="flex-1 py-1.5 rounded-lg border border-light-border hover:bg-soft-bg text-xs font-medium text-secondary-text hover:text-primary-text transition-colors"
                        >
                          Change Link
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const p = getProjectForSlot(slotId, 'Long Video');
                            if (p) handleToggleVisibility(p, 'Long Video');
                          }}
                          className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                            getProjectForSlot(slotId, 'Long Video')?.likes !== 0
                              ? 'border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10 bg-emerald-500/5'
                              : 'border-amber-500/20 text-amber-400 hover:bg-amber-500/10 bg-amber-500/5'
                          }`}
                          title={getProjectForSlot(slotId, 'Long Video')?.likes !== 0 ? 'Hide from Site' : 'Show on Site'}
                        >
                          {getProjectForSlot(slotId, 'Long Video')?.likes !== 0 ? 'Visible' : 'Hidden'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const p = getProjectForSlot(slotId, 'Long Video');
                            if (p) handleDeleteSlot(p.id);
                          }}
                          className="p-1.5 rounded-lg border border-red-500/20 hover:bg-red-500/10 text-red-400 transition-colors"
                          title="Clear Slot"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSaveSlot(slotId, 'Long Video');
                      }} 
                      className="space-y-3"
                    >
                      <div>
                        <input
                          type="url"
                          required
                          placeholder="Video Link (YouTube, Instagram...)"
                          value={slotLinks[slotId] || ''}
                          onChange={(e) => setSlotLinks(prev => ({ ...prev, [slotId]: e.target.value }))}
                          className="w-full px-3 py-1.5 bg-soft-bg border border-light-border rounded-lg focus:border-primary focus:outline-none text-primary-text text-xs transition-colors placeholder:text-muted-text"
                        />
                      </div>
                      {slotErrors[slotId] && <p className="text-[10px] text-red-400">{slotErrors[slotId]}</p>}
                      <button
                        type="submit"
                        disabled={isAddingSlot[slotId]}
                        className="w-full py-1.5 rounded-lg bg-primary hover:bg-primary-dark text-white font-medium text-xs transition-colors disabled:opacity-50 shadow-sm"
                      >
                        {isAddingSlot[slotId] ? 'Saving...' : 'Save to Slot'}
                      </button>
                    </form>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Client Stories Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-2 border-b border-light-border">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Settings size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-primary-text">Client Success Stories</h2>
                <p className="text-xs text-secondary-text">Add and manage video success stories for creators and brands.</p>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6 items-start">
              {/* Form */}
              <div className="p-6 rounded-2xl bg-card-bg border border-light-border shadow-sm">
                <h3 className="text-sm font-bold text-primary-text mb-4">Add Client Success Story</h3>
                <form onSubmit={handleSaveClientStory} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-secondary-text mb-1">Client Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Gaming Nexus"
                      value={clientStoryName}
                      onChange={(e) => setClientStoryName(e.target.value)}
                      className="w-full px-3 py-2 bg-soft-bg border border-light-border rounded-lg focus:border-primary focus:outline-none text-primary-text text-sm transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-secondary-text mb-1">Platform</label>
                    <select
                      value={clientStoryPlatform}
                      onChange={(e) => setClientStoryPlatform(e.target.value)}
                      className="w-full px-3 py-2 bg-soft-bg border border-light-border rounded-lg focus:border-primary focus:outline-none text-primary-text text-sm transition-colors"
                    >
                      <option value="YouTube">YouTube</option>
                      <option value="Instagram">Instagram</option>
                      <option value="TikTok">TikTok</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-secondary-text mb-1">Video Link</label>
                    <input
                      type="url"
                      required
                      placeholder="https://..."
                      value={clientStoryLink}
                      onChange={(e) => setClientStoryLink(e.target.value)}
                      className="w-full px-3 py-2 bg-soft-bg border border-light-border rounded-lg focus:border-primary focus:outline-none text-primary-text text-sm transition-colors"
                    />
                  </div>
                  {clientStoryError && <p className="text-xs text-red-400">{clientStoryError}</p>}
                  <button
                    type="submit"
                    disabled={isAddingClientStory}
                    className="w-full py-2 rounded-lg bg-primary hover:bg-primary-dark text-white font-medium text-sm transition-colors disabled:opacity-50 shadow-md shadow-primary/10"
                  >
                    {isAddingClientStory ? 'Adding...' : 'Add Client Story'}
                  </button>
                </form>
              </div>

              {/* List */}
              <div className="lg:col-span-2 bg-card-bg border border-light-border rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm text-secondary-text">
                  <thead className="bg-soft-bg text-secondary-text uppercase font-semibold text-xs">
                    <tr>
                      <th className="px-6 py-4">Client</th>
                      <th className="px-6 py-4">Platform</th>
                      <th className="px-6 py-4">Video URL</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-light-border text-xs">
                    {projects.filter(p => p.category === 'Client Story').length > 0 ? (
                      projects.filter(p => p.category === 'Client Story').map((project) => (
                        <tr key={project.id} className="hover:bg-soft-bg transition-colors">
                          <td className="px-6 py-4 font-bold text-primary-text">{project.client_name}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] border ${
                              project.platform === 'YouTube' ? 'border-red-500/20 text-red-400 bg-red-500/10' :
                              project.platform === 'Instagram' ? 'border-pink-500/20 text-pink-400 bg-pink-500/10' :
                              'border-blue-500/20 text-blue-400 bg-blue-500/10'
                            }`}>
                              {project.platform}
                            </span>
                          </td>
                          <td className="px-6 py-4 truncate max-w-[200px]" title={project.video_url}>
                            <a href={project.video_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">
                              <ExternalLink size={10} />
                              {project.video_url}
                            </a>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button 
                              onClick={() => handleDeleteProject(project.id)}
                              className="p-1 hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-muted-text">
                          No client stories added yet. Use the form on the left to add one.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
