export interface Crypto {
  id: string;
  rank: string;
  symbol: string;
  name: string;
  priceUsd: string;
  changePercent24Hr: string;
  volumeUsd24Hr: string;
  highDay?: string;
  lowDay?: string;
  trades24h?: string;
}

export interface CryptoNews {
  title: string;
  url: string;
  imageurl: string;
  categories: string;
  sentiment: 'positive' | 'negative' | 'neutral';
}