import { Link, Outlet, useLocation } from 'react-router-dom';
import { Phone, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Popup from './Popup';

export default function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const navLinks = [
    { name: '홈', path: '/' },
    { name: '성공사례', path: '/cases' },
    { name: '변호사소개', path: '/lawyers' },
    { name: '대응프로세스', path: '/process' },
    { name: '상담안내', path: '/consultation' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0f18] text-white font-sans selection:bg-red-500/30 relative overflow-hidden flex flex-col">
      {/* Header / Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0f18]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-5xl mx-auto px-5 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img 
              src="https://www.beobjin.com/images/common/logo_on.png" 
              alt="법률사무소 법진" 
              className="h-8 object-contain"
              referrerPolicy="no-referrer"
            />
          </Link>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path} className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                {link.name}
              </Link>
            ))}
            <a href="tel:031-214-5566" className="flex items-center gap-1.5 text-sm font-semibold bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full transition-colors ml-4">
              <Phone className="w-3.5 h-3.5" />
              <span>031-214-5566</span>
            </a>
          </nav>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-slate-300 hover:text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t border-white/5 bg-[#0a0f18]"
            >
              <nav className="flex flex-col py-4 px-5 gap-4">
                {navLinks.map((link) => (
                  <Link 
                    key={link.path} 
                    to={link.path} 
                    className="text-base font-medium text-slate-300 hover:text-white transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
                <a href="tel:031-214-5566" className="flex items-center justify-center gap-2 text-base font-bold bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-xl transition-colors mt-2">
                  <Phone className="w-4 h-4" />
                  <span>031-214-5566 긴급상담</span>
                </a>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-16">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-[#05080c] py-12 px-5 border-t border-white/5 mt-auto relative z-10">
        <div className="max-w-5xl mx-auto text-center sm:text-left grid sm:grid-cols-2 gap-8">
          <div>
            <div className="mb-6 flex justify-center sm:justify-start">
              <img 
                src="https://www.beobjin.com/images/common/foot_logo.png" 
                alt="법률사무소 법진" 
                className="h-8 object-contain opacity-80"
                referrerPolicy="no-referrer"
              />
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">
              <strong>법률사무소 법진</strong><br />
              대표변호사: 정해원, 윤선영, 곽은정 | 사업자등록번호: 587-12-02153<br />
              주소: 경기도 수원시 영통구 광교중앙로 248번길 7-3, 503호(하동, 우연법전프라자)<br />
              TEL: 031-214-5566 | FAX: 031-213-6655 | E-mail: lawofficebj@naver.com
            </p>
          </div>
          <div className="sm:text-right flex flex-col justify-center">
            <p className="text-slate-400 text-sm mb-2">상담 문의</p>
            <p className="text-2xl font-bold text-white mb-4">031-214-5566</p>
            <p className="text-slate-600 text-xs">
              Copyright (c) {new Date().getFullYear()} BEOBJIN LAW Office., All rights reserved
              <Link to="/admin" className="ml-2 opacity-20 hover:opacity-100 transition-opacity">Admin</Link>
            </p>
          </div>
        </div>
      </footer>
      
      {/* Background Effects */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-red-900/10 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/3 pointer-events-none z-0"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-900/5 rounded-full blur-[100px] -translate-x-1/3 translate-y-1/3 pointer-events-none z-0"></div>
      
      {/* Global Popup */}
      <Popup />
    </div>
  );
}
