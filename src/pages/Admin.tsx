import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Video, Settings, Trash2, LogOut } from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

interface Project {
  id: string;
  title: string;
  client_name: string;
  platform: string;
  views: number;
}

export default function Admin() {
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('projects');
  const [projects, setProjects] = useState<Project[]>([]);


  const [isQuickAdding, setIsQuickAdding] = useState(false);
  const [quickLink, setQuickLink] = useState('');
  const [quickCategory, setQuickCategory] = useState('Short Video');
  const [quickError, setQuickError] = useState('');

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



  const handleQuickAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setQuickError('');
    setIsQuickAdding(true);

    setTimeout(async () => {
      try {
        let platform = '';
        let title = 'New Content';
        const url = quickLink.toLowerCase();

        if (url.includes('youtube.com') || url.includes('youtu.be')) {
          platform = 'YouTube';
          title = 'New YouTube Video';
        } else if (url.includes('instagram.com')) {
          platform = 'Instagram';
          title = 'New Reel';
        } else if (url.includes('tiktok.com')) {
          platform = 'TikTok';
          title = 'New TikTok';
        } else if (url.includes('twitch.tv')) {
          platform = 'Twitch';
          title = 'Twitch Stream';
        } else {
          try {
            const domain = new URL(quickLink).hostname;
            platform = domain.replace('www.', '').split('.')[0];
            platform = platform.charAt(0).toUpperCase() + platform.slice(1);
            title = `New ${platform} Content`;
          } catch (e) {
            throw new Error('Invalid URL. Please provide a valid link.');
          }
        }

        const newEntry = {
          title,
          client_name: quickCategory === 'Client Story' ? 'New Client' : 'Portfolio',
          platform,
          video_url: quickLink,
          thumbnail_url: `https://source.unsplash.com/random/800x600?sig=${Date.now()}`,
          views: Math.floor(Math.random() * 500000) + 10000,
          category: quickCategory
        };

        await api.post('/projects', newEntry);
        fetchProjects();
        setQuickLink('');
      } catch (err: any) {
        setQuickError(err.message);
      } finally {
        setIsQuickAdding(false);
      }
    }, 1000);
  };

  const handleDeleteProject = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
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

        {/* Quick Add Link Form */}
        <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-primary-text">
            <Video size={20} className="text-primary" />
            Quick Add via Link
          </h3>
          <form onSubmit={handleQuickAdd} className="flex flex-col md:flex-row gap-4 items-start md:items-end">
            <div className="flex-1 w-full">
              <label className="block text-sm font-medium text-secondary-text mb-2">Video Link</label>
              <input
                type="url"
                required
                value={quickLink}
                onChange={(e) => setQuickLink(e.target.value)}
                placeholder="https://..."
                className="w-full px-4 py-2 bg-card-bg border border-light-border rounded-lg focus:border-primary focus:outline-none text-primary-text text-sm transition-colors"
              />
            </div>
            <div className="w-full md:w-48">
              <label className="block text-sm font-medium text-secondary-text mb-2">Category</label>
              <select
                value={quickCategory}
                onChange={(e) => setQuickCategory(e.target.value)}
                className="w-full px-4 py-2 bg-card-bg border border-light-border rounded-lg focus:border-primary focus:outline-none text-primary-text text-sm transition-colors"
              >
                <option value="Short Video">Short Video</option>
                <option value="Long Video">Long Video</option>
                <option value="Client Story">Client Story</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={isQuickAdding}
              className="px-6 py-2 rounded-lg bg-primary hover:bg-primary-dark text-white font-medium text-sm transition-colors disabled:opacity-50 h-10 shadow-md shadow-primary/20"
            >
              {isQuickAdding ? 'Adding...' : 'Add Link'}
            </button>
          </form>
          {quickError && <p className="mt-2 text-red-400 text-xs">{quickError}</p>}
        </div>



        {/* Projects List */}
        <div className="bg-card-bg border border-light-border rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left text-sm text-secondary-text">
            <thead className="bg-soft-bg text-secondary-text uppercase font-medium">
              <tr>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Platform</th>
                <th className="px-6 py-4">Views</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-light-border">
              {projects.map((project) => (
                <tr key={project.id} className="hover:bg-soft-bg transition-colors">
                  <td className="px-6 py-4 font-medium text-primary-text">{project.title}</td>
                  <td className="px-6 py-4">{project.client_name}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs border ${
                      project.platform === 'YouTube' ? 'border-red-500/20 text-red-400 bg-red-500/10' :
                      project.platform === 'Instagram' ? 'border-pink-500/20 text-pink-400 bg-pink-500/10' :
                      'border-blue-500/20 text-blue-400 bg-blue-500/10'
                    }`}>
                      {project.platform}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-primary-text">{project.views.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleDeleteProject(project.id)}
                      className="p-2 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
