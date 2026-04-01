import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Phone, Search, PenTool, Shield, CheckCircle } from 'lucide-react';

export default function Process() {
  const steps = [
    {
      icon: <Search className="w-8 h-8 text-red-500" />,
      title: "1. 상황 분석",
      desc: "의뢰인의 현재 상황을 정확히 파악하고, 수사기관의 동향을 예측합니다.",
      details: ["사건 경위 파악", "증거 자료 수집 및 검토", "수사 단계 확인"]
    },
    {
      icon: <PenTool className="w-8 h-8 text-orange-500" />,
      title: "2. 전략 설계",
      desc: "무혐의, 불기소, 무죄, 감형 등 목표에 맞는 최적의 대응 전략을 수립합니다.",
      details: ["목표 설정 (무혐의/감형 등)", "진술 방향 설계", "유리한 증거 확보 계획"]
    },
    {
      icon: <Shield className="w-8 h-8 text-blue-500" />,
      title: "3. 수사 대응",
      desc: "경찰/검찰 조사에 변호사가 직접 동행하여 불리한 진술을 방어합니다.",
      details: ["조사 전 시뮬레이션", "수사기관 동행 출석", "변호인 의견서 제출"]
    },
    {
      icon: <CheckCircle className="w-8 h-8 text-green-500" />,
      title: "4. 결과 도출",
      desc: "수사기관 및 법원과 적극적으로 소통하며 의뢰인에게 가장 유리한 결과를 이끌어냅니다.",
      details: ["검찰 처분 대응", "재판 변론 (기소 시)", "최종 판결 및 사후 관리"]
    }
  ];

  return (
    <div className="pt-10 pb-20 px-5 max-w-5xl mx-auto relative z-10">
      {/* 4. 사건 대응 프로세스 */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight mb-4 break-keep">
          보이스피싱 사건 대응 절차
        </h1>
        <p className="text-slate-300 text-lg sm:text-xl font-medium break-keep">
          <span className="text-red-500 font-bold">초기 대응이 결과를 결정합니다</span>
        </p>
      </motion.div>

      {/* 프로세스 스텝 */}
      <div className="relative mb-20">
        {/* 연결 선 (데스크탑) */}
        <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-red-500/20 via-orange-500/20 to-blue-500/20 -translate-y-1/2 z-0"></div>
        
        <div className="grid md:grid-cols-4 gap-8 relative z-10">
          {steps.map((step, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-[#141b29] border border-white/10 rounded-2xl p-6 sm:p-8 relative overflow-hidden group hover:border-red-500/30 transition-all"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="w-16 h-16 rounded-full bg-[#0a0f18] border border-white/5 flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                {step.icon}
              </div>
              
              <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6 break-keep">
                {step.desc}
              </p>
              
              <ul className="space-y-2">
                {step.details.map((detail, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                    <span className="text-red-500 mt-0.5">•</span>
                    <span className="break-keep">{detail}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
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
          <span>지금 상담하기</span>
        </Link>
      </motion.div>
    </div>
  );
}
