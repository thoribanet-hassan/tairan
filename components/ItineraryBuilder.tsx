
import React, { useState } from 'react';
import { generateItinerary } from '../services/geminiService';
import { Itinerary } from '../types';
import { Map, Calendar, Loader2, Sparkles, Clock, Navigation } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

const ItineraryBuilder: React.FC = () => {
  const { t, language, dir } = useLanguage();
  const [destination, setDestination] = useState('');
  const [days, setDays] = useState(3);
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);

  const handleGenerate = async () => {
    if (!destination) return;
    setLoading(true);
    try {
      const data = await generateItinerary(destination, days, language);
      setItinerary(data);
    } catch (e) {
      alert("Failed to generate itinerary. Please check your connection and API limits.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="bg-gradient-to-r from-brand-600 to-brand-800 p-8 rounded-2xl text-white shadow-lg relative overflow-hidden shrink-0">
        <div className={`absolute top-0 ${dir === 'rtl' ? 'left-0' : 'right-0'} w-64 h-64 bg-white opacity-5 rounded-full transform ${dir === 'rtl' ? '-translate-x-1/2' : 'translate-x-1/2'} -translate-y-1/2`}></div>
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-yellow-300" />
            {t('ai_planner')}
          </h2>
          <p className="text-brand-100 mb-6 max-w-lg">
            {t('planner_desc')}
          </p>
          
          <div className="bg-white/10 backdrop-blur-md p-1 rounded-xl flex flex-col md:flex-row gap-2">
            <div className="flex-1 relative">
                <Map className={`absolute ${dir === 'rtl' ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-brand-200 w-5 h-5`} />
                <input 
                  type="text" 
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder={t('where_to')}
                  className={`w-full bg-transparent border-none text-white placeholder-brand-200 focus:ring-0 ${dir === 'rtl' ? 'pr-10' : 'pl-10'} py-3`}
                />
            </div>
            <div className="w-px bg-brand-400 hidden md:block"></div>
            <div className="relative md:w-48">
                <Calendar className={`absolute ${dir === 'rtl' ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-brand-200 w-5 h-5`} />
                <select 
                  value={days}
                  onChange={(e) => setDays(Number(e.target.value))}
                  className={`w-full bg-transparent border-none text-white focus:ring-0 ${dir === 'rtl' ? 'pr-10' : 'pl-10'} py-3 appearance-none cursor-pointer [&>option]:text-slate-800`}
                >
                  <option value={1}>{t('days_1')}</option>
                  <option value={3}>{t('days_3')}</option>
                  <option value={5}>{t('days_5')}</option>
                  <option value={7}>{t('days_7')}</option>
                </select>
            </div>
            <button 
              onClick={handleGenerate}
              disabled={loading || !destination}
              className="bg-white text-brand-700 font-bold px-6 py-3 rounded-lg hover:bg-brand-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center whitespace-nowrap"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : t('generate_plan')}
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {itinerary && (
          <div className="space-y-6 pb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h1 className="text-3xl font-bold text-slate-800 mb-2">{itinerary.destination}</h1>
                <p className="text-slate-500 mb-4">{itinerary.duration} • AI Curated</p>
                <p className={`text-lg text-slate-700 italic border-brand-500 ${dir === 'rtl' ? 'border-r-4 pr-4 rounded-l-lg' : 'border-l-4 pl-4 rounded-r-lg'} py-1 bg-slate-50`}>
                    {itinerary.summary}
                </p>
            </div>

            <div className="space-y-6">
              {itinerary.days.map((day) => (
                <div key={day.day} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                  <div className="bg-slate-50 p-4 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold text-slate-800 flex items-center gap-3">
                        <span className="w-8 h-8 bg-brand-600 text-white rounded-lg flex items-center justify-center">
                            {day.day}
                        </span>
                        {t('day')} {day.day}: {day.theme}
                    </h3>
                  </div>
                  <div className="p-4">
                    <div className={`space-y-6 relative before:absolute ${dir === 'rtl' ? 'before:right-2 pr-8' : 'before:left-2 pl-8'} before:top-2 before:bottom-2 before:w-px before:bg-slate-200`}>
                        {day.activities.map((activity, idx) => (
                            <div key={idx} className="relative">
                                <div className={`absolute ${dir === 'rtl' ? '-right-[29px]' : '-left-[29px]'} top-1 w-3 h-3 rounded-full bg-brand-400 border-2 border-white ring-1 ring-slate-100`}></div>
                                <div className="flex flex-col sm:flex-row gap-1 sm:gap-4 mb-1">
                                    <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2 py-1 rounded w-fit h-fit flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {activity.time}
                                    </span>
                                    {activity.location && (
                                        <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                                            <Navigation className="w-3 h-3" />
                                            {activity.location}
                                        </span>
                                    )}
                                </div>
                                <p className="text-slate-700">{activity.description}</p>
                            </div>
                        ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {!itinerary && !loading && (
            <div className="h-64 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl">
                <Map className="w-12 h-12 mb-3 opacity-20" />
                <p>{t('empty_state')}</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default ItineraryBuilder;
