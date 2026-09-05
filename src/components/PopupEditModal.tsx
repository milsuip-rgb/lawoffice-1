import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Monitor, 
  Type, 
  Palette, 
  AlignLeft, 
  AlignCenter, 
  Upload, 
  Trash2, 
  ImageIcon, 
  Link as LinkIcon, 
  Calendar as CalendarIcon, 
  Check, 
  Eye, 
  Sparkles,
  ChevronRight,
  CornerDownLeft
} from 'lucide-react';
import { compressImage } from '../utils/imageCompressor';
import { toast } from 'sonner';

interface PopupData {
  id: number;
  title: string;
  content: string;
  imageUrl?: string;
  link?: string;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  titleFontSize?: string;
  titleFontWeight?: string;
  titleColor?: string;
  contentFontSize?: string;
  contentFontWeight?: string;
  contentColor?: string;
  textAlign?: 'left' | 'center';
}

interface PopupEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  popup: PopupData | null;
  onSave: (popup: PopupData) => Promise<void>;
  onDelete?: (id: number | string) => Promise<void>;
}

// Preset color options
const TITLE_COLORS = [
  { label: '화이트', value: '#ffffff' },
  { label: '골드옐로우', value: '#facc15' },
  { label: '크림슨레드', value: '#ef4444' },
  { label: '스카이블루', value: '#38bdf8' },
  { label: '에메랄드', value: '#4ade80' },
  { label: '오렌지', value: '#fb923c' },
  { label: '소프트그레이', value: '#e2e8f0' },
];

const CONTENT_COLORS = [
  { label: '라이트슬레이트', value: '#cbd5e1' },
  { label: '화이트', value: '#ffffff' },
  { label: '소프트그레이', value: '#94a3b8' },
  { label: '소프트옐로우', value: '#fef08a' },
  { label: '소프트레드', value: '#fca5a5' },
  { label: '소프트스카이', value: '#bae6fd' },
  { label: '소프트그린', value: '#bbf7d0' },
];

// Special characters categories
const SPECIAL_CHAR_GROUPS = [
  {
    name: '법률 & 기호',
    chars: ['§', '※', '★', '☆', '◆', '◇', '●', '○', '■', '□', '▶', '▼', '▲', '№']
  },
  {
    name: '알림 & 이모지',
    chars: ['⚖️', '🚨', '📢', '⚠️', '📌', '💡', '✔️', '📞', '⏰', '🏛️', '📜', '🔒', '❗', '❓', '👉', '🔥', '⭐']
  },
  {
    name: '괄호 & 구분자',
    chars: ['【', '】', '「', '」', '『', '』', '[', ']', '(', ')', 'ㆍ', '|', '―', '→', '~']
  }
];

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

