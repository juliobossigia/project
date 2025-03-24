import React from 'react';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { Crypto } from '../types';

interface Props {
  crypto: Crypto;
}

export function CryptoCard({ crypto }: Props) {
  const priceChange = parseFloat(crypto.changePercent24Hr);
  const formattedPrice = parseFloat(crypto.priceUsd).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  
  // Formatação melhorada para o volume
  const formatVolume = (volumeStr: string) => {
    const volume = parseFloat(volumeStr || '0');
    if (isNaN(volume)) return 'N/A';
    
    if (volume >= 1e9) {
      return `$${(volume / 1e9).toFixed(2)}B`;
    } else if (volume >= 1e6) {
      return `$${(volume / 1e6).toFixed(2)}M`;
    } else if (volume >= 1e3) {
      return `$${(volume / 1e3).toFixed(2)}K`;
    } else {
      return `$${volume.toFixed(2)}`;
    }
  };
  
  const formattedVolume = formatVolume(crypto.volumeUsd24Hr);

  return (
    <div className="relative bg-[#111111] rounded-xl overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(107,70,193,0.3)]">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 via-blue-500/5 to-green-500/5" />
      <div className="relative p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/5 rounded-lg">
              <Activity className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">{crypto.name}</h3>
              <p className="text-sm text-gray-400">{crypto.symbol}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-medium text-white">{formattedPrice}</p>
            <div
              className={`flex items-center space-x-1 ${
                priceChange >= 0 ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {priceChange >= 0 ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span className="text-sm font-medium">
                {Math.abs(priceChange).toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
        <div className="pt-4 border-t border-white/10">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">24h Volume</span>
            <span className="text-white font-medium">{formattedVolume}</span>
          </div>
          <div className="flex justify-between text-sm mt-2">
            <span className="text-gray-400">Rank</span>
            <span className="text-white font-medium">#{crypto.rank}</span>
          </div>
        </div>
      </div>
    </div>
  );
}