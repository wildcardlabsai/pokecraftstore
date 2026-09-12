import React from 'react';
import { Sparkles, Flame, Shield, ArrowRight } from 'lucide-react';
import { useRouter } from '../context/RouterContext';

export const PromoStrip: React.FC = () => {
  const { navigate } = useRouter();

  const cards = [
    {
      id: 'promo-card-new-releases',
      tag: 'NEW RELEASES',
      title: 'Fresh Prints, New Arrivals',
      description: 'Discover our latest 3D printed collectibles.',
      cta: 'Shop New Releases',
      route: '/shop?filter=new',
      icon: Sparkles,
      tagBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      accentColor: 'group-hover:border-[#FFD21F]',
    },
    {
      id: 'promo-card-best-sellers',
      tag: 'BEST SELLERS',
      title: 'Fan Favourites',
      description: 'The prints everyone wants in their collection.',
      cta: 'Shop Best Sellers',
      route: '/shop?filter=bestsellers',
      icon: Flame,
      tagBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      accentColor: 'group-hover:border-[#FFD21F]',
    },
    {
      id: 'promo-card-made-to-collect',
      tag: 'MADE TO COLLECT',
      title: 'Display. Store. Show Off.',
      description: 'Accessories designed around your collection.',
      cta: 'Shop Accessories',
      route: '/shop/accessories',
      icon: Shield,
      tagBg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
      accentColor: 'group-hover:border-[#FFD21F]',
    },
  ];

  return (
    <section className="relative z-20 -mt-10 sm:-mt-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              id={card.id}
              onClick={() => navigate(card.route)}
              className="group relative bg-[#0D1B2A] border border-slate-700/90 hover:border-[#FFD21F] rounded-2xl p-6 sm:p-7 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden"
            >
              {/* Subtle ambient lighting accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFD21F]/5 rounded-full blur-2xl group-hover:bg-[#FFD21F]/15 transition-colors pointer-events-none" />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-[11px] font-black tracking-wider uppercase px-2.5 py-1 rounded-md border ${card.tagBg}`}>
                    {card.tag}
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-[#071525] border border-slate-700 flex items-center justify-center text-slate-300 group-hover:text-[#FFD21F] group-hover:border-[#FFD21F]/40 transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <h3 className="font-display font-extrabold text-xl sm:text-2xl text-white group-hover:text-[#FFD21F] transition-colors mb-2">
                  {card.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6 font-normal">
                  {card.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/90 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-200 group-hover:text-[#FFD21F] transition-colors">
                <span>{card.cta}</span>
                <div className="w-7 h-7 rounded-full bg-white/5 group-hover:bg-[#FFD21F] text-slate-300 group-hover:text-[#071525] flex items-center justify-center transition-all group-hover:translate-x-1">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
