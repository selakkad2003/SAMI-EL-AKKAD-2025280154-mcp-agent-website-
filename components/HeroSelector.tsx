
import React, { useState, useMemo } from 'react';
import { Hero } from '../types';
import { HEROES } from '../constants';
import { Globe, Map as MapIcon, RotateCcw, Search, Star } from 'lucide-react';

interface HeroSelectorProps {
  onSelect: (hero: Hero) => void;
  favoriteHeroes: string[];
  onToggleFavorite: (heroId: string) => void;
}

// 1. REGIONS (Broad Categories)
const REGIONS: Record<string, string[]> = {
  "Americas": ["Americas", "Arctic", "Brazil", "Caribbean"],
  "Europe": ["Europe", "Greece", "Norse", "Celtic", "Slavic", "Literature"],
  "Africa": ["Africa", "Egypt"],
  "Asia": ["China", "India", "Japan", "Vietnam", "Philippines", "Middle East", "Persia"],
  "Oceania": ["Australia", "Polynesia"],
  "Future": ["Future"]
};

// 2. SPECIFIC CULTURE COORDINATES (For Flags on the Map)
const CULTURE_POINTS: Record<string, {x: number, y: number, region: string, flag: string}> = {
  // Americas
  "Arctic": { x: 150, y: 80, region: "Americas", flag: "🇬🇱" },
  "Americas": { x: 120, y: 160, region: "Americas", flag: "🌎" }, // General/Native
  "Caribbean": { x: 190, y: 230, region: "Americas", flag: "🇭🇹" },
  "Brazil": { x: 220, y: 350, region: "Americas", flag: "🇧🇷" },
  
  // Europe
  "Norse": { x: 430, y: 70, region: "Europe", flag: "🇳🇴" },
  "Celtic": { x: 390, y: 110, region: "Europe", flag: "🇮🇪" },
  "Europe": { x: 415, y: 135, region: "Europe", flag: "🇬🇧" }, // Arthurian
  "Slavic": { x: 480, y: 110, region: "Europe", flag: "🇷🇺" },
  "Greece": { x: 460, y: 155, region: "Europe", flag: "🇬🇷" },
  "Literature": { x: 380, y: 95, region: "Europe", flag: "📚" }, 

  // Africa
  "Egypt": { x: 480, y: 210, region: "Africa", flag: "🇪🇬" },
  "Africa": { x: 430, y: 300, region: "Africa", flag: "🇬🇭" },

  // Asia
  "Middle East": { x: 530, y: 190, region: "Asia", flag: "🇮🇶" },
  "Persia": { x: 560, y: 170, region: "Asia", flag: "🇮🇷" },
  "India": { x: 600, y: 220, region: "Asia", flag: "🇮🇳" },
  "China": { x: 680, y: 160, region: "Asia", flag: "🇨🇳" },
  "Vietnam": { x: 690, y: 210, region: "Asia", flag: "🇻🇳" },
  "Japan": { x: 780, y: 160, region: "Asia", flag: "🇯🇵" },
  "Philippines": { x: 740, y: 230, region: "Asia", flag: "🇵🇭" },

  // Oceania
  "Polynesia": { x: 820, y: 300, region: "Oceania", flag: "🌺" },
  "Australia": { x: 720, y: 350, region: "Oceania", flag: "🇦🇺" },

  // Future
  "Future": { x: 900, y: 80, region: "Future", flag: "🤖" }
};

const REGION_COLORS: Record<string, string> = {
  "Americas": "text-emerald-400 fill-emerald-500/10 hover:fill-emerald-500/30 stroke-emerald-400",
  "Europe": "text-indigo-400 fill-indigo-500/10 hover:fill-indigo-500/30 stroke-indigo-400",
  "Africa": "text-amber-400 fill-amber-500/10 hover:fill-amber-500/30 stroke-amber-400",
  "Asia": "text-rose-400 fill-rose-500/10 hover:fill-rose-500/30 stroke-rose-400",
  "Oceania": "text-cyan-400 fill-cyan-500/10 hover:fill-cyan-500/30 stroke-cyan-400",
  "Future": "text-fuchsia-400 fill-fuchsia-500/10 hover:fill-fuchsia-500/30 stroke-fuchsia-400"
};

// Zoom Targets (Focus Points)
const VIEW_TARGETS: Record<string, { x: number, y: number, zoom: number }> = {
  "All": { x: 500, y: 260, zoom: 1 },
  "Americas": { x: 200, y: 250, zoom: 2.3 },
  "Europe": { x: 430, y: 120, zoom: 3 },
  "Africa": { x: 450, y: 300, zoom: 2.5 },
  "Asia": { x: 660, y: 190, zoom: 2.2 },
  "Oceania": { x: 750, y: 350, zoom: 2.5 },
  "Future": { x: 900, y: 80, zoom: 5 }
};

