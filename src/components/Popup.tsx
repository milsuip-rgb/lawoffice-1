import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useFirestore } from '../hooks/useFirestore';

export default function Popup() {
  const [isOpen, setIsOpen] = useState(false);
  const [activePopup, setActivePopup] = useState<any>(null);
  const { data: popups, loading } = useFirestore('popups');

  useEffect(() => {
    if (loading || popups.length === 0) return;
    
    const now = new Date();
    
    const active = popups.find((p: any) => {
      if (!p.isActive) return false;
      
      // Check activation period if set
      if (p.startDate) {
        const start = new Date(p.startDate);
        if (now < start) return false;
      }
      if (p.endDate) {
        const end = new Date(p.endDate);
        // Set end time to end of the day
        end.setHours(23, 59, 59, 999);
        if (now > end) return false;
      }
      
      return true;
    });
    
    if (active) {
      setActivePopup(active);
      
      // Check if user has seen this specific popup today
      const hasSeenPopup = localStorage.getItem(`hidePopup_${active.id}`);
      const today = new Date().toDateString();
      
      if (hasSeenPopup !== today) {
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [popups, loading]);

  const closePopup = () => {
    setIsOpen(false);
  };

  const closeForToday = () => {
    if (activePopup) {
      const today = new Date().toDateString();
      localStorage.setItem(`hidePopup_${activePopup.id}`, today);
      setIsOpen(false);
    }
  };

  if (!activePopup) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-5 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-[#0a0f18] border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
          >
            {/* Close Button */}
            <button 
              onClick={closePopup}
              className="absolute top-4 right-4 z-10 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Image */}
            <div className="aspect-video relative">
              <img 
                src={activePopup.imageUrl} 
                alt={activePopup.title} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f18] via-transparent to-transparent"></div>
            </div>

            {/* Content */}
            <div className="p-8 pt-0">
              <h2 className="text-2xl font-bold text-white mb-3">{activePopup.title}</h2>
              <p className="text-slate-300 leading-relaxed mb-8 break-keep">
                {activePopup.content}
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link 
                  to={activePopup.link} 
                  onClick={closePopup}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-red-600/20"
                >
                  <span>자세히 보기</span>
                  <ChevronRight className="w-5 h-5" />
                </Link>
                <a 
                  href="tel:031-214-5566"
                  className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-colors border border-white/10"
                >
                  <span>전화 바로 연결</span>
                </a>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-black/40 border-t border-white/5 flex justify-between items-center px-8">
              <button 
                onClick={closeForToday}
                className="text-slate-500 hover:text-slate-300 text-sm transition-colors"
              >
                오늘 하루 보지 않기
              </button>
              <button 
                onClick={closePopup}
                className="text-white font-medium text-sm hover:underline"
              >
                닫기
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
