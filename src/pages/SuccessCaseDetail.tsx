import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Phone, MessageSquare, Calendar } from 'lucide-react';
import { successCases } from '../data';
import { useEffect } from 'react';

const getBadgeColor = (badge: string) => {
  switch(badge) {
    case '혐의없음': return 'bg-green-500/10 text-green-500 border-green-500/20';
    case '불기소': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    case '무죄': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
    case '감형':
    case '집행유예':
    case '벌금': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
    default: return 'bg-red-500/10 text-red-500 border-red-500/20';
  }
};

export default function SuccessCaseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const caseId = parseInt(id || '1', 10);
  
  const currentCase = successCases.find(c => c.id === caseId);
  const currentIndex = successCases.findIndex(c => c.id === caseId);
  
  const prevCase = currentIndex > 0 ? successCases[currentIndex - 1] : null;
  const nextCase = currentIndex < successCases.length - 1 ? successCases[currentIndex + 1] : null;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!currentCase) {
    return (
      <div className="pt-32 pb-20 px-5 text-center min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold text-white mb-4">사례를 찾을 수 없습니다</h1>
        <button onClick={() => navigate('/cases')} className="text-red-500 hover:text-red-400 font-bold flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" /> 목록으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#0a0f18] min-h-screen pb-32">
      {/* 상단 고정 CTA (모바일 필수) */}
      <div className="fixed top-[60px] left-0 right-0 z-40 bg-[#141b29]/90 backdrop-blur-md border-b border-white/10 p-3 flex justify-between gap-2 sm:hidden">
        <Link to="/consultation" className="flex-1 bg-red-600 text-white text-center py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-1">
          <Phone className="w-4 h-4" /> 전화
        </Link>
        <Link to="/consultation" className="flex-1 bg-[#03C75A] text-white text-center py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-1">
          <Calendar className="w-4 h-4" /> 예약
        </Link>
        <Link to="/consultation" className="flex-1 bg-white/10 text-white text-center py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-1">
          <MessageSquare className="w-4 h-4" /> 상담
        </Link>
      </div>

      <div className="pt-24 sm:pt-10 pb-10 px-5 max-w-3xl mx-auto relative z-10">
        <Link to="/cases" className="inline-flex items-center gap-2 text-slate-400 hover:text-white font-medium mb-8 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span>목록으로</span>
        </Link>

        {/* 1️⃣ 상단 히어로 (결과로 압도) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center sm:text-left"
        >
          <span className={`inline-block border text-sm font-bold px-3 py-1 rounded-full mb-4 ${getBadgeColor(currentCase.badge)}`}>
            [{currentCase.badge}]
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight break-keep mb-4">
            {currentCase.title}
          </h1>
          <p className="text-slate-400 text-sm font-medium">
            보이스피싱 사건 성공 사례
          </p>
        </motion.div>

        <div className="space-y-6 mb-12">
          {/* 2️⃣ 사건 상황 (내 이야기처럼 느끼게) */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#141b29] border border-white/5 rounded-2xl p-6"
          >
            <h2 className="text-lg font-bold text-slate-400 mb-3">의뢰인 상황</h2>
            <p className="text-white leading-relaxed break-keep text-lg">
              {currentCase.situation}
            </p>
          </motion.section>

          {/* 3️⃣ 당시 위험 상황 (불안 자극) */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-red-950/20 border border-red-500/20 rounded-2xl p-6"
          >
            <h2 className="text-lg font-bold text-red-400 mb-3">당시 상황</h2>
            <p className="text-white leading-relaxed break-keep text-lg">
              {currentCase.dangerSituation || "수사기관은 전달 행위를 근거로 공모관계를 인정할 가능성이 높은 상황이었고, 기소로 이어질 위험이 매우 컸습니다."}
            </p>
          </motion.section>

          {/* 4️⃣ 핵심 쟁점 (전문성) */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-[#141b29] border border-white/5 rounded-2xl p-6"
          >
            <h2 className="text-lg font-bold text-slate-400 mb-3">핵심 쟁점</h2>
            <ul className="space-y-2">
              {currentCase.issues.map((issue, idx) => (
                <li key={idx} className="flex items-start gap-2 text-white text-lg">
                  <span className="text-slate-500">-</span>
                  <span className="break-keep">{issue}</span>
                </li>
              ))}
            </ul>
          </motion.section>

          {/* 5️⃣ 🔥 변호 전략 (가장 중요) */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-[#141b29] border border-white/5 rounded-2xl p-6 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
            <h2 className="text-lg font-bold text-blue-400 mb-3">대응 전략</h2>
            <ul className="space-y-2">
              {currentCase.strategy.map((strat, idx) => (
                <li key={idx} className="flex items-start gap-2 text-white text-lg">
                  <span className="text-blue-500">-</span>
                  <span className="break-keep">{strat}</span>
                </li>
              ))}
            </ul>
          </motion.section>

          {/* 6️⃣ 결과 (다시 강조) */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-[#141b29] border border-white/5 rounded-2xl p-6"
          >
            <h2 className="text-lg font-bold text-slate-400 mb-3">결과</h2>
            <p className="text-white leading-relaxed break-keep text-lg font-bold">
              {currentCase.result}
            </p>
          </motion.section>

          {/* 7️⃣ 📄 판결문 / 결정문 (핵심 차별화) */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-[#141b29] border border-white/10 rounded-2xl p-6 text-center"
          >
            <h2 className="text-xl font-bold text-white mb-2">결정문 확인</h2>
            <p className="text-slate-400 text-sm mb-6">※ 개인정보는 비식별 처리되었습니다</p>
            
            <div className="grid gap-4 max-w-md mx-auto mb-6">
              {currentCase.documentImages.map((img, idx) => (
                <div key={idx} className="relative w-full aspect-[1/1.4] bg-[#0a0f18] rounded-xl border border-white/10 overflow-hidden flex flex-col items-center justify-center p-4">
                  <img 
                    src={img} 
                    alt={`판결문 이미지 ${idx + 1}`} 
                    className="absolute inset-0 w-full h-full object-cover opacity-30"
                    referrerPolicy="no-referrer"
                  />
                  <div className="relative z-10 bg-black/60 backdrop-blur-sm border border-red-500/30 p-4 rounded-lg w-full">
                    <p className="text-red-400 font-bold text-lg break-keep">
                      "{currentCase.highlightText || '혐의를 인정하기 부족하다'}"
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-3">
            </div>
          </motion.section>
        </div>

        {/* 8️⃣ 🔥 공감 유도 문장 & 9️⃣ CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 pt-8"
        >
          <p className="text-2xl sm:text-3xl font-bold text-white mb-2 break-keep">
            비슷한 상황이라면
          </p>
          <p className="text-2xl sm:text-3xl font-bold text-red-500 mb-8 break-keep">
            결과는 충분히 달라질 수 있습니다
          </p>
          
          <p className="text-lg text-slate-300 mb-6">지금 대응이 필요합니다</p>
          
          <div className="flex flex-col gap-3 max-w-md mx-auto">
            <Link to="/consultation" className="bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-bold text-xl transition-all active:scale-95 shadow-lg">
              [ 전화 상담하기 ]
            </Link>
            <Link to="/consultation" className="bg-[#03C75A] hover:bg-[#02b351] text-white py-4 rounded-xl font-bold text-xl transition-all active:scale-95 shadow-lg">
              [ 네이버 예약하기 ]
            </Link>
            <Link to="/consultation" className="bg-white/10 hover:bg-white/20 text-white py-4 rounded-xl font-bold text-xl transition-all active:scale-95">
              [ 빠른 상담 신청 ]
            </Link>
          </div>
        </motion.div>

        {/* 🔟 이전 / 다음 사례 */}
        <div className="flex items-center justify-between pt-8 border-t border-white/10">
          {prevCase ? (
            <Link to={`/cases/${prevCase.id}`} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group max-w-[45%]">
              <ArrowLeft className="w-5 h-5 shrink-0 group-hover:-translate-x-1 transition-transform" />
              <div className="truncate">
                <span className="block text-xs mb-1">← 이전 사례</span>
                <span className="font-bold truncate text-sm">{prevCase.title}</span>
              </div>
            </Link>
          ) : (
            <div></div>
          )}
          
          {nextCase ? (
            <Link to={`/cases/${nextCase.id}`} className="flex items-center justify-end gap-2 text-slate-400 hover:text-white transition-colors group max-w-[45%] text-right">
              <div className="truncate">
                <span className="block text-xs mb-1">다음 사례 →</span>
                <span className="font-bold truncate text-sm">{nextCase.title}</span>
              </div>
              <ArrowRight className="w-5 h-5 shrink-0 group-hover:translate-x-1 transition-transform" />
            </Link>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </div>
  );
}
