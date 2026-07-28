import React, { useState } from 'react';
import {
  ShoppingBag,
  Search,
  Star,
  Download,
  CheckCircle2,
  Tag,
  Filter,
  Plus,
  Bot,
  Brain,
  ShieldAlert,
  Cpu,
  Layers,
  Sparkles
} from 'lucide-react';
import { MarketplaceItem } from '../types';

interface MarketplaceProps {
  items: MarketplaceItem[];
  onInstallItem: (item: MarketplaceItem) => void;
  onPublishNewItem: (item: Partial<MarketplaceItem>) => void;
}

export const Marketplace: React.FC<MarketplaceProps> = ({
  items,
  onInstallItem,
  onPublishNewItem,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [installedMap, setInstalledMap] = useState<Record<string, boolean>>({});
  const [showPublishModal, setShowPublishModal] = useState(false);

  // New Item Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<MarketplaceItem['category']>('AI Models');
  const [newDesc, setNewDesc] = useState('');
  const [newPrice, setNewPrice] = useState(0);

  const categories = ['All', 'Robots', 'AI Models', 'Mission Templates', 'Plugins', 'ROS Packages', 'Extensions'];

  const filteredItems = items.filter((item) => {
    const matchCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchSearch;
  });

  const handleInstall = (item: MarketplaceItem) => {
    setInstalledMap((prev) => ({ ...prev, [item.id]: true }));
    onInstallItem(item);
  };

  const handlePublish = () => {
    if (!newTitle.trim()) return;
    onPublishNewItem({
      title: newTitle,
      category: newCategory,
      description: newDesc,
      priceUSD: Number(newPrice),
      isFree: Number(newPrice) === 0,
      author: 'Dr. Rajesh Subramanian',
      downloads: 1,
      rating: 5.0,
      tags: [newCategory, 'RoboAssistOS'],
      version: 'v1.0.0',
      verified: true,
      iconName: 'Sparkles',
    });
    setShowPublishModal(false);
    setNewTitle('');
    setNewDesc('');
  };

  return (
    <div className="space-y-8">
      
      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-sky-500/30 p-6 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3.5 rounded-2xl bg-sky-500/20 text-sky-400 border border-sky-500/40">
            <ShoppingBag className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-mono text-white flex items-center space-x-2">
              <span>ROBOTICS & AI MARKETPLACE</span>
              <span className="px-2.5 py-0.5 text-[10px] bg-sky-500/20 text-sky-300 border border-sky-500/30 rounded-full font-sans">
                Verified Packages
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Discover, install, and publish pre-trained AI models, ROS2 packages, mission templates, & hardware extensions.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowPublishModal(true)}
          className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-mono text-xs font-bold shadow-lg shadow-sky-500/25 hover:scale-105 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Publish to Marketplace</span>
        </button>
      </div>

      {/* Search & Category Filter */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search AI models, ROS packages..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 font-mono"
          />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all ${
                selectedCategory === cat
                  ? 'bg-sky-500 text-white font-bold shadow-md shadow-sky-500/30'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => {
          const isInstalled = installedMap[item.id];
          return (
            <div
              key={item.id}
              className="bg-slate-900/80 border border-sky-500/20 rounded-2xl p-6 flex flex-col justify-between hover:border-sky-500/50 hover:bg-slate-900 transition-all space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold bg-sky-500/10 text-sky-400 border border-sky-500/30 rounded-md">
                    {item.category}
                  </span>
                  <div className="flex items-center space-x-1 text-amber-400 text-xs font-mono">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{item.rating}</span>
                  </div>
                </div>

                <h3 className="text-base font-bold font-mono text-white mb-1">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-3">{item.description}</p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {item.tags.map((t) => (
                    <span key={t} className="px-2 py-0.5 text-[9px] font-mono bg-slate-950 text-slate-400 rounded">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
                <div>
                  <span className="text-slate-500 block text-[10px]">Author: {item.author}</span>
                  <span className="text-emerald-400 font-bold">
                    {item.isFree ? 'FREE' : `$${item.priceUSD}`}
                  </span>
                </div>

                <button
                  onClick={() => handleInstall(item)}
                  disabled={isInstalled}
                  className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                    isInstalled
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-sky-600 hover:bg-sky-500 text-white shadow-lg shadow-sky-500/20'
                  }`}
                >
                  {isInstalled ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>INSTALLED</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5" />
                      <span>INSTALL</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Publish Modal */}
      {showPublishModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-sky-500/30 p-6 rounded-2xl max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold font-mono text-white">Publish Package to Marketplace</h3>
            
            <div className="space-y-3 text-xs font-mono">
              <div>
                <label className="block text-slate-400 mb-1">Package Title:</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. YOLOv11 Hazardous Leak Sensor"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Category:</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                >
                  {['Robots', 'AI Models', 'Mission Templates', 'Plugins', 'ROS Packages', 'Extensions'].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Price (USD) - 0 for Free:</label>
                <input
                  type="number"
                  value={newPrice}
                  onChange={(e) => setNewPrice(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Description:</label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <button
                onClick={() => setShowPublishModal(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-mono"
              >
                Cancel
              </button>
              <button
                onClick={handlePublish}
                className="px-5 py-2 bg-sky-500 hover:bg-sky-400 text-white font-mono text-xs font-bold rounded-xl shadow-lg shadow-sky-500/25"
              >
                Publish Now
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
