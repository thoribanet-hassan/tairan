
import React from 'react';
import { Plane, Hotel, Map, MessageSquare, Compass } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate }) => {
  const { t, language, setLanguage } = useLanguage();

  const navItems = [
    { id: 'dashboard', label: 'explore', icon: Compass },
    { id: 'chat', label: 'ai_assistant', icon: MessageSquare },
    { id: 'flights', label: 'flights', icon: Plane },
    { id: 'hotels', label: 'hotels', icon: Hotel },
    { id: 'itinerary', label: 'itinerary', icon: Map },
  ];

  return (
    <div className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 h-screen sticky top-0">
      <div className="p-6 flex items-center justify-between border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
            <Plane className="text-white w-5 h-5 transform -rotate-45 rtl:rotate-45" />
          </div>
          <span className="text-xl font-bold text-slate-800">{t('app_name')}</span>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                isActive 
                  ? 'bg-brand-50 text-brand-700' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-brand-600' : 'text-slate-400'}`} />
              <span className={`font-medium ${isActive ? 'font-semibold' : ''}`}>{t(item.label as any)}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-100 space-y-4">
        
        {/* Language Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button 
            onClick={() => setLanguage('ar')}
            className={`flex-1 flex items-center justify-center py-1.5 rounded-md text-sm font-medium transition-all ${language === 'ar' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <span className="mr-1">🇸🇦</span> العربية
          </button>
          <button 
            onClick={() => setLanguage('en')}
            className={`flex-1 flex items-center justify-center py-1.5 rounded-md text-sm font-medium transition-all ${language === 'en' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <span className="mr-1">🇺🇸</span> En
          </button>
        </div>

        <div className="bg-slate-50 rounded-xl p-4">
          <p className="text-xs font-medium text-slate-500 uppercase mb-2">{t('pro_tip')}</p>
          <p className="text-sm text-slate-600">
            {t('pro_tip_content')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
