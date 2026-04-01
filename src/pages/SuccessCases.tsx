import { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown, Phone, Calendar, MessageSquare } from 'lucide-react';
import { useFirestore } from '../hooks/useFirestore';
import { successCases as initialCases } from '../data';

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

export default function SuccessCases() {
  const { data: cases, loading } = useFirestore('cases', initialCases);

  if (loading && cases.length === 0) {
    return (
      <div className="pt-32 pb-20 px-5 text-center min-h-screen flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-400">데이터를 불러오는 중입니다...</p>
      </div>
    );
  }

  const fullCases = cases.slice(4);
  const halfLength = Math.ceil(fullCases.length / 2);
  const firstHalf = fullCases.slice(0, halfLength);
  const secondHalf = fullCases.slice(halfLength);

  return (
    <div className="pt-10 pb-20 px-5 max-w-4xl mx-auto relative z-10">
      
      {/* 1️⃣ 상단 히어로 (차별화 시작) */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight mb-6 break-keep text-white">
          보이스피싱 사건,<br />
          <span className="text-red-500">결과는 이렇게 만들어집니다</span>
        </h1>
        <p className="text-slate-300 text-lg sm:text-xl font-medium break-keep">
          실제 사건을 기반으로 상세 내용과 결정문까지 확인하실 수 있습니다
        </p>
      </motion.div>

      {/* 2️⃣ 대표 성공사례 (완전 개편 핵심) */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-16"
      >
        <h2 className="text-2xl font-bold text-white mb-6 text-center">대표 성공사례</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {cases.slice(0, 4).map((item) => (
            <Link key={item.id} to={`/cases/${item.id}`} className="block group">
              <div className="bg-[#141b29] border border-white/5 rounded-2xl p-6 sm:p-8 hover:border-red-500/30 hover:bg-[#1a2235] transition-all h-full flex flex-col">
                <span className={`inline-block border text-sm font-bold px-3 py-1 rounded-full mb-4 w-fit ${getBadgeColor(item.badge)}`}>
                  [{item.badge}]
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white leading-snug break-keep mb-6 group-hover:text-red-400 transition-colors">
                  {item.title}
                </h3>
                <div className="mt-auto flex items-center gap-2 text-slate-400 group-hover:text-red-400 transition-colors font-bold">
                  <span>→ 자세히 보기</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* 3️⃣ 신뢰 강화 문구 & 4️⃣ 스크롤 유도 구간 */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-20"
      >
        <p className="text-lg sm:text-xl font-medium text-slate-300 mb-8 break-keep">
          모든 사례는 실제 사건을 기반으로 하며 클릭 시 상세 내용 및 결정문을 확인하실 수 있습니다
        </p>
        <div className="flex flex-col items-center justify-center text-red-500 animate-bounce">
          <span className="text-sm font-bold mb-1">▼ 전체 성공사례 확인</span>
          <ChevronDown className="w-6 h-6" />
        </div>
      </motion.div>

      {/* 5️⃣ 전체 성공사례 리스트 (Part 1) */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-12"
      >
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-6 text-center">전체 성공사례</h2>
        <div className="grid gap-3 sm:gap-4">
          {firstHalf.map((item) => (
            <Link key={item.id} to={`/cases/${item.id}`} className="block group">
              <div className="bg-[#141b29] border border-white/5 rounded-xl p-5 sm:p-6 hover:border-red-500/30 hover:bg-[#1a2235] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                  <span className={`inline-block border text-xs sm:text-sm font-bold px-2 py-1 rounded shrink-0 ${getBadgeColor(item.badge)}`}>
                    [{item.badge}]
                  </span>
                  <h4 className="text-base sm:text-lg font-bold text-slate-200 group-hover:text-white transition-colors break-keep">
                    {item.title}
                  </h4>
                </div>
                <div className="flex items-center gap-1 text-slate-500 group-hover:text-red-400 transition-colors shrink-0 text-sm font-bold mt-2 sm:mt-0 self-end sm:self-auto">
                  <span>자세히 보기</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* 6️⃣ 중간 CTA (스크롤 중간 차단) */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-gradient-to-r from-red-900/40 to-[#141b29] border border-red-500/20 rounded-2xl p-8 sm:p-10 text-center mb-12 backdrop-blur-sm max-w-3xl mx-auto"
      >
        <h3 className="text-2xl sm:text-3xl font-bold text-white mb-8 break-keep">
          비슷한 상황이라면,<br className="sm:hidden" />
          지금 대응이 필요합니다
        </h3>
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <Link to="/consultation" className="flex-1 inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-bold text-lg transition-all active:scale-95 shadow-lg">
            <Phone className="w-5 h-5" />
            <span>전화 상담하기</span>
          </Link>
          <Link to="/consultation" className="flex-1 inline-flex items-center justify-center gap-2 bg-[#03C75A] hover:bg-[#02b351] text-white py-4 rounded-xl font-bold text-lg transition-all active:scale-95 shadow-lg">
            <Calendar className="w-5 h-5" />
            <span>네이버 예약하기</span>
          </Link>
          <Link to="/consultation" className="flex-1 inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white py-4 rounded-xl font-bold text-lg transition-all active:scale-95">
            <MessageSquare className="w-5 h-5" />
            <span>빠른 상담 신청</span>
          </Link>
        </div>
      </motion.div>

      {/* 5️⃣ 전체 성공사례 리스트 (Part 2) */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-20"
      >
        <div className="grid gap-3 sm:gap-4">
          {secondHalf.map((item) => (
            <Link key={item.id} to={`/cases/${item.id}`} className="block group">
              <div className="bg-[#141b29] border border-white/5 rounded-xl p-5 sm:p-6 hover:border-red-500/30 hover:bg-[#1a2235] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                  <span className={`inline-block border text-xs sm:text-sm font-bold px-2 py-1 rounded shrink-0 ${getBadgeColor(item.badge)}`}>
                    [{item.badge}]
                  </span>
                  <h4 className="text-base sm:text-lg font-bold text-slate-200 group-hover:text-white transition-colors break-keep">
                    {item.title}
                  </h4>
                </div>
                <div className="flex items-center gap-1 text-slate-500 group-hover:text-red-400 transition-colors shrink-0 text-sm font-bold mt-2 sm:mt-0 self-end sm:self-auto">
                  <span>자세히 보기</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* 7️⃣ 하단 신뢰 마무리 문구 & 8️⃣ 최종 CTA */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mt-20"
      >
        <p className="text-xl sm:text-2xl font-bold text-slate-300 mb-4 break-keep">
          보이스피싱 사건은<br className="sm:hidden" />
          대응에 따라 결과가 달라집니다
        </p>
        <h3 className="text-2xl sm:text-4xl font-extrabold text-white mb-8 break-keep">
          지금 대응하지 않으면 늦습니다
        </h3>
        <Link to="/consultation" className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-10 py-5 rounded-xl font-bold text-xl transition-all active:scale-95 shadow-[0_0_40px_-10px_rgba(220,38,38,0.5)]">
          <Phone className="w-6 h-6 animate-pulse" />
          <span>지금 상담하기</span>
        </Link>
      </motion.div>
    </div>
  );
}
