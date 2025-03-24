import React, { useEffect, useState } from 'react';
import { Search, RefreshCw, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchCryptoData, fetchCryptoNews } from './api';
import { CryptoCard } from './components/CryptoCard';
import { NewsCard } from './components/NewsCard';
import { Crypto, CryptoNews } from './types';

function App() {
  const [cryptos, setCryptos] = useState<Crypto[]>([]);
  const [news, setNews] = useState<CryptoNews[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchData = async () => {
    setUpdating(true);
    setError(null);
    try {
      const [cryptoData, newsData] = await Promise.all([
        fetchCryptoData(),
        fetchCryptoNews(),
      ]);
      setCryptos(cryptoData);
      setNews(newsData);
      setLastUpdate(new Date());
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao buscar dados';
      setError(message);
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
      setUpdating(false);
    }
  };

  const fetchCryptoOnly = async () => {
    setUpdating(true);
    try {
      const cryptoData = await fetchCryptoData();
      setCryptos(cryptoData);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error fetching crypto data:', error);
      setError('Erro ao buscar dados da criptomoeda. Por favor, tente novamente mais tarde.');
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    fetchData(); // Busca inicial de tudo
    
    // Atualiza cripto a cada 15 segundos
    const cryptoInterval = setInterval(fetchCryptoOnly, 15000);
    
    // Atualiza notícias a cada 5 minutos
    const newsInterval = setInterval(fetchData, 100000);
    
    return () => {
      clearInterval(cryptoInterval);
      clearInterval(newsInterval);
    };
  }, []);

  const filteredCryptos = cryptos.filter(
    crypto =>
      crypto.name.toLowerCase().includes(search.toLowerCase()) ||
      crypto.symbol.toLowerCase().includes(search.toLowerCase())
  );

  const topCryptos = cryptos.slice(0, 6);
  const topNews = news.slice(0, 6); // Pegando as 3 principais notícias

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <header className="mb-6 sm:mb-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-500 to-green-500 text-transparent bg-clip-text">
              CryptoVision
            </h1>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
              <button
                onClick={fetchData}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500/20 text-purple-500 hover:bg-purple-500/30 transition-all ${
                  updating ? 'animate-pulse' : ''
                }`}
                disabled={updating}
              >
                <RefreshCw className={`w-4 h-4 ${updating ? 'animate-spin' : ''}`} />
                Atualizar
              </button>
              <span className="text-sm text-gray-400">
                Última atualização: {lastUpdate.toLocaleTimeString()}
              </span>
            </div>
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

        {error && (
          <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500">
            <p>{error}</p>
          </div>
        )}

        <div className="space-y-12">
          {/* Seção de Top Criptomoedas */}
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Top Criptomoedas</h2>
              <button
                onClick={() => navigate('/all')}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500/20 text-purple-500 hover:bg-purple-500/30 transition-all"
              >
                Ver todas
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="animate-pulse bg-white/5 rounded-xl h-[200px]" />
                ))
              ) : (
                topCryptos.map(crypto => (
                  <CryptoCard key={crypto.id} crypto={crypto} />
                ))
              )}
            </div>
          </section>

          {/* Seção de Notícias */}
          <section>
            <h2 className="text-2xl font-semibold mb-6">Últimas Notícias</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="animate-pulse bg-white/5 rounded-xl h-[300px]" />
                ))
              ) : (
                topNews.map(news => (
                  <NewsCard key={news.url} news={news} />
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default App;