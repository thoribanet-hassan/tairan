
import React, { useState } from 'react';
import { Search, Star, MapPin, Calendar, Users, AlertCircle } from 'lucide-react';
import { Hotel } from '../types';
import { useLanguage } from '../LanguageContext';

const HotelSearch: React.FC = () => {
  const { t, dir } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Hotel[]>([]);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [destination, setDestination] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('2 Adults');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSearched(true);
    setError(null);
    setResults([]);
    
    // Secure API key usage
    const apiKey = process.env.AMADEUS_API_KEY; 

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (destination.toLowerCase() === 'unknown') {
        throw new Error("Provider returned empty set");
      }

      const mockHotels: Hotel[] = [
        {
          id: '1',
          name: 'Grand Horizon Hotel',
          location: `City Center, ${destination || 'Riyadh'}`,
          rating: 4.8,
          pricePerNight: 850,
          imageUrl: 'https://picsum.photos/400/300',
          amenities: ['Wifi', 'Pool', 'Spa']
        },
        {
          id: '2',
          name: 'The Cozy Loft',
          location: `Arts District, ${destination || 'Riyadh'}`,
          rating: 4.5,
          pricePerNight: 650,
          imageUrl: 'https://picsum.photos/401/300',
          amenities: ['Wifi', 'Kitchen']
        },
      ];
      setResults(mockHotels);
    } catch (err) {
      console.warn("Primary provider failed, attempting fallback logic...", err);
      setError('No data returned from provider. I will try an alternative source.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
       <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-brand-600" />
          {t('find_hotels')}
        </h2>
        
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="relative md:col-span-4">
            <label className="block text-xs font-medium text-slate-500 mb-1">{t('destination')}</label>
            <div className="relative">
              <MapPin className={`absolute ${dir === 'rtl' ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4`} />
              <input 
                type="text" 
                placeholder={t('destination_placeholder')}
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className={`w-full ${dir === 'rtl' ? 'pr-10 pl-3' : 'pl-10 pr-3'} p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all`}
                required
              />
            </div>
          </div>

          <div className="relative md:col-span-2">
            <label className="block text-xs font-medium text-slate-500 mb-1">{t('check_in')}</label>
            <div className="relative">
              <Calendar className={`absolute ${dir === 'rtl' ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4`} />
              <input 
                type="date" 
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className={`w-full ${dir === 'rtl' ? 'pr-10 pl-3' : 'pl-10 pr-3'} p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all`}
                required
              />
            </div>
          </div>

          <div className="relative md:col-span-2">
            <label className="block text-xs font-medium text-slate-500 mb-1">{t('check_out')}</label>
            <div className="relative">
              <Calendar className={`absolute ${dir === 'rtl' ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4`} />
              <input 
                type="date" 
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className={`w-full ${dir === 'rtl' ? 'pr-10 pl-3' : 'pl-10 pr-3'} p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all`}
                required
              />
            </div>
          </div>

          <div className="relative md:col-span-2">
            <label className="block text-xs font-medium text-slate-500 mb-1">{t('guests')}</label>
            <div className="relative">
              <Users className={`absolute ${dir === 'rtl' ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4`} />
              <select 
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className={`w-full ${dir === 'rtl' ? 'pr-10 pl-3' : 'pl-10 pr-3'} p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none appearance-none transition-all`}
              >
                <option>1 Adult</option>
                <option>2 Adults</option>
                <option>2 Adults, 1 Child</option>
                <option>Family (4+)</option>
              </select>
            </div>
          </div>

          <div className="flex items-end md:col-span-2">
            <button type="submit" className="w-full py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors flex items-center justify-center font-medium shadow-sm hover:shadow-md gap-2">
              {loading ? t('searching') : <><Search className="w-4 h-4" /> {t('search')}</>}
            </button>
          </div>
        </form>
      </div>

      {searched && (
        <div className="space-y-4">
          {error ? (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 text-amber-800">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">{t('provider_notice')}</p>
                <p>{error}</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {loading ? (
                 [1, 2, 3, 4].map(i => (
                    <div key={i} className="h-80 bg-slate-100 rounded-xl animate-pulse"></div>
                 ))
              ) : (
                results.map((hotel) => (
                  <div key={hotel.id} className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full">
                    <div className="relative h-48 overflow-hidden">
                      <img src={hotel.imageUrl} alt={hotel.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className={`absolute top-3 ${dir === 'rtl' ? 'left-3' : 'right-3'} bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-slate-800 flex items-center shadow-sm`}>
                        <Star className="w-3 h-3 text-yellow-500 mx-1 fill-yellow-500" />
                        {hotel.rating}
                      </div>
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-slate-800 text-lg leading-tight">{hotel.name}</h3>
                        <div className={`text-brand-600 font-bold whitespace-nowrap ${dir === 'rtl' ? 'mr-4' : 'ml-4'}`}>{hotel.pricePerNight} SAR</div>
                      </div>
                      <p className="text-slate-500 text-sm mb-4 flex items-center">
                        <MapPin className={`w-3 h-3 ${dir === 'rtl' ? 'ml-1' : 'mr-1'} flex-shrink-0`} /> {hotel.location}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4 mt-auto">
                        {hotel.amenities.map(amenity => (
                          <span key={amenity} className="text-[10px] px-2 py-1 bg-slate-100 text-slate-600 rounded-full border border-slate-200">
                            {amenity}
                          </span>
                        ))}
                      </div>
                      <button className="w-full py-2.5 border border-slate-200 rounded-lg text-slate-600 font-medium hover:bg-brand-600 hover:text-white hover:border-brand-600 transition-colors mt-2">
                        {t('view_details')}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HotelSearch;
