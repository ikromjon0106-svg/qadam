// Beautiful SVG illustrations for each product type
export default function ProductImage({ item }) {
  if (item.image_url) {
    return <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />;
  }

  if (item.item_type === 'bomb') {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
        {/* Sparks */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2">
          <svg width="20" height="28" viewBox="0 0 20 28">
            <path d="M10 0 Q14 8 10 14 Q6 8 10 0Z" fill="#f59e0b" opacity="0.9"/>
            <path d="M10 2 Q12 8 10 13 Q8 8 10 2Z" fill="#fde68a"/>
            {/* sparks */}
            <circle cx="4" cy="6" r="1.2" fill="#f59e0b" opacity="0.7"/>
            <circle cx="16" cy="5" r="1" fill="#fbbf24" opacity="0.6"/>
            <circle cx="14" cy="10" r="0.8" fill="#fde68a" opacity="0.5"/>
          </svg>
        </div>
        {/* Bomb body */}
        <svg width="64" height="64" viewBox="0 0 64 64" className="mt-3">
          {/* Shadow */}
          <ellipse cx="32" cy="58" rx="16" ry="4" fill="black" opacity="0.3"/>
          {/* Fuse string */}
          <path d="M32 8 Q38 4 40 10 Q42 16 48 12" stroke="#a16207" strokeWidth="2" fill="none" strokeLinecap="round"/>
          {/* Body */}
          <radialGradient id="bombGrad" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#4b5563"/>
            <stop offset="60%" stopColor="#1f2937"/>
            <stop offset="100%" stopColor="#111827"/>
          </radialGradient>
          <circle cx="32" cy="36" r="22" fill="url(#bombGrad)"/>
          {/* Highlight */}
          <ellipse cx="24" cy="28" rx="6" ry="4" fill="white" opacity="0.12"/>
          {/* Skull or X mark */}
          <circle cx="27" cy="36" r="2" fill="#ef4444" opacity="0.8"/>
          <circle cx="37" cy="36" r="2" fill="#ef4444" opacity="0.8"/>
          <path d="M27 42 Q32 40 37 42" stroke="#ef4444" strokeWidth="1.5" fill="none" opacity="0.8"/>
          {/* Ring */}
          <rect x="29" y="6" width="6" height="4" rx="2" fill="#6b7280"/>
          <rect x="30" y="5" width="4" height="6" rx="2" fill="#9ca3af"/>
        </svg>
        {/* Glow */}
        <div className="absolute inset-0 rounded-2xl" style={{background: 'radial-gradient(circle at 50% 30%, rgba(239,68,68,0.15) 0%, transparent 70%)'}}/>
      </div>
    );
  }

  if (item.item_type === 'shield') {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900 relative overflow-hidden">
        {/* Stars bg */}
        {[...Array(8)].map((_, i) => (
          <div key={i} className="absolute w-1 h-1 bg-white rounded-full opacity-30"
            style={{ top: `${10 + (i * 11) % 80}%`, left: `${5 + (i * 17) % 90}%` }} />
        ))}
        <svg width="72" height="72" viewBox="0 0 72 72">
          {/* Glow behind */}
          <ellipse cx="36" cy="38" rx="28" ry="26" fill="#3b82f6" opacity="0.2"/>
          {/* Shield outer */}
          <path d="M36 6 L58 16 L58 36 Q58 54 36 66 Q14 54 14 36 L14 16 Z"
            fill="url(#shieldGrad)" stroke="#60a5fa" strokeWidth="1.5"/>
          <defs>
            <linearGradient id="shieldGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#1d4ed8"/>
              <stop offset="50%" stopColor="#2563eb"/>
              <stop offset="100%" stopColor="#1e40af"/>
            </linearGradient>
          </defs>
          {/* Inner shield */}
          <path d="M36 14 L52 22 L52 37 Q52 50 36 59 Q20 50 20 37 L20 22 Z"
            fill="url(#shieldInner)" opacity="0.8"/>
          <defs>
            <linearGradient id="shieldInner" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#3b82f6"/>
              <stop offset="100%" stopColor="#1d4ed8"/>
            </linearGradient>
          </defs>
          {/* Checkmark */}
          <path d="M26 36 L33 43 L47 29" stroke="white" strokeWidth="3.5" fill="none"
            strokeLinecap="round" strokeLinejoin="round"/>
          {/* Shine */}
          <path d="M22 20 Q28 16 34 18 Q30 22 24 24 Z" fill="white" opacity="0.15"/>
        </svg>
        <div className="absolute inset-0 rounded-2xl" style={{background: 'radial-gradient(circle at 50% 40%, rgba(96,165,250,0.2) 0%, transparent 65%)'}}/>
      </div>
    );
  }

  // Category-based illustrations
  const categoryArt = {
    sports: (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
        <svg width="60" height="60" viewBox="0 0 60 60">
          <circle cx="30" cy="30" r="26" fill="white" stroke="#16a34a" strokeWidth="2"/>
          <path d="M30 4 Q46 14 46 30 Q46 46 30 56 Q14 46 14 30 Q14 14 30 4Z" fill="#16a34a" opacity="0.1"/>
          <path d="M4 30 Q14 22 30 30 Q46 38 56 30" stroke="#16a34a" strokeWidth="2" fill="none"/>
          <path d="M14 12 Q22 22 30 30" stroke="#16a34a" strokeWidth="2" fill="none"/>
          <path d="M46 12 Q38 22 30 30" stroke="#16a34a" strokeWidth="2" fill="none"/>
          <path d="M14 48 Q22 38 30 30" stroke="#16a34a" strokeWidth="2" fill="none"/>
          <path d="M46 48 Q38 38 30 30" stroke="#16a34a" strokeWidth="2" fill="none"/>
        </svg>
      </div>
    ),
    coupons: (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-100">
        <svg width="64" height="48" viewBox="0 0 64 48">
          <rect x="2" y="6" width="60" height="36" rx="6" fill="white" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 2"/>
          <circle cx="2" cy="24" r="6" fill="#fef3c7"/>
          <circle cx="62" cy="24" r="6" fill="#fef3c7"/>
          <line x1="20" y1="6" x2="20" y2="42" stroke="#fcd34d" strokeWidth="1" strokeDasharray="3 3"/>
          <text x="36" y="20" textAnchor="middle" fontSize="8" fill="#d97706" fontWeight="bold">CHEGIRMA</text>
          <text x="36" y="32" textAnchor="middle" fontSize="14" fill="#f59e0b" fontWeight="bold">50%</text>
        </svg>
      </div>
    ),
    accessories: (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-50 to-violet-100">
        <svg width="56" height="56" viewBox="0 0 56 56">
          <rect x="8" y="20" width="40" height="28" rx="8" fill="#7c3aed" opacity="0.15"/>
          <rect x="10" y="22" width="36" height="24" rx="7" fill="white" stroke="#7c3aed" strokeWidth="1.5"/>
          <path d="M20 22 L20 16 Q20 8 28 8 Q36 8 36 16 L36 22" stroke="#7c3aed" strokeWidth="2" fill="none" strokeLinecap="round"/>
          <rect x="23" y="30" width="10" height="7" rx="2" fill="#7c3aed" opacity="0.5"/>
        </svg>
      </div>
    ),
    vouchers: (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-50 to-rose-100">
        <svg width="60" height="52" viewBox="0 0 60 52">
          <rect x="4" y="4" width="52" height="44" rx="8" fill="white" stroke="#f43f5e" strokeWidth="1.5"/>
          <path d="M4 20 L56 20" stroke="#f43f5e" strokeWidth="1" strokeDasharray="3 2"/>
          <circle cx="15" cy="12" r="4" fill="#fecdd3"/>
          <text x="30" y="16" textAnchor="middle" fontSize="8" fill="#f43f5e" fontWeight="600">VOUCHER</text>
          <rect x="12" y="28" width="16" height="3" rx="1.5" fill="#fda4af"/>
          <rect x="12" y="34" width="24" height="3" rx="1.5" fill="#fda4af" opacity="0.6"/>
          <rect x="12" y="40" width="18" height="3" rx="1.5" fill="#fda4af" opacity="0.4"/>
          <rect x="38" y="26" width="12" height="16" rx="3" fill="#f43f5e" opacity="0.15"/>
          <text x="44" y="37" textAnchor="middle" fontSize="11" fill="#f43f5e" fontWeight="bold">★</text>
        </svg>
      </div>
    ),
    sponsor: (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-yellow-50 to-amber-100">
        <svg width="60" height="56" viewBox="0 0 60 56">
          <polygon points="30,4 38,20 56,22 43,35 46,52 30,44 14,52 17,35 4,22 22,20" fill="#fbbf24" stroke="#f59e0b" strokeWidth="1.5"/>
          <polygon points="30,12 36,22 48,24 39,33 41,45 30,39 19,45 21,33 12,24 24,22" fill="#fde68a"/>
          <text x="30" y="32" textAnchor="middle" fontSize="11" fill="#92400e" fontWeight="bold">VIP</text>
        </svg>
      </div>
    ),
    powerups: (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-violet-900 to-purple-900">
        <svg width="56" height="60" viewBox="0 0 56 60">
          <path d="M30 2 L20 28 L26 28 L16 58 L44 22 L36 22 L48 2 Z" fill="#a78bfa" stroke="#7c3aed" strokeWidth="1"/>
          <path d="M30 2 L22 26 L28 26 L20 52 L40 24 L33 24 L44 4 Z" fill="#c4b5fd" opacity="0.7"/>
        </svg>
      </div>
    ),
  };

  return categoryArt[item.category] || (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
      <svg width="48" height="48" viewBox="0 0 48 48">
        <rect x="8" y="16" width="32" height="26" rx="4" fill="#9ca3af" opacity="0.5"/>
        <path d="M16 16 L16 10 Q16 6 24 6 Q32 6 32 10 L32 16" stroke="#9ca3af" strokeWidth="2" fill="none"/>
      </svg>
    </div>
  );
}