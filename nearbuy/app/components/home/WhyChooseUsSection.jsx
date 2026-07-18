import React from "react";

export default function WhyChooseUsSection() {
  const features = [
    {
      step: "01",
      icon: (
        <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Zero Size & Fit Mismatches",
      description:
        "Skip online return cycles. Discover local boutiques nearby, walk in, try on apparel in person, and get custom alteration or fitting support on the spot.",
      badge: "In-Person Fitting",
    },
    {
      step: "02",
      icon: (
        <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      ),
      title: "Touch & Feel Real Fabrics",
      description:
        "Apparel looks different in heavily retouched studio photos. Walk in to feel cotton weights, linen textures, and silk weaves before spending.",
      badge: "Guaranteed Quality",
    },
    {
      step: "03",
      icon: (
        <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Instant Collection Pickups",
      description:
        "Need an outfit for an event tonight? Don't wait for 2-day delivery delays. Browse nearby inventories online and pick up instantly.",
      badge: "Same-Day Readiness",
    },
  ];

  return (
    <section className="py-24 bg-slate-950 text-white relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-600/10 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 tracking-wider uppercase mb-3">
            The Offline Shopping Advantage
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Why Browse & Shop Local Fashion Offline?
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-400 leading-relaxed font-body">
            Online shopping is convenient, but apparel requires tactile quality, exact sizing, and immediate availability. Here is how Nearbuy bridges the physical-digital gap.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.step}
              className="bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 p-8 rounded-2xl backdrop-blur-md transition-all duration-300 hover:-translate-y-1 group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="h-12 w-12 bg-slate-800/80 border border-slate-700/60 rounded-xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <span className="font-heading text-xs font-extrabold tracking-widest text-slate-600 group-hover:text-blue-400 transition-colors">
                    {feature.step}
                  </span>
                </div>

                <h4 className="font-heading text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                  {feature.title}
                </h4>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-body">
                  {feature.description}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-800/60 flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                  {feature.badge}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
