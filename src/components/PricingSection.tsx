import React, { useState } from 'react';
import {
  Check,
  Zap,
  ShieldCheck,
  Sparkles,
  CreditCard,
  Building2,
  Lock
} from 'lucide-react';

interface PricingSectionProps {
  onSelectPlan: (planName: string, priceUSD: number) => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onSelectPlan }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');

  const plans = [
    {
      name: 'Developer Starter',
      priceMonthly: 299,
      priceYearly: 249,
      description: 'Ideal for robotics researchers, university labs, and single autonomous unit testing.',
      features: [
        'Up to 3 Active Robots',
        '100 FPS Live WebRTC Stream',
        'Basic 2D SLAM Mapping',
        '1,000 AI Credits / Month',
        'Email & Discord Support'
      ],
      popular: false,
      cta: 'Start Free Trial'
    },
    {
      name: 'Pro Facility',
      priceMonthly: 999,
      priceYearly: 799,
      description: 'For smart factories, warehouses, & mining sites requiring 24/7 autonomous patrol.',
      features: [
        'Up to 15 Active Robots',
        '120 FPS FLIR Thermal Stream',
        '3D LiDAR SLAM + YOLOv11 AI',
        '10,000 AI Credits / Month',
        'AI Incident Commander (Zoom/Meet)',
        'ROS2 Native K8s Pipeline',
        '24/7 Priority SLA Support'
      ],
      popular: true,
      cta: 'Go Pro Facility'
    },
    {
      name: 'Enterprise Heavy',
      priceMonthly: 2999,
      priceYearly: 2499,
      description: 'For oil refineries, nuclear power plants, & defense facilities needing custom compliance.',
      features: [
        'Unlimited Robot Fleet Units',
        'NVIDIA Isaac Sim Digital Twin',
        '25,000 AI Credits / Month',
        'Dedicated On-Prem K8s Cluster',
        'Full RBAC + Immutable Audit Logs',
        'Custom YOLO Neural Model Fine-Tuning',
        'Dedicated Robotics Solutions Engineer'
      ],
      popular: false,
      cta: 'Contact Enterprise Sales'
    }
  ];

  return (
    <section className="py-16 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-[#0EA5E9] text-xs font-mono mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>TRANSPARENT PRICING</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Scalable <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0EA5E9] to-[#22C55E]">Industry Plans</span>
          </h2>
          <p className="mt-3 text-slate-300 text-sm">
            Choose the right tier to deploy autonomous robots, computer vision AI, and AI Incident Commander.
          </p>

          {/* Toggle Monthly / Yearly */}
          <div className="flex items-center justify-center space-x-3 mt-8">
            <span className={`text-xs font-mono ${billingCycle === 'monthly' ? 'text-white font-bold' : 'text-slate-400'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="w-12 h-6 bg-white/10 rounded-full p-1 relative border border-white/20 backdrop-blur-md"
            >
              <div
                className={`w-4 h-4 bg-[#0EA5E9] rounded-full transition-transform ${
                  billingCycle === 'yearly' ? 'translate-x-6 bg-[#22C55E]' : ''
                }`}
              />
            </button>
            <span className={`text-xs font-mono flex items-center space-x-1.5 ${billingCycle === 'yearly' ? 'text-white font-bold' : 'text-slate-400'}`}>
              <span>Yearly</span>
              <span className="px-2.5 py-0.5 text-[9px] bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/30 rounded-full font-bold backdrop-blur-md">
                SAVE 20%
              </span>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((p) => {
            const price = billingCycle === 'yearly' ? p.priceYearly : p.priceMonthly;
            return (
              <div
                key={p.name}
                className={`relative rounded-3xl p-8 flex flex-col justify-between border transition-all backdrop-blur-2xl shadow-2xl ${
                  p.popular
                    ? 'bg-white/10 border-white/30 ring-1 ring-[#0EA5E9]'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                {p.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-white text-black font-mono text-[10px] font-extrabold rounded-full shadow-xl">
                    MOST POPULAR FOR INDUSTRY 4.0
                  </div>
                )}

                <div>
                  <h3 className="text-xl font-extrabold text-white mb-2">{p.name}</h3>
                  <p className="text-xs text-slate-300 mb-6 leading-relaxed">{p.description}</p>

                  <div className="mb-6 flex items-baseline">
                    <span className="text-4xl font-extrabold font-mono text-white">${price}</span>
                    <span className="text-xs text-slate-400 font-mono ml-2">/ month</span>
                  </div>

                  <ul className="space-y-3 mb-8 text-xs font-mono text-slate-300">
                    {p.features.map((feat) => (
                      <li key={feat} className="flex items-center space-x-2.5">
                        <Check className="w-4 h-4 text-[#22C55E] flex-shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => onSelectPlan(p.name, price)}
                  className={`w-full py-3.5 rounded-xl font-mono text-xs font-bold transition-all shadow-xl ${
                    p.popular
                      ? 'bg-white text-black shadow-white/10 hover:scale-105'
                      : 'bg-white/5 hover:bg-white/10 text-white border border-white/10 backdrop-blur-md'
                  }`}
                >
                  {p.cta}
                </button>
              </div>
            );
          })}
        </div>

        {/* Security / Payment Guarantee */}
        <div className="mt-12 text-center flex items-center justify-center space-x-6 text-xs font-mono text-slate-400">
          <span className="flex items-center space-x-1.5">
            <Lock className="w-4 h-4 text-[#22C55E]" />
            <span>256-Bit SSL Encrypted</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <CreditCard className="w-4 h-4 text-[#0EA5E9]" />
            <span>Stripe & Razorpay Integrated</span>
          </span>
        </div>

      </div>
    </section>
  );
};
