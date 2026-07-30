import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/supabaseClient';
import { ShieldAlert, Terminal } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      navigate('/admin');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="p-6 border-b border-zinc-800 flex items-center gap-3">
          <div className="h-10 w-10 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-center">
            <ShieldAlert className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <h1 className="font-display font-semibold text-zinc-100 uppercase tracking-widest text-sm">
              Admin Gateway
            </h1>
            <p className="font-mono text-[10px] text-zinc-500 mt-0.5 uppercase">
              Secure Terminal Access
            </p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="p-6 space-y-4">
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3 rounded-lg font-mono text-[10px]">
              {error}
            </div>
          )}
          
          <div className="space-y-1.5">
            <label className="font-mono text-[10px] text-zinc-500 uppercase tracking-wide">Admin Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-200 outline-none focus:border-emerald-500 transition"
              placeholder="sysadmin@homelab.local"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-mono text-[10px] text-zinc-500 uppercase tracking-wide">Passphrase</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-200 outline-none focus:border-emerald-500 transition"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-sans font-semibold text-xs py-2.5 rounded-lg flex items-center justify-center gap-2 mt-2 disabled:opacity-50 transition cursor-pointer"
          >
            {loading ? (
              <span className="h-4 w-4 rounded-full border-2 border-zinc-950 border-t-transparent animate-spin"></span>
            ) : (
              <Terminal className="h-4 w-4" />
            )}
            <span>{loading ? 'Authenticating...' : 'Establish Session'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
