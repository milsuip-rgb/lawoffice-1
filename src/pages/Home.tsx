import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Phone, CheckCircle2, AlertTriangle, Clock, ArrowRight, AlertOctagon, CheckCircle, Quote, User, MessageSquare, Shield, Target, Scale } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useFirestore } from '../hooks/useFirestore';
import { lawyers as initialLawyers, successCases as initialCases } from '../data';

export default function Home() {
  const { data: lawyersList } = useFirestore('lawyers', initialLawyers);
  const { data: casesList } = useFirestore('cases', initialCases);
  const { data: reviewsList } = useFirestore('reviews');
  const [currentLawyerIdx, setCurrentLawyerIdx] = useState(0);
  const [currentReviewIdx, setCurrentReviewIdx] = useState(0);

  useEffect(() => {
    if (lawyersList.length === 0) return;
    const timer = setInterval(() => {
      setCurrentLawyerIdx((prev) => (prev + 1) % lawyersList.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [lawyersList]);

  useEffect(() => {
    if (reviewsList.length === 0) return;
    const timer = setInterval(() => {
      setCurrentReviewIdx((prev) => (prev + 1) % reviewsList.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [reviewsList]);

  return (
    <>
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-5 max-w-5xl mx-auto min-h-[calc(100vh-64px)] flex flex-col justify-center relative z-10">
        <div className="max-w-2xl">
          {/* 1. 상단 (신뢰 + 전문성 한 줄) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap items-center gap-2 mb-5"
          >
            <span className="bg-red-500/10 text-red-500 border border-red-500/20 px-3 py-1 rounded-full text-xs font-bold tracking-wider">
              보이스피싱 사건 전문 변호사
            </span>
            <span className="bg-orange-500/10 text-orange-400 border border-orange-500/20 px-3 py-1 rounded-full text-xs font-bold tracking-wider flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              24시 대응가능
            </span>
          </motion.div>

          {/* 2. 메인 타이틀 */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-[2.5rem] sm:text-5xl md:text-6xl font-extrabold leading-[1.2] tracking-tight mb-6 break-keep"
          >
            보이스피싱 사건,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400">
              지금 대응하지 않으면<br />'공범'으로 굳어집니다
            </span>
          </motion.h1>

          {/* 3. 서브 카피 */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg sm:text-xl text-slate-300 mb-10 leading-relaxed break-keep font-medium"
          >
            <span className="text-white font-bold text-xl sm:text-2xl block mb-2">혐의없음 · 불기소 · 무죄 · 감형</span>
            압도적인 성공사례가 모든 것을 증명합니다. <br className="hidden sm:block" />
            초기 대응만이 결과를 바꿀 수 있습니다.
          </motion.p>

          {/* 4. 핵심 신뢰 포인트 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-4 mb-12 bg-white/[0.03] border border-white/10 p-5 sm:p-6 rounded-2xl backdrop-blur-sm"
          >
            {[
              "보이스피싱 사건 집중 수행",
              "다수의 혐의없음·무죄 사례 확보",
              "초기 대응으로 결과가 달라집니다"
            ].map((point, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-red-500 shrink-0" />
                <span className="text-slate-200 font-semibold text-base sm:text-lg leading-snug break-keep">{point}</span>
              </div>
            ))}
          </motion.div>

          {/* 5. 긴급성 CTA */}
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col items-center gap-4 w-full mt-8"
        >
          <Link to="/consultation" className="w-full sm:w-auto group relative inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-8 py-5 rounded-xl font-bold text-xl transition-all active:scale-95 shadow-[0_0_40px_-10px_rgba(220,38,38,0.5)] hover:shadow-[0_0_60px_-15px_rgba(220,38,38,0.7)]">
            <Phone className="w-6 h-6 animate-pulse" />
            <span>상담 접수하기</span>
            <div className="absolute inset-0 rounded-xl ring-2 ring-white/20 group-hover:ring-white/40 transition-all"></div>
          </Link>
          <div className="flex items-center justify-center w-full sm:w-auto gap-1.5 text-red-400 text-sm font-bold bg-red-500/10 px-4 py-2 rounded-lg whitespace-nowrap">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>※ 모든 상담은 철저히 비밀 보장됩니다</span>
          </div>
        </motion.div>
      </section>

      {/* Success Stories Section */}
      <section className="py-20 px-5 bg-[#0d131f] relative z-10 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          {/* Section Title */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-4xl font-extrabold leading-tight mb-4 break-keep">
              말로 설명하지 않겠습니다.<br />
              결과로 이미 증명했습니다.
            </h2>
            <p className="text-xl sm:text-2xl text-red-500 font-bold tracking-tight">
              압도적인 성공사례 직접 확인하십시오.
            </p>
          </motion.div>

          {/* Cases Grid */}
          <div className="grid gap-6 md:grid-cols-3 mb-8">
            {casesList.slice(0, 3).map((item, i) => (
              <Link 
                key={i}
                to={`/cases/${item.id}`}
                className="block"
              >
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="bg-[#141b29] border border-white/5 rounded-2xl p-6 relative overflow-hidden group hover:border-red-500/30 transition-colors h-full"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-red-500 to-orange-500"></div>
                  
                  <div className="mb-5">
                    <span 
                      className="inline-block bg-red-500/10 text-red-500 border border-red-500/20 text-sm font-bold px-3 py-1 rounded-md mb-3"
                    >
                      [{item.badge}]
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold text-white leading-snug break-keep group-hover:text-red-400 transition-colors">
                      {item.title}
                    </h3>
                  </div>

                  {/* Document Image Placeholder */}
                  <div className="relative w-full h-32 mb-5 rounded-lg overflow-hidden border border-white/10 group-hover:border-white/20 transition-colors bg-black/50">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#141b29] via-transparent to-transparent z-10"></div>
                    <div className="absolute inset-0 flex items-center justify-center z-20">
                      <span className="bg-black/60 text-white/80 text-xs px-2.5 py-1 rounded backdrop-blur-sm border border-white/10 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-red-400" />
                        실제 판결문 일부
                      </span>
                    </div>
                    <img 
                      src={item.documentImages?.[0] || item.image} 
                      alt={`${item.badge} 판결문`} 
                      className="w-full h-full object-cover opacity-40 mix-blend-luminosity"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  
                  <div className="space-y-3 bg-black/20 rounded-xl p-4 border border-white/5">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-3">
                      <span className="text-slate-400 text-sm font-bold shrink-0 sm:w-16">의뢰인 상황</span>
                      <span className="text-slate-200 text-sm sm:text-base font-medium break-keep">{item.situation}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-3">
                      <span className="text-slate-400 text-sm font-bold shrink-0 sm:w-16">핵심 쟁점</span>
                      <span className="text-slate-200 text-sm sm:text-base font-medium break-keep">{item.issue}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-3 pt-3 border-t border-white/5 mt-3">
                      <span className="text-red-400 text-sm font-bold shrink-0 sm:w-16">결과</span>
                      <span className="text-white text-sm sm:text-base font-bold break-keep">{item.result}</span>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>

          {/* 추가 문구 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            className="text-center mb-12"
          >
            <p className="inline-flex items-center justify-center gap-1.5 text-slate-300 text-base sm:text-lg font-bold bg-white/5 px-5 py-3 rounded-xl border border-white/10">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              ※ 사건 상황에 따라 무혐의부터 감형까지 최적의 결과를 도출합니다
            </p>
          </motion.div>

          {/* CTA */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            className="text-center"
          >
            <Link to="/cases" className="group inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all active:scale-95">
              <span>더 많은 성공사례 확인하기</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 3. 현실 경고 섹션 (불안 자극) */}
      <section className="py-20 px-5 bg-[#0a0f18] relative z-10">
        <div className="max-w-3xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 mb-6">
              <AlertOctagon className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold leading-tight mb-4 break-keep">
              지금 상황,<br />
              <span className="text-red-500">이미 위험 단계</span>일 수 있습니다
            </h2>
          </motion.div>

          <div className="space-y-4">
            {[
              { step: "1", title: "단순 가담으로 시작", desc: "대부분 \"몰랐다\"고 주장" },
              { step: "2", title: "수사기관은 공범으로 판단", desc: "계좌 제공·현금 전달만으로도 공모 인정" },
              { step: "3", title: "그대로 진행되면 기소", desc: "이후 뒤집기 매우 어려움" }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.15 }}
                className="flex items-center gap-4 sm:gap-6 bg-[#141b29] p-5 sm:p-6 rounded-2xl border border-white/5"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 bg-red-500 rounded-full flex items-center justify-center text-white font-black text-xl sm:text-2xl shadow-[0_0_20px_rgba(239,68,68,0.4)]">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-1">{item.title}</h3>
                  <p className="text-red-400 font-bold text-sm sm:text-base flex items-center gap-1.5">
                    <ArrowRight className="w-4 h-4" /> {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. 결과가 갈리는 이유 & 5. 해결 방식 (변호사 신뢰 통합) */}
      <section className="py-20 px-5 bg-[#0d131f] relative z-10 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* 변호사 사진 (불안 제거 장치) */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="relative rounded-3xl overflow-hidden border border-white/10 bg-[#141b29] aspect-[4/5] sm:aspect-square md:aspect-[4/5] group"
            >
              <AnimatePresence mode="wait">
                {lawyersList.length > 0 && (
                  <motion.div
                    key={currentLawyerIdx}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0"
                  >
                    <img 
                      src={lawyersList[currentLawyerIdx].image} 
                      alt={lawyersList[currentLawyerIdx].name} 
                      className="w-full h-full object-cover transition-opacity duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d131f] via-[#0d131f]/50 to-transparent"></div>

                    <div className="absolute bottom-8 left-8 right-8 z-10">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <div className="inline-flex items-center justify-center bg-red-600/90 backdrop-blur-sm text-white text-xs font-bold px-3 h-7 rounded-full border border-red-500/50 shadow-sm">
                          {lawyersList[currentLawyerIdx].field}
                        </div>
                        {lawyersList[currentLawyerIdx].cert && (
                          <div className="inline-flex items-center justify-center bg-black/40 backdrop-blur-md text-slate-200 text-xs font-bold px-3 h-7 rounded-full border border-white/10 shadow-sm">
                            {lawyersList[currentLawyerIdx].cert}
                          </div>
                        )}
                      </div>
                      <h3 className="text-3xl font-extrabold text-white tracking-tight drop-shadow-lg">{lawyersList[currentLawyerIdx].name}</h3>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* 왜 이 사람이 해결하는지 (해결 방식) */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl sm:text-4xl font-extrabold leading-tight mb-8 break-keep">
                결과를 바꾸는 핵심은<br />
                <span className="text-red-500">'누가' 초기 수사를 통제하느냐</span>입니다
              </h2>
              
              <div className="space-y-4">
                {[
                  { title: "사건 초기 즉시 개입", desc: "첫 조사부터 동행하여 불리한 진술을 원천 차단합니다." },
                  { title: "공모관계 집중 타격", desc: "수백 건의 성공 데이터를 바탕으로 혐의 성립을 무너뜨립니다." },
                  { title: "결과 중심 전략 설계", desc: "오직 무혐의·불기소·무죄라는 결과만을 목표로 움직입니다." }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 bg-[#141b29] p-5 sm:p-6 rounded-2xl border border-white/5 hover:border-red-500/30 transition-colors">
                    <CheckCircle className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-white font-bold text-lg mb-1.5">{item.title}</h4>
                      <p className="text-slate-400 text-sm sm:text-base break-keep leading-snug">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5.5 전략 섹션 (리뉴얼) */}
      <section className="py-24 px-5 bg-[#141b29] relative z-10 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight mb-6 break-keep text-white">
              사건마다 대응은 달라야 합니다.<br />
              <span className="text-red-500">때로는 '감형'이 최고의 전략입니다.</span>
            </h2>
            <p className="text-lg sm:text-xl text-slate-400 font-medium break-keep">
              감형은 차선책이 아닙니다. 실형을 막기 위한 가장 현실적이고 치밀한 전략입니다.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* 전략 A */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              className="bg-[#0a0f18] border border-white/10 rounded-3xl p-8 sm:p-10 relative overflow-hidden group hover:border-blue-500/30 transition-all"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-400"></div>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center shrink-0">
                  <Shield className="w-7 h-7 text-blue-400" />
                </div>
                <div>
                  <div className="text-blue-400 font-bold text-sm mb-1">억울한 연루 / 증거 부족 시</div>
                  <h3 className="text-2xl font-bold text-white">무혐의 · 무죄 입증</h3>
                </div>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3 text-slate-300 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <span className="break-keep">수사 초기부터 공모관계 전면 부정</span>
                </li>
                <li className="flex items-start gap-3 text-slate-300 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <span className="break-keep">수사기관의 증거 모순점 강력 탄핵</span>
                </li>
              </ul>
              <div className="bg-blue-500/10 text-blue-300 p-4 rounded-xl text-center font-bold break-keep">
                "끝까지 싸워 억울한 혐의를 벗겨냅니다"
              </div>
            </motion.div>

            {/* 전략 B */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: 0.2 }}
              className="bg-[#0a0f18] border border-white/10 rounded-3xl p-8 sm:p-10 relative overflow-hidden group hover:border-red-500/30 transition-all"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-400"></div>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center shrink-0">
                  <Target className="w-7 h-7 text-red-500" />
                </div>
                <div>
                  <div className="text-red-400 font-bold text-sm mb-1">가담 증거가 명백할 시</div>
                  <h3 className="text-2xl font-bold text-white">전략적 감형</h3>
                </div>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3 text-slate-300 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <span className="break-keep">빠른 인정과 수사 협조로 선처 유도</span>
                </li>
                <li className="flex items-start gap-3 text-slate-300 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <span className="break-keep">피해 회복 및 양형 자료 완벽 구비</span>
                </li>
              </ul>
              <div className="bg-red-500/10 text-red-400 p-4 rounded-xl text-center font-bold break-keep">
                "실형을 막는 가장 현실적이고 확실한 전략"
              </div>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: 0.4 }}
            className="mt-12 text-center"
          >
            <p className="inline-block bg-white/5 border border-white/10 px-6 py-4 rounded-full text-slate-200 font-bold text-base sm:text-lg break-keep shadow-lg">
              상황을 냉정하게 분석하여 <span className="text-white">가장 유리한 결과</span>만을 설계합니다.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 6. 고객 후기 */}
      <section className="py-20 px-5 bg-[#0a0f18] relative z-10">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-4xl font-extrabold leading-tight mb-4">
              실제 의뢰인 결과 후기
            </h2>
          </motion.div>

          {/* Desktop Grid */}
          <div className="hidden md:grid md:grid-cols-3 gap-6">
            {reviewsList.map((review, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#141b29] rounded-2xl border border-white/5 relative overflow-hidden flex flex-col group"
              >
                {/* 실제 후기 이미지 영역 (상단) */}
                <div className="relative h-48 w-full bg-[#0a0f18] overflow-hidden">
                  <img 
                    src={review.bg} 
                    alt="실제 후기 캡처" 
                    className="w-full h-full object-cover opacity-50 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500" 
                    referrerPolicy="no-referrer" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141b29] via-transparent to-transparent"></div>
                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-2.5 py-1.5 rounded-md text-xs text-white/90 border border-white/10 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>실제 대화 발췌</span>
                  </div>
                </div>

                {/* 텍스트 영역 (하단) */}
                <div className="p-6 sm:p-8 pt-0 flex-1 flex flex-col relative">
                  <Quote className="w-10 h-10 text-white/5 absolute -top-5 left-6" />
                  <p className="text-lg text-slate-200 font-semibold leading-relaxed whitespace-pre-line mb-6 break-keep relative z-10 mt-6">
                    "{review.text}"
                  </p>
                  <div className="mt-auto flex items-center gap-3 pt-6 border-t border-white/10">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                      <User className="w-4 h-4 text-slate-400" />
                    </div>
                    <span className="text-red-400 font-bold text-sm bg-red-500/10 px-2.5 py-1 rounded">
                      최종결과: {review.result}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Mobile Slider */}
          <div className="md:hidden relative h-[450px]">
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentReviewIdx}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 bg-[#141b29] rounded-2xl border border-white/5 overflow-hidden flex flex-col"
              >
                <div className="relative h-48 w-full bg-[#0a0f18] overflow-hidden">
                  <img 
                    src={reviewsList[currentReviewIdx]?.bg} 
                    alt="실제 후기 캡처" 
                    className="w-full h-full object-cover opacity-50" 
                    referrerPolicy="no-referrer" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141b29] via-transparent to-transparent"></div>
                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-2.5 py-1.5 rounded-md text-xs text-white/90 border border-white/10 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>실제 대화 발췌</span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col relative">
                  <Quote className="w-10 h-10 text-white/5 absolute -top-5 left-6" />
                  <p className="text-lg text-slate-200 font-semibold leading-relaxed whitespace-pre-line mb-6 break-keep relative z-10 mt-6">
                    "{reviewsList[currentReviewIdx]?.text}"
                  </p>
                  <div className="mt-auto flex items-center gap-3 pt-6 border-t border-white/10">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                      <User className="w-4 h-4 text-slate-400" />
                    </div>
                    <span className="text-red-400 font-bold text-sm bg-red-500/10 px-2.5 py-1 rounded">
                      최종결과: {reviewsList[currentReviewIdx]?.result}
                    </span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
            
            {/* Dots for mobile slider */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
              {reviewsList.map((_, i) => (
                <div 
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all ${i === currentReviewIdx ? 'bg-red-500 w-4' : 'bg-white/20'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7. 변호사 신뢰 & 8. 중간 CTA */}
      <section className="py-24 px-5 bg-gradient-to-b from-[#0d131f] to-[#1a0b0b] relative z-10 text-center border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="text-xl sm:text-2xl font-bold text-slate-400 mb-8">
              보이스피싱 사건, 왜 결과가 다른가
            </h2>
            <p className="text-2xl sm:text-4xl font-extrabold text-white leading-tight mb-12 break-keep">
              보이스피싱 사건은<br />
              <span className="text-red-500">초기 대응과 전략</span>에 따라 결과가 갈립니다.<br /><br />
              법률사무소 법진은<br />
              보이스피싱 사건을 집중 수행하며<br /><br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400">
                무혐의 · 불기소 · 무죄
              </span><br />
              결과를 만들어왔습니다.
            </p>

            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 sm:p-10 backdrop-blur-sm mt-16">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-8 break-keep">
                지금 대응이 늦어지면 결과는 바뀌지 않습니다
              </h3>
              <Link to="/consultation" className="w-full sm:w-auto group relative inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-10 py-5 rounded-xl font-bold text-xl transition-all active:scale-95 shadow-[0_0_40px_-10px_rgba(220,38,38,0.5)]">
                <Phone className="w-6 h-6 animate-pulse" />
                <span>상담 접수하기</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 9. FAQ */}
      <section className="py-20 px-5 bg-[#0a0f18] relative z-10">
        <div className="max-w-3xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-4xl font-extrabold leading-tight">
              자주 묻는 질문
            </h2>
          </motion.div>

          <div className="space-y-4">
            {[
              { q: "무조건 무죄만 진행하나요?", a: "아닙니다. 사건 상황에 따라 무혐의, 불기소, 무죄뿐 아니라 감형까지 가장 유리한 전략을 선택합니다." },
              { q: "지금 상황에서도 가능성이 있나요?", a: "상황에 따라 충분히 결과를 바꿀 수 있습니다." },
              { q: "이미 조사받았는데 늦은 건가요?", a: "아직 대응 가능합니다. 다만 빠를수록 유리합니다." },
              { q: "비용이 부담됩니다.", a: "사건 상황에 따라 합리적으로 안내드립니다." }
            ].map((faq, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#141b29] rounded-2xl p-6 border border-white/5"
              >
                <div className="flex gap-4">
                  <div className="text-red-500 font-black text-xl">Q.</div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">{faq.q}</h3>
                    <div className="flex gap-2 items-start">
                      <ArrowRight className="w-4 h-4 text-slate-500 mt-1 shrink-0" />
                      <p className="text-slate-300 font-medium leading-relaxed break-keep">{faq.a}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
