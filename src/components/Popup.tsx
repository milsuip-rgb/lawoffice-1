import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useFirestore, DEFAULT_POPUP } from '../hooks/useFirestore';

// Robust multiline renderer that splits on actual newlines as well as literal escaped '\n'
function renderMultilineText(rawText: string | undefined | null) {
  if (!rawText) return null;
  const normalized = String(rawText)
    .replace(/\\r\\n/g, '\n')
    .replace(/\\n/g, '\n')
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n');

  const lines = normalized.split('\n');
  return lines.map((line, idx) => (
    <span key={idx} className="block min-h-[1.4em]">
      {line === '' ? '\u00A0' : line}
    </span>
  ));
}

export default function Popup() {
  const [isOpen, setIsOpen] = useState(false);
  const [activePopup, setActivePopup] = useState<any>(null);
  const { data: popups, loading } = useFirestore('popups', [DEFAULT_POPUP]);

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
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative w-full max-w-lg bg-[#0a0f18] border border-white/15 rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[82vh] sm:max-h-[85vh] my-auto overflow-hidden"
          >
            {/* Top Close Button (Always floating at top-right with high contrast) */}
            <button 
              type="button"
              onClick={closePopup}
              className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 z-30 p-2 sm:p-2.5 bg-black/70 hover:bg-black/90 active:scale-95 text-white rounded-full transition-all border border-white/20 shadow-xl backdrop-blur-md cursor-pointer"
              aria-label="팝업 닫기"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Scrollable Content Area (min-h-0 is mandatory for flex child scrolling) */}
            <div 
              className="flex-1 min-h-0 overflow-y-auto overscroll-contain touch-pan-y"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              {/* Image (Compact on mobile to prevent pushing text off-screen) */}
              {activePopup.imageUrl ? (
                <div className="w-full h-32 sm:h-48 relative overflow-hidden bg-black/50 shrink-0">
                  <img 
                    src={activePopup.imageUrl} 
                    alt={activePopup.title || '안내'} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f18] via-transparent to-transparent pointer-events-none"></div>
                </div>
              ) : null}

              {/* Title & Body */}
              <div className={`p-4 sm:p-6 ${activePopup.imageUrl ? 'pt-3 sm:pt-4' : 'pt-5 sm:pt-6'}`}>
                <h2 
                  style={{
                    fontSize: activePopup.titleFontSize || '20px',
                    fontWeight: activePopup.titleFontWeight || '700',
                    color: activePopup.titleColor || '#ffffff',
                    textAlign: (activePopup.textAlign as any) || 'left',
                    wordBreak: 'keep-all',
                    overflowWrap: 'break-word',
                  }}
                  className="mb-3 leading-snug"
                >
                  {renderMultilineText(activePopup.title)}
                </h2>
                <div 
                  style={{
                    fontSize: activePopup.contentFontSize || '15px',
                    fontWeight: activePopup.contentFontWeight || '400',
                    color: activePopup.contentColor || '#cbd5e1',
                    textAlign: (activePopup.textAlign as any) || 'left',
                    wordBreak: 'keep-all',
                    overflowWrap: 'break-word',
                  }}
                  className="leading-relaxed text-sm sm:text-base"
                >
                  {renderMultilineText(activePopup.content)}
                </div>
              </div>
            </div>

            {/* Bottom Pinned Controls (Always visible, never clipped or pushed off screen) */}
            <div className="shrink-0 bg-[#0c121e] border-t border-white/10 p-3 sm:p-4 space-y-2.5">
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <Link 
                  to={activePopup.link || '/consultation'} 
                  onClick={closePopup}
                  className="bg-red-600 hover:bg-red-700 active:scale-[0.98] text-white font-bold py-2.5 sm:py-3 px-2 sm:px-4 rounded-xl flex items-center justify-center gap-1 sm:gap-1.5 transition-all text-xs sm:text-sm shadow-lg shadow-red-600/25 min-h-[42px] text-center"
                >
                  <span>자세히 보기</span>
                  <ChevronRight className="w-4 h-4 shrink-0" />
                </Link>
                <a 
                  href="tel:031-214-5566"
                  className="bg-white/5 hover:bg-white/10 active:scale-[0.98] text-white font-bold py-2.5 sm:py-3 px-2 sm:px-4 rounded-xl flex items-center justify-center gap-1 sm:gap-1.5 transition-all border border-white/10 text-xs sm:text-sm min-h-[42px] text-center"
                >
                  <span>전화 바로 연결</span>
                </a>
              </div>

              {/* Footer Links */}
              <div className="flex justify-between items-center px-1 pt-0.5 text-xs text-slate-400">
                <button 
                  type="button"
                  onClick={closeForToday}
                  className="hover:text-slate-200 transition-colors py-1 cursor-pointer"
                >
                  오늘 하루 보지 않기
                </button>
                <button 
                  type="button"
                  onClick={closePopup}
                  className="text-slate-200 hover:text-white font-semibold hover:underline py-1 cursor-pointer flex items-center gap-1"
                >
                  <span>닫기</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
