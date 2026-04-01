import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Phone, Clock, ArrowRight, AlertTriangle, Calendar, MessageSquare } from 'lucide-react';
import { useFirestore } from '../hooks/useFirestore';
import { toast } from 'sonner';
import { sendTelegramMessage } from '../utils/telegram';

export default function Consultation() {
  const { addOrUpdate: saveConsultation } = useFirestore('consultations');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    content: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const now = new Date();
      const consultationData = {
        ...formData,
        id: Date.now(),
        status: 'new',
        date: now.toISOString().split('T')[0],
        time: now.toTimeString().split(' ')[0].substring(0, 5),
        createdAt: now.toISOString()
      };

      await saveConsultation(consultationData);

      // 텔레그램 알림 전송
      const message = `
<b>[새로운 상담 신청 알림]</b>
<b>성함:</b> ${formData.name}
<b>연락처:</b> ${formData.phone}
<b>내용:</b> ${formData.content}
<b>신청시간:</b> ${consultationData.date} ${consultationData.time}
      `;
      await sendTelegramMessage(message);

      toast.success('상담 신청이 접수되었습니다. 곧 연락드리겠습니다.');
      setFormData({ name: '', phone: '', content: '' });
    } catch (error) {
      console.error('Consultation save error:', error);
      toast.error('접수 중 오류가 발생했습니다. 전화로 문의 부탁드립니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-10 pb-20 px-5 max-w-4xl mx-auto relative z-10">
      {/* 5. 상담 안내 페이지 */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight mb-4 break-keep">
          지금 <span className="text-red-500">상담이 필요합니다</span>
        </h1>
        <p className="text-slate-300 text-lg sm:text-xl font-medium break-keep">
          대응이 늦어질수록 결과는 불리해집니다.<br className="sm:hidden" />
          가장 빠른 방법으로 연락주세요.
        </p>
      </motion.div>

      {/* 상담 방법 카드 */}
      <div className="grid md:grid-cols-3 gap-6 mb-16">
        {/* 전화 상담 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#141b29] border border-red-500/30 rounded-2xl p-8 text-center relative overflow-hidden group hover:bg-red-900/10 transition-colors"
        >
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
            <Phone className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">전화 상담</h3>
          <p className="text-slate-400 mb-6">가장 빠르고 확실한 방법</p>
          <a href="tel:031-214-5566" className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold transition-colors w-full">
            <Phone className="w-5 h-5" />
            <span>031-214-5566</span>
          </a>
        </motion.div>

        {/* 네이버 예약 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#141b29] border border-white/10 rounded-2xl p-8 text-center relative overflow-hidden group hover:border-[#03C75A]/30 transition-colors"
        >
          <div className="w-16 h-16 rounded-full bg-[#03C75A]/10 flex items-center justify-center mx-auto mb-6">
            <Calendar className="w-8 h-8 text-[#03C75A]" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">네이버 예약</h3>
          <p className="text-slate-400 mb-6">원하는 시간에 방문 상담</p>
          <a 
            href="https://map.naver.com/p/entry/place/1555988892?placePath=/ticket?entry=plt&from=map&fromPanelNum=1&additionalHeight=76&timestamp=202603312147&locale=ko&svcName=map_pcv5&from=map&fromPanelNum=1&additionalHeight=76&timestamp=202603312147&locale=ko&svcName=map_pcv5&searchType=place&lng=127.0677545&lat=37.2918034&c=15.00,0,0,0,dh" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center justify-center gap-2 bg-[#03C75A] hover:bg-[#02b351] text-white px-6 py-3 rounded-xl font-bold transition-colors w-full"
          >
            <span>예약하기</span>
          </a>
        </motion.div>

        {/* 빠른 상담 신청 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[#141b29] border border-white/10 rounded-2xl p-8 text-center relative overflow-hidden group hover:border-blue-500/30 transition-colors"
        >
          <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-6">
            <MessageSquare className="w-8 h-8 text-blue-500" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">빠른 상담 신청</h3>
          <p className="text-slate-400 mb-6">간단한 정보 입력 후 연락</p>
          <button onClick={() => document.getElementById('consultation-form')?.scrollIntoView({ behavior: 'smooth' })} className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-bold transition-colors w-full">
            <span>신청하기</span>
          </button>
        </motion.div>
      </div>

      {/* 상담 폼 */}
      <motion.div 
        id="consultation-form"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-[#0a0f18]/80 backdrop-blur-md rounded-3xl border border-white/10 p-8 sm:p-12 shadow-2xl"
      >
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">빠른 상담 신청</h2>
          <p className="text-slate-400">내용을 남겨주시면 전담팀이 신속하게 연락드립니다.</p>
        </div>

        <form className="space-y-6 max-w-2xl mx-auto" onSubmit={handleSubmit}>
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">이름</label>
              <input 
                type="text" 
                id="name" 
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-[#141b29] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
                placeholder="홍길동"
                required
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-slate-300 mb-2">연락처</label>
              <input 
                type="tel" 
                id="phone" 
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-[#141b29] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
                placeholder="010-0000-0000"
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="details" className="block text-sm font-medium text-slate-300 mb-2">간략 내용</label>
            <textarea 
              id="details" 
              rows={5}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full bg-[#141b29] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors resize-none"
              placeholder="현재 상황을 간략히 적어주세요. (예: 경찰 조사 출석 요구를 받았습니다.)"
              required
            ></textarea>
          </div>
          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full group relative inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all active:scale-95 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>{isSubmitting ? '접수 중...' : '상담 접수하기'}</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <div className="flex items-center justify-center gap-2 text-xs text-slate-500 mt-4">
            <AlertTriangle className="w-4 h-4 text-yellow-500/50" />
            <p>남겨주신 정보는 상담 목적으로만 사용되며 철저히 비밀이 보장됩니다.</p>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
