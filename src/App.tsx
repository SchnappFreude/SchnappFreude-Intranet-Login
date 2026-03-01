/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Lock, 
  User, 
  ArrowRight, 
  ShieldCheck, 
  Database, 
  Warehouse, 
  Truck,
  Activity,
  Terminal,
  Globe,
  Cpu,
  BarChart3
} from 'lucide-react';

const SystemStat = ({ icon: Icon, label, value, color = "text-schnapp-green" }: { icon: any, label: string, value: string, color?: string }) => (
  <div className="flex items-center gap-3 p-3 rounded-xl bg-schnapp-green/5 border border-schnapp-green/10">
    <div className={`p-2 rounded-lg bg-schnapp-green/10 ${color}`}>
      <Icon size={18} />
    </div>
    <div>
      <div className="text-[10px] font-mono uppercase tracking-widest text-white/30">{label}</div>
      <div className="text-sm font-bold font-mono text-white/80">{value}</div>
    </div>
  </div>
);

const InputField = ({ icon: Icon, label, type = "text", placeholder }: { icon: any, label: string, type?: string, placeholder: string }) => (
  <div className="space-y-1.5 group">
    <label className="text-[10px] font-mono uppercase tracking-widest text-schnapp-green/60 group-focus-within:text-schnapp-accent transition-colors">
      {label}
    </label>
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-schnapp-accent transition-colors">
        <Icon size={16} />
      </div>
      <input 
        type={type}
        placeholder={placeholder}
        className="w-full bg-black/40 border border-schnapp-green/20 rounded-xl py-3.5 pl-12 pr-4 text-sm font-mono focus:outline-none focus:border-schnapp-accent/50 focus:ring-1 focus:ring-schnapp-accent/20 transition-all placeholder:text-white/10"
      />
    </div>
  </div>
);