export default function PopupEditModal({ isOpen, onClose, popup, onSave, onDelete }: PopupEditModalProps) {
  const [formData, setFormData] = useState<PopupData>({
    id: Date.now(),
    title: '',
    content: '',
    imageUrl: '',
    link: '/consultation',
    isActive: true,
    startDate: '',
    endDate: '',
    titleFontSize: '24px',
    titleFontWeight: '700',
    titleColor: '#ffffff',
    contentFontSize: '16px',
    contentFontWeight: '400',
    contentColor: '#cbd5e1',
    textAlign: 'left'
  });

  const [activeTarget, setActiveTarget] = useState<'title' | 'content'>('title');
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');

  const titleInputRef = useRef<HTMLInputElement>(null);
  const contentTextareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (popup) {
      setFormData({
        id: popup.id || Date.now(),
        title: popup.title || '',
        content: popup.content || '',
        imageUrl: popup.imageUrl || '',
        link: popup.link || '/consultation',
        isActive: popup.isActive !== undefined ? popup.isActive : true,
        startDate: popup.startDate || '',
        endDate: popup.endDate || '',
        titleFontSize: popup.titleFontSize || '24px',
        titleFontWeight: popup.titleFontWeight || '700',
        titleColor: popup.titleColor || '#ffffff',
        contentFontSize: popup.contentFontSize || '16px',
        contentFontWeight: popup.contentFontWeight || '400',
        contentColor: popup.contentColor || '#cbd5e1',
        textAlign: popup.textAlign || 'left'
      });
    }
  }, [popup]);

  if (!isOpen) return null;

  // Insert special character or newline into target field
  const handleInsertChar = (char: string) => {
    if (activeTarget === 'title') {
      const input = titleInputRef.current;
      if (input) {
        const start = input.selectionStart ?? input.value.length;
        const end = input.selectionEnd ?? input.value.length;
        const val = formData.title || '';
        const updated = val.substring(0, start) + char + val.substring(end);
        setFormData(prev => ({ ...prev, title: updated }));
        setTimeout(() => {
          input.focus();
          const newPos = start + char.length;
          input.setSelectionRange(newPos, newPos);
        }, 10);
      } else {
        setFormData(prev => ({ ...prev, title: (prev.title || '') + char }));
      }
    } else {
      const textarea = contentTextareaRef.current;
      if (textarea) {
        const start = textarea.selectionStart ?? textarea.value.length;
        const end = textarea.selectionEnd ?? textarea.value.length;
        const val = formData.content || '';
        const updated = val.substring(0, start) + char + val.substring(end);
        setFormData(prev => ({ ...prev, content: updated }));
        setTimeout(() => {
          textarea.focus();
          const newPos = start + char.length;
          textarea.setSelectionRange(newPos, newPos);
        }, 10);
      } else {
        setFormData(prev => ({ ...prev, content: (prev.content || '') + char }));
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const compressed = await compressImage(reader.result as string);
          setFormData(prev => ({ ...prev, imageUrl: compressed }));
          toast.success('이미지가 업로드되었습니다.');
        } catch {
          toast.error('이미지 처리 중 오류가 발생했습니다.');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('팝업 제목을 입력해주세요.');
      return;
    }
    if (!formData.content.trim()) {
      toast.error('팝업 내용을 입력해주세요.');
      return;
    }

    setIsSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Save popup error:', error);
      toast.error('팝업 저장 중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        className="bg-[#0b111e] border border-white/10 rounded-3xl w-full max-w-6xl overflow-hidden shadow-2xl my-auto flex flex-col max-h-[92vh]"
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-white/10 flex justify-between items-center bg-[#101827]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-500">
              <Monitor className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                팝업 상세 서식 설정
                <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full font-normal">
                  줄바꿈·글자크기·굵기·색상·특수문자
                </span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-400">
                제목과 본문의 서식을 지정하고 우측 실시간 미리보기로 확인하세요.
              </p>
            </div>
          </div>

          {/* Mobile Tab Switcher */}
          <div className="flex items-center gap-2">
            <div className="lg:hidden flex bg-white/5 p-1 rounded-xl border border-white/10">
              <button
                type="button"
                onClick={() => setActiveTab('editor')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${activeTab === 'editor' ? 'bg-red-600 text-white' : 'text-slate-400'}`}
              >
                편집기
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${activeTab === 'preview' ? 'bg-red-600 text-white' : 'text-slate-400'}`}
              >
                미리보기
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Modal Body - 2 Columns (Editor + Live Preview) */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-white/10">
            {/* Left Column: Form & Tools (7 cols) */}
            <div className={`lg:col-span-7 p-6 sm:p-8 space-y-6 ${activeTab === 'preview' ? 'hidden lg:block' : 'block'}`}>
              
              {/* 특수문자 빠른 삽입 툴바 */}
              <div className="bg-[#131b2c] border border-white/10 rounded-2xl p-4">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2 border-b border-white/10">
                  <div className="flex items-center gap-2 text-sm font-bold text-white">
                    <Sparkles className="w-4 h-4 text-yellow-400" />
                    <span>특수문자 & 기호 빠른 삽입</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-lg border border-white/5">
                    <span className="text-xs text-slate-400 pl-1.5">삽입 위치:</span>
                    <button
                      type="button"
                      onClick={() => setActiveTarget('title')}
                      className={`px-2.5 py-1 rounded-md text-xs font-bold transition-colors ${activeTarget === 'title' ? 'bg-red-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                    >
                      제목에 삽입
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTarget('content')}
                      className={`px-2.5 py-1 rounded-md text-xs font-bold transition-colors ${activeTarget === 'content' ? 'bg-red-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                    >
                      내용에 삽입
                    </button>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {SPECIAL_CHAR_GROUPS.map((group) => (
                    <div key={group.name} className="flex flex-wrap items-center gap-1.5">
                      <span className="text-xs font-medium text-slate-400 w-20 shrink-0">
                        {group.name}
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {group.chars.map((char) => (
                          <button
                            key={char}
                            type="button"
                            onClick={() => handleInsertChar(char)}
                            className="px-2 py-1 bg-white/5 hover:bg-white/15 active:scale-95 text-white text-xs rounded-md border border-white/10 transition-all font-sans"
                            title={`${char} 삽입 (${activeTarget === 'title' ? '제목' : '내용'})`}
                          >
                            {char}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}

                  <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                    <span className="text-xs font-medium text-slate-400 w-20 shrink-0">줄바꿈 삽입</span>
                    <button
                      type="button"
                      onClick={() => handleInsertChar('\n')}
                      className="px-2.5 py-1 bg-red-600/15 hover:bg-red-600/25 active:scale-95 text-red-400 text-xs font-medium rounded-md border border-red-500/20 flex items-center gap-1.5 transition-all"
                    >
                      <CornerDownLeft className="w-3.5 h-3.5" />
                      <span>줄바꿈 (Enter) 추가</span>
                    </button>
                    <span className="text-[11px] text-slate-500">
                      * 텍스트 입력 중 키보드 Enter를 쳐도 팝업에 줄바꿈이 그대로 반영됩니다.
                    </span>
                  </div>
                </div>
              </div>

              {/* 1. 팝업 제목 및 서식 설정 */}
              <div className="bg-[#131b2c] border border-white/10 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-white flex items-center gap-2">
                    <Type className="w-4 h-4 text-red-500" />
                    팝업 제목
                  </label>
                  <span className="text-xs text-slate-400">
                    줄바꿈(Enter) 시 제목도 여러 줄로 표시 가능
                  </span>
                </div>

                <input
                  ref={titleInputRef}
                  type="text"
                  value={formData.title}
                  onFocus={() => setActiveTarget('title')}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="예: 【긴급】 주말 야간 법률 상담 지원 안내"
                  className="w-full bg-[#0b111e] border border-white/15 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors text-base"
                  required
                />

                {/* 제목 서식 바 (크기, 굵기, 색상) */}
                <div className="p-3.5 bg-black/30 rounded-xl border border-white/5 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* 제목 글자 크기 */}
                    <div>
                      <span className="text-xs font-medium text-slate-400 block mb-1.5">글자 크기</span>
                      <div className="grid grid-cols-5 gap-1">
                        {[
                          { label: '18px', val: '18px' },
                          { label: '20px', val: '20px' },
                          { label: '24px', val: '24px' },
                          { label: '28px', val: '28px' },
                          { label: '32px', val: '32px' },
                        ].map(item => (
                          <button
                            key={item.val}
                            type="button"
                            onClick={() => setFormData({ ...formData, titleFontSize: item.val })}
                            className={`py-1 text-xs rounded-lg border font-medium transition-colors ${formData.titleFontSize === item.val ? 'bg-red-600 text-white border-red-500' : 'bg-white/5 text-slate-300 border-white/5 hover:bg-white/10'}`}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 제목 굵기 */}
                    <div>
                      <span className="text-xs font-medium text-slate-400 block mb-1.5">굵기</span>
                      <div className="grid grid-cols-4 gap-1">
                        {[
                          { label: '보통', val: '400' },
                          { label: '중간', val: '500' },
                          { label: '약간굵게', val: '600' },
                          { label: '굵게', val: '700' },
                        ].map(item => (
                          <button
                            key={item.val}
                            type="button"
                            onClick={() => setFormData({ ...formData, titleFontWeight: item.val })}
                            className={`py-1 text-xs rounded-lg border font-medium transition-colors ${formData.titleFontWeight === item.val ? 'bg-red-600 text-white border-red-500' : 'bg-white/5 text-slate-300 border-white/5 hover:bg-white/10'}`}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 제목 색상 */}
                  <div className="pt-2 border-t border-white/5">
                    <span className="text-xs font-medium text-slate-400 block mb-1.5 flex items-center gap-1.5">
                      <Palette className="w-3.5 h-3.5 text-slate-400" />
                      제목 글자 색상
                    </span>
                    <div className="flex flex-wrap items-center gap-2">
                      {TITLE_COLORS.map(c => (
                        <button
                          key={c.value}
                          type="button"
                          onClick={() => setFormData({ ...formData, titleColor: c.value })}
                          className={`w-7 h-7 rounded-full border-2 transition-transform ${formData.titleColor?.toLowerCase() === c.value.toLowerCase() ? 'scale-110 border-red-500 ring-2 ring-red-500/30' : 'border-white/20 hover:scale-105'}`}
                          style={{ backgroundColor: c.value }}
                          title={c.label}
                        />
                      ))}
                      <div className="flex items-center gap-2 ml-auto">
                        <input
                          type="color"
                          value={formData.titleColor || '#ffffff'}
                          onChange={(e) => setFormData({ ...formData, titleColor: e.target.value })}
                          className="w-7 h-7 rounded cursor-pointer bg-transparent border-0"
                          title="직접 색상 선택"
                        />
                        <input
                          type="text"
                          value={formData.titleColor || '#ffffff'}
                          onChange={(e) => setFormData({ ...formData, titleColor: e.target.value })}
                          className="w-20 bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-white uppercase text-center font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. 팝업 내용 및 서식 설정 (줄바꿈 핵심 반영) */}
              <div className="bg-[#131b2c] border border-white/10 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-white flex items-center gap-2">
                    <Type className="w-4 h-4 text-red-500" />
                    팝업 내용 (줄바꿈 지원)
                  </label>
                  <span className="text-xs text-emerald-400 font-medium">
                    ✓ 줄바꿈(Enter)이 그대로 팝업에 적용됩니다
                  </span>
                </div>

                <textarea
                  ref={contentTextareaRef}
                  value={formData.content}
                  onFocus={() => setActiveTarget('content')}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={5}
                  placeholder={`팝업에 표시할 내용을 입력하세요.\n줄바꿈(Enter)을 누르면 실제 팝업에서도 동일하게 줄이 나뉩니다.\n\n예시:\n※ 주말 및 공휴일에도 긴급 상담 가능\n☎ 031-214-5566 (24시간 즉시 연결)`}
                  className="w-full bg-[#0b111e] border border-white/15 rounded-xl p-4 text-white focus:outline-none focus:border-red-500 transition-colors leading-relaxed whitespace-pre-wrap font-sans text-sm"
                  required
                />

                {/* 내용 서식 바 (크기, 굵기, 색상, 정렬) */}
                <div className="p-3.5 bg-black/30 rounded-xl border border-white/5 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* 내용 글자 크기 */}
                    <div>
                      <span className="text-xs font-medium text-slate-400 block mb-1.5">본문 글자 크기</span>
                      <div className="grid grid-cols-6 gap-1">
                        {[
                          { label: '13', val: '13px' },
                          { label: '14', val: '14px' },
                          { label: '15', val: '15px' },
                          { label: '16', val: '16px' },
                          { label: '18', val: '18px' },
                          { label: '20', val: '20px' },
                        ].map(item => (
                          <button
                            key={item.val}
                            type="button"
                            onClick={() => setFormData({ ...formData, contentFontSize: item.val })}
                            className={`py-1 text-xs rounded-lg border font-medium transition-colors ${formData.contentFontSize === item.val ? 'bg-red-600 text-white border-red-500' : 'bg-white/5 text-slate-300 border-white/5 hover:bg-white/10'}`}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 내용 굵기 */}
                    <div>
                      <span className="text-xs font-medium text-slate-400 block mb-1.5">본문 굵기</span>
                      <div className="grid grid-cols-5 gap-1">
                        {[
                          { label: '가늘게', val: '300' },
                          { label: '보통', val: '400' },
                          { label: '중간', val: '500' },
                          { label: '약간굵게', val: '600' },
                          { label: '굵게', val: '700' },
                        ].map(item => (
                          <button
                            key={item.val}
                            type="button"
                            onClick={() => setFormData({ ...formData, contentFontWeight: item.val })}
                            className={`py-1 text-xs rounded-lg border font-medium transition-colors ${formData.contentFontWeight === item.val ? 'bg-red-600 text-white border-red-500' : 'bg-white/5 text-slate-300 border-white/5 hover:bg-white/10'}`}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 정렬 & 본문 색상 */}
                  <div className="pt-2 border-t border-white/5 flex flex-wrap items-center justify-between gap-4">
                    {/* 본문 색상 */}
                    <div>
                      <span className="text-xs font-medium text-slate-400 block mb-1.5 flex items-center gap-1.5">
                        <Palette className="w-3.5 h-3.5 text-slate-400" />
                        본문 글자 색상
                      </span>
                      <div className="flex flex-wrap items-center gap-2">
                        {CONTENT_COLORS.map(c => (
                          <button
                            key={c.value}
                            type="button"
                            onClick={() => setFormData({ ...formData, contentColor: c.value })}
                            className={`w-7 h-7 rounded-full border-2 transition-transform ${formData.contentColor?.toLowerCase() === c.value.toLowerCase() ? 'scale-110 border-red-500 ring-2 ring-red-500/30' : 'border-white/20 hover:scale-105'}`}
                            style={{ backgroundColor: c.value }}
                            title={c.label}
                          />
                        ))}
                        <input
                          type="color"
                          value={formData.contentColor || '#cbd5e1'}
                          onChange={(e) => setFormData({ ...formData, contentColor: e.target.value })}
                          className="w-7 h-7 rounded cursor-pointer bg-transparent border-0 ml-1"
                          title="직접 색상 선택"
                        />
                        <input
                          type="text"
                          value={formData.contentColor || '#cbd5e1'}
                          onChange={(e) => setFormData({ ...formData, contentColor: e.target.value })}
                          className="w-20 bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-white uppercase text-center font-mono"
                        />
                      </div>
                    </div>

                    {/* 텍스트 정렬 */}
                    <div>
                      <span className="text-xs font-medium text-slate-400 block mb-1.5">텍스트 정렬</span>
                      <div className="flex items-center gap-1 bg-black/40 p-1 rounded-lg border border-white/5">
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, textAlign: 'left' })}
                          className={`p-1.5 rounded-md text-xs font-medium flex items-center gap-1 transition-colors ${formData.textAlign !== 'center' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'}`}
                        >
                          <AlignLeft className="w-3.5 h-3.5" />
                          <span>좌측</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, textAlign: 'center' })}
                          className={`p-1.5 rounded-md text-xs font-medium flex items-center gap-1 transition-colors ${formData.textAlign === 'center' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'}`}
                        >
                          <AlignCenter className="w-3.5 h-3.5" />
                          <span>가운데</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. 이미지 및 부가 설정 */}
              <div className="bg-[#131b2c] border border-white/10 rounded-2xl p-5 space-y-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-red-500" />
                  이미지 및 링크 / 기간 설정
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* 배너 이미지 */}
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5 flex items-between justify-between">
                      <span>팝업 배너 이미지 (선택)</span>
                      {formData.imageUrl && (
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, imageUrl: '' })}
                          className="text-[11px] text-red-400 hover:underline flex items-center gap-0.5"
                        >
                          <Trash2 className="w-3 h-3" />
                          이미지 삭제 (텍스트 전용)
                        </button>
                      )}
                    </label>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full bg-[#0b111e] hover:bg-white/5 border border-white/15 text-white rounded-xl py-2.5 px-3 text-xs font-medium flex items-center justify-center gap-2 transition-colors"
                      >
                        <Upload className="w-4 h-4 text-red-500" />
                        <span>사진 파일 업로드</span>
                      </button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        className="hidden"
                        accept="image/*"
                      />
                    </div>
                    {formData.imageUrl && (
                      <div className="mt-2 aspect-video rounded-xl overflow-hidden border border-white/10 relative">
                        <img
                          src={formData.imageUrl}
                          alt="배너 미리보기"
                          className="w-full h-full object-cover"
                          onError={(e: any) => e.target.src = 'https://via.placeholder.com/800x450?text=Image+Error'}
                        />
                      </div>
                    )}
                  </div>

                  {/* 연결 링크 */}
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5 flex items-center gap-1">
                      <LinkIcon className="w-3.5 h-3.5 text-slate-400" />
                      버튼 연결 링크
                    </label>
                    <input
                      type="text"
                      value={formData.link || ''}
                      onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                      placeholder="예: /consultation 또는 tel:031-214-5566"
                      className="w-full bg-[#0b111e] border border-white/15 rounded-xl px-3 py-2.5 text-white text-xs focus:outline-none focus:border-red-500 transition-colors"
                    />
                    <span className="text-[11px] text-slate-500 mt-1 block">
                      * '자세히 보기' 클릭 시 이동할 경로입니다.
                    </span>
                  </div>
                </div>

                {/* 기간 설정 */}
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/5">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1 flex items-center gap-1">
                      <CalendarIcon className="w-3.5 h-3.5 text-slate-400" />
                      시작일 (선택)
                    </label>
                    <input
                      type="date"
                      value={formData.startDate || ''}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full bg-[#0b111e] border border-white/15 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1 flex items-center gap-1">
                      <CalendarIcon className="w-3.5 h-3.5 text-slate-400" />
                      종료일 (선택)
                    </label>
                    <input
                      type="date"
                      value={formData.endDate || ''}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="w-full bg-[#0b111e] border border-white/15 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>

                {/* 활성화 체크박스 */}
                <div className="flex items-center gap-3 p-3.5 bg-black/40 rounded-xl border border-white/5">
                  <input
                    type="checkbox"
                    id="isActivePopup"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-5 h-5 accent-red-600 rounded cursor-pointer"
                  />
                  <label htmlFor="isActivePopup" className="text-white text-sm font-medium cursor-pointer flex-1">
                    이 팝업을 즉시 웹사이트에 활성화합니다.
                  </label>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${formData.isActive ? 'bg-green-500/20 text-green-400' : 'bg-slate-700 text-slate-400'}`}>
                    {formData.isActive ? '활성화 상태' : '비활성'}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Live Real-time Popup Preview (5 cols) */}
            <div className={`lg:col-span-5 p-6 sm:p-8 bg-[#070b13] flex flex-col justify-between ${activeTab === 'editor' ? 'hidden lg:flex' : 'flex'}`}>
              <div>
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-red-500" />
                    <span className="text-sm font-bold text-white">실시간 팝업 미리보기</span>
                  </div>
                  <span className="text-[11px] text-slate-400 bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
                    방문자 화면과 100% 동일
                  </span>
                </div>

                {/* Simulated Popup Box */}
                <div className="relative w-full bg-[#0a0f18] border border-white/15 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[520px]">
                  {/* Fake Close Button */}
                  <div className="absolute top-3 right-3 z-10 p-2 bg-black/50 text-white/70 rounded-full">
                    <X className="w-4 h-4" />
                  </div>

                  {/* Scrollable area */}
                  <div className="flex-1 overflow-y-auto">
                    {/* Banner Image if any */}
                    {formData.imageUrl ? (
                      <div className="max-h-40 relative overflow-hidden bg-black">
                        <img
                          src={formData.imageUrl}
                          alt="팝업 미리보기"
                          className="w-full h-full object-cover max-h-40"
                          onError={(e: any) => e.target.src = 'https://via.placeholder.com/800x450?text=Preview+Image'}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f18] via-transparent to-transparent"></div>
                      </div>
                    ) : null}

                    {/* Content Area with dynamic styles and line breaks */}
                    <div className={`p-5 ${formData.imageUrl ? 'pt-3' : 'pt-5'}`}>
                      {/* Title */}
                      <h3
                        style={{
                          fontSize: formData.titleFontSize || '20px',
                          fontWeight: formData.titleFontWeight || '700',
                          color: formData.titleColor || '#ffffff',
                          textAlign: formData.textAlign || 'left',
                          wordBreak: 'keep-all',
                          overflowWrap: 'break-word',
                        }}
                        className="mb-2.5 leading-snug transition-all"
                      >
                        {renderMultilineText(formData.title || '팝업 제목이 여기에 표시됩니다')}
                      </h3>

                      {/* Content (Preserving line breaks!) */}
                      <div
                        style={{
                          fontSize: formData.contentFontSize || '15px',
                          fontWeight: formData.contentFontWeight || '400',
                          color: formData.contentColor || '#cbd5e1',
                          textAlign: formData.textAlign || 'left',
                          wordBreak: 'keep-all',
                          overflowWrap: 'break-word',
                        }}
                        className="leading-relaxed transition-all text-sm"
                      >
                        {renderMultilineText(formData.content || '팝업 본문 내용이 여기에 표시됩니다.\n줄바꿈(Enter)과 특수문자 서식이 실시간으로 반영됩니다.')}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Pinned Action Controls */}
                  <div className="shrink-0 bg-[#0c121e] border-t border-white/10 p-3.5 space-y-2.5">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-red-600 text-white font-bold py-2.5 px-2 rounded-xl flex items-center justify-center gap-1 text-xs shadow-lg shadow-red-600/20 cursor-default min-h-[40px] text-center">
                        <span>자세히 보기</span>
                        <ChevronRight className="w-4 h-4 shrink-0" />
                      </div>
                      <div className="bg-white/5 text-white font-bold py-2.5 px-2 rounded-xl flex items-center justify-center gap-1 text-xs border border-white/10 cursor-default min-h-[40px] text-center">
                        <span>전화 바로 연결</span>
                      </div>
                    </div>

                    {/* Footer Mockup */}
                    <div className="flex justify-between items-center px-1 pt-1 text-xs">
                      <span className="text-slate-500">오늘 하루 보지 않기</span>
                      <span className="text-white font-medium">닫기</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Info Box */}
              <div className="mt-6 p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs text-slate-400">
                <div className="flex justify-between">
                  <span>제목 서식:</span>
                  <span className="text-slate-200 font-mono">
                    {formData.titleFontSize} / {formData.titleFontWeight} / {formData.titleColor}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>본문 서식:</span>
                  <span className="text-slate-200 font-mono">
                    {formData.contentFontSize} / {formData.contentFontWeight} / {formData.contentColor}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>정렬:</span>
                  <span className="text-slate-200">{formData.textAlign === 'center' ? '가운데 정렬' : '좌측 정렬'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer Controls */}
          <div className="p-4 sm:p-6 border-t border-white/10 bg-[#101827] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 font-bold rounded-xl transition-colors text-sm"
              >
                닫기
              </button>

              {onDelete && formData.id && (
                !isConfirmingDelete ? (
                  <button
                    type="button"
                    onClick={() => setIsConfirmingDelete(true)}
                    className="px-4 py-2.5 bg-red-500/10 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/20 rounded-xl transition-all text-sm font-bold flex items-center gap-1.5"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>팝업 삭제</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-2 bg-red-950/40 border border-red-500/40 rounded-xl p-1.5 px-3">
                    <span className="text-xs text-red-300 font-medium">정말 삭제할까요?</span>
                    <button
                      type="button"
                      disabled={isDeleting}
                      onClick={async () => {
                        setIsDeleting(true);
                        try {
                          await onDelete(formData.id);
                        } finally {
                          setIsDeleting(false);
                          setIsConfirmingDelete(false);
                        }
                      }}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-all disabled:opacity-50"
                    >
                      {isDeleting ? '삭제 중...' : '예, 삭제'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsConfirmingDelete(false)}
                      className="px-2 py-1 text-slate-400 hover:text-white text-xs font-medium"
                    >
                      취소
                    </button>
                  </div>
                )
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={isSaving}
                className="px-7 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-600/25 flex items-center gap-2 text-sm"
              >
                {isSaving ? (
                  <span>저장 중...</span>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>팝업 설정 저장하기</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
