import React from 'react';
import { CryptoNews } from '../types';
import { MessageCircle } from 'lucide-react';

interface Props {
  news: CryptoNews;
}

export function NewsCard({ news }: Props) {
  const sentimentColor = {
    positive: 'bg-green-500/20 text-green-500',
    negative: 'bg-red-500/20 text-red-500',
    neutral: 'bg-blue-500/20 text-blue-500',
  }[news.sentiment];

  return (
    <a
      href={news.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-[#111111] rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(107,70,193,0.3)]"
    >
      <div className="relative h-48">
        <img
          src={news.imageurl || 'https://images.unsplash.com/photo-1621761191319-c6fb62004040'}
          alt={news.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
      </div>
      <div className="p-4 space-y-3">
        <div className="flex items-center space-x-2">
          <MessageCircle className="w-4 h-4 text-purple-500" />
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${sentimentColor}`}>
            {news.sentiment}
          </span>
        </div>
        <h3 className="text-white font-medium line-clamp-2">{news.title}</h3>
        <p className="text-sm text-gray-400">{news.categories}</p>
      </div>
    </a>
  );
}