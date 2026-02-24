import React from 'react';
import PaymentForm from '@/components/PaymentForm';
import POSMachineVisual from '@/components/POSMachineVisual';
import { Lock, Star } from 'lucide-react';

export default function PaymentPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-sky-50">
      <div className="max-w-6xl mx-auto px-4 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">

          {/* Left: Illustrations & Info */}
          <div className="hidden lg:flex flex-col items-center justify-center gap-8 pt-8">
            {/* Hero text */}
            <div className="text-center">
              <h2 className="text-3xl font-display font-bold text-foreground mb-3">
                Fast & Secure
                <span className="block text-emerald-600">Payment Processing</span>
              </h2>
              <p className="text-muted-foreground max-w-xs mx-auto">
                Your payment details are encrypted with bank-grade security. Submit with confidence.
              </p>
            </div>

            {/* Illustrations */}
            <div className="relative flex items-center justify-center gap-6 w-full">
              {/* Credit card image */}
              <div className="animate-card-float">
                <img
                  src="/assets/generated/credit-card.dim_600x380.png"
                  alt="Credit Card"
                  className="w-64 rounded-2xl shadow-xl"
                  onError={(e) => {
                    // Fallback: hide if image not found
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>

              {/* POS machine */}
              <div className="animate-pos-float">
                <img
                  src="/assets/generated/pos-machine.dim_400x500.png"
                  alt="POS Machine"
                  className="w-28 rounded-xl shadow-lg"
                  onError={(e) => {
                    // Fallback to SVG component
                    const parent = (e.target as HTMLImageElement).parentElement;
                    if (parent) {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }
                  }}
                />
                <POSMachineVisual className="mt-2" />
              </div>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap justify-center gap-3">
              {['256-bit SSL', 'PCI Compliant', 'Secure Checkout'].map((badge) => (
                <div
                  key={badge}
                  className="flex items-center gap-1.5 bg-white border border-emerald-100 rounded-full px-3 py-1.5 text-xs font-medium text-emerald-700 shadow-xs"
                >
                  <Lock className="w-3 h-3" />
                  {badge}
                </div>
              ))}
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-2xl border border-border p-4 shadow-xs max-w-xs w-full">
              <div className="flex items-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="text-xs text-muted-foreground ml-1">4.9/5 trusted by 10k+ users</span>
              </div>
              <p className="text-xs text-muted-foreground italic">
                "Fast, secure, and easy to use. My customers love the seamless checkout experience."
              </p>
            </div>
          </div>

          {/* Right: Payment Form */}
          <div className="w-full">
            <div className="bg-white rounded-3xl shadow-card border border-border p-6 sm:p-8">
              <div className="mb-6">
                <h1 className="text-2xl font-display font-bold text-foreground mb-1">
                  Complete Payment
                </h1>
                <p className="text-sm text-muted-foreground">
                  Fill in your details below to process your payment securely
                </p>
              </div>
              <PaymentForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