export default function App() {
  const [loading, setLoading] = useState(false);
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [authStatus, setAuthStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const origin = event.origin;
      if (!origin.endsWith('.run.app') && !origin.includes('localhost')) {
        return;
      }
      
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS' && event.data?.provider === 'google') {
        setAuthStatus('success');
      }
    };
    
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleGoogleSSO = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/auth/google/url');
      if (!response.ok) {
        throw new Error('Failed to get Google auth URL');
      }
      const { url } = await response.json();

      const authWindow = window.open(
        url,
        'google_oauth_popup',
        'width=600,height=700'
      );

      if (!authWindow) {
        alert('Please allow popups for this site to connect your account.');
      }
    } catch (error) {
      console.error('Google SSO error:', error);
      setAuthStatus('error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-[#040D0A] overflow-y-auto">
      {/* Immersive Background */}
      <div className="fixed inset-0 data-grid opacity-40 pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-to-tr from-schnapp-dark via-transparent to-schnapp-dark/20 pointer-events-none" />
      
      {/* Animated Data Lines */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ x: '-100%', opacity: 0 }}
            animate={{ x: '200%', opacity: [0, 0.5, 0] }}
            transition={{ duration: 15 + i * 5, repeat: Infinity, ease: "linear", delay: i * 2 }}
            className="glow-line"
            style={{ top: `${10 + i * 12}%`, width: '40%' }}
          />
        ))}
      </div>

      {/* Main Content Container */}
      <div className="flex-1 flex items-center justify-center py-10 lg:py-16 relative z-10">
        <div className="w-full max-w-7xl px-6 grid lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Section: System Overview */}
        <div className="hidden lg:flex lg:col-span-7 flex-col gap-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-8">
              <img 
                src="https://schnappfreude.de/cdn/shop/files/1.png?v=1768946981&width=150" 
                alt="SchnappFreude" 
                className="h-32 w-auto object-contain brightness-110"
                referrerPolicy="no-referrer"
              />
              <div>
                <h1 className="text-4xl font-bold tracking-tighter text-white">
                  SCHNAPP<span className="text-schnapp-green">FREUDE</span>
                  <span className="block text-xs font-mono font-normal tracking-[0.4em] text-schnapp-green/60 uppercase mt-1">
                    Partner OS • Enterprise v2.0
                  </span>
                </h1>
              </div>
            </div>
            <p className="text-xl text-white/40 max-w-xl leading-relaxed font-light">
              Zentrales Management-Interface für <span className="text-white/80 font-medium">Lagerlogistik</span>, 
              <span className="text-white/80 font-medium"> Bestandsführung</span> und 
              <span className="text-white/80 font-medium"> Dropshipping-Prozesse</span>.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 gap-4 max-w-2xl">
            <SystemStat icon={Warehouse} label="Warehouse Nodes" value="14 Global" />
            <SystemStat icon={Database} label="ERP Sync Status" value="Active / 0ms" />
            <SystemStat icon={Truck} label="Dropship Queue" value="842 Pending" />
            <SystemStat icon={Activity} label="System Load" value="12% Nominal" />
          </div>

          <div className="p-6 b2b-glass rounded-2xl space-y-4 max-w-2xl">
            <div className="flex items-center justify-between border-b border-schnapp-green/10 pb-3">
              <div className="flex items-center gap-2">
                <Terminal size={14} className="text-schnapp-green" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">Live Network Feed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-schnapp-green animate-pulse" />
                <span className="text-[10px] font-mono text-schnapp-green">{time}</span>
              </div>
            </div>
            <div className="space-y-2 font-mono text-[11px] text-white/30">
              <div className="flex justify-between">
                <span>{'>'} Initializing ERP Handshake...</span>
                <span className="text-schnapp-green">DONE</span>
              </div>
              <div className="flex justify-between">
                <span>{'>'} Syncing Inventory Node: BER-02</span>
                <span className="text-schnapp-green">100%</span>
              </div>
              <div className="flex justify-between">
                <span>{'>'} Dropship API Gateway: Listening</span>
                <span className="text-schnapp-accent">READY</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section: Login Card */}
        <div className="lg:col-span-5 flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              duration: 0.8, 
              delay: 0.2,
              type: "spring",
              stiffness: 100,
              damping: 15
            }}
            className="w-full max-w-md"
          >
            <div className="b2b-glass rounded-[2rem] overflow-hidden relative">
              {/* Decorative Header */}
              <div className="h-1.5 w-full bg-gradient-to-r from-schnapp-green via-schnapp-accent to-schnapp-green" />
              
              <div className="p-10 space-y-8">
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-center space-y-2"
                >
                  <h2 className="text-2xl font-bold tracking-tight text-white">Partner Login</h2>
                  <p className="text-xs font-mono text-white/30 uppercase tracking-widest">
                    Authorized Personnel Only
                  </p>
                </motion.div>

                <motion.form 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  onSubmit={handleSubmit} 
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    <InputField 
                      icon={User} 
                      label="Employee / Partner ID" 
                      placeholder="SF-XXXX-XXXX" 
                    />
                    <InputField 
                      icon={Lock} 
                      label="Security Token" 
                      type="password" 
                      placeholder="••••••••••••" 
                    />
                  </div>

                  <div className="flex items-center justify-between px-1">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <div className="w-4 h-4 rounded border border-schnapp-green/30 flex items-center justify-center group-hover:border-schnapp-green transition-colors">
                        <div className="w-2 h-2 rounded-sm bg-schnapp-green opacity-0 group-hover:opacity-20 transition-opacity" />
                      </div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-white/30 group-hover:text-white/50 transition-colors">Angemeldet bleiben</span>
                    </label>
                    <button type="button" className="text-[10px] font-mono uppercase tracking-widest text-schnapp-green hover:text-schnapp-accent transition-colors">
                      Support anfordern
                    </button>
                  </div>

                  <button 
                    disabled={loading}
                    className="w-full relative group overflow-hidden bg-schnapp-green text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 hover:shadow-[0_0_30px_rgba(45,106,79,0.3)] transition-all active:scale-[0.98] disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        <span className="font-mono uppercase tracking-widest text-xs">Verifying...</span>
                      </div>
                    ) : (
                      <>
                        <span className="font-mono uppercase tracking-widest text-xs">Terminal Access</span>
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                    <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                  </button>
                </motion.form>

                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-px flex-1 bg-schnapp-green/10" />
                    <span className="text-[9px] font-mono uppercase tracking-[0.3em] text-white/20">Corporate SSO</span>
                    <div className="h-px flex-1 bg-schnapp-green/10" />
                  </div>

                   <div className="grid grid-cols-3 gap-3">
                    {[
                      { name: 'Microsoft', icon: (props: any) => (
                        <svg viewBox="0 0 23 23" {...props} fill="currentColor">
                          <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z"/>
                        </svg>
                      ), onClick: () => {} },
                      { name: 'Google', icon: (props: any) => (
                        <svg viewBox="0 0 24 24" {...props} fill="currentColor">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                      ), onClick: handleGoogleSSO },
                      { name: 'Okta', icon: (props: any) => (
                        <svg viewBox="0 0 24 24" {...props} fill="currentColor">
                          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 18c-3.314 0-6-2.686-6-6s2.686-6 6-6 6 2.686 6 6-2.686 6-6 6z"/>
                        </svg>
                      ), onClick: () => {} }
                    ].map((sso) => (
                      <button 
                        key={sso.name}
                        type="button"
                        onClick={sso.onClick}
                        disabled={loading}
                        className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-schnapp-green/30 transition-all group disabled:opacity-50"
                      >
                        <sso.icon className="w-5 h-5 opacity-40 group-hover:opacity-100 transition-opacity" />
                        <span className="text-[8px] font-mono uppercase tracking-widest text-white/20 group-hover:text-white/60">{sso.name}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>

                <div className="pt-6 border-t border-schnapp-green/10 flex flex-col items-center gap-6">
                  {authStatus === 'success' && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="w-full p-3 rounded-lg bg-schnapp-green/20 border border-schnapp-green/30 text-schnapp-green text-[10px] font-mono text-center uppercase tracking-widest"
                    >
                      SSO Verification Successful. Redirecting...
                    </motion.div>
                  )}
                  
                  <div className="flex gap-10">
                    {[
                      { icon: Globe, label: 'Network' },
                      { icon: Cpu, label: 'Compute' },
                      { icon: BarChart3, label: 'Analytics' }
                    ].map((item) => (
                      <div key={item.label} className="relative group flex flex-col items-center cursor-help">
                        <item.icon size={20} className="text-schnapp-green opacity-30 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110" />
                        
                        {/* Tooltip */}
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-schnapp-green text-black text-[9px] font-mono font-bold uppercase tracking-[0.2em] rounded border border-schnapp-green shadow-[0_0_15px_rgba(45,106,79,0.3)] opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 pointer-events-none whitespace-nowrap z-30">
                          {item.label}
                          {/* Tooltip Arrow */}
                          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-schnapp-green" />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5">
                    <ShieldCheck size={12} className="text-schnapp-green" />
                    <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest">End-to-End Encrypted Session</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>

      {/* Footer Branding & Legal */}
      <div className="w-full mt-auto p-8 lg:px-12 flex flex-col md:flex-row justify-between items-center gap-8 border-t border-schnapp-green/20 bg-black/40 backdrop-blur-xl relative z-20 shadow-[0_-10px_40px_rgba(45,106,79,0.05)]">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 opacity-60 hover:opacity-100 transition-opacity duration-500">
            <div className="w-8 h-8 bg-schnapp-green rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(45,106,79,0.4)]">
              <Warehouse size={18} className="text-black" />
            </div>
            <span className="text-[11px] font-mono font-bold tracking-[0.25em] text-white">SCHNAPPFREUDE BUSINESS</span>
          </div>
          <div className="hidden md:block w-px h-6 bg-white/10" />
          <div className="hidden md:flex items-center gap-2 text-[10px] font-mono text-white/40 uppercase tracking-widest">
            <Activity size={12} className="text-schnapp-green" />
            <span>All Systems Operational</span>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-8 md:gap-10">
          {[
            { label: 'Impressum', href: '#' },
            { label: 'Datenschutz', href: '#' },
            { label: 'AGB', href: '#' },
            { label: 'Sicherheit', href: '#' },
            { label: 'Support', href: '#' }
          ].map((link) => (
            <a 
              key={link.label}
              href={link.href}
              className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 hover:text-schnapp-green transition-all hover:translate-y-[-1px]"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="text-right">
          <div className="text-[10px] font-mono text-white/20 uppercase tracking-[0.3em]">
            © 2026 SchnappFreude Systems GmbH • <span className="text-schnapp-green/40">v2.4.0-stable</span>
          </div>
        </div>
      </div>
    </div>
  );
}
