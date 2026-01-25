
import React, { useState } from 'react';

const DeveloperStory: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="max-w-4xl mx-auto px-4 mb-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className={`group relative overflow-hidden transition-all duration-700 cursor-pointer rounded-[3rem] border ${
          isExpanded 
          ? 'bg-[#0a0a14] border-white/20 p-12 shadow-2xl' 
          : 'bg-white/5 border-white/10 p-8 hover:bg-white/10 shadow-lg'
        }`}
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 blur-3xl rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-600/10 blur-3xl rounded-full"></div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform duration-500">
                ✍️
              </div>
              <div>
                <h3 className="text-2xl font-black text-white">قصة الحلم</h3>
                <p className="text-[10px] text-indigo-400 font-black uppercase tracking-[0.3em]">A Journey of Sacrifice</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
               {!isExpanded && <span className="text-xs text-slate-500 font-bold ml-2">اضغط لقراءة الحكاية</span>}
               <div className={`w-8 h-8 rounded-full flex items-center justify-center border border-white/10 transition-transform duration-500 ${isExpanded ? 'rotate-180 bg-white/10' : ''}`}>
                 <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                 </svg>
               </div>
            </div>
          </div>

          <div className={`transition-all duration-700 overflow-hidden ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-24 opacity-60'}`}>
            <div className="space-y-6 text-right">
              <p className="text-xl md:text-2xl font-bold text-white leading-relaxed italic">
                "ما كان مجرد تطبيق.. كان حلم تقيل اتحملته خطوة خطوة"
              </p>
              
              <div className="space-y-5 text-slate-300 text-lg leading-relaxed font-medium">
                <p>الفكرة بدأت كتطبيق تحليل فني يشتغل عبر الذكاء الاصطناعي، يقرأ الشارت ويفهم حركة السوق ويعطي قرارات مبنية على تحليل حقيقي ما على الحظ.</p>
                
                <p>مع الوقت اكتشفت ان الطريق ما ساهل، كل مرحلة كانت محتاجة تكلفة وتجربة واعادة ومحاولات فاشلة قبل ما تنجح. سيرفرات، اشتراكات، ادوات تطوير، اختبارات مستمرة وتعديلات ما بتنتهي.</p>
                
                <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] my-8 relative group">
                   <div className="absolute -top-4 -right-4 bg-indigo-600 text-white px-6 py-2 rounded-full text-xs font-black shadow-xl">التكلفة الحقيقية</div>
                   <p className="text-white text-xl font-black">التكلفة تراكمت لحدي ما وصلت حوالي <span className="text-indigo-400 text-3xl">36,000,000</span> جنيه سوداني.</p>
                   <p className="mt-4 text-slate-400">مبلغ كبير في ظروف صعبة لكنه كان الثمن الحقيقي للحلم.</p>
                </div>

                <p className="text-white font-bold text-xl border-r-4 border-rose-500 pr-6">في لحظة صعبة اضطررت ابيع العربية.. ما كانت عربية وبس كانت تعب سنين واحساس بالامان، لكن اخترت اكمل الطريق وما اوقف.</p>

                <p>مرت علي ايام شك وتعب وضغط نفسي، ايام افكر اوقف وكل شي يقول لي كفاية.. لكن كل مرة التطبيق يتحسن وكل مرة التحليل يكون ادق، كنت اعرف اني ماشي في الاتجاه الصح.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6">
                   <div className="bg-black/40 p-6 rounded-3xl border border-white/5 italic text-sm text-slate-400">
                      "الناس شافت تطبيق.. لكن ما شافت التعب ورا الشاشة، ما شافت السهر والخوف والخسارة."
                   </div>
                   <div className="bg-black/40 p-6 rounded-3xl border border-white/5 italic text-sm text-slate-400">
                      "التطبيق دا ما اتبنى بالمال فقط، اتبنى بالصبر والايمان والعناد.. بقرار اني ما استسلم."
                   </div>
                </div>

                <p className="text-2xl font-black text-white pt-6 border-t border-white/10 flex items-center gap-4">
                   <span className="text-rose-500 animate-pulse">❤️</span>
                   اليوم لما اشوفه شغال، اعرف ان الثمن كان كبير.. لكن الحلم كان اكبر.
                </p>
                
                <div className="pt-4 flex flex-col items-start">
                   <span className="text-indigo-400 font-black text-lg">شكراً لكم،</span>
                   <span className="text-slate-500 font-bold">مازن حسين - المطور</span>
                </div>
              </div>
            </div>
          </div>
          
          {!isExpanded && (
             <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#020205] to-transparent"></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeveloperStory;
