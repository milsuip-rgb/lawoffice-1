import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { Phone, ArrowRight, User, Scale } from 'lucide-react';
import { useState } from 'react';
import { useFirestore } from '../hooks/useFirestore';

export default function Lawyers() {
  const { data: lawyersList } = useFirestore('lawyers');
  const [selectedLawyer, setSelectedLawyer] = useState<number | null>(null);

  const currentLawyer = lawyersList.find(l => l.id === selectedLawyer);

  return (
    <div className="pt-10 pb-20 px-5 max-w-5xl mx-auto relative z-10">
      {/* 3. 변호사 소개 페이지 */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight mb-4 break-keep">
          사건은 많아도,<br />
          <span className="text-red-500">대응은 직접 합니다</span>
        </h1>
        <p className="text-slate-300 text-lg sm:text-xl font-medium break-keep">
          대표 변호사가 직접 사건을 맡아<br className="sm:hidden" />
          처음부터 끝까지 책임지고 대응합니다
        </p>
      </motion.div>

      {/* 변호사 카드 그리드 */}
      <div className="grid md:grid-cols-3 gap-8 mb-20">
        {lawyersList.map((lawyer, i) => (
          <motion.div 
            key={lawyer.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group cursor-pointer"
            onClick={() => setSelectedLawyer(lawyer.id)}
          >
            <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-[#141b29] aspect-[4/5] mb-6">
              <img 
                src={lawyer.image} 
                alt={lawyer.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d131f] via-[#0d131f]/50 to-transparent"></div>

              <div className="absolute bottom-6 left-6 right-6 z-10">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <div className="inline-flex items-center justify-center bg-red-600/90 backdrop-blur-sm text-white text-xs font-bold px-3 h-7 rounded-full border border-red-500/50 shadow-sm">
                    {lawyer.field}
                  </div>
                  {lawyer.cert && (
                    <div className="inline-flex items-center justify-center bg-black/40 backdrop-blur-md text-slate-200 text-xs font-bold px-3 h-7 rounded-full border border-white/10 shadow-sm">
                      {lawyer.cert}
                    </div>
                  )}
                </div>
                <h3 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2 drop-shadow-lg">
                  {lawyer.name}
                  <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </h3>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center"
      >
        <Link to="/consultation" className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-10 py-5 rounded-xl font-bold text-xl transition-all active:scale-95 shadow-[0_0_40px_-10px_rgba(220,38,38,0.5)]">
          <Phone className="w-6 h-6 animate-pulse" />
          <span>상담하기</span>
        </Link>
      </motion.div>

      {/* 변호사 프로필 팝업 */}
      <AnimatePresence>
        {selectedLawyer && currentLawyer && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-5 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedLawyer(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#141b29] border border-white/10 rounded-3xl p-8 max-w-lg w-full relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors"
                onClick={() => setSelectedLawyer(null)}
              >
                <span className="sr-only">닫기</span>
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="flex flex-col sm:flex-row gap-8">
                <div className="w-32 h-32 rounded-full overflow-hidden shrink-0 border-2 border-white/10 mx-auto sm:mx-0">
                  <img 
                    src={currentLawyer.image} 
                    alt={currentLawyer.name} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="text-center sm:text-left">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-3">
                    <div className="inline-flex items-center justify-center bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-bold px-3 h-7 rounded-full">
                      {currentLawyer.field}
                    </div>
                    {currentLawyer.cert && (
                      <div className="inline-flex items-center justify-center bg-black/50 text-white/90 border border-white/20 text-xs font-bold px-3 h-7 rounded-full">
                        {currentLawyer.cert}
                      </div>
                    )}
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {currentLawyer.name}
                  </h2>
                  <p className="text-slate-400 font-medium mb-6">
                    {currentLawyer.role}
                  </p>
                  
                  <div className="space-y-2 text-sm text-slate-300 text-left">
                    {currentLawyer.careers?.map((career: string, idx: number) => (
                      <p key={idx} className="flex items-start gap-2">
                        <span className="text-red-500 mt-0.5">•</span>
                        {career}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-white/10 flex justify-center">
                <Link 
                  to="/consultation" 
                  className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-bold transition-colors w-full sm:w-auto"
                  onClick={() => setSelectedLawyer(null)}
                >
                  <User className="w-5 h-5" />
                  <span>이 변호사에게 상담 신청하기</span>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
