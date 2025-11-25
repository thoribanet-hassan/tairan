
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import FlightSearch from './components/FlightSearch';
import HotelSearch from './components/HotelSearch';
import ItineraryBuilder from './components/ItineraryBuilder';
import { Compass, ExternalLink, Menu } from 'lucide-react';
import { LanguageProvider, useLanguage } from './LanguageContext';

// Main App Component wrapped in Provider
const App: React.FC = () => {
  return (
    <LanguageProvider>
      <MainLayout />
    </LanguageProvider>
  );
};

const MainLayout: React.FC = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const { dir } = useLanguage();

  const renderView = () => {
    switch (currentView) {
      case 'chat':
        return <ChatInterface />;
      case 'flights':
        return <FlightSearch />;
      case 'hotels':
        return <HotelSearch />;
      case 'itinerary':
        return <ItineraryBuilder />;
      case 'dashboard':
      default:
        return <Dashboard onNavigate={setCurrentView} />;
    }
  };

  // Chat and Itinerary need a full height container without parent scrolling
  const isFixedView = ['chat', 'itinerary'].includes(currentView);

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden" dir={dir}>
      <Sidebar currentView={currentView} onNavigate={setCurrentView} />
      
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full relative overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200 flex-shrink-0 z-10">
           <div className="font-bold text-xl text-slate-800">Safar</div>
           <button className="text-brand-600">
             <Menu className="w-6 h-6" />
           </button>
        </header>
        
        {/* View Container */}
        <div className="flex-1 overflow-hidden relative w-full h-full">
            {isFixedView ? (
               <div className="w-full h-full p-0 md:p-8 overflow-hidden">
                 {renderView()}
               </div>
            ) : (
               <div className="w-full h-full overflow-y-auto p-4 md:p-8 scrollbar-hide">
                 {renderView()}
               </div>
            )}
        </div>
      </main>
    </div>
  );
};

// Translated Dashboard Component
const Dashboard: React.FC<{ onNavigate: (view: string) => void }> = ({ onNavigate }) => {
  const { t, dir } = useLanguage();

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="relative bg-slate-900 rounded-3xl p-8 md:p-12 text-white overflow-hidden shadow-2xl">
        <img 
          src="https://picsum.photos/1200/400" 
          alt="Travel Background" 
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">{t('dashboard_title')}</h1>
          <p className="text-lg text-slate-200 mb-8">
            {t('dashboard_subtitle')}
          </p>
          <button 
            onClick={() => onNavigate('itinerary')}
            className="bg-brand-500 hover:bg-brand-600 text-white px-8 py-3 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg shadow-brand-500/30"
          >
            {t('start_planning')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div 
          onClick={() => onNavigate('flights')}
          className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">{t('find_flights')}</h3>
          <p className="text-sm text-slate-500">{t('find_flights_desc')}</p>
        </div>

        <div 
          onClick={() => onNavigate('hotels')}
          className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-orange-100 transition-colors">
            <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">{t('book_stays')}</h3>
          <p className="text-sm text-slate-500">{t('book_stays_desc')}</p>
        </div>

        <div 
           onClick={() => onNavigate('chat')}
           className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-100 transition-colors">
            <Compass className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">{t('ai_assistant')}</h3>
          <p className="text-sm text-slate-500">{t('ai_assistant_desc')}</p>
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-slate-100 to-white rounded-2xl p-6 border border-slate-200">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
                <h3 className="font-bold text-slate-800">{t('popular_destinations')}</h3>
                <p className="text-sm text-slate-500">{t('based_on_trends')}</p>
            </div>
            <button className="text-brand-600 text-sm font-bold flex items-center hover:underline gap-1">
                {t('view_all')} <ExternalLink className={`w-3 h-3 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
            </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {['Kyoto', 'Santorini', 'Cape Town', 'Banff'].map((city, i) => (
                <div key={city} className="relative h-32 rounded-xl overflow-hidden cursor-pointer group">
                    <img src={`https://picsum.photos/300/200?random=${i}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={city} />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors"></div>
                    <span className={`absolute bottom-3 ${dir === 'rtl' ? 'right-3' : 'left-3'} text-white font-bold`}>{city}</span>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default App;
