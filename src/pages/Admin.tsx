import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutDashboard, FileText, Users, Settings, LogOut, Plus, Edit2, Trash2, Search, MessageSquare, Clock, Calendar as CalendarIcon, AlertTriangle, Monitor, X, Link as LinkIcon, Image as ImageIcon, Upload, RotateCcw } from 'lucide-react';
import { useFirestore, initialCases, initialLawyers, DEFAULT_POPUP, DEFAULT_REVIEWS } from '../hooks/useFirestore';
import { compressImage } from '../utils/imageCompressor';
import { toast } from 'sonner';

import { auth } from '../firebase';
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'cases' | 'lawyers' | 'consultations' | 'popups' | 'reviews'>('dashboard');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email === 'milsuip@gmail.com') {
        setIsLoggedIn(true);
        setUser(user);
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      if (result.user.email !== 'milsuip@gmail.com') {
        await signOut(auth);
        toast.error('관리자 권한이 없는 계정입니다.');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.code === 'auth/unauthorized-domain') {
        toast.error('현재 도메인이 Firebase 승인 도메인에 등록되지 않았습니다. 관리자에게 문의하세요.');
      } else {
        toast.error('로그인 중 오류가 발생했습니다.');
      }
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('로그아웃 되었습니다.');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Firestore Hooks
  const { data: popups, addOrUpdate: savePopup, remove: removePopup } = useFirestore('popups', [DEFAULT_POPUP]);
  const { data: cases, addOrUpdate: saveCase, remove: removeCase } = useFirestore('cases', initialCases);
  const { data: lawyersList, addOrUpdate: saveLawyer, remove: removeLawyer } = useFirestore('lawyers', initialLawyers);
  const { data: consultations, addOrUpdate: saveConsultation, remove: removeConsultation } = useFirestore('consultations');
  const { data: reviews, addOrUpdate: saveReview, remove: removeReview } = useFirestore('reviews', DEFAULT_REVIEWS);

  // Popup Management State
  const [isPopupModalOpen, setIsPopupModalOpen] = useState(false);
  const [editingPopup, setEditingPopup] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const lawyerFileInputRef = useRef<HTMLInputElement>(null);
  const caseFileInputRef = useRef<HTMLInputElement>(null);
  const documentImagesInputRef = useRef<HTMLInputElement>(null);
  const reviewFileInputRef = useRef<HTMLInputElement>(null);

  // Success Cases State
  const [isCaseModalOpen, setIsCaseModalOpen] = useState(false);
  const [editingCase, setEditingCase] = useState<any>(null);

  // Lawyers State
  const [isLawyerModalOpen, setIsLawyerModalOpen] = useState(false);
  const [editingLawyer, setEditingLawyer] = useState<any>(null);

  // Reviews State
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<any>(null);

  // Review Handlers
  const handleAddReview = () => {
    setEditingReview({
      id: Date.now(),
      text: '',
      result: '',
      bg: ''
    });
    setIsReviewModalOpen(true);
  };

  const handleEditReview = (review: any) => {
    setEditingReview({ ...review });
    setIsReviewModalOpen(true);
  };

  const handleDeleteReview = async (id: any) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      try {
        await removeReview(id);
        toast.success('후기가 삭제되었습니다.');
      } catch (error) {
        console.error('Delete review error:', error);
        toast.error('삭제 중 오류가 발생했습니다.');
      }
    }
  };

  const handleSaveReview = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveReview(editingReview);
      setIsReviewModalOpen(false);
      setEditingReview(null);
      toast.success('후기가 저장되었습니다.');
    } catch (error) {
      console.error('Save review error:', error);
      toast.error('저장 중 오류가 발생했습니다.');
    }
  };

  const handleReviewImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const compressed = await compressImage(reader.result as string);
        setEditingReview({ ...editingReview, bg: compressed });
      };
      reader.readAsDataURL(file);
    }
  };

  // Popup Handlers
  const handleTogglePopup = async (id: number) => {
    const popup = popups.find(p => p.id === id);
    if (popup) {
      await savePopup({ ...popup, isActive: !popup.isActive });
    }
  };

  const handleDeletePopup = async (id: any) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      try {
        await removePopup(id);
        toast.success('팝업이 삭제되었습니다.');
      } catch (error) {
        console.error('Delete popup error:', error);
        toast.error('삭제 중 오류가 발생했습니다.');
      }
    }
  };

  const handleEditPopup = (popup: any) => {
    setEditingPopup({ ...popup });
    setIsPopupModalOpen(true);
  };

  const handleAddPopup = () => {
    setEditingPopup({
      id: Date.now(),
      title: '',
      content: '',
      imageUrl: 'https://picsum.photos/seed/' + Date.now() + '/800/450',
      isActive: true,
      link: '/consultation',
      startDate: '',
      endDate: ''
    });
    setIsPopupModalOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const compressed = await compressImage(reader.result as string);
        setEditingPopup({ ...editingPopup, imageUrl: compressed });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSavePopup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await savePopup(editingPopup);
      setIsPopupModalOpen(false);
      setEditingPopup(null);
      toast.success('팝업이 저장되었습니다.');
    } catch (error) {
      console.error('Save popup error:', error);
      toast.error('저장 중 오류가 발생했습니다.');
    }
  };

  // Case Handlers
  const handleAddCase = () => {
    setEditingCase({
      id: Date.now(),
      badge: '무죄',
      title: '',
      situation: '',
      dangerSituation: '',
      issue: '',
      result: '',
      image: 'https://picsum.photos/seed/' + Date.now() + '/400/250?grayscale',
      summary: '',
      issues: [],
      strategy: [],
      finalResult: '',
      documentImages: [],
      highlightText: '',
      order: 0
    });
    setIsCaseModalOpen(true);
  };

  const handleEditCase = (item: any) => {
    setEditingCase({ ...item });
    setIsCaseModalOpen(true);
  };

  const handleRestoreCases = async () => {
    if (!window.confirm('기존의 13개 성공사례를 복원하시겠습니까? (이미 존재하는 경우 덮어씌워집니다)')) return;
    
    const toastId = toast.loading('성공사례 복원 중...');
    try {
      for (const item of initialCases) {
        await saveCase(item);
      }
      toast.dismiss(toastId);
      toast.success('성공사례 13건이 복원되었습니다.');
    } catch (error) {
      toast.dismiss(toastId);
      toast.error('복원 중 오류가 발생했습니다.');
    }
  };

  const handleCaseImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const compressed = await compressImage(reader.result as string);
        setEditingCase({ ...editingCase, image: compressed });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDocumentImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newImages: string[] = [...(editingCase.documentImages || [])];
      let processedCount = 0;

      Array.from(files).forEach((file: File) => {
        const reader = new FileReader();
        reader.onloadend = async () => {
          const compressed = await compressImage(reader.result as string);
          newImages.push(compressed);
          processedCount++;
          
          if (processedCount === files.length) {
            setEditingCase({ ...editingCase, documentImages: newImages });
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleRemoveDocumentImage = (index: number) => {
    const newImages = [...(editingCase.documentImages || [])];
    newImages.splice(index, 1);
    setEditingCase({ ...editingCase, documentImages: newImages });
  };

  const handleDeleteCase = async (id: any) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      try {
        await removeCase(id);
        toast.success('성공사례가 삭제되었습니다.');
      } catch (error) {
        console.error('Delete case error:', error);
        toast.error('삭제 중 오류가 발생했습니다.');
      }
    }
  };

  const handleSaveCase = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveCase(editingCase);
      setIsCaseModalOpen(false);
      setEditingCase(null);
      toast.success('성공사례가 저장되었습니다.');
    } catch (error) {
      console.error('Save case error:', error);
      toast.error('저장 중 오류가 발생했습니다.');
    }
  };

  // Lawyer Handlers
  const handleAddLawyer = () => {
    setEditingLawyer({
      id: Date.now(),
      name: '',
      role: '변호사',
      field: '',
      image: 'https://picsum.photos/seed/' + Date.now() + '/300/400',
      cert: '',
      careers: []
    });
    setIsLawyerModalOpen(true);
  };

  const handleEditLawyer = (lawyer: any) => {
    setEditingLawyer({ ...lawyer });
    setIsLawyerModalOpen(true);
  };

  const handleLawyerImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const compressed = await compressImage(reader.result as string);
        setEditingLawyer({ ...editingLawyer, image: compressed });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddCareer = () => {
    setEditingLawyer({
      ...editingLawyer,
      careers: [...(editingLawyer.careers || []), '']
    });
  };

  const handleUpdateCareer = (index: number, value: string) => {
    const newCareers = [...editingLawyer.careers];
    newCareers[index] = value;
    setEditingLawyer({ ...editingLawyer, careers: newCareers });
  };

  const handleRemoveCareer = (index: number) => {
    const newCareers = editingLawyer.careers.filter((_: any, i: number) => i !== index);
    setEditingLawyer({ ...editingLawyer, careers: newCareers });
  };

  const handleDeleteLawyer = async (id: any) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      try {
        await removeLawyer(id);
        toast.success('변호사 정보가 삭제되었습니다.');
      } catch (error) {
        console.error('Delete lawyer error:', error);
        toast.error('삭제 중 오류가 발생했습니다.');
      }
    }
  };

  const handleSaveLawyer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveLawyer(editingLawyer);
      setIsLawyerModalOpen(false);
      setEditingLawyer(null);
      toast.success('변호사 정보가 저장되었습니다.');
    } catch (error) {
      console.error('Save lawyer error:', error);
      toast.error('저장 중 오류가 발생했습니다.');
    }
  };

  // Consultation Handlers
  const handleConfirmConsultation = async (id: number) => {
    const consult = consultations.find(c => c.id === id);
    if (consult) {
      await saveConsultation({ ...consult, status: 'read' });
    }
  };

  const handleDeleteConsultation = async (id: any) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      await removeConsultation(id);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050a14] px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#0a0f18] border border-white/10 p-8 rounded-3xl w-full max-w-md shadow-2xl"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-500/20">
              <Settings className="w-8 h-8 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-white">관리자 로그인</h1>
            <p className="text-slate-400 mt-2">시스템 관리를 위해 로그인하세요</p>
          </div>
          <div className="space-y-4">
            <p className="text-slate-400 text-center mb-6">
              관리자 권한이 있는 구글 계정으로 로그인해주세요.
            </p>
            <button
              onClick={handleLogin}
              className="w-full bg-white text-black py-4 rounded-xl font-bold text-lg hover:bg-slate-100 transition-all active:scale-95 flex items-center justify-center gap-3 shadow-lg"
            >
              <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
              구글 계정으로 로그인
            </button>
          </div>
          <p className="text-center text-xs text-slate-600 mt-6">
            © 2026 법무법인 정해. All rights reserved.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050a14] flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-[#0a0f18] hidden lg:flex flex-col">
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center font-bold text-white">J</div>
            <span className="font-bold text-white text-lg">정해 Admin</span>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'dashboard' ? 'bg-red-600 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>대시보드</span>
          </button>
          <button 
            onClick={() => setActiveTab('cases')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'cases' ? 'bg-red-600 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
          >
            <FileText className="w-5 h-5" />
            <span>성공사례 관리</span>
          </button>
          <button 
            onClick={() => setActiveTab('lawyers')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'lawyers' ? 'bg-red-600 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
          >
            <Users className="w-5 h-5" />
            <span>변호사 관리</span>
          </button>
          <button 
            onClick={() => setActiveTab('consultations')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'consultations' ? 'bg-red-600 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
          >
            <MessageSquare className="w-5 h-5" />
            <span>상담 신청 관리</span>
          </button>
          <button 
            onClick={() => setActiveTab('popups')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'popups' ? 'bg-red-600 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
          >
            <Monitor className="w-5 h-5" />
            <span>팝업 관리</span>
          </button>
          <button 
            onClick={() => setActiveTab('reviews')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'reviews' ? 'bg-red-600 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
          >
            <MessageSquare className="w-5 h-5" />
            <span>고객 후기 관리</span>
          </button>
        </nav>
        <div className="p-4 border-t border-white/5">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-500 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>로그아웃</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {activeTab === 'dashboard' && '대시보드'}
              {activeTab === 'cases' && '성공사례 관리'}
              {activeTab === 'lawyers' && '변호사 관리'}
              {activeTab === 'consultations' && '상담 신청 관리'}
              {activeTab === 'popups' && '팝업 관리'}
              {activeTab === 'reviews' && '고객 후기 관리'}
            </h2>
            <p className="text-slate-400">환영합니다, 관리자님.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="w-5 h-5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="검색..."
                className="bg-[#141b29] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-white focus:outline-none focus:border-red-500 transition-colors w-64"
              />
            </div>
            {activeTab === 'cases' && (
              <button 
                onClick={handleRestoreCases}
                className="bg-red-600/10 hover:bg-red-600/20 text-red-500 px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all border border-red-500/20 shadow-lg shadow-red-500/5 active:scale-95"
              >
                <RotateCcw className="w-5 h-5" />
                <span>기본 데이터 복원</span>
              </button>
            )}
            <button 
              onClick={() => {
                if (activeTab === 'cases') handleAddCase();
                if (activeTab === 'lawyers') handleAddLawyer();
                if (activeTab === 'popups') handleAddPopup();
                if (activeTab === 'reviews') handleAddReview();
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>추가하기</span>
            </button>
          </div>
        </header>

        {activeTab === 'dashboard' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-[#0a0f18] border border-white/5 p-6 rounded-2xl">
                <p className="text-slate-400 text-sm mb-1">총 성공사례</p>
                <h3 className="text-3xl font-bold text-white">{cases.length}건</h3>
                <div className="mt-4 text-green-500 text-sm flex items-center gap-1">
                  <span>+2 건</span>
                  <span className="text-slate-500">이번 달</span>
                </div>
              </div>

              <div className="bg-[#0a0f18] border border-white/5 p-6 rounded-2xl flex flex-col justify-between">
                <div>
                  <p className="text-slate-400 text-sm mb-1">데이터 관리</p>
                  <h3 className="text-xl font-bold text-white">성공사례 복원</h3>
                </div>
                <button 
                  onClick={handleRestoreCases}
                  className="mt-4 w-full bg-red-600/10 hover:bg-red-600/20 text-red-500 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all border border-red-500/20"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>13개 기본 사례 복원하기</span>
                </button>
              </div>
              <div className="bg-[#0a0f18] border border-white/5 p-6 rounded-2xl">
                <p className="text-slate-400 text-sm mb-1">소속 변호사</p>
                <h3 className="text-3xl font-bold text-white">{lawyersList.length}명</h3>
                <div className="mt-4 text-slate-500 text-sm">
                  전문 분야별 배치 완료
                </div>
              </div>
              <div 
                onClick={() => setActiveTab('consultations')}
                className="bg-[#0a0f18] border border-white/5 p-6 rounded-2xl cursor-pointer hover:border-red-500/30 transition-colors"
              >
                <p className="text-slate-400 text-sm mb-1">오늘의 상담 신청</p>
                <h3 className="text-3xl font-bold text-white">{consultations.filter(c => c.date === new Date().toISOString().split('T')[0]).length}건</h3>
                <div className="mt-4 text-red-500 text-sm flex items-center gap-1">
                  <span>미확인 {consultations.filter(c => c.status === 'new').length}건</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
              <div className="bg-[#0a0f18] border border-white/5 rounded-2xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="text-lg font-bold text-white">최근 상담 신청</h4>
                  <button onClick={() => setActiveTab('consultations')} className="text-red-500 text-sm hover:underline">전체보기</button>
                </div>
                <div className="space-y-4">
                  {consultations.slice(0, 3).map((consult) => (
                    <div key={consult.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                      <div>
                        <p className="text-white font-bold text-sm">{consult.name}</p>
                        <p className="text-slate-500 text-xs">{consult.phone}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-slate-400 text-xs">{consult.date}</p>
                        <p className="text-slate-500 text-[10px]">{consult.time}</p>
                      </div>
                    </div>
                  ))}
                  {consultations.length === 0 && (
                    <p className="text-slate-500 text-center py-4">최근 상담 신청이 없습니다.</p>
                  )}
                </div>
              </div>
              <div className="bg-[#0a0f18] border border-white/5 rounded-2xl p-6">
                <h4 className="text-lg font-bold text-white mb-6">시스템 알림</h4>
                <div className="space-y-4">
                  {consultations.filter(c => c.status === 'new').length > 0 ? (
                    <div className="flex gap-4 p-4 bg-red-500/5 border border-red-500/10 rounded-xl">
                      <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center shrink-0">
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                      </div>
                      <div>
                        <p className="text-white text-sm font-bold">미확인 상담 신청이 있습니다</p>
                        <p className="text-slate-400 text-xs mt-1">현재 {consultations.filter(c => c.status === 'new').length}건의 미확인 상담 신청이 있습니다.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-4 p-4 bg-green-500/5 border border-green-500/10 rounded-xl">
                      <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center shrink-0">
                        <Monitor className="w-5 h-5 text-green-500" />
                      </div>
                      <div>
                        <p className="text-white text-sm font-bold">모든 상담을 확인했습니다</p>
                        <p className="text-slate-400 text-xs mt-1">새로운 알림이 없습니다.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'cases' && (
          <div className="bg-[#0a0f18] border border-white/5 rounded-2xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 text-slate-400 text-sm uppercase tracking-wider">
                  <th className="px-6 py-4 font-semibold">ID</th>
                  <th className="px-6 py-4 font-semibold">순번</th>
                  <th className="px-6 py-4 font-semibold">구분</th>
                  <th className="px-6 py-4 font-semibold">제목</th>
                  <th className="px-6 py-4 font-semibold">결과</th>
                  <th className="px-6 py-4 font-semibold text-right">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {cases.map((item) => (
                  <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4 text-slate-400 font-mono text-sm">{item.id}</td>
                    <td className="px-6 py-4 font-bold text-red-500">{item.order || 0}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-red-500/10 text-red-500 text-xs font-bold rounded uppercase tracking-tighter">
                        {item.badge}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-white max-w-xs truncate">{item.title}</td>
                    <td className="px-6 py-4 text-slate-400 text-sm">{item.finalResult?.substring(0, 20)}...</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleEditCase(item)}
                          className="p-2 text-slate-500 hover:text-white transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteCase(item.id)}
                          className="p-2 text-slate-500 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'lawyers' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lawyersList.map((lawyer) => (
              <div key={lawyer.id} className="bg-[#0a0f18] border border-white/5 p-6 rounded-2xl group">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-xl bg-slate-800 overflow-hidden">
                    <img src={lawyer.image} alt={lawyer.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white">{lawyer.name}</h4>
                    <p className="text-red-500 text-sm font-medium">{lawyer.role}</p>
                  </div>
                </div>
                <div className="space-y-2 mb-6">
                  {lawyer.careers?.slice(0, 2).map((career: string, idx: number) => (
                    <p key={idx} className="text-slate-400 text-xs truncate">• {career}</p>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleEditLawyer(lawyer)}
                    className="flex-1 bg-white/5 hover:bg-white/10 text-white py-2 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    수정
                  </button>
                  <button 
                    onClick={() => handleDeleteLawyer(lawyer.id)}
                    className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        {activeTab === 'reviews' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((review) => (
                <div key={review.id} className="bg-[#0a0f18] border border-white/5 rounded-2xl overflow-hidden group">
                  <div className="aspect-video relative overflow-hidden bg-slate-800">
                    <img 
                      src={review.bg} 
                      alt="후기 배경" 
                      className="w-full h-full object-cover opacity-60"
                      onError={(e: any) => e.target.src = 'https://via.placeholder.com/400x250?text=No+Image'}
                    />
                    <div className="absolute inset-0 p-6 flex flex-col justify-between">
                      <div className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded w-fit">
                        최종결과: {review.result}
                      </div>
                      <p className="text-white text-sm font-medium line-clamp-4 italic">
                        "{review.text}"
                      </p>
                    </div>
                  </div>
                  <div className="p-4 flex justify-end gap-2 bg-white/5">
                    <button 
                      onClick={() => handleEditReview(review)}
                      className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteReview(review.id)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/5 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'consultations' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              {consultations.map((consult) => (
                <motion.div 
                  key={consult.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#0a0f18] border border-white/5 p-6 rounded-2xl hover:border-white/10 transition-colors"
                >
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-lg font-bold text-white">{consult.name}</span>
                        <span className="text-slate-500 text-sm">{consult.phone}</span>
                        {consult.status === 'new' && (
                          <span className="px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full uppercase">NEW</span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="w-3.5 h-3.5" />
                          <span>{consult.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{consult.time}</span>
                        </div>
                      </div>
                      <div className="bg-[#141b29] p-4 rounded-xl border border-white/5">
                        <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                          {consult.content}
                        </p>
                      </div>
                    </div>
                    <div className="flex md:flex-col justify-end gap-2 shrink-0">
                      {consult.status === 'new' && (
                        <button 
                          onClick={() => handleConfirmConsultation(consult.id)}
                          className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-sm font-bold rounded-lg transition-colors"
                        >
                          확인 완료
                        </button>
                      )}
                      <button 
                        onClick={() => handleDeleteConsultation(consult.id)}
                        className="px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white text-sm font-bold rounded-lg transition-colors"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
              {consultations.length === 0 && (
                <div className="text-center py-20 bg-[#0a0f18] rounded-3xl border border-white/5">
                  <MessageSquare className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                  <p className="text-slate-500">접수된 상담 신청이 없습니다.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'popups' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {popups.map((popup) => (
              <div key={popup.id} className="bg-[#0a0f18] border border-white/5 rounded-2xl overflow-hidden group">
                <div className="aspect-video relative overflow-hidden">
                  <img src={popup.imageUrl} alt={popup.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${popup.isActive ? 'bg-green-500 text-white' : 'bg-slate-600 text-white'}`}>
                      {popup.isActive ? '활성화' : '비활성화'}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="text-lg font-bold text-white mb-2">{popup.title}</h4>
                  <p className="text-slate-400 text-sm mb-6 line-clamp-2">{popup.content}</p>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleEditPopup(popup)}
                      className="flex-1 bg-white/5 hover:bg-white/10 text-white py-2 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2"
                    >
                      <Edit2 className="w-4 h-4" />
                      수정
                    </button>
                    <button 
                      onClick={() => handleTogglePopup(popup.id)}
                      className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${popup.isActive ? 'bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white' : 'bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white'}`}
                    >
                      {popup.isActive ? '비활성화' : '활성화'}
                    </button>
                    <button 
                      onClick={() => handleDeletePopup(popup.id)}
                      className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <button 
              onClick={handleAddPopup}
              className="border-2 border-dashed border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 text-slate-500 hover:border-red-500/30 hover:text-red-500 transition-all group"
            >
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-red-500/10 transition-colors">
                <Plus className="w-6 h-6" />
              </div>
              <span className="font-bold">새 팝업 추가</span>
            </button>
          </div>
        )}
      </main>

      {/* Popup Edit Modal */}
      <AnimatePresence>
        {isPopupModalOpen && editingPopup && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-5 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#0a0f18] border border-white/10 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Monitor className="w-5 h-5 text-red-500" />
                  팝업 설정
                </h3>
                <button onClick={() => setIsPopupModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <form onSubmit={handleSavePopup} className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2">팝업 제목</label>
                      <input 
                        type="text" 
                        value={editingPopup.title}
                        onChange={(e) => setEditingPopup({ ...editingPopup, title: e.target.value })}
                        className="w-full bg-[#141b29] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
                        placeholder="예: 24시간 긴급 상담 안내"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2">팝업 내용</label>
                      <textarea 
                        value={editingPopup.content}
                        onChange={(e) => setEditingPopup({ ...editingPopup, content: e.target.value })}
                        className="w-full bg-[#141b29] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors h-32 resize-none"
                        placeholder="팝업에 표시될 상세 내용을 입력하세요."
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">시작일</label>
                        <input 
                          type="date" 
                          value={editingPopup.startDate}
                          onChange={(e) => setEditingPopup({ ...editingPopup, startDate: e.target.value })}
                          className="w-full bg-[#141b29] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">종료일</label>
                        <input 
                          type="date" 
                          value={editingPopup.endDate}
                          onChange={(e) => setEditingPopup({ ...editingPopup, endDate: e.target.value })}
                          className="w-full bg-[#141b29] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2 flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <ImageIcon className="w-4 h-4" />
                          이미지 설정
                        </span>
                        <button 
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="text-xs text-red-500 hover:underline flex items-center gap-1"
                        >
                          <Upload className="w-3 h-3" />
                          파일 업로드
                        </button>
                      </label>
                      <input 
                        type="file" 
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        className="hidden"
                        accept="image/*"
                      />
                      <div className="mt-2 aspect-video rounded-xl bg-slate-800 overflow-hidden border border-white/5 relative">
                        <img src={editingPopup.imageUrl} alt="미리보기" className="w-full h-full object-cover" onError={(e: any) => e.target.src = 'https://via.placeholder.com/800x450?text=Invalid+Image+URL'} />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                          <Upload className="w-8 h-8 text-white" />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2 flex items-center gap-2">
                        <LinkIcon className="w-4 h-4" />
                        연결 링크
                      </label>
                      <input 
                        type="text" 
                        value={editingPopup.link}
                        onChange={(e) => setEditingPopup({ ...editingPopup, link: e.target.value })}
                        className="w-full bg-[#141b29] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
                        placeholder="예: /consultation"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                  <input 
                    type="checkbox" 
                    id="isActive"
                    checked={editingPopup.isActive}
                    onChange={(e) => setEditingPopup({ ...editingPopup, isActive: e.target.checked })}
                    className="w-5 h-5 accent-red-600"
                  />
                  <label htmlFor="isActive" className="text-white font-medium cursor-pointer">이 팝업을 즉시 활성화합니다.</label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsPopupModalOpen(false)}
                    className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-4 rounded-2xl transition-colors"
                  >
                    취소
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-2xl transition-colors shadow-lg shadow-red-600/20"
                  >
                    설정 저장하기
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Case Edit Modal */}
      <AnimatePresence>
        {isCaseModalOpen && editingCase && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-5 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#0a0f18] border border-white/10 rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
            >
              <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-red-500" />
                  성공사례 설정
                </h3>
                <button onClick={() => setIsCaseModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <form onSubmit={handleSaveCase} className="p-8 space-y-6 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">순번 (작을수록 앞)</label>
                        <input 
                          type="number" 
                          value={editingCase.order || 0}
                          onChange={(e) => setEditingCase({ ...editingCase, order: parseInt(e.target.value) || 0 })}
                          className="w-full bg-[#141b29] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">구분 (배지)</label>
                        <input 
                          type="text" 
                          value={editingCase.badge}
                          onChange={(e) => setEditingCase({ ...editingCase, badge: e.target.value })}
                          className="w-full bg-[#141b29] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
                          placeholder="예: 무죄, 집행유예"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">제목</label>
                        <input 
                          type="text" 
                          value={editingCase.title}
                          onChange={(e) => setEditingCase({ ...editingCase, title: e.target.value })}
                          className="w-full bg-[#141b29] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
                          placeholder="사례 제목"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2">사건 상황</label>
                      <textarea 
                        value={editingCase.situation || ''}
                        onChange={(e) => setEditingCase({ ...editingCase, situation: e.target.value })}
                        className="w-full bg-[#141b29] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors h-24 resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2">위기 상황</label>
                      <textarea 
                        value={editingCase.dangerSituation || ''}
                        onChange={(e) => setEditingCase({ ...editingCase, dangerSituation: e.target.value })}
                        className="w-full bg-[#141b29] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors h-24 resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2">핵심 쟁점</label>
                      <textarea 
                        value={editingCase.issue || (Array.isArray(editingCase.issues) ? editingCase.issues.join('\n') : editingCase.issues) || ''}
                        onChange={(e) => setEditingCase({ ...editingCase, issue: e.target.value, issues: e.target.value.split('\n').filter((s: string) => s.trim() !== '') })}
                        className="w-full bg-[#141b29] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors h-24 resize-none"
                        placeholder="한 줄에 하나씩 입력하세요"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2">대응 전략</label>
                      <textarea 
                        value={editingCase.strategy || (Array.isArray(editingCase.strategy) ? editingCase.strategy.join('\n') : editingCase.strategy) || ''}
                        onChange={(e) => setEditingCase({ ...editingCase, strategy: e.target.value })}
                        className="w-full bg-[#141b29] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors h-24 resize-none"
                        placeholder="한 줄에 하나씩 입력하세요"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2">결과 (요약)</label>
                      <textarea 
                        value={editingCase.result || ''}
                        onChange={(e) => setEditingCase({ ...editingCase, result: e.target.value })}
                        className="w-full bg-[#141b29] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors h-24 resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2">최종 결과 (상세)</label>
                      <textarea 
                        value={editingCase.finalResult || ''}
                        onChange={(e) => setEditingCase({ ...editingCase, finalResult: e.target.value })}
                        className="w-full bg-[#141b29] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors h-24 resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2 flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <ImageIcon className="w-4 h-4" />
                          대표 이미지 설정
                        </span>
                        <button 
                          type="button"
                          onClick={() => caseFileInputRef.current?.click()}
                          className="text-xs text-red-500 hover:underline flex items-center gap-1"
                        >
                          <Upload className="w-3 h-3" />
                          파일 업로드
                        </button>
                      </label>
                      <input 
                        type="file" 
                        ref={caseFileInputRef}
                        onChange={handleCaseImageUpload}
                        className="hidden"
                        accept="image/*"
                      />
                      {editingCase.image && (
                        <div className="mt-2 w-full h-32 rounded-xl bg-slate-800 overflow-hidden border border-white/5 relative">
                          <img src={editingCase.image} alt="미리보기" className="w-full h-full object-cover" onError={(e: any) => e.target.src = 'https://via.placeholder.com/400x250?text=No+Image'} />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer" onClick={() => caseFileInputRef.current?.click()}>
                            <Upload className="w-6 h-6 text-white" />
                          </div>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2 flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          결정문 이미지 추가
                        </span>
                        <button 
                          type="button"
                          onClick={() => documentImagesInputRef.current?.click()}
                          className="text-xs text-red-500 hover:underline flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          이미지 추가
                        </button>
                      </label>
                      <input 
                        type="file" 
                        ref={documentImagesInputRef}
                        onChange={handleDocumentImageUpload}
                        className="hidden"
                        accept="image/*"
                        multiple
                      />
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {editingCase.documentImages?.map((img: string, idx: number) => (
                          <div key={idx} className="relative aspect-[1/1.4] bg-slate-800 rounded-lg overflow-hidden border border-white/5 group">
                            <img src={img} alt={`결정문 ${idx + 1}`} className="w-full h-full object-cover" />
                            <button 
                              type="button"
                              onClick={() => handleRemoveDocumentImage(idx)}
                              className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2">강조 텍스트</label>
                      <input 
                        type="text" 
                        value={editingCase.highlightText}
                        onChange={(e) => setEditingCase({ ...editingCase, highlightText: e.target.value })}
                        className="w-full bg-[#141b29] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsCaseModalOpen(false)}
                    className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-4 rounded-2xl transition-colors"
                  >
                    취소
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-2xl transition-colors shadow-lg shadow-red-600/20"
                  >
                    저장하기
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Review Edit Modal */}
      <AnimatePresence>
        {isReviewModalOpen && editingReview && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-5 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#0a0f18] border border-white/10 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-red-500" />
                  고객 후기 설정
                </h3>
                <button onClick={() => setIsReviewModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <form onSubmit={handleSaveReview} className="p-8 space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">최종 결과 (배지)</label>
                    <input 
                      type="text" 
                      value={editingReview.result}
                      onChange={(e) => setEditingReview({ ...editingReview, result: e.target.value })}
                      className="w-full bg-[#141b29] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
                      placeholder="예: 무죄, 혐의없음"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">후기 내용</label>
                    <textarea 
                      value={editingReview.text}
                      onChange={(e) => setEditingReview({ ...editingReview, text: e.target.value })}
                      className="w-full bg-[#141b29] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors h-32 resize-none"
                      placeholder="고객의 후기 내용을 입력하세요"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2 flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <ImageIcon className="w-4 h-4" />
                        배경 이미지 설정
                      </span>
                      <button 
                        type="button"
                        onClick={() => reviewFileInputRef.current?.click()}
                        className="text-xs text-red-500 hover:underline flex items-center gap-1"
                      >
                        <Upload className="w-3 h-3" />
                        파일 업로드
                      </button>
                    </label>
                    <input 
                      type="file" 
                      ref={reviewFileInputRef}
                      onChange={handleReviewImageUpload}
                      className="hidden"
                      accept="image/*"
                    />
                    {editingReview.bg && (
                      <div className="mt-4 w-full h-40 rounded-xl bg-slate-800 overflow-hidden border border-white/5 relative">
                        <img src={editingReview.bg} alt="미리보기" className="w-full h-full object-cover opacity-60" onError={(e: any) => e.target.src = 'https://via.placeholder.com/400x250?text=No+Image'} />
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                          <div className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded mb-2">
                            최종결과: {editingReview.result}
                          </div>
                          <p className="text-white text-xs italic line-clamp-3">"{editingReview.text}"</p>
                        </div>
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer" onClick={() => reviewFileInputRef.current?.click()}>
                          <Upload className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsReviewModalOpen(false)}
                    className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-4 rounded-2xl transition-colors"
                  >
                    취소
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-2xl transition-colors shadow-lg shadow-red-600/20"
                  >
                    저장하기
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Lawyer Edit Modal */}
      <AnimatePresence>
        {isLawyerModalOpen && editingLawyer && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-5 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#0a0f18] border border-white/10 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-red-500" />
                  변호사 설정
                </h3>
                <button onClick={() => setIsLawyerModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <form onSubmit={handleSaveLawyer} className="p-8 space-y-6 overflow-y-auto max-h-[70vh]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2">이름</label>
                      <input 
                        type="text" 
                        value={editingLawyer.name}
                        onChange={(e) => setEditingLawyer({ ...editingLawyer, name: e.target.value })}
                        className="w-full bg-[#141b29] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2">직함</label>
                      <input 
                        type="text" 
                        value={editingLawyer.role}
                        onChange={(e) => setEditingLawyer({ ...editingLawyer, role: e.target.value })}
                        className="w-full bg-[#141b29] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2">전문 분야</label>
                      <input 
                        type="text" 
                        value={editingLawyer.field}
                        onChange={(e) => setEditingLawyer({ ...editingLawyer, field: e.target.value })}
                        className="w-full bg-[#141b29] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2 flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <ImageIcon className="w-4 h-4" />
                          이미지 설정
                        </span>
                        <button 
                          type="button"
                          onClick={() => lawyerFileInputRef.current?.click()}
                          className="text-xs text-red-500 hover:underline flex items-center gap-1"
                        >
                          <Upload className="w-3 h-3" />
                          파일 업로드
                        </button>
                      </label>
                      <input 
                        type="file" 
                        ref={lawyerFileInputRef}
                        onChange={handleLawyerImageUpload}
                        className="hidden"
                        accept="image/*"
                      />
                      <div className="mt-2 w-24 h-32 rounded-xl bg-slate-800 overflow-hidden border border-white/5 relative mx-auto">
                        <img src={editingLawyer.image} alt="미리보기" className="w-full h-full object-cover" onError={(e: any) => e.target.src = 'https://via.placeholder.com/300x400?text=No+Image'} />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer" onClick={() => lawyerFileInputRef.current?.click()}>
                          <Upload className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2">자격/인증</label>
                      <input 
                        type="text" 
                        value={editingLawyer.cert}
                        onChange={(e) => setEditingLawyer({ ...editingLawyer, cert: e.target.value })}
                        className="w-full bg-[#141b29] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-4">
                    <label className="block text-sm font-medium text-slate-400">주요 이력</label>
                    <button 
                      type="button"
                      onClick={handleAddCareer}
                      className="text-xs bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white px-2 py-1 rounded transition-colors flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      추가
                    </button>
                  </div>
                  <div className="space-y-3">
                    {editingLawyer.careers?.map((career: string, idx: number) => (
                      <div key={idx} className="flex gap-2">
                        <input 
                          type="text" 
                          value={career}
                          onChange={(e) => handleUpdateCareer(idx, e.target.value)}
                          className="flex-1 bg-[#141b29] border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-red-500 transition-colors"
                          placeholder="이력 내용을 입력하세요"
                        />
                        <button 
                          type="button"
                          onClick={() => handleRemoveCareer(idx)}
                          className="p-2 text-slate-500 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    {(!editingLawyer.careers || editingLawyer.careers.length === 0) && (
                      <p className="text-center text-slate-500 text-sm py-4 bg-white/5 rounded-xl border border-dashed border-white/10">
                        등록된 이력이 없습니다.
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsLawyerModalOpen(false)}
                    className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-4 rounded-2xl transition-colors"
                  >
                    취소
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-2xl transition-colors shadow-lg shadow-red-600/20"
                  >
                    저장하기
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