const HeroSelector: React.FC<HeroSelectorProps> = ({ onSelect, favoriteHeroes, onToggleFavorite }) => {
  const [mapFilter, setMapFilter] = useState<string>('All'); // 'All' | RegionName | CultureName | 'Favorites'
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [hoveredCulture, setHoveredCulture] = useState<string | null>(null);

  // Filter Logic
  const filteredHeroes = useMemo(() => {
    if (searchTerm) {
      const lowerCaseSearch = searchTerm.toLowerCase();
      return HEROES.filter(h => 
        h.name.toLowerCase().includes(lowerCaseSearch) ||
        h.role.toLowerCase().includes(lowerCaseSearch) ||
        h.culture.toLowerCase().includes(lowerCaseSearch)
      );
    }
    if (mapFilter === 'Favorites') {
      return HEROES.filter(h => favoriteHeroes.includes(h.id));
    }
    if (mapFilter === 'All') return HEROES;
    if (REGIONS[mapFilter]) {
        return HEROES.filter(h => REGIONS[mapFilter].includes(h.culture));
    }
    return HEROES.filter(h => h.culture === mapFilter);
  }, [searchTerm, mapFilter, favoriteHeroes]);

  // Calculate View State
  const activeRegionName = REGIONS[mapFilter] ? mapFilter : (CULTURE_POINTS[mapFilter]?.region || 'All');
  const target = VIEW_TARGETS[activeRegionName] || VIEW_TARGETS['All'];
  
  // Calculate dynamic flag scale
  const flagScale = Math.max(0.4, 1 / Math.pow(target.zoom, 0.8)); 

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (e.target.value) {
      setMapFilter('All');
    }
  };
  
  const handleRegionClick = (region: string) => {
      setMapFilter(region);
      setSearchTerm('');
  };

  const handleCultureClick = (culture: string, e: React.MouseEvent) => {
      e.stopPropagation(); 
      setMapFilter(culture);
      setSearchTerm('');
  };
  
  const handleReset = () => {
      setMapFilter('All');
      setSearchTerm('');
  };

  const mapTransformStyle: React.CSSProperties = {
      transform: `translate(${500 - target.x * target.zoom}px, ${260 - target.y * target.zoom}px) scale(${target.zoom})`,
      transition: 'transform 1000ms cubic-bezier(0.34, 1.56, 0.64, 1)', 
      transformOrigin: '0 0'
  };

  // SVG Paths
  const MapPaths = () => (
    <svg viewBox="0 0 1000 520" className="w-full h-full drop-shadow-2xl filter select-none overflow-visible">
      <defs>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <radialGradient id="oceanGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stopColor="#1e3a8a" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Background Ocean (Decorative) */}
      <circle cx="500" cy="260" r="450" fill="url(#oceanGradient)" className="opacity-50" />

      {/* Main Zoom Group */}
      <g style={mapTransformStyle}>
          
          {/* AMERICAS */}
          <g 
            className={`cursor-pointer transition-all duration-500 ${activeRegionName === 'Americas' ? 'opacity-100' : 'opacity-60 hover:opacity-80'}`}
            onClick={() => handleRegionClick('Americas')}
          >
            <path 
              d="M 150,60 C 100,60 50,100 80,150 C 60,180 100,250 120,280 C 130,300 160,320 180,420 C 200,480 260,450 280,380 C 290,320 220,280 200,260 C 250,220 300,180 280,120 C 260,80 200,60 150,60 Z" 
              vectorEffect="non-scaling-stroke"
              className={`stroke-[2] transition-colors duration-500 ${REGION_COLORS['Americas']} ${activeRegionName === 'Americas' ? 'fill-emerald-500/30 stroke-emerald-300 filter drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]' : ''}`} 
            />
          </g>

          {/* EUROPE */}
          <g 
            className={`cursor-pointer transition-all duration-500 ${activeRegionName === 'Europe' ? 'opacity-100' : 'opacity-60 hover:opacity-80'}`}
            onClick={() => handleRegionClick('Europe')}
          >
            <path 
              d="M 420,80 C 380,80 380,120 390,150 C 400,180 450,180 480,170 C 500,160 520,120 500,90 C 480,60 440,60 420,80 Z" 
              vectorEffect="non-scaling-stroke"
              className={`stroke-[2] transition-colors duration-500 ${REGION_COLORS['Europe']} ${activeRegionName === 'Europe' ? 'fill-indigo-500/30 stroke-indigo-300 filter drop-shadow-[0_0_10px_rgba(99,102,241,0.5)]' : ''}`}
            />
          </g>

          {/* AFRICA */}
          <g 
            className={`cursor-pointer transition-all duration-500 ${activeRegionName === 'Africa' ? 'opacity-100' : 'opacity-60 hover:opacity-80'}`}
            onClick={() => handleRegionClick('Africa')}
          >
            <path 
              d="M 420,200 C 400,200 380,240 390,280 C 400,350 450,420 480,400 C 520,380 540,300 520,240 C 500,200 460,200 420,200 Z" 
              vectorEffect="non-scaling-stroke"
              className={`stroke-[2] transition-colors duration-500 ${REGION_COLORS['Africa']} ${activeRegionName === 'Africa' ? 'fill-amber-500/30 stroke-amber-300 filter drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]' : ''}`}
            />
          </g>

          {/* ASIA */}
          <g 
            className={`cursor-pointer transition-all duration-500 ${activeRegionName === 'Asia' ? 'opacity-100' : 'opacity-60 hover:opacity-80'}`}
            onClick={() => handleRegionClick('Asia')}
          >
            <path 
              d="M 540,80 C 520,100 520,150 540,200 C 550,240 600,280 650,260 C 700,250 800,200 820,150 C 840,100 750,50 650,60 C 600,60 560,70 540,80 Z" 
              vectorEffect="non-scaling-stroke"
              className={`stroke-[2] transition-colors duration-500 ${REGION_COLORS['Asia']} ${activeRegionName === 'Asia' ? 'fill-rose-500/30 stroke-rose-300 filter drop-shadow-[0_0_10px_rgba(244,63,94,0.5)]' : ''}`}
            />
          </g>

          {/* OCEANIA */}
          <g 
            className={`cursor-pointer transition-all duration-500 ${activeRegionName === 'Oceania' ? 'opacity-100' : 'opacity-60 hover:opacity-80'}`}
            onClick={() => handleRegionClick('Oceania')}
          >
            <path 
              d="M 680,300 C 660,300 650,340 660,380 C 680,420 750,400 780,380 C 800,350 750,300 680,300 Z M 820,320 C 810,320 810,340 820,340 C 840,340 840,320 820,320 Z" 
              vectorEffect="non-scaling-stroke"
              className={`stroke-[2] transition-colors duration-500 ${REGION_COLORS['Oceania']} ${activeRegionName === 'Oceania' ? 'fill-cyan-500/30 stroke-cyan-300 filter drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]' : ''}`}
            />
          </g>

          {/* FUTURE (MOON) */}
          <g 
            className={`cursor-pointer transition-all duration-500 ${activeRegionName === 'Future' ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}
            onClick={() => handleRegionClick('Future')}
          >
            <circle 
              cx="900" cy="80" r="40" 
              vectorEffect="non-scaling-stroke"
              className={`stroke-[2] transition-colors duration-500 ${REGION_COLORS['Future']} ${activeRegionName === 'Future' ? 'fill-fuchsia-500/30 stroke-fuchsia-300 filter drop-shadow-[0_0_15px_rgba(217,70,239,0.6)]' : ''}`}
            />
            <circle cx="890" cy="70" r="8" className="fill-black/10" />
            <circle cx="915" cy="90" r="5" className="fill-black/10" />
          </g>

          {/* --- CULTURE FLAGS (Top Layer) --- */}
          {Object.entries(CULTURE_POINTS).map(([culture, coords]) => {
              const isSelected = mapFilter === culture;
              const isRegionActive = activeRegionName === coords.region;
              const isHovered = hoveredCulture === culture;
              
              const currentScale = (isSelected ? 1.4 : isHovered ? 1.2 : 1.0) * flagScale;

              return (
                <g 
                    key={culture} 
                    onClick={(e) => handleCultureClick(culture, e)}
                    onMouseEnter={() => setHoveredCulture(culture)}
                    onMouseLeave={() => setHoveredCulture(null)}
                    className={`cursor-pointer group`}
                    style={{ 
                        transformOrigin: `${coords.x}px ${coords.y}px`,
                        transform: `scale(${currentScale})`,
                        transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)' 
                    }}
                >
                    {(isSelected || isHovered || isRegionActive) && (
                         <circle cx={coords.x} cy={coords.y} r="20" className="fill-white/20 filter blur-md" />
                    )}
                    
                    <text
                        x={coords.x} 
                        y={coords.y + 7} 
                        textAnchor="middle"
                        className={`
                            text-2xl select-none transition-all duration-300
                            ${isSelected ? 'animate-bounce-slow drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]' : 'drop-shadow-md'}
                            ${!isRegionActive && !isSelected && !isHovered ? 'opacity-60 grayscale-[50%]' : 'opacity-100'}
                        `}
                        style={{ fontSize: '24px' }}
                    >
                        {coords.flag}
                    </text>
                    
                    <g 
                        className={`transition-all duration-300 ${isSelected || isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}
                        style={{ transform: `scale(${1 / flagScale})`, transformOrigin: `${coords.x}px ${coords.y - 45}px` }} 
                    >
                         <rect x={coords.x - 50} y={coords.y - 50} width="100" height="28" rx="14" className="fill-black/80 stroke-white/30 stroke-1 shadow-xl backdrop-blur-sm" />
                         <text x={coords.x} y={coords.y - 32} textAnchor="middle" className="fill-white text-[12px] font-bold uppercase tracking-wider">
                             {culture}
                         </text>
                         <line x1={coords.x} y1={coords.y - 22} x2={coords.x} y2={coords.y - 10} className="stroke-white/50" />
                    </g>
                </g>
              );
          })}
      </g>
    </svg>
  );

  const activeFlag = mapFilter !== 'Favorites' ? CULTURE_POINTS[mapFilter]?.flag : null;
  let gridTitle: string;
  if (searchTerm) {
      gridTitle = `Search Results`;
  } else if (mapFilter === 'Favorites') {
      gridTitle = 'Your Favorite Heroes';
  } else if (mapFilter === 'All') {
      gridTitle = 'Select a Hero';
  } else {
      gridTitle = `${mapFilter} Heroes`;
  }
  

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 animate-fade-in pb-20">
      
      {/* Title Section */}
      <div className="text-center mb-6 relative">
        <h2 className="text-4xl md:text-6xl font-bold mb-2 hero-font text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 drop-shadow-sm">
          Choose Your Realm
        </h2>
        <p className="text-purple-200/70 text-lg font-medium">
          Search or navigate the map to discover legendary mentors.
        </p>
      </div>

      {/* SEARCH BAR */}
      <div className="w-full max-w-2xl mx-auto mb-8 relative">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-purple-300/50 pointer-events-none" size={20} />
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search by name, role, or culture..."
            className="w-full bg-black/30 border-2 border-white/10 rounded-full py-4 pl-14 pr-6 text-white text-lg placeholder-white/30 focus:outline-none focus:border-purple-400 focus:bg-black/40 transition-all shadow-lg"
          />
      </div>


      {/* MAP SECTION */}
      {mapFilter !== 'Favorites' && !searchTerm && (
        <div className="w-full max-w-5xl mx-auto mb-8 relative z-10">
            <div className="bg-gradient-to-b from-[#1a103c]/90 to-[#2d1b69]/90 rounded-[2rem] border border-white/20 p-2 shadow-2xl backdrop-blur-xl relative overflow-hidden group h-[300px] md:h-[500px]">
               <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
               
               <MapPaths />
               
               {(mapFilter !== 'All' || searchTerm) && (
                   <button 
                      onClick={handleReset}
                      className="absolute top-6 right-6 bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 backdrop-blur-md transition-all border border-white/20 shadow-lg z-20 hover:scale-105 active:scale-95"
                   >
                      <RotateCcw size={14} /> Reset View
                   </button>
               )}
               
               <div className="absolute bottom-6 left-8 pointer-events-none opacity-50 text-xs font-mono text-white hidden md:block">
                  INTERACTIVE ATLAS // CLICK REGIONS TO EXPLORE
               </div>
            </div>
        </div>
      )}

      {/* FILTER BAR - Hidden when searching for simplicity */}
      {!searchTerm && (
        <div className="mb-10 max-w-6xl mx-auto">
            <div className="flex flex-wrap items-center justify-center gap-2 p-4 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm shadow-inner">
              <button
                  onClick={() => setMapFilter('All')}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition-all border ${
                      mapFilter === 'All' 
                      ? 'bg-white text-purple-900 border-white shadow-lg scale-105' 
                      : 'bg-transparent text-white/60 border-transparent hover:bg-white/10'
                  }`}
              >
                  All Legends
              </button>
              <button
                  onClick={() => setMapFilter('Favorites')}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition-all border flex items-center gap-2 ${
                      mapFilter === 'Favorites' 
                      ? 'bg-yellow-400 text-black border-yellow-300 shadow-lg scale-105' 
                      : 'bg-transparent text-white/60 border-transparent hover:bg-white/10'
                  }`}
              >
                  <Star size={14} /> Favorites ({favoriteHeroes.length})
              </button>
              {Object.keys(CULTURE_POINTS).sort().map(culture => (
                  <button
                      key={culture}
                      onClick={() => setMapFilter(culture)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all border flex items-center gap-1 ${
                          mapFilter === culture
                          ? 'bg-purple-500 text-white border-purple-400 shadow-md scale-105'
                          : 'bg-white/5 text-white/50 border-white/5 hover:bg-white/10 hover:text-white/80'
                      }`}
                  >
                      <span className="text-base">{CULTURE_POINTS[culture].flag}</span>
                      {culture}
                  </button>
              ))}
            </div>
        </div>
      )}

      {/* HEROES GRID */}
      <div className="flex items-center gap-3 mb-8 px-4">
         <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
         <span className="text-2xl font-bold text-white uppercase tracking-widest flex items-center gap-2">
             {mapFilter === 'Favorites' 
                ? <Star size={20} className="text-yellow-400" /> 
                : activeFlag && !searchTerm 
                    ? <span className="text-3xl drop-shadow-md">{activeFlag}</span> 
                    : <MapIcon size={20} className="text-purple-400" />}
             {gridTitle}
             <span className="text-sm bg-white/10 px-2 py-0.5 rounded-full text-white/50 ml-2">
                {filteredHeroes.length}
             </span>
         </span>
         <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredHeroes.map((hero) => {
            const heroFlag = CULTURE_POINTS[hero.culture]?.flag;
            const isFavorite = favoriteHeroes.includes(hero.id);
            
            return (
              <div
                key={hero.id}
                onClick={() => onSelect(hero)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    onSelect(hero);
                  }
                }}
                role="button"
                tabIndex={0}
                className={`group relative overflow-hidden rounded-3xl transition-all duration-500 hover:transform hover:-translate-y-2 hover:shadow-2xl text-left h-full border-2 border-transparent hover:border-white/20 animate-fade-in cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500/50`}
              >
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(hero.id);
                    }}
                    className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/30 hover:bg-black/50 transition-colors backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
                    aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                    <Star size={20} className={`transition-all ${isFavorite ? 'text-yellow-400 fill-yellow-400' : 'text-white/60 hover:text-white'}`} />
                </button>

                <div className={`absolute inset-0 bg-gradient-to-br ${hero.bgGradient} opacity-90 group-hover:opacity-100 transition-opacity`} />
                
                <div className="relative z-10 p-6 flex flex-col h-full">
                    
                    <div className="flex justify-between items-start mb-4">
                        <span className="bg-black/20 backdrop-blur-md text-white/90 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                            {heroFlag ? <span className="text-base leading-none drop-shadow-sm">{heroFlag}</span> : <Globe size={12} />}
                            {hero.culture}
                        </span>
                    </div>

                    {/* REVERTED TO EMOJI AVATAR */}
                    <div className="flex justify-center mb-6">
                        <div className="relative w-32 h-32 rounded-full border-4 border-white/20 shadow-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 bg-black/20">
                            <span className="text-6xl drop-shadow-lg">{hero.emoji}</span>
                        </div>
                    </div>
                    
                    <div className="mt-auto text-center">
                        <h3 className="text-2xl font-bold text-white mb-1 hero-font shadow-black drop-shadow-md">{hero.name}</h3>
                        <p className="text-white/80 text-sm font-semibold uppercase tracking-wider mb-3">{hero.role}</p>
                        <div className="bg-black/10 rounded-xl p-3 backdrop-blur-sm">
                            <p className="text-white/90 text-sm leading-snug line-clamp-3">
                                "{hero.description}"
                            </p>
                        </div>
                    </div>
                    
                    <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors pointer-events-none" />
                </div>
              </div>
            );
        })}
        
        {/* Empty State */}
        {filteredHeroes.length === 0 && (
            <div className="col-span-full py-20 text-center flex flex-col items-center justify-center opacity-50">
               {mapFilter === 'Favorites' ? (
                   <>
                     <Star size={48} className="mb-4 text-white" />
                     <p className="text-xl text-white font-bold">No Favorite Heroes Yet.</p>
                     <p className="text-sm text-white/70">Click the star icon on any hero to add them here!</p>
                   </>
               ) : (
                   <>
                     <Search size={48} className="mb-4 text-white" />
                     <p className="text-xl text-white font-bold">No heroes found.</p>
                     <p className="text-sm text-white/70">
                       {searchTerm ? "Try adjusting your search term." : "Try selecting a different region."}
                     </p>
                   </>
               )}
            </div>
        )}
      </div>
    </div>
  );
};

export default HeroSelector;
