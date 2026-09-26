/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { BoosterState, ShopPackage } from '../types/candy';
import { 
  X, Check, Sparkles, ShieldCheck, CreditCard, 
  Smartphone, Wallet, ArrowRight, QrCode, Lock, 
  Crown, Gift, Star, Award, Zap, AlertTriangle, ShieldAlert,
  ChevronDown, Flame, Clock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../audio/sound';

interface ShopModalProps {
  currentGold: number;
  hasVipPass: boolean;
  purchasedPackageIds?: string[];
  onPurchaseSuccess: (pkg: ShopPackage) => void;
  onClose: () => void;
}

// Price formatting helpers for standard and high-roller premium packages
export const formatPackagePrice = (price: number): string => {
  if (price >= 1000) {
    if (price >= 10000) {
      return `$${price / 1000}k`;
    }
    return `$${price.toLocaleString()}`;
  }
  return `$${price}`;
};

export const formatPackagePriceFull = (price: number): string => {
  if (price >= 10000) {
    return `$${price / 1000}k ($${price.toLocaleString()} USD)`;
  }
  return `$${price.toLocaleString()} USD`;
};

// User specified prices:
// VIP Tiers: $100, $400, $470, $750, $890
// Ultra Premium Packages: $100k, $280k, $400k, $490k
// Coming Soon Tiers: $999, $1000, 1 Lakh Gold
const ALL_PACKAGES: ShopPackage[] = [
  {
    id: 'pkg_100',
    name: 'Royal Sugar Pass',
    price: 100,
    goldBars: 5000,
    hammers: 15,
    switches: 15,
    bombs: 10,
    shuffles: 10,
    unlimitedLivesHours: 24,
    hasPass: true,
    passTier: 'Gold',
    badge: 'Popular Pass',
    oneTimeOnly: true,
    popular: false,
  },
  {
    id: 'pkg_400',
    name: 'Candy Emperor Chest',
    price: 400,
    goldBars: 25000,
    hammers: 40,
    switches: 40,
    bombs: 35,
    shuffles: 35,
    unlimitedLivesHours: 72,
    hasPass: true,
    passTier: 'Royal',
    badge: 'Best Value',
    oneTimeOnly: true,
    popular: true,
  },
  {
    id: 'pkg_470',
    name: 'Royal Confectionery Vault',
    price: 470,
    goldBars: 35000,
    hammers: 60,
    switches: 60,
    bombs: 50,
    shuffles: 50,
    unlimitedLivesHours: 120,
    hasPass: true,
    passTier: 'Royal',
    badge: 'High Roller',
    oneTimeOnly: true,
  },
  {
    id: 'pkg_750',
    name: 'Sugar King Treasury',
    price: 750,
    goldBars: 65000,
    hammers: 120,
    switches: 120,
    bombs: 100,
    shuffles: 100,
    unlimitedLivesHours: 360,
    hasPass: true,
    passTier: 'Emperor',
    badge: 'VIP King Pass',
    oneTimeOnly: true,
  },
  {
    id: 'pkg_890',
    name: 'Grand Sugar Dynasty Bundle',
    price: 890,
    goldBars: 90000,
    hammers: 200,
    switches: 200,
    bombs: 180,
    shuffles: 180,
    unlimitedLivesHours: 720,
    hasPass: true,
    passTier: 'Emperor',
    badge: 'Dynasty VIP',
    oneTimeOnly: true,
  },
  // ULTRA HIGH-ROLLER PREMIUM PACKAGES ($100k, $280k, $400k, $490k)
  {
    id: 'pkg_100k',
    name: 'Mythic Diamond Crown Vault ($100k)',
    price: 100000,
    goldBars: 10000000, // 10 Million Gold Bars
    hammers: 10000,
    switches: 10000,
    bombs: 8000,
    shuffles: 8000,
    unlimitedLivesHours: 99999,
    hasPass: true,
    passTier: 'Mythic',
    isOneTimeLifetime: true,
    badge: '💎 $100K MYTHIC PASS',
    popular: true,
    oneTimeOnly: true,
  },
  {
    id: 'pkg_280k',
    name: 'Titan Overlord Royal Treasury ($280k)',
    price: 280000,
    goldBars: 35000000, // 35 Million Gold Bars
    hammers: 35000,
    switches: 35000,
    bombs: 30000,
    shuffles: 30000,
    unlimitedLivesHours: 99999,
    hasPass: true,
    passTier: 'Titan',
    isOneTimeLifetime: true,
    badge: '👑 $280K TITAN VIP',
    popular: false,
    oneTimeOnly: true,
  },
  {
    id: 'pkg_400k',
    name: 'Sovereign Galaxy Grand Sanctum ($400k)',
    price: 400000,
    goldBars: 60000000, // 60 Million Gold Bars
    hammers: 60000,
    switches: 60000,
    bombs: 50000,
    shuffles: 50000,
    unlimitedLivesHours: 99999,
    hasPass: true,
    passTier: 'Sovereign',
    isOneTimeLifetime: true,
    badge: '🌌 $400K SOVEREIGN PASS',
    popular: false,
    oneTimeOnly: true,
  },
  {
    id: 'pkg_490k',
    name: 'Omnipotent Candy God Supreme Treasury ($490k)',
    price: 490000,
    goldBars: 100000000, // 100 Million Gold Bars (10 Crore)
    hammers: 100000,
    switches: 100000,
    bombs: 90000,
    shuffles: 90000,
    unlimitedLivesHours: 99999,
    hasPass: true,
    passTier: 'Omnipotent',
    isOneTimeLifetime: true,
    badge: '⚡ $490K OMNIPOTENT GOD',
    popular: true,
    oneTimeOnly: true,
  },
  // COMING SOON TIERS AS REQUESTED: 999, 1000, 1 Lakh Gold
  {
    id: 'pkg_999',
    name: 'Celestial Candy God Pass',
    price: 999,
    goldBars: 200000,
    hammers: 500,
    switches: 500,
    bombs: 500,
    shuffles: 500,
    unlimitedLivesHours: 99999,
    hasPass: true,
    passTier: 'Celestial',
    isOneTimeLifetime: true,
    badge: '⏳ COMING SOON',
    isComingSoon: true,
    comingSoonText: '999 Gold Tier - Coming Soon! (Wait for next update...)',
  },
  {
    id: 'pkg_1000',
    name: 'Sugar Emperor 1000 Mega Chest',
    price: 1000,
    goldBars: 500000,
    hammers: 1000,
    switches: 1000,
    bombs: 800,
    shuffles: 800,
    unlimitedLivesHours: 99999,
    hasPass: true,
    passTier: 'Lifetime',
    badge: '⏳ 1000 TIER COMING SOON',
    isComingSoon: true,
    comingSoonText: '1000 Special Pack - Arriving in Next Update! (Wait for update...)',
  },
  {
    id: 'pkg_1lakh',
    name: '1 Lakh Gold (1,00,000) Supreme Vault',
    price: 2500,
    goldBars: 100000,
    hammers: 2500,
    switches: 2500,
    bombs: 2000,
    shuffles: 2000,
    unlimitedLivesHours: 99999,
    hasPass: true,
    passTier: 'Lifetime',
    badge: '⏳ 1 LAKH GOLD COMING SOON',
    isComingSoon: true,
    comingSoonText: '1 Lakh (1,00,000) Gold Pack - Coming Soon in next update! (Wait for update...)',
  },
];

type CheckoutStep = 'package_select' | 'order_verification' | 'payment_method' | 'human_verification' | 'processing' | 'success';

export const ShopModal: React.FC<ShopModalProps> = ({
  currentGold,
  hasVipPass,
  purchasedPackageIds = ['pkg_100'], // Default to pkg_100 purchased as requested
  onPurchaseSuccess,
  onClose,
}) => {
  const [selectedPkg, setSelectedPkg] = useState<ShopPackage | null>(null);
  const [step, setStep] = useState<CheckoutStep>('package_select');
  const [purchaseLimitAlert, setPurchaseLimitAlert] = useState<string | null>(null);
  const [comingSoonToast, setComingSoonToast] = useState<string | null>(null);

  const packageListRef = useRef<HTMLDivElement>(null);
  
  // Payment methods
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'wallet'>('upi');
  const [upiId, setUpiId] = useState('itzphonk28@upi');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8821');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('786');

  // Human Verification State
  const [humanPin, setHumanPin] = useState('');
  const [humanPinError, setHumanPinError] = useState(false);
  const [sliderVal, setSliderVal] = useState<number>(0);
  const [sliderSolved, setSliderSolved] = useState(false);

  const isPurchased = (pkgId: string) => {
    return purchasedPackageIds.includes(pkgId);
  };

  const handlePackageClick = (pkg: ShopPackage) => {
    // Coming Soon packages check
    if (pkg.isComingSoon) {
      sound.playInvalid();
      setComingSoonToast(
        pkg.comingSoonText || 'Next update coming soon! Wait for 999, 1000, and 1 Lakh Gold packs...'
      );
      setTimeout(() => setComingSoonToast(null), 4000);
      return;
    }

    // One-time payment & already purchased limit check
    if (isPurchased(pkg.id)) {
      sound.playInvalid();
      setPurchaseLimitAlert(
        'तुमने पहले से परचेस करके रखा है। ये तुम एक ही बार में परचेस कर सकते हो और तुम नीचे जाके देखो और भी होंगे।'
      );
      return;
    }

    sound.playPop();
    setSelectedPkg(pkg);
    setPurchaseLimitAlert(null);
    setStep('order_verification');
  };

  const handleConfirmToPay = () => {
    if (!selectedPkg) return;

    // Strict One-time limit check when user clicks "Confirm to Pay"
    if (isPurchased(selectedPkg.id)) {
      sound.playInvalid();
      setPurchaseLimitAlert(
        'तुमने पहले से परचेस करके रखा है। ये तुम एक ही बार में परचेस कर सकते हो और तुम नीचे जाके देखो और भी होंगे।'
      );
      setStep('package_select');
      return;
    }

    sound.playPop();
    setStep('payment_method');
  };

  const handleVerifyHuman = () => {
    if (!selectedPkg) return;

    // Strict processing limit check:
    // If this package is already purchased, processing is strictly blocked!
    if (isPurchased(selectedPkg.id)) {
      sound.playInvalid();
      setPurchaseLimitAlert(
        'तुमने पहले से परचेस करके रखा है। ये तुम एक ही बार में परचेस कर सकते हो और तुम नीचे जाके देखो और भी होंगे।'
      );
      setStep('package_select');
      return;
    }

    if (humanPin !== '777' && humanPin !== '1234' && humanPin.length < 3 && !sliderSolved) {
      sound.playInvalid();
      setHumanPinError(true);
      return;
    }

    sound.playMatch(3);
    setStep('processing');

    setTimeout(() => {
      // Final re-check
      if (isPurchased(selectedPkg.id)) {
        sound.playInvalid();
        setPurchaseLimitAlert(
          'तुमने पहले से परचेस करके रखा है। ये तुम एक ही बार में परचेस कर सकते हो और तुम नीचे जाके देखो और भी होंगे।'
        );
        setStep('package_select');
        return;
      }

      sound.playSugarCrush();
      confetti({
        particleCount: 160,
        spread: 100,
        origin: { y: 0.5 },
      });
      onPurchaseSuccess(selectedPkg);
      setStep('success');
    }, 2000);
  };

  const handleScrollDownToMore = () => {
    setPurchaseLimitAlert(null);
    setStep('package_select');
    setTimeout(() => {
      if (packageListRef.current) {
        packageListRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 animate-fade-in select-none">
      <div className="bg-gradient-to-b from-purple-900 via-indigo-950 to-purple-950 border-4 border-amber-400 rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-[0_0_50px_rgba(245,158,11,0.6)] overflow-hidden text-white">
        
        {/* Top Header */}
        <div className="p-3.5 sm:p-4 bg-purple-950/95 border-b border-purple-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-3xl">💎</span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-amber-300">Candy Crush 2 VIP Shop & Gold</h2>
                {hasVipPass && (
                  <span className="bg-gradient-to-r from-amber-400 to-yellow-500 text-purple-950 font-black text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 shadow">
                    <Crown className="w-3 h-3" /> VIP ACTIVE
                  </span>
                )}
              </div>
              <p className="text-xs text-purple-300">Official In-Game Gold Bars & Season Passes</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2.5">
            <div className="bg-purple-900/80 border border-amber-400/60 px-3 py-1 rounded-full flex items-center gap-1.5 shadow">
              <span className="text-amber-400 font-black">🪙</span>
              <span className="text-xs font-black text-amber-300">{currentGold.toLocaleString()} Gold</span>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-purple-800 hover:bg-pink-600 text-white flex items-center justify-center font-black transition-all cursor-pointer shadow"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PROMINENT MANDATORY NOTICE: PAYMENT ON YOUR OWN RISK */}
        <div className="bg-gradient-to-r from-red-600 via-amber-600 to-red-600 text-white px-3 py-1.5 text-xs font-black flex items-center justify-center gap-2 border-b border-yellow-300 shadow animate-pulse">
          <ShieldAlert className="w-4 h-4 text-yellow-200 shrink-0" />
          <span className="tracking-wide uppercase">
            ⚠️ पेमेंट ऑन योर रिस्क • PAYMENT AT YOUR OWN RISK (NO REFUND / NON-REVERSIBLE)
          </span>
        </div>

        {/* Global Alert Toast: Purchase Limit Reached */}
        {purchaseLimitAlert && (
          <div className="mx-4 mt-3 p-3.5 bg-gradient-to-r from-red-900/95 via-purple-950/95 to-red-900/95 border-2 border-amber-400 rounded-2xl shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-white animate-bounce">
            <div className="flex items-center gap-2.5 text-left">
              <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0" />
              <div>
                <p className="text-xs sm:text-sm font-black text-amber-300 leading-snug">
                  {purchaseLimitAlert}
                </p>
                <p className="text-[11px] text-purple-200 mt-0.5">
                  (One-Time Purchase Limit: You have already purchased this item. Explore higher available packages below!)
                </p>
              </div>
            </div>
            <button
              onClick={handleScrollDownToMore}
              className="shrink-0 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-purple-950 font-black text-xs shadow cursor-pointer flex items-center gap-1 active:scale-95"
            >
              <span>नीचे देखें (View More)</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Coming Soon Toast */}
        {comingSoonToast && (
          <div className="mx-4 mt-3 p-3 bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 border-2 border-cyan-400 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-black text-cyan-200">
            <Clock className="w-5 h-5 text-cyan-400 shrink-0" />
            <div className="flex-1">
              <p>{comingSoonToast}</p>
            </div>
            <button onClick={() => setComingSoonToast(null)} className="text-white hover:text-cyan-300">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Dynamic Modal Content */}
        <div className="flex-1 overflow-y-auto p-4">
          
          {/* STEP 1: PACKAGE SELECT */}
          {step === 'package_select' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-pink-900/60 via-purple-900/60 to-amber-900/60 p-3.5 rounded-2xl border border-amber-400/40 flex items-center justify-between">
                <div>
                  <h3 className="font-black text-amber-300 text-sm flex items-center gap-1.5">
                    <Crown className="w-4 h-4 text-amber-400" />
                    One-Time Purchase Bundles & VIP Passes
                  </h3>
                  <p className="text-xs text-purple-200">
                    Each bundle is a 1-time payment. Notice: <span className="text-amber-300 font-bold">पेमेंट ऑन योर रिस्क (Payment on your own risk)</span>
                  </p>
                </div>
              </div>

              {/* Package Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {ALL_PACKAGES.map((pkg) => {
                  const purchased = isPurchased(pkg.id);
                  const isComing = pkg.isComingSoon;

                  return (
                    <div
                      key={pkg.id}
                      onClick={() => handlePackageClick(pkg)}
                      className={`relative p-4 rounded-3xl border-2 transition-all flex flex-col justify-between ${
                        isComing
                          ? 'bg-purple-950/40 border-cyan-700/60 opacity-80 cursor-pointer hover:border-cyan-400'
                          : purchased
                          ? 'bg-purple-950/50 border-purple-800 opacity-75 cursor-pointer hover:border-amber-400'
                          : pkg.popular
                          ? 'bg-gradient-to-b from-purple-800/80 to-pink-900/80 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:scale-[1.02] cursor-pointer'
                          : 'bg-purple-950/70 hover:bg-purple-900/70 border-purple-700/80 hover:border-pink-400 cursor-pointer'
                      }`}
                    >
                      {/* Top Badges */}
                      <div className="flex items-center gap-1.5 absolute -top-2.5 right-4">
                        {isComing ? (
                          <span className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow border border-cyan-300 flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5" /> COMING SOON • कमिंग सून
                          </span>
                        ) : purchased ? (
                          <span className="bg-red-950 text-red-200 border border-red-500 text-[10px] font-black px-2.5 py-0.5 rounded-full shadow flex items-center gap-1">
                            <Lock className="w-2.5 h-2.5 text-amber-400" /> ALREADY PURCHASED (1 TIME LIMIT)
                          </span>
                        ) : (
                          pkg.badge && (
                            <span className="bg-gradient-to-r from-amber-400 to-pink-500 text-purple-950 text-[10px] font-black px-2.5 py-0.5 rounded-full shadow border border-white">
                              {pkg.badge}
                            </span>
                          )
                        )}
                      </div>

                      <div>
                        <div className="flex items-center justify-between">
                          <h4 className="font-black text-base text-white">{pkg.name}</h4>
                          <span className="text-xl font-black text-amber-300">${pkg.price}</span>
                        </div>

                        <div className="flex items-center gap-1 text-xs text-amber-400 font-bold mt-1">
                          <span>🪙 {pkg.goldBars.toLocaleString()} Gold Bars</span>
                          {pkg.hasPass && (
                            <span className="bg-pink-600/80 text-white text-[9px] px-1.5 py-0.2 rounded font-black">
                              {pkg.passTier} Pass
                            </span>
                          )}
                        </div>

                        {/* Already Purchased Specific Notice for pkg_100 or any purchased package */}
                        {purchased ? (
                          <div className="mt-2 p-2 rounded-xl bg-red-950/80 border border-red-500/60 text-[11px] text-amber-300 font-bold leading-tight space-y-1">
                            <p className="flex items-center gap-1 text-red-300">
                              <Lock className="w-3 h-3 text-red-400 shrink-0" />
                              <span>तुमने पहले से परचेस करके रखा है।</span>
                            </p>
                            <p className="text-[10px] text-purple-200 font-normal">
                              ये तुम एक ही बार में परचेस कर सकते हो और तुम नीचे जाके देखो और भी होंगे।
                            </p>
                          </div>
                        ) : isComing ? (
                          <div className="mt-2 p-2 rounded-xl bg-cyan-950/70 border border-cyan-500/50 text-[11px] text-cyan-300 font-bold flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                            <span>Next update coming soon! Wait for...</span>
                          </div>
                        ) : (
                          <div className="mt-1.5 bg-amber-400/20 text-amber-300 border border-amber-400/50 text-[10px] font-black px-2 py-0.5 rounded-lg flex items-center justify-between">
                            <span>⚡ One-Time Payment</span>
                            <span className="text-red-300 text-[9px]">पेमेंट ऑन योर रिस्क</span>
                          </div>
                        )}

                        <div className="mt-3 grid grid-cols-2 gap-1.5 text-[11px] text-purple-200">
                          <div className="bg-purple-900/60 px-2 py-1 rounded-lg flex items-center gap-1">
                            <span>🔨 Hammer:</span>
                            <span className="font-bold text-amber-300">+{pkg.hammers}</span>
                          </div>
                          <div className="bg-purple-900/60 px-2 py-1 rounded-lg flex items-center gap-1">
                            <span>⇄ Free Swap:</span>
                            <span className="font-bold text-amber-300">+{pkg.switches}</span>
                          </div>
                          <div className="bg-purple-900/60 px-2 py-1 rounded-lg flex items-center gap-1">
                            <span>💣 Color Bomb:</span>
                            <span className="font-bold text-amber-300">+{pkg.bombs}</span>
                          </div>
                          <div className="bg-purple-900/60 px-2 py-1 rounded-lg flex items-center gap-1">
                            <span>⚡ Shuffle:</span>
                            <span className="font-bold text-amber-300">+{pkg.shuffles}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      {isComing ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePackageClick(pkg);
                          }}
                          className="mt-3.5 w-full py-2 rounded-xl bg-purple-900/80 hover:bg-purple-800 text-cyan-300 font-black text-xs border border-cyan-500/50 shadow flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Lock className="w-3.5 h-3.5" />
                          <span>Coming Soon (कमिंग सून - Wait for update)</span>
                        </button>
                      ) : purchased ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePackageClick(pkg);
                          }}
                          className="mt-3.5 w-full py-2 rounded-xl bg-purple-900/70 hover:bg-purple-800 text-red-300 font-black text-xs border border-red-500/50 shadow flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Lock className="w-3.5 h-3.5" />
                          <span>Already Purchased • नीचे देखें</span>
                        </button>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePackageClick(pkg);
                          }}
                          className="mt-3.5 w-full py-2 rounded-xl bg-gradient-to-r from-amber-400 to-pink-500 hover:from-amber-300 hover:to-pink-400 text-purple-950 font-black text-sm shadow-md flex items-center justify-center gap-1 cursor-pointer active:scale-95"
                        >
                          <span>Purchase for ${pkg.price}</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Reference Anchor to scroll to lower packages */}
              <div ref={packageListRef} className="pt-2">
                <div className="bg-gradient-to-r from-purple-900/80 via-indigo-900/80 to-purple-900/80 p-4 rounded-3xl border-2 border-cyan-400/50 text-center space-y-2">
                  <div className="flex items-center justify-center gap-2 text-cyan-300 font-black text-sm">
                    <Sparkles className="w-4 h-4" />
                    <span>More Gold & Packages Coming Soon! (अगले अपडेट में और भी गोल्ड आने वाले हैं)</span>
                  </div>
                  <p className="text-xs text-purple-200 max-w-lg mx-auto leading-relaxed">
                    999, 1000, and 1 Lakh (1,00,000) Gold packs are in progress. Stay tuned for the upcoming game release! All payments: <span className="text-amber-300 font-bold">पेमेंट ऑन योर रिस्क</span>.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: ORDER VERIFICATION */}
          {step === 'order_verification' && selectedPkg && (
            <div className="space-y-4 max-w-md mx-auto">
              {/* Payment on your risk alert */}
              <div className="bg-red-950/80 border-2 border-red-500 p-2.5 rounded-2xl flex items-center gap-2 text-xs font-black text-red-200">
                <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />
                <span>सूचना: पेमेंट ऑन योर रिस्क (Notice: Payment on your own risk - 1 Time Payment)</span>
              </div>

              <div className="bg-purple-950/80 p-4 rounded-3xl border-2 border-purple-700/80 text-center space-y-3">
                <span className="inline-block p-3 rounded-full bg-amber-400 text-purple-950 text-2xl shadow">
                  🛡️
                </span>
                <h3 className="text-lg font-black text-amber-300">Step 1: Order Verification</h3>
                <p className="text-xs text-purple-200">
                  Please review and confirm your package order before proceeding to checkout:
                </p>

                <div className="bg-purple-900/70 p-3.5 rounded-2xl border border-purple-700 text-left space-y-2 text-xs">
                  <div className="flex justify-between border-b border-purple-800 pb-1.5">
                    <span className="text-purple-300">Item:</span>
                    <span className="font-black text-white">{selectedPkg.name}</span>
                  </div>
                  <div className="flex justify-between border-b border-purple-800 pb-1.5">
                    <span className="text-purple-300">Player Account:</span>
                    <span className="font-mono text-cyan-300">itzphonk28@gmail.com</span>
                  </div>
                  <div className="flex justify-between border-b border-purple-800 pb-1.5">
                    <span className="text-purple-300">Purchase Limit:</span>
                    <span className="font-bold text-amber-300">One-Time Only (1 बार)</span>
                  </div>
                  <div className="flex justify-between border-b border-purple-800 pb-1.5">
                    <span className="text-purple-300">Included Pass:</span>
                    <span className="font-bold text-pink-300">{selectedPkg.passTier || 'VIP'} Season Pass</span>
                  </div>
                  <div className="flex justify-between border-b border-purple-800 pb-1.5">
                    <span className="text-purple-300">Gold Coins:</span>
                    <span className="font-bold text-amber-300">+{selectedPkg.goldBars.toLocaleString()} Bars</span>
                  </div>
                  <div className="flex justify-between pt-1 text-sm font-black">
                    <span className="text-white">Total Amount:</span>
                    <span className="text-amber-300 text-base">${selectedPkg.price} USD</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setStep('package_select')}
                  className="flex-1 py-2.5 rounded-2xl bg-purple-900 hover:bg-purple-800 text-purple-200 font-bold text-xs cursor-pointer"
                >
                  Back to Shop
                </button>
                <button
                  onClick={handleConfirmToPay}
                  className="flex-2 py-2.5 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-black text-sm shadow flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>Confirm to Pay ${selectedPkg.price}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PAYMENT METHOD SELECTION */}
          {step === 'payment_method' && selectedPkg && (
            <div className="space-y-4 max-w-md mx-auto">
              {/* Payment on your risk alert */}
              <div className="bg-red-950/80 border-2 border-red-500 p-2.5 rounded-2xl flex items-center gap-2 text-xs font-black text-red-200">
                <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />
                <span>चेतावनी: पेमेंट ऑन योर रिस्क (Payment on your own risk)</span>
              </div>

              <div className="bg-purple-950/80 p-4 rounded-3xl border-2 border-purple-700/80 space-y-3">
                <div className="flex items-center justify-between border-b border-purple-800 pb-2">
                  <h3 className="font-black text-amber-300 text-sm">Step 2: Choose Payment Method</h3>
                  <span className="text-xs font-black text-white bg-purple-900 px-2 py-0.5 rounded-full border border-purple-700">
                    Pay: ${selectedPkg.price}
                  </span>
                </div>

                {/* Method Tabs */}
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    onClick={() => setPaymentMethod('upi')}
                    className={`py-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1 border transition-all cursor-pointer ${
                      paymentMethod === 'upi'
                        ? 'bg-amber-400 text-purple-950 border-white shadow'
                        : 'bg-purple-900/60 text-purple-200 border-purple-700 hover:bg-purple-800'
                    }`}
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>UPI / BHIM</span>
                  </button>

                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`py-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1 border transition-all cursor-pointer ${
                      paymentMethod === 'card'
                        ? 'bg-amber-400 text-purple-950 border-white shadow'
                        : 'bg-purple-900/60 text-purple-200 border-purple-700 hover:bg-purple-800'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Debit Card</span>
                  </button>

                  <button
                    onClick={() => setPaymentMethod('wallet')}
                    className={`py-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1 border transition-all cursor-pointer ${
                      paymentMethod === 'wallet'
                        ? 'bg-amber-400 text-purple-950 border-white shadow'
                        : 'bg-purple-900/60 text-purple-200 border-purple-700 hover:bg-purple-800'
                    }`}
                  >
                    <Wallet className="w-4 h-4" />
                    <span>Candy Wallet</span>
                  </button>
                </div>

                {/* Sub-view for UPI / BHIM */}
                {paymentMethod === 'upi' && (
                  <div className="bg-purple-900/50 p-3 rounded-2xl border border-purple-700 space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="bg-white p-2 rounded-xl text-purple-950">
                        <QrCode className="w-12 h-12" />
                      </div>
                      <div className="text-xs">
                        <p className="font-bold text-amber-300">Scan BHIM UPI QR Code</p>
                        <p className="text-[11px] text-purple-300">Supports GPay, PhonePe, Paytm, BHIM</p>
                        <span className="text-[10px] bg-green-950 text-green-300 px-2 py-0.5 rounded border border-green-600 mt-1 inline-block">
                          Verified Merchant: King Candy Confection
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] text-purple-300 font-bold block mb-1">
                        Or enter your VPA / UPI ID:
                      </label>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className="w-full bg-purple-950 border border-purple-600 rounded-xl px-3 py-2 text-xs font-mono text-cyan-300 focus:outline-none focus:border-amber-400"
                        placeholder="yourname@upi"
                      />
                    </div>
                  </div>
                )}

                {/* Sub-view for Card */}
                {paymentMethod === 'card' && (
                  <div className="bg-purple-900/50 p-3 rounded-2xl border border-purple-700 space-y-2.5 text-xs">
                    <div>
                      <label className="text-[11px] text-purple-300 font-bold block mb-1">
                        Debit / Credit Card Number:
                      </label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full bg-purple-950 border border-purple-600 rounded-xl px-3 py-2 font-mono text-amber-300 focus:outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] text-purple-300 font-bold block mb-1">Expiry:</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full bg-purple-950 border border-purple-600 rounded-xl px-3 py-2 font-mono text-white text-center focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-purple-300 font-bold block mb-1">CVV:</label>
                        <input
                          type="password"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          className="w-full bg-purple-950 border border-purple-600 rounded-xl px-3 py-2 font-mono text-white text-center focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Sub-view for Wallet */}
                {paymentMethod === 'wallet' && (
                  <div className="bg-purple-900/50 p-3 rounded-2xl border border-purple-700 space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-purple-300">Candy Crush Account Balance:</span>
                      <span className="font-black text-amber-300">${(currentGold / 100).toFixed(2)} USD</span>
                    </div>
                    <p className="text-[11px] text-purple-300">
                      You can pay via your verified Sugar Gold Wallet or connected payment profile.
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setStep('order_verification')}
                  className="flex-1 py-2.5 rounded-2xl bg-purple-900 hover:bg-purple-800 text-purple-200 font-bold text-xs cursor-pointer"
                >
                  Back
                </button>
                <button
                  onClick={() => {
                    sound.playPop();
                    setStep('human_verification');
                  }}
                  className="flex-2 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-pink-500 hover:from-amber-300 hover:to-pink-400 text-purple-950 font-black text-sm shadow flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>Proceed to Human Verification</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: HUMAN VERIFICATION */}
          {step === 'human_verification' && selectedPkg && (
            <div className="space-y-4 max-w-md mx-auto">
              {/* Payment on your risk alert */}
              <div className="bg-red-950/80 border-2 border-red-500 p-2.5 rounded-2xl flex items-center gap-2 text-xs font-black text-red-200">
                <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />
                <span>अंतिम चेतावनी: पेमेंट ऑन योर रिस्क (Payment on your own risk)</span>
              </div>

              <div className="bg-purple-950/80 p-5 rounded-3xl border-2 border-amber-400 space-y-4 text-center">
                <div className="w-12 h-12 rounded-full bg-amber-400 text-purple-950 flex items-center justify-center mx-auto shadow text-2xl font-black">
                  🤖
                </div>
                <div>
                  <h3 className="text-lg font-black text-amber-300">Final Step: Human Verification</h3>
                  <p className="text-xs text-purple-200 mt-1">
                    (ह्यूमन वेरिफिकेशन) - Please solve the anti-bot sugar security challenge to authorize payment of ${selectedPkg.price}.
                  </p>
                </div>

                {/* Interactive Captcha 1: Slide to unlock */}
                <div className="p-3 bg-purple-900/60 rounded-2xl border border-purple-700 space-y-2">
                  <span className="text-xs text-purple-300 font-semibold block">
                    Security Option 1: Slide candy slider to the right
                  </span>
                  <div className="relative w-full h-12 bg-purple-950 rounded-full border border-purple-600 flex items-center px-2 overflow-hidden">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={sliderVal}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10) || 0;
                        setSliderVal(val);
                        if (val > 85 && !sliderSolved) {
                          setSliderSolved(true);
                          setSliderVal(100);
                          sound.playPop();
                        }
                      }}
                      className="w-full accent-pink-500 cursor-pointer"
                    />
                    {sliderSolved && (
                      <span className="absolute inset-0 bg-green-500/90 text-purple-950 font-black flex items-center justify-center gap-1 text-xs">
                        <Check className="w-4 h-4" /> Slide Verified Human!
                      </span>
                    )}
                  </div>
                </div>

                {/* Interactive Captcha 2: Enter PIN Code */}
                <div className="p-3 bg-purple-900/60 rounded-2xl border border-purple-700 space-y-2 text-left">
                  <span className="text-xs text-purple-300 font-semibold block">
                    Or Enter Security Code (Default: 777 or 1234):
                  </span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      maxLength={4}
                      value={humanPin}
                      onChange={(e) => {
                        setHumanPin(e.target.value);
                        setHumanPinError(false);
                      }}
                      placeholder="e.g. 777"
                      className="flex-1 bg-purple-950 border border-purple-600 rounded-xl px-3 py-2 text-center font-mono text-base font-black text-amber-300 focus:outline-none focus:border-amber-400"
                    />
                    <button
                      onClick={() => {
                        setHumanPin('777');
                        setSliderVal(100);
                        setSliderSolved(true);
                        sound.playPop();
                      }}
                      className="text-xs bg-purple-800 hover:bg-purple-700 text-purple-200 px-3 py-1.5 rounded-xl cursor-pointer font-bold"
                    >
                      Auto-Fill (777)
                    </button>
                  </div>
                  {humanPinError && (
                    <span className="text-[11px] text-red-400 font-bold block">
                      ⚠️ Verification failed. Slide the bar or enter 777!
                    </span>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setStep('payment_method')}
                  className="flex-1 py-2.5 rounded-2xl bg-purple-900 hover:bg-purple-800 text-purple-200 font-bold text-xs cursor-pointer"
                >
                  Back
                </button>
                <button
                  onClick={handleVerifyHuman}
                  className="flex-2 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-black text-sm shadow-xl flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <ShieldCheck className="w-5 h-5 text-amber-300" />
                  <span>Verify Human & Pay ${selectedPkg.price}</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: PROCESSING */}
          {step === 'processing' && (
            <div className="p-8 text-center space-y-4 max-w-sm mx-auto">
              <div className="w-16 h-16 border-4 border-amber-400 border-t-pink-500 rounded-full animate-spin mx-auto"></div>
              <h3 className="text-xl font-black text-amber-300">Processing Payment...</h3>
              <p className="text-xs text-purple-200">
                Authorizing secure payment with UPI / Banking Gateway and issuing VIP credentials...
              </p>
              <div className="bg-red-950/70 border border-red-500/50 p-2 rounded-xl text-[11px] text-red-300 font-bold">
                ⚠️ पेमेंट ऑन योर रिस्क • Processing payment at your own risk
              </div>
            </div>
          )}

          {/* STEP 6: SUCCESS */}
          {step === 'success' && selectedPkg && (
            <div className="p-6 text-center space-y-4 max-w-md mx-auto">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 text-purple-950 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(245,158,11,0.8)] text-4xl animate-bounce">
                👑
              </div>
              <div>
                <h3 className="text-2xl font-black text-amber-300">Payment Successful!</h3>
                <p className="text-sm text-pink-300 font-bold mt-1">
                  You are now a Royal VIP Member!
                </p>
                <p className="text-xs text-purple-200 mt-1">
                  Purchased {selectedPkg.name} (${selectedPkg.price}). All boosters and rewards have been delivered to your inventory!
                </p>
              </div>

              <div className="bg-purple-950/80 p-4 rounded-2xl border border-amber-400/60 text-xs text-left space-y-1.5">
                <div className="text-amber-300 font-bold flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-green-400" />
                  <span>+{selectedPkg.goldBars.toLocaleString()} Gold Bars added</span>
                </div>
                <div className="text-pink-300 font-bold flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-green-400" />
                  <span>+{selectedPkg.hammers} Lollipop Hammers, +{selectedPkg.switches} Free Swaps</span>
                </div>
                <div className="text-cyan-300 font-bold flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-green-400" />
                  <span>+{selectedPkg.bombs} Color Bombs, +{selectedPkg.shuffles} Shuffles</span>
                </div>
                <div className="text-purple-200 font-bold flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-green-400" />
                  <span>Unlimited Lives for {selectedPkg.unlimitedLivesHours} Hours!</span>
                </div>
              </div>

              <button
                onClick={() => {
                  sound.playPop();
                  onClose();
                }}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-pink-500 hover:from-amber-300 hover:to-pink-400 text-purple-950 font-black text-sm shadow-xl cursor-pointer"
              >
                Enjoy Your Rewards!
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
