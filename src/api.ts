import axios from 'axios';
import { Crypto, CryptoNews } from './types';

const BINANCE_API = 'https://api.binance.com/api/v3';
const CRYPTOCOMPARE_API = 'https://min-api.cryptocompare.com/data/v2';

const api = axios.create({
  timeout: 5000,
  headers: {
    'Accept': 'application/json',
  }
});

export async function fetchCryptoData(): Promise<Crypto[]> {
  try {
    const [tickerResponse, priceResponse] = await Promise.all([
      api.get(`${BINANCE_API}/ticker/24hr`),
      api.get(`${BINANCE_API}/ticker/price`)
    ]);

    // Primeiro, processamos os dados básicos
    let processedData = tickerResponse.data
      .filter((ticker: any) => ticker.symbol.endsWith('USDT'))
      .map((ticker: any) => ({
        id: ticker.symbol.replace('USDT', '').toLowerCase(),
        symbol: ticker.symbol.replace('USDT', ''),
        name: ticker.symbol.replace('USDT', ''),
        priceUsd: ticker.lastPrice,
        changePercent24Hr: ticker.priceChangePercent,
        volumeUsd24Hr: ticker.quoteVolume || ticker.volume,
        highDay: ticker.highPrice,
        lowDay: ticker.lowPrice,
        trades24h: ticker.count
      }));
      
    // Ordenamos por volume (do maior para o menor)
    processedData.sort((a: Crypto, b: Crypto) => {
      const volumeA = parseFloat(a.volumeUsd24Hr || '0');
      const volumeB = parseFloat(b.volumeUsd24Hr || '0');
      return volumeB - volumeA;
    });
    
    // Atribuímos o rank com base na posição após a ordenação
    processedData = processedData.map((crypto: Crypto, index: number) => ({
      ...crypto,
      rank: (index + 1).toString()
    }));
    
    // Pegamos as 100 primeiras criptos
    return processedData.slice(0, 100);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ERR_NETWORK') {
        throw new Error('Não foi possível conectar ao servidor. Verifique sua conexão.');
      }
    }
    throw error;
  }
}

export async function fetchCryptoNews(): Promise<CryptoNews[]> {
  const response = await axios.get(
    `${CRYPTOCOMPARE_API}/news/?categories=BTC,ETH&excludeCategories=Sponsored`
  );
  return response.data.Data.map((news: any) => ({
    ...news,
    sentiment: analyzeSentiment(news.title),
  }));
}

function analyzeSentiment(title: string): 'positive' | 'negative' | 'neutral' {
  const keywords = {
    positive: ['surge', 'bull', 'adopt', 'grow', 'gain', 'high', 'up'],
    negative: ['crash', 'bear', 'hack', 'ban', 'drop', 'low', 'down'],
  };

  const lowerTitle = title.toLowerCase();
  const hasPositive = keywords.positive.some(word => lowerTitle.includes(word));
  const hasNegative = keywords.negative.some(word => lowerTitle.includes(word));

  if (hasPositive && !hasNegative) return 'positive';
  if (hasNegative && !hasPositive) return 'negative';
  return 'neutral';
}