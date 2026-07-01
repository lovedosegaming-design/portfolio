import { motion } from 'motion/react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', views: 4000, subs: 2400 },
  { name: 'Feb', views: 3000, subs: 1398 },
  { name: 'Mar', views: 2000, subs: 9800 },
  { name: 'Apr', views: 2780, subs: 3908 },
  { name: 'May', views: 1890, subs: 4800 },
  { name: 'Jun', views: 2390, subs: 3800 },
  { name: 'Jul', views: 3490, subs: 4300 },
];

export default function Analytics() {
  return (
    <section className="py-24 bg-black relative">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-4xl font-bold leading-tight">
              Data-Driven <br />
              <span className="text-gradient">Content Strategy</span>
            </h2>
            <p className="text-gray-400 text-lg">
              I don't just edit videos; I analyze performance metrics to optimize content for maximum reach and engagement.
            </p>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <h3 className="text-3xl font-bold text-white mb-1">1.2M+</h3>
                <p className="text-sm text-gray-400">Average Views per Video</p>
              </div>
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <h3 className="text-3xl font-bold text-white mb-1">45%</h3>
                <p className="text-sm text-gray-400">Retention Rate Increase</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="h-[400px] w-full bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 -z-10" />
            <h3 className="text-lg font-semibold mb-6 text-gray-300">Channel Growth Overview</h3>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorSubs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="name" stroke="#666" tick={{ fill: '#666' }} axisLine={false} tickLine={false} />
                <YAxis stroke="#666" tick={{ fill: '#666' }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px' }}
                  itemStyle={{ color: '#ccc' }}
                />
                <Area type="monotone" dataKey="views" stroke="#8884d8" fillOpacity={1} fill="url(#colorViews)" />
                <Area type="monotone" dataKey="subs" stroke="#82ca9d" fillOpacity={1} fill="url(#colorSubs)" />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
