
import React, { useState } from 'react';
import { Search, Calendar, MapPin, Clock, DollarSign, ArrowRight } from 'lucide-react';
import { Flight } from '../types';
import { useLanguage } from '../LanguageContext';

const FlightSearch: React.FC = () => {
  const { t, dir } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Flight[]>([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSearched(true);
    
    setTimeout(() => {
      const mockFlights: Flight[] = [
        {
          id: '1',
          airline: 'SkyWings',
          flightNumber: 'SW101',
          departure: { city: 'Riyadh', code: 'RUH', time: '08:00 AM' },
          arrival: { city: 'London', code: 'LHR', time: '02:00 PM' },
          price: 1680,
          duration: '7h 00m'
        },
        {
          id: '2',
          airline: 'OceanAir',
          flightNumber: 'OA420',
          departure: { city: 'Riyadh', code: 'RUH', time: '10:30 AM' },
          arrival: { city: 'London', code: 'LHR', time: '04:45 PM' },
          price: 1950,
          duration: '7h 15m'
        },
      ];
      setResults(mockFlights);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-brand-600" />
          {t('search_flights')}
        </h2>
        
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <label className="block text-xs font-medium text-slate-500 mb-1">{t('from')}</label>
            <input type="text" placeholder="RUH" defaultValue="RUH" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none" />
          </div>
          <div className="relative">
            <label className="block text-xs font-medium text-slate-500 mb-1">{t('to')}</label>
            <input type="text" placeholder="LHR" defaultValue="LHR" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none" />
          </div>
          <div className="relative">
            <label className="block text-xs font-medium text-slate-500 mb-1">{t('date')}</label>
            <input type="date" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none" />
          </div>
          <div className="flex items-end">
            <button type="submit" className="w-full py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors flex items-center justify-center font-medium gap-2">
              {loading ? t('searching') : <><Search className="w-4 h-4" /> {t('find_flights_btn')}</>}
            </button>
          </div>
        </form>
      </div>

      {searched && (
        <div className="space-y-4">
          <h3 className="font-semibold text-slate-700">{t('results')}</h3>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-slate-100 rounded-xl animate-pulse"></div>
              ))}
            </div>
          ) : results.length > 0 ? (
            <div className="grid gap-4">
              {results.map((flight) => (
                <div key={flight.id} className="bg-white p-5 rounded-xl border border-slate-200 hover:border-brand-300 hover:shadow-md transition-all group cursor-pointer">
                  <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-4 w-full md:w-auto">
                      <div className="w-12 h-12 bg-brand-50 rounded-full flex items-center justify-center text-brand-600 font-bold text-xs">
                        {flight.airline.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-slate-800">{flight.airline}</div>
                        <div className="text-xs text-slate-500">{flight.flightNumber}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-8 flex-1 justify-center">
                      <div className="text-center">
                        <div className="text-lg font-bold text-slate-800">{flight.departure.time}</div>
                        <div className="text-xs text-slate-500">{flight.departure.code}</div>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="text-[10px] text-slate-400 mb-1">{flight.duration}</div>
                        <div className="w-24 h-[1px] bg-slate-300 relative">
                          <div className={`absolute top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full bg-slate-300 ${dir === 'rtl' ? 'right-1/2 translate-x-1/2' : 'left-1/2 -translate-x-1/2'}`}></div>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-slate-800">{flight.arrival.time}</div>
                        <div className="text-xs text-slate-500">{flight.arrival.code}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                      <div className="text-end">
                        <div className="text-2xl font-bold text-slate-900">{flight.price} SAR</div>
                        <div className="text-xs text-slate-500">{t('per_traveler')}</div>
                      </div>
                      <button className="p-2 rounded-full bg-slate-50 text-slate-400 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                        <ArrowRight className={`w-5 h-5 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-slate-500">{t('no_flights')}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default FlightSearch;
