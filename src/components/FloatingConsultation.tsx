import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, ArrowRight, AlertTriangle } from 'lucide-react';
import { useFirestore } from '../hooks/useFirestore';
import { toast } from 'sonner';
import { sendTelegramMessage } from '../utils/telegram';

export default function FloatingConsultation() {
  const [isOpen, setIsOpen] = useState(false);
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
<b>[빠른 상담 신청 알림]</b>
<b>성함:</b> ${formData.name}
<b>연락처:</b> ${formData.phone}
<b>내용:</b> ${formData.content}
<b>신청시간:</b> ${consultationData.date} ${consultationData.time}
      `;
      
      try {
        const telegramSuccess = await sendTelegramMessage(message);
        if (telegramSuccess === false) {
          toast.success('상담 신청이 접수되었습니다. 곧 연락드리겠습니다.');
        } else {
          toast.success('상담 신청이 접수되었습니다. 곧 연락드리겠습니다.');
        }
      } catch (telegramError) {
        console.error('Telegram notification failed:', telegramError);
        toast.success('상담 신청이 접수되었습니다. (알림 전송 지연)');
      }

      setFormData({ name: '', phone: '', content: '' });
      setIsOpen(false);
    } catch (error) {
      console.error('Consultation save error:', error);
      toast.error('접수 중 오류가 발생했습니다. 전화로 문의 부탁드립니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-red-600 hover:bg-red-700 text-white p-4 rounded-full shadow-[0_0_30px_-5px_rgba(220,38,38,0.6)] transition-all active:scale-95 flex items-center justify-center group"
        aria-label="빠른 상담 신청"
      >
        <MessageSquare className="w-7 h-7" />
        <span className="absolute right-full mr-4 bg-black/80 backdrop-blur-sm text-white text-sm font-bold px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-white/10">
          빠른 상담 신청
        </span>
      </button>

      {/* Floating Form Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-5 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: 100, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.95 }}
              className="relative w-full max-w-md bg-[#0a0f18] border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
            >
              {/* Header */}
              <div className="bg-[#141b29] p-6 border-b border-white/5 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">빠른 상담 신청</h3>
                  <p className="text-slate-400 text-sm">내용을 남겨주시면 신속하게 연락드립니다.</p>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 bg-white/5 hover:bg-white/10 text-white rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form className="p-6 space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="quick-name" className="block text-sm font-medium text-slate-300 mb-1.5">이름</label>
                  <input 
                    type="text" 
                    id="quick-name" 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#141b29] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
                    placeholder="홍길동"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="quick-phone" className="block text-sm font-medium text-slate-300 mb-1.5">연락처</label>
                  <input 
                    type="tel" 
                    id="quick-phone" 
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-[#141b29] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
                    placeholder="010-0000-0000"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="quick-details" className="block text-sm font-medium text-slate-300 mb-1.5">간략 내용</label>
                  <textarea 
                    id="quick-details" 
                    rows={3}
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="w-full bg-[#141b29] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors resize-none"
                    placeholder="현재 상황을 간략히 적어주세요."
                    required
                  ></textarea>
                </div>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full group relative inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3.5 rounded-xl font-bold transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>{isSubmitting ? '접수 중...' : '상담 접수하기'}</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500">
                  <AlertTriangle className="w-3.5 h-3.5 text-yellow-500/50" />
                  <p>모든 상담 내용은 철저히 비밀이 보장됩니다.</p>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
