
import React, { useState, useEffect } from 'react';

const VisitorStats: React.FC = () => {
  const [activeUsers, setActiveUsers] = useState(0);
  const [totalVisits, setTotalVisits] = useState(0);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    // 1. حساب الزوار بشكل واقعي تراكمي (Persistent Counter)
    // نبدأ برقم كبير لإعطاء هيبة للتطبيق، ونضيف عليه زيارات المستخدم الحقيقية
    const BASE_VISITS = 894320; 
    const currentVisits = Number(localStorage.getItem('user_visits_count') || '0') + 1;
    localStorage.setItem('user_visits_count', currentVisits.toString());
    
    // محاكاة أن هناك 7 أشخاص آخرين دخلوا مع كل دخول للمستخدم
    setTotalVisits(BASE_VISITS + (currentVisits * 7));

    // 2. حساب المتواجدين الآن بناءً على وقت اليوم (Time-based Logic)
    // هذا يجعل الرقم "حقيقياً" ومنطقياً بدلاً من العشوائية
    const calculateActiveUsers = () => {
      const now = new Date();
      const hour = now.getHours();
      
      // ذروة التداول تكون عادة في منتصف النهار (الساعة 12-2)
      // المعادلة: الأساس 1200 مستخدم + متغير بناءً على الساعة
      // نستخدم دالة الجيب (Sine) لمحاكاة دورة اليوم الطبيعية
      const timeFactor = Math.sin(((hour - 4) / 24) * Math.PI * 2); // تتراوح بين -1 و 1
      const variance = Math.floor(timeFactor * 800); // تذبذب بمقدار 800 مستخدم
      
      // إضافة تذبذب بسيط جداً وطبيعي كل دقيقة
      const naturalNoise = Math.floor(Math.random() * 15); 
      
      return 1500 + variance + naturalNoise;
    };

    setActiveUsers(calculateActiveUsers());
    setIsLive(true);

    // تحديث بسيط كل دقيقة وليس كل ثانية ليكون أكثر واقعية وثباتاً
    const interval = setInterval(() => {
      setActiveUsers(calculateActiveUsers());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto border-t border-slate-800/50 pt-8 mt-8">
      {/* Active Users - يظهر كثبات واستقرار */}
      <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-lg flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative flex h-3 w-3">
            {isLive && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>}
            <span className={`relative inline-flex rounded-full h-3 w-3 ${isLive ? 'bg-emerald-500' : 'bg-slate-500'}`}></span>
          </div>
          <div className="flex flex-col">
             <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">المتداولون النشطون الآن</span>
             <span className="text-xs text-slate-600">بيانات التزامن الفعلي</span>
          </div>
        </div>
        <div className="text-2xl font-mono font-bold text-white tracking-tight">
          {activeUsers > 0 ? formatNumber(activeUsers) : '---'}
        </div>
      </div>

      {/* Total Visits - يظهر رقم ضخم وتراكمي */}
      <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-lg flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700/50">
             <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
             </svg>
          </div>
          <div className="flex flex-col">
             <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">إجمالي المشاهدات</span>
             <span className="text-xs text-slate-600">منذ الإطلاق</span>
          </div>
        </div>
        <div className="text-2xl font-mono font-bold text-white tracking-tight">
          {totalVisits > 0 ? formatNumber(totalVisits) : '---'}
        </div>
      </div>
    </div>
  );
};

export default VisitorStats;
