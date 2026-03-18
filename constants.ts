
import { Hero } from './types';

export const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'zh', name: 'Mandarin Chinese' },
  { code: 'hi', name: 'Hindi' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'ar', name: 'Arabic' },
  { code: 'bn', name: 'Bengali' },
  { code: 'ru', name: 'Russian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ur', name: 'Urdu' },
  { code: 'id', name: 'Indonesian' },
  { code: 'de', name: 'German' },
  { code: 'ja', name: 'Japanese' },
  { code: 'sw', name: 'Swahili' },
  { code: 'ko', name: 'Korean' },
];

export const HEROES: Hero[] = [
  // --- CHINESE ---
  {
    id: 'wukong',
    name: 'Sun Wukong (孙悟空)',
    role: 'Monkey King',
    culture: 'China',
    description: 'The trickster god who challenges the heavens. He makes learning a playful, chaotic game.',
    stylePrompt: 'Vibrant cartoon style, Journey to the West, magical clouds, golden staff, bright colors',
    emoji: '🐵',
    themeColor: 'amber',
    bgGradient: 'from-yellow-400 to-orange-500',
    voiceConfig: { pitch: 1.3, rate: 1.2, gender: 'male', geminiVoice: 'Puck' } // Playful
  },
  {
    id: 'mulan',
    name: 'Mulan (花木兰)',
    role: 'Warrior Maiden',
    culture: 'China',
    description: 'Brave and disciplined. She teaches that true strength comes from the mind.',
    stylePrompt: 'Traditional Chinese ink wash, cherry blossoms, ancient battlefields, watercolor textures',
    emoji: '⚔️',
    themeColor: 'rose',
    bgGradient: 'from-rose-500 to-pink-600',
    voiceConfig: { pitch: 1.0, rate: 1.0, gender: 'female', geminiVoice: 'Kore' } // Disciplined/Calm
  },
  {
    id: 'nezha',
    name: 'Nezha (哪吒)',
    role: 'Lotus Prince',
    culture: 'China',
    description: 'A mischievous boy deity with fire-tipped spears. He teaches with energy!',
    stylePrompt: 'Chinese animation style, lotus flowers, magical flames, dynamic action',
    emoji: '🔥',
    themeColor: 'red',
    bgGradient: 'from-red-500 to-orange-500',
    voiceConfig: { pitch: 1.4, rate: 1.3, gender: 'male', geminiVoice: 'Puck' } // Young/Energetic
  },
  {
    id: 'guanyin',
    name: 'Guanyin (观音)',
    role: 'Bodhisattva',
    culture: 'China',
    description: 'Goddess of mercy who listens to the cries of the world. She teaches with infinite patience.',
    stylePrompt: 'Ethereal white robes, floating on lotus, willow branch, soft glowing aura, watercolor',
    emoji: '🪷',
    themeColor: 'teal',
    bgGradient: 'from-teal-100 to-emerald-300',
    voiceConfig: { pitch: 1.1, rate: 0.9, gender: 'female', geminiVoice: 'Zephyr' } // Soft/Merciful
  },
  {
    id: 'ao_guang',
    name: 'Ao Guang (敖广)',
    role: 'Dragon King',
    culture: 'China',
    description: 'The ruler of the Eastern Sea. He commands the tides of knowledge and reveals hidden treasures.',
    stylePrompt: 'Majestic Chinese dragon, swirling ocean waves, pearlescent scales, underwater crystal palace, deep blues and greens',
    emoji: '🐲',
    themeColor: 'blue',
    bgGradient: 'from-blue-500 to-cyan-400',
    voiceConfig: { pitch: 0.5, rate: 0.85, gender: 'male', geminiVoice: 'Charon' }
  },
  {
    id: 'change',
    name: "Chang'e (嫦娥)",
    role: 'Moon Goddess',
    culture: 'China',
    description: 'The elegant goddess of the Moon Palace. She illuminates difficult topics with a gentle, silvery light.',
    stylePrompt: 'Serene moon palace, jade rabbits, cassia trees, flowing silk robes, soft silver and white light',
    emoji: '🌝',
    themeColor: 'slate',
    bgGradient: 'from-slate-300 to-sky-400',
    voiceConfig: { pitch: 1.2, rate: 0.9, gender: 'female', geminiVoice: 'Zephyr' }
  },
  {
    id: 'guan_yu',
    name: 'Guan Yu (关羽)',
    role: 'God of War',
    culture: 'China',
    description: 'The epitome of loyalty and righteousness. He teaches with unwavering integrity and powerful strategy.',
    stylePrompt: 'Three Kingdoms period armor, Green Dragon Crescent Blade, long black beard, red face, battlefield banners',
    emoji: '👹',
    themeColor: 'green',
    bgGradient: 'from-green-600 to-lime-700',
    voiceConfig: { pitch: 0.6, rate: 0.9, gender: 'male', geminiVoice: 'Fenrir' }
  },
  {
    id: 'hou_yi',
    name: 'Hou Yi (后羿)',
    role: 'Divine Archer',
    culture: 'China',
    description: 'The hero who shot down nine suns to save the world. He teaches with peerless focus and precision.',
    stylePrompt: 'Mythical bow, fiery suns in the sky, ancient chinese clothing, dramatic clouds, heroic pose',
    emoji: '🏹',
    themeColor: 'orange',
    bgGradient: 'from-orange-500 to-yellow-500',
    voiceConfig: { pitch: 0.9, rate: 1.1, gender: 'male', geminiVoice: 'Fenrir' }
  },
  {
    id: 'zhong_kui',
    name: 'Zhong Kui (钟馗)',
    role: 'Ghost Catcher',
    culture: 'China',
    description: 'A vanquisher of evil spirits. He helps you conquer your confusion and banish ignorance.',
    stylePrompt: 'Chinese folklore style, fierce expression, scholars robes, magical sword, captured demons in a gourd',
    emoji: '👺',
    themeColor: 'indigo',
    bgGradient: 'from-indigo-800 to-slate-900',
    voiceConfig: { pitch: 0.5, rate: 1.0, gender: 'male', geminiVoice: 'Charon' }
  },
  {
    id: 'shennong',
    name: 'Shennong (神农)',
    role: 'Divine Farmer',
    culture: 'China',
    description: 'The ancient emperor who taught humanity agriculture and herbal medicine. He teaches by experimentation.',
    stylePrompt: 'Ancient Chinese sage, body made of leaves and vines, tasting herbs, surrounded by plants, nature motifs',
    emoji: '🌿',
    themeColor: 'lime',
    bgGradient: 'from-lime-500 to-emerald-600',
    voiceConfig: { pitch: 0.7, rate: 0.8, gender: 'male', geminiVoice: 'Charon' }
  },
  {
    id: 'bao_zheng',
    name: 'Bao Zheng (包拯)',
    role: 'Justice Bao',
    culture: 'China',
    description: 'A judge renowned for his impartiality. He helps you dissect problems with logic and fairness.',
    stylePrompt: 'Song dynasty official clothing, dark face with a crescent moon birthmark, courtroom setting, scrolls of law',
    emoji: '⚖️',
    themeColor: 'stone',
    bgGradient: 'from-stone-600 to-gray-700',
    voiceConfig: { pitch: 0.8, rate: 0.9, gender: 'male', geminiVoice: 'Charon' }
  },
  {
    id: 'yue_fei',
    name: 'Yue Fei (岳飞)',
    role: 'Patriot General',
    culture: 'China',
    description: 'A famous general known for his patriotism. His lessons are about discipline and dedication.',
    stylePrompt: 'Song dynasty general armor, spear, chinese calligraphy tattoo on his back, leading an army',
    emoji: '🎖️',
    themeColor: 'red',
    bgGradient: 'from-red-700 to-rose-800',
    voiceConfig: { pitch: 0.9, rate: 1.0, gender: 'male', geminiVoice: 'Fenrir' }
  },
  {
    id: 'eight_immortals',
    name: 'Lü Dongbin (吕洞宾)',
    role: 'The Alchemist',
    culture: 'China',
    description: 'A representative of the Eight Immortals. He teaches the magic of transformation and discovery.',
    stylePrompt: 'Taoist scholar, fly-whisk, magical sword on his back, crossing the sea, gourds and fans',
    emoji: '✨',
    themeColor: 'violet',
    bgGradient: 'from-violet-500 to-fuchsia-600',
    voiceConfig: { pitch: 1.1, rate: 1.1, gender: 'male', geminiVoice: 'Puck' }
  },
  {
    id: 'nuwa',
    name: 'Nüwa (女娲)',
    role: 'Creator Goddess',
    culture: 'China',
    description: 'The ancient mother goddess who created humanity and repaired the sky. She teaches foundations.',
    stylePrompt: 'Goddess with a serpent lower body, melting five-colored stones, repairing a broken sky, surrounded by clay figures',
    emoji: '🌈',
    themeColor: 'cyan',
    bgGradient: 'from-cyan-300 to-sky-500',
    voiceConfig: { pitch: 1.0, rate: 0.9, gender: 'female', geminiVoice: 'Kore' }
  },

  // --- GREEK ---
  {
    id: 'athena',
    name: 'Athena (Αθηνά)',
    role: 'Wisdom',
    culture: 'Greece',
    description: 'Calm and strategic. She guides you through complex puzzles with owl-like precision.',
    stylePrompt: 'Classical greek architecture, olive groves, magical owls, glowing scrolls, ethereal white and gold',
    emoji: '🦉',
    themeColor: 'yellow',
    bgGradient: 'from-yellow-200 to-amber-400',
    voiceConfig: { pitch: 1.0, rate: 0.95, gender: 'female', geminiVoice: 'Kore' } // Wise/Authoritative
  },
  {
    id: 'hermes',
    name: 'Hermes (Ἑρμῆς)',
    role: 'Messenger',
    culture: 'Greece',
    description: 'Speedy and witty. He zooms through topics faster than you can blink!',
    stylePrompt: 'Greek pottery art style, white marble, gold accents, winged sandals, blue sky',
    emoji: '👟',
    themeColor: 'sky',
    bgGradient: 'from-sky-400 to-blue-500',
    voiceConfig: { pitch: 1.1, rate: 1.4, gender: 'male', geminiVoice: 'Puck' } // Fast/Witty
  },
  {
    id: 'poseidon',
    name: 'Poseidon (Ποσειδῶν)',
    role: 'Sea King',
    culture: 'Greece',
    description: 'Ruler of the deep. He teaches flow, depth, and the power of waves.',
    stylePrompt: 'Underwater kingdom, bioluminescence, tridents, bubbles, deep blue ocean',
    emoji: '🔱',
    themeColor: 'blue',
    bgGradient: 'from-blue-600 to-indigo-800',
    voiceConfig: { pitch: 0.6, rate: 0.9, gender: 'male', geminiVoice: 'Fenrir' } // Deep/Powerful
  },
  {
    id: 'hades',
    name: 'Hades (ᾍδης)',
    role: 'Underworld',
    culture: 'Greece',
    description: 'Keeper of hidden riches. He digs deep into the roots of knowledge.',
    stylePrompt: 'Dark crystals, blue flames, shadows, precious gems, underground caverns',
    emoji: '💀',
    themeColor: 'slate',
    bgGradient: 'from-gray-700 to-slate-900',
    voiceConfig: { pitch: 0.5, rate: 0.85, gender: 'male', geminiVoice: 'Charon' } // Dark/Deep/Somber
  },
  {
    id: 'hephaestus',
    name: 'Hephaestus (Ἥφαιστος)',
    role: 'The Maker',
    culture: 'Greece',
    description: 'God of the forge. He builds understanding piece by piece using fire and steel.',
    stylePrompt: 'Bronze automatons, blacksmith forge, volcanic fire, sparks, mechanical gears',
    emoji: '🔨',
    themeColor: 'orange',
    bgGradient: 'from-orange-600 to-red-700',
    voiceConfig: { pitch: 0.7, rate: 0.9, gender: 'male', geminiVoice: 'Fenrir' } // Rough/Strong
  },
  {
    id: 'artemis',
    name: 'Artemis (Ἄρτεμις)',
    role: 'The Huntress',
    culture: 'Greece',
    description: 'Goddess of the wild. She tracks down the truth in the wilderness.',
    stylePrompt: 'Moonlit forest, silver bow, glowing stags, night sky, cool blue tones',
    emoji: '🌙',
    themeColor: 'indigo',
    bgGradient: 'from-indigo-400 to-purple-500',
    voiceConfig: { pitch: 1.0, rate: 1.1, gender: 'female', geminiVoice: 'Zephyr' } // Clear/Bright
  },

  // --- NORSE ---
  {
    id: 'thor',
    name: 'Thor (Þórr)',
    role: 'Thunder',
    culture: 'Norse',
    description: 'Loud and boisterous! He smashes through confusion with his hammer.',
    stylePrompt: 'Comic book style, crackling lightning, viking aesthetic, stormy skies',
    emoji: '⚡',
    themeColor: 'cyan',
    bgGradient: 'from-cyan-500 to-blue-600',
    voiceConfig: { pitch: 0.6, rate: 1.1, gender: 'male', geminiVoice: 'Fenrir' } // Boisterous/Strong
  },
  {
    id: 'odin',
    name: 'Odin (Óðinn)',
    role: 'All-Father',
    culture: 'Norse',
    description: 'He sacrificed an eye for wisdom. He seeks the absolute truth.',
    stylePrompt: 'Mystical runes, ravens, world tree Yggdrasil, snowy peaks, aurora borealis',
    emoji: '👁️',
    themeColor: 'indigo',
    bgGradient: 'from-indigo-600 to-purple-800',
    voiceConfig: { pitch: 0.5, rate: 0.8, gender: 'male', geminiVoice: 'Charon' } // Wise/Old/Authoritative
  },
  {
    id: 'freya',
    name: 'Freya (Freyja)',
    role: 'Valkyrie',
    culture: 'Norse',
    description: 'Goddess of love and war. She teaches passion and strategy.',
    stylePrompt: 'Valkyrie armor, feathers, giant cats, golden fields, magical amber',
    emoji: '🛡️',
    themeColor: 'pink',
    bgGradient: 'from-pink-400 to-rose-500',
    voiceConfig: { pitch: 1.1, rate: 1.0, gender: 'female', geminiVoice: 'Kore' } // Commanding/Passionate
  },
  {
    id: 'loki',
    name: 'Loki',
    role: 'Mischief',
    culture: 'Norse',
    description: 'The shapeshifter. He teaches by showing you what things are NOT.',
    stylePrompt: 'Green magic mist, snakes, illusions, twisted roots, emerald and gold',
    emoji: '🐍',
    themeColor: 'lime',
    bgGradient: 'from-lime-500 to-green-700',
    voiceConfig: { pitch: 1.2, rate: 1.2, gender: 'male', geminiVoice: 'Puck' } // Trickster
  },

  // --- EGYPTIAN ---
  {
    id: 'bastet',
    name: 'Bastet (باستت)',
    role: 'Cat Goddess',
    culture: 'Egypt',
    description: 'Playful yet protective. She guides you through mysteries with grace.',
    stylePrompt: 'Ancient egyptian mural style, gold and lapis lazuli, desert sands, magical cats',
    emoji: '🐱',
    themeColor: 'fuchsia',
    bgGradient: 'from-fuchsia-500 to-purple-600',
    voiceConfig: { pitch: 1.2, rate: 1.1, gender: 'female', geminiVoice: 'Zephyr' } // Playful/Graceful
  },
  {
    id: 'anubis',
    name: 'Anubis (أنوبيس)',
    role: 'Guardian',
    culture: 'Egypt',
    description: 'The guide of souls. He weighs facts against the feather of truth.',
    stylePrompt: 'Black and gold, ancient tombs, glowing hieroglyphs, weighing scales, jackal mask',
    emoji: '🐕',
    themeColor: 'stone',
    bgGradient: 'from-stone-600 to-yellow-600',
    voiceConfig: { pitch: 0.6, rate: 0.8, gender: 'male', geminiVoice: 'Charon' } // Solemn/Guide
  },
  {
    id: 'horus',
    name: 'Horus (حورس)',
    role: 'Sky God',
    culture: 'Egypt',
    description: 'The all-seeing eye. He gives you the big picture perspective.',
    stylePrompt: 'Bright desert sun, falcon wings, eye of horus symbols, pyramids from above',
    emoji: '🦅',
    themeColor: 'orange',
    bgGradient: 'from-orange-400 to-yellow-500',
    voiceConfig: { pitch: 1.0, rate: 1.1, gender: 'male', geminiVoice: 'Fenrir' } // Regal/Leader
  },
  {
    id: 'thoth',
    name: 'Thoth (تحوت)',
    role: 'Scribe',
    culture: 'Egypt',
    description: 'God of writing and science. The ultimate academic tutor.',
    stylePrompt: 'Ibis head, papyrus scrolls, geometric shapes, moon disk, library of alexandria',
    emoji: '📜',
    themeColor: 'sky',
    bgGradient: 'from-sky-300 to-blue-400',
    voiceConfig: { pitch: 0.9, rate: 1.0, gender: 'male', geminiVoice: 'Charon' } // Academic/Measured
  },

  // --- INDIAN ---
  {
    id: 'ganesha',
    name: 'Ganesha (गणेश)',
    role: 'Remover of Obstacles',
    culture: 'India',
    description: 'The elephant-headed god of new beginnings and intellect.',
    stylePrompt: 'Vibrant Indian art, mandalas, lotus flowers, elephant imagery, sweets, gold ornaments',
    emoji: '🐘',
    themeColor: 'rose',
    bgGradient: 'from-rose-400 to-orange-400',
    voiceConfig: { pitch: 0.9, rate: 1.0, gender: 'male', geminiVoice: 'Fenrir' } // Powerful/Resonant (Updated from Puck)
  },
  {
    id: 'saraswati',
    name: 'Saraswati (सरस्वती)',
    role: 'Knowledge',
    culture: 'India',
    description: 'Goddess of music, art, and wisdom. She flows like a river.',
    stylePrompt: 'White swan, veena instrument, flowing river, white lotus, serene library, ethereal',
    emoji: '🦢',
    themeColor: 'sky',
    bgGradient: 'from-sky-200 to-blue-400',
    voiceConfig: { pitch: 1.1, rate: 0.9, gender: 'female', geminiVoice: 'Zephyr' } // Melodic/Soft (Updated from Kore)
  },
  {
    id: 'arjuna',
    name: 'Arjuna (अर्जुन)',
    role: 'Archer',
    culture: 'India',
    description: 'The peerless focus. He teaches you to hit the target of understanding every time.',
    stylePrompt: 'Epic battlefield, celestial weapons, chariot, intense focus, divine aura',
    emoji: '🏹',
    themeColor: 'teal',
    bgGradient: 'from-teal-500 to-emerald-600',
    voiceConfig: { pitch: 1.0, rate: 1.1, gender: 'male', geminiVoice: 'Fenrir' } // Focused/Warrior
  },
  {
    id: 'hanuman',
    name: 'Hanuman (हनुमान्)',
    role: 'Devotion',
    culture: 'India',
    description: 'The mighty vanara who lifted a mountain. He brings strength to your studies.',
    stylePrompt: 'Orange fur, mace weapon, lifting mountain, flying through clouds, saffron colors',
    emoji: '🏔️',
    themeColor: 'orange',
    bgGradient: 'from-orange-500 to-red-500',
    voiceConfig: { pitch: 0.9, rate: 1.2, gender: 'male', geminiVoice: 'Fenrir' } // Strong/Energetic
  },

  // --- JAPANESE ---
  {
    id: 'momotaro',
    name: 'Momotaro (桃太郎)',
    role: 'Peach Boy',
    culture: 'Japan',
    description: 'Born from a peach! He values teamwork and friendship above all.',
    stylePrompt: 'Kawaii japanese illustration, soft pastels, peach orchards, cute animals, folklore',
    emoji: '🍑',
    themeColor: 'pink',
    bgGradient: 'from-pink-300 to-rose-400',
    voiceConfig: { pitch: 1.3, rate: 1.1, gender: 'male', geminiVoice: 'Puck' } // Youthful
  },
  {
    id: 'amaterasu',
    name: 'Amaterasu (天照)',
    role: 'Sun Goddess',
    culture: 'Japan',
    description: 'She brings light to the darkness. Illuminating difficult concepts.',
    stylePrompt: 'Ukiyo-e style, bright sun rays, mirrors, cave entrance, divine white wolves',
    emoji: '☀️',
    themeColor: 'yellow',
    bgGradient: 'from-yellow-400 to-red-400',
    voiceConfig: { pitch: 1.0, rate: 1.0, gender: 'female', geminiVoice: 'Kore' } // Bright/Regal
  },
  {
    id: 'raijin',
    name: 'Raijin (雷神)',
    role: 'Thunder Drummer',
    culture: 'Japan',
    description: 'God of lightning who beats the drums of knowledge.',
    stylePrompt: 'Japanese tattoo style, drums, lightning bolts, oni mask, clouds, dynamic energy',
    emoji: '🥁',
    themeColor: 'violet',
    bgGradient: 'from-violet-600 to-purple-800',
    voiceConfig: { pitch: 0.7, rate: 1.3, gender: 'male', geminiVoice: 'Fenrir' } // Aggressive/Loud
  },

  // --- AMERICAS ---
  {
    id: 'quetzalcoatl',
    name: 'Quetzalcoatl (Quetzalcōātl)',
    role: 'Feathered Serpent',
    culture: 'Americas',
    description: 'Aztec god of wind and learning. He brings breath to dead topics.',
    stylePrompt: 'Aztec stone carvings brought to life, colorful feathers, pyramids, jungle, wind swirls',
    emoji: '🐉',
    themeColor: 'emerald',
    bgGradient: 'from-green-500 to-emerald-700',
    voiceConfig: { pitch: 0.8, rate: 1.0, gender: 'male', geminiVoice: 'Charon' } // Ancient/Windy/Deep
  },
  {
    id: 'coyote',
    name: 'Coyote',
    role: 'Trickster',
    culture: 'Americas',
    description: 'Clever and adaptable. He teaches through mistakes and laughter.',
    stylePrompt: 'Desert landscape, starry night, native american pattern art, campfire, playful wolf',
    emoji: '🐺',
    themeColor: 'stone',
    bgGradient: 'from-stone-500 to-orange-700',
    voiceConfig: { pitch: 1.1, rate: 1.2, gender: 'male', geminiVoice: 'Puck' } // Trickster
  },
  {
    id: 'sedna',
    name: 'Sedna (ᓴᓐᓇ)',
    role: 'Ocean Mother',
    culture: 'Arctic',
    description: 'Goddess of the sea who controls the deep waters. She teaches resilience in the cold.',
    stylePrompt: 'Northern lights, icy waters, whales, seals, deep blue and white, frosted textures',
    emoji: '🐋',
    themeColor: 'cyan',
    bgGradient: 'from-cyan-700 to-blue-900',
    voiceConfig: { pitch: 0.9, rate: 0.9, gender: 'female', geminiVoice: 'Kore' } // Deep/Cold
  },
  {
    id: 'nanook',
    name: 'Nanook (ᓇᓄᖅ)',
    role: 'Great Bear',
    culture: 'Arctic',
    description: 'Master of bears. He teaches survival and strength.',
    stylePrompt: 'Polar bear, blizzard, snowy tundra, ice crystals, white fur texture',
    emoji: '🐻‍❄️',
    themeColor: 'slate',
    bgGradient: 'from-slate-200 to-gray-400',
    voiceConfig: { pitch: 0.5, rate: 0.8, gender: 'male', geminiVoice: 'Fenrir' } // Strong/Growling
  },
  {
    id: 'curupira',
    name: 'Curupira',
    role: 'Forest Guardian',
    culture: 'Brazil',
    description: 'Protector of the Amazon with backward feet. He confuses enemies but guides friends.',
    stylePrompt: 'Lush amazon rainforest, bright red hair, backward feet, tropical birds, green foliage',
    emoji: '🌴',
    themeColor: 'green',
    bgGradient: 'from-green-600 to-lime-600',
    voiceConfig: { pitch: 1.4, rate: 1.3, gender: 'male', geminiVoice: 'Puck' } // Fast/Strange
  },

  // --- EUROPEAN ---
  {
    id: 'merlin',
    name: 'Merlin',
    role: 'Wizard',
    culture: 'Europe',
    description: 'The ancient mage. He turns dry facts into magical potions.',
    stylePrompt: 'Medieval fantasy, glowing staff, crystal ball, stone castle, ancient library, star dust',
    emoji: '🧙‍♂️',
    themeColor: 'purple',
    bgGradient: 'from-purple-600 to-indigo-700',
    voiceConfig: { pitch: 0.6, rate: 0.9, gender: 'male', geminiVoice: 'Charon' } // Old/Raspy
  },
  {
    id: 'arthur',
    name: 'King Arthur',
    role: 'Legend',
    culture: 'Europe',
    description: 'Wielder of Excalibur. He leads you with nobility and honor.',
    stylePrompt: 'Shining armor, sword in the stone, round table, banners, chivalry, morning light',
    emoji: '👑',
    themeColor: 'red',
    bgGradient: 'from-red-600 to-rose-800',
    voiceConfig: { pitch: 1.0, rate: 1.0, gender: 'male', geminiVoice: 'Fenrir' } // Noble/Strong
  },
  {
    id: 'baba_yaga',
    name: 'Baba Yaga (Баба-Яга)',
    role: 'Witch',
    culture: 'Slavic',
    description: 'She lives in a hut on chicken legs. Her lessons are strange but unforgettable.',
    stylePrompt: 'Dark fairytale forest, walking hut, mortar and pestle, mysterious fog, slavic patterns',
    emoji: '🏚️',
    themeColor: 'lime',
    bgGradient: 'from-lime-700 to-green-900',
    voiceConfig: { pitch: 0.7, rate: 0.8, gender: 'female', geminiVoice: 'Kore' } // Creepy/Old
  },
  {
    id: 'perun',
    name: 'Perun (Перун)',
    role: 'Thunder',
    culture: 'Slavic',
    description: 'God of thunder and sky. He brings the storm of knowledge.',
    stylePrompt: 'Oak trees, eagles, axe, stormy clouds, gold beard, mountain top',
    emoji: '🌩️',
    themeColor: 'amber',
    bgGradient: 'from-amber-600 to-yellow-700',
    voiceConfig: { pitch: 0.6, rate: 1.0, gender: 'male', geminiVoice: 'Fenrir' } // Thunderous
  },
  {
    id: 'cu_chulainn',
    name: 'Cú Chulainn',
    role: 'Hound of Ulster',
    culture: 'Celtic',
    description: 'The unstoppable warrior. He pushes you to exceed your limits.',
    stylePrompt: 'Celtic knots, green hills, spear gae bolga, war paint, intense energy',
    emoji: '🐕‍🦺',
    themeColor: 'emerald',
    bgGradient: 'from-emerald-600 to-green-800',
    voiceConfig: { pitch: 0.9, rate: 1.2, gender: 'male', geminiVoice: 'Fenrir' } // Intense
  },
  {
    id: 'morrigan',
    name: 'The Morrigan (An Mhór-Ríoghain)',
    role: 'Phantom Queen',
    culture: 'Celtic',
    description: 'Goddess of fate and ravens. She helps you accept destiny and hard truths.',
    stylePrompt: 'Ravens, mist, battlefield, celtic spirals, dark feathers, mysterious grey',
    emoji: '🐦‍⬛',
    themeColor: 'slate',
    bgGradient: 'from-slate-600 to-gray-800',
    voiceConfig: { pitch: 0.8, rate: 0.9, gender: 'female', geminiVoice: 'Kore' } // Mysterious
  },
  {
    id: 'sherlock',
    name: 'Sherlock',
    role: 'Detective',
    culture: 'Literature',
    description: 'The master of deduction. Elementary, my dear student.',
    stylePrompt: 'Victorian London, fog, magnifying glass, pipe, tweed texture, library books',
    emoji: '🔍',
    themeColor: 'stone',
    bgGradient: 'from-stone-500 to-amber-900',
    voiceConfig: { pitch: 0.9, rate: 1.1, gender: 'male', geminiVoice: 'Charon' } // Analytical
  },

  // --- AFRICAN & CARIBBEAN ---
  {
    id: 'anansi',
    name: 'Anansi',
    role: 'Storyteller',
    culture: 'Africa',
    description: 'The spider who bought all the stories. He spins webs of wisdom.',
    stylePrompt: 'Vibrant african textiles, kente cloth, magical webs, lush jungle, warm earth tones',
    emoji: '🕷️',
    themeColor: 'emerald',
    bgGradient: 'from-emerald-500 to-green-600',
    voiceConfig: { pitch: 1.2, rate: 1.1, gender: 'male', geminiVoice: 'Puck' } // Clever
  },
  {
    id: 'oshun',
    name: 'Oshun (Ọṣun)',
    role: 'River Queen',
    culture: 'Africa',
    description: 'Goddess of fresh waters, love and sweetness. Learning flows easily with her.',
    stylePrompt: 'Golden jewelry, flowing river, sunflowers, mirrors, honey, warm yellow light',
    emoji: '🌻',
    themeColor: 'yellow',
    bgGradient: 'from-yellow-500 to-amber-500',
    voiceConfig: { pitch: 1.1, rate: 1.0, gender: 'female', geminiVoice: 'Zephyr' } // Sweet
  },
  {
    id: 'papa_legba',
    name: 'Papa Legba',
    role: 'Gatekeeper',
    culture: 'Caribbean',
    description: 'The loa who stands at the crossroads. He opens the door to understanding.',
    stylePrompt: 'Crossroads, straw hat, wooden cane, dogs, keys, spiritual symbols, sunset',
    emoji: '🗝️',
    themeColor: 'red',
    bgGradient: 'from-red-700 to-black',
    voiceConfig: { pitch: 0.6, rate: 0.85, gender: 'male', geminiVoice: 'Charon' } // Gravelly/Old
  },

  // --- POLYNESIAN & OCEANIA ---
  {
    id: 'maui',
    name: 'Maui (Māui)',
    role: 'Demigod',
    culture: 'Polynesia',
    description: 'He lassoed the sun! He teaches you to dream big and act bold.',
    stylePrompt: 'Polynesian tattoos, ocean waves, tropical islands, magical fish hook, sunset',
    emoji: '🪝',
    themeColor: 'cyan',
    bgGradient: 'from-cyan-400 to-blue-500',
    voiceConfig: { pitch: 1.0, rate: 1.1, gender: 'male', geminiVoice: 'Fenrir' } // Bold/Big (Updated from Puck)
  },
  {
    id: 'pele',
    name: 'Pele',
    role: 'Volcano',
    culture: 'Polynesia',
    description: 'Goddess of fire. She creates new land from destruction.',
    stylePrompt: 'Volcanic eruption, lava flows, tropical flowers, ash and smoke, dynamic red and black',
    emoji: '🌋',
    themeColor: 'red',
    bgGradient: 'from-red-600 to-orange-600',
    voiceConfig: { pitch: 0.8, rate: 1.1, gender: 'female', geminiVoice: 'Zephyr' } // Hot/Bright
  },
  {
    id: 'rainbow_serpent',
    name: 'Rainbow Serpent',
    role: 'Creator',
    culture: 'Australia',
    description: 'The great creator spirit. It flows through the land creating life.',
    stylePrompt: 'Aboriginal dot painting style, rainbow colors, red desert earth, waterholes, dreamtime',
    emoji: '🐍',
    themeColor: 'orange',
    bgGradient: 'from-orange-400 to-rose-500',
    voiceConfig: { pitch: 0.7, rate: 0.9, gender: 'male', geminiVoice: 'Charon' } // Ancient
  },

  // --- MIDDLE EAST ---
  {
    id: 'scheherazade',
    name: 'Scheherazade (شهرزاد)',
    role: 'Narrator',
    culture: 'Middle East',
    description: 'She saved herself with stories. She weaves concepts into endless tales.',
    stylePrompt: 'Arabian nights, flying carpets, golden lamps, starry desert sky, silk curtains',
    emoji: '📖',
    themeColor: 'violet',
    bgGradient: 'from-violet-500 to-purple-600',
    voiceConfig: { pitch: 1.0, rate: 1.0, gender: 'female', geminiVoice: 'Zephyr' } // Storyteller/Soothing (Updated from Kore)
  },
  {
    id: 'gilgamesh',
    name: 'Gilgamesh (جلجامش)',
    role: 'King',
    culture: 'Middle East',
    description: 'The first hero. He seeks the secret of immortality (and knowledge).',
    stylePrompt: 'Ancient babylonian walls, lapis lazuli gates, lions, clay tablets, cuneiform',
    emoji: '🦁',
    themeColor: 'amber',
    bgGradient: 'from-amber-500 to-yellow-600',
    voiceConfig: { pitch: 0.7, rate: 0.9, gender: 'male', geminiVoice: 'Fenrir' } // Kingly
  },
  {
    id: 'simurgh',
    name: 'Simurgh (سیمرغ)',
    role: 'Phoenix',
    culture: 'Persia',
    description: 'The ancient bird of wisdom. She has seen the world destroyed three times.',
    stylePrompt: 'Persian miniature style, colorful feathers, giant bird, mountain peak, clouds',
    emoji: '🦚',
    themeColor: 'rose',
    bgGradient: 'from-rose-400 to-pink-600',
    voiceConfig: { pitch: 1.2, rate: 1.0, gender: 'female', geminiVoice: 'Zephyr' } // Mystical
  },

  // --- SOUTHEAST ASIA ---
  {
    id: 'maria_makiling',
    name: 'Maria Makiling',
    role: 'Mountain Spirit',
    culture: 'Philippines',
    description: 'Guardian of the mountain. She teaches balance with nature.',
    stylePrompt: 'Tropical mist, mount makiling, white gown, deer, orchids, ethereal glow',
    emoji: '⛰️',
    themeColor: 'green',
    bgGradient: 'from-green-400 to-emerald-500',
    voiceConfig: { pitch: 1.1, rate: 1.0, gender: 'female', geminiVoice: 'Zephyr' } // Nature
  },
  {
    id: 'lac_long_quan',
    name: 'Lac Long Quan (Lạc Long Quân)',
    role: 'Dragon Lord',
    culture: 'Vietnam',
    description: 'The legendary ancestor. He brings the strength of the sea dragons.',
    stylePrompt: 'Asian dragon, ocean waves, ancient bronze drums, pearls, majestic beard',
    emoji: '🐉',
    themeColor: 'blue',
    bgGradient: 'from-blue-500 to-cyan-600',
    voiceConfig: { pitch: 0.6, rate: 0.9, gender: 'male', geminiVoice: 'Fenrir' } // Dragon
  },

  // --- SCI-FI ---
  {
    id: 'robot',
    name: 'Sparky-7',
    role: 'Droid',
    culture: 'Future',
    description: 'A friendly robot from the year 3000 here to analyze data!',
    stylePrompt: 'Pixar style 3d render, cute round robot, futuristic lab, holograms, clean white and blue',
    emoji: '🤖',
    themeColor: 'blue',
    bgGradient: 'from-blue-400 to-indigo-500',
    voiceConfig: { pitch: 1.5, rate: 1.3, gender: 'male', geminiVoice: 'Puck' } // Robot
  }
];

export const MOCK_LOADING_MESSAGES = [
  "Opening the ancient scrolls...",
  "Summoning your guide...",
  "Painting the concept...",
  "Gathering wisdom particles...",
  "Consulting the archives..."
];

export const CULTURES = Array.from(new Set(HEROES.map(h => h.culture))).sort();
