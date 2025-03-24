import React, { useEffect, useState } from 'react';
import { Search, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchCryptoData } from '../api';
import { CryptoCard } from '../components/CryptoCard';
import { Crypto } from '../types';

export function AllCryptos() {
  const [cryptos, setCryptos] = useState<Crypto[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchCryptoData();
        setCryptos(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredCryptos = cryptos.filter(
    crypto =>
      crypto.name.toLowerCase().includes(search.toLowerCase()) ||
      crypto.symbol.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <header className="mb-6 sm:mb-12">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-3xl sm:text-4xl font-bold">
              Todas as Criptomoedas
            </h1>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar criptomoeda..."
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 p-4">
          {loading ? (
            Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-white/5 rounded-xl h-[200px]" />
            ))
          ) : (
            filteredCryptos.map(crypto => (
              <CryptoCard key={crypto.id} crypto={crypto} />
            ))
          )}
        </div>
      </div>
    </div>
  );
} 