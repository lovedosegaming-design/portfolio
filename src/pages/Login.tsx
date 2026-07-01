import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(email, password)) {
      navigate('/admin');
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen bg-soft-bg flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-card-bg border border-light-border rounded-2xl p-8 shadow-xl">
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
            <Lock className="text-white w-6 h-6" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-primary-text text-center mb-2">Admin Login</h2>
        <p className="text-secondary-text text-center mb-8">Enter your email and password to access the admin panel.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Admin Email"
              className="w-full px-4 py-3 rounded-xl bg-soft-bg border border-light-border focus:border-primary focus:outline-none text-primary-text transition-colors mb-4 placeholder:text-muted-text"
              required
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-3 rounded-xl bg-soft-bg border border-light-border focus:border-primary focus:outline-none text-primary-text transition-colors placeholder:text-muted-text"
              required
            />
          </div>
          
          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}
          
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
