import React, { useState } from 'react';
import { CreditCard, User, MapPin, Mail, Calendar, Lock, DollarSign, CheckCircle, Loader2 } from 'lucide-react';
import CreditCardVisual from './CreditCardVisual';
import { useSubmitPayment } from '../hooks/useQueries';

interface FormData {
  fullName: string;
  address: string;
  email: string;
  cardNumber: string;
  expirationDate: string;
  cvv: string;
  amount: string;
}

interface FormErrors {
  fullName?: string;
  address?: string;
  email?: string;
  cardNumber?: string;
  expirationDate?: string;
  cvv?: string;
  amount?: string;
}

function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(.{4})/g, '$1 ').trim();
}

function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length >= 3) {
    return digits.slice(0, 2) + '/' + digits.slice(2);
  }
  return digits;
}

function validateForm(data: FormData): FormErrors {
  const errors: FormErrors = {};
  if (!data.fullName.trim()) errors.fullName = 'Full name is required.';
  if (!data.address.trim()) errors.address = 'Address is required.';
  if (!data.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'A valid email is required.';
  }
  const rawCard = data.cardNumber.replace(/\s/g, '');
  if (rawCard.length !== 16) errors.cardNumber = 'Card number must be 16 digits.';
  if (!data.expirationDate || !/^\d{2}\/\d{2}$/.test(data.expirationDate)) {
    errors.expirationDate = 'Expiry must be MM/YY.';
  }
  if (!data.cvv || !/^\d{3,4}$/.test(data.cvv)) errors.cvv = 'CVV must be 3 or 4 digits.';
  const amt = parseFloat(data.amount);
  if (isNaN(amt) || amt <= 0) errors.amount = 'Enter a valid amount greater than 0.';
  return errors;
}

export default function PaymentForm() {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    address: '',
    email: '',
    cardNumber: '',
    expirationDate: '',
    cvv: '',
    amount: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const submitPayment = useSubmitPayment();

  const handleChange = (field: keyof FormData, value: string) => {
    let processed = value;
    if (field === 'cardNumber') processed = formatCardNumber(value);
    if (field === 'expirationDate') processed = formatExpiry(value);
    setFormData(prev => ({ ...prev, [field]: processed }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
    if (submitError) setSubmitError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const amountCents = Math.round(parseFloat(formData.amount) * 100);
    const rawCardNumber = formData.cardNumber.replace(/\s/g, '');

    try {
      await submitPayment.mutateAsync({
        fullName: formData.fullName,
        address: formData.address,
        email: formData.email,
        cardNumber: rawCardNumber,
        expirationDate: formData.expirationDate,
        amount: BigInt(amountCents),
      });
      setSubmitted(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Submission failed. Please try again.';
      setSubmitError(message);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-6">
          <CheckCircle className="w-10 h-10 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Submitted!</h2>
        <p className="text-gray-500 mb-8">
          Thank you, <span className="font-semibold text-gray-700">{formData.fullName}</span>. Your payment has been received.
        </p>
        <button
          onClick={() => {
            setSubmitted(false);
            setFormData({ fullName: '', address: '', email: '', cardNumber: '', expirationDate: '', cvv: '', amount: '' });
            setErrors({});
            setSubmitError(null);
          }}
          className="px-6 py-2 rounded-full bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors"
        >
          Make Another Payment
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Card Preview */}
      <div className="mb-8 flex justify-center">
        <CreditCardVisual
          cardNumber={formData.cardNumber}
          cardHolder={formData.fullName || 'YOUR NAME'}
          expiry={formData.expirationDate || 'MM/YY'}
        />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={formData.fullName}
              onChange={e => handleChange('fullName', e.target.value)}
              placeholder="John Doe"
              className={`w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition ${errors.fullName ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white'}`}
            />
          </div>
          {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Billing Address</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={formData.address}
              onChange={e => handleChange('address', e.target.value)}
              placeholder="123 Main St, City, State"
              className={`w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition ${errors.address ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white'}`}
            />
          </div>
          {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="email"
              value={formData.email}
              onChange={e => handleChange('email', e.target.value)}
              placeholder="john@example.com"
              className={`w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition ${errors.email ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white'}`}
            />
          </div>
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
        </div>

        {/* Card Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
          <div className="relative">
            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={formData.cardNumber}
              onChange={e => handleChange('cardNumber', e.target.value)}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              className={`w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500 transition ${errors.cardNumber ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white'}`}
            />
          </div>
          {errors.cardNumber && <p className="text-xs text-red-500 mt-1">{errors.cardNumber}</p>}
        </div>

        {/* Expiry + CVV */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={formData.expirationDate}
                onChange={e => handleChange('expirationDate', e.target.value)}
                placeholder="MM/YY"
                maxLength={5}
                className={`w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition ${errors.expirationDate ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white'}`}
              />
            </div>
            {errors.expirationDate && <p className="text-xs text-red-500 mt-1">{errors.expirationDate}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="password"
                value={formData.cvv}
                onChange={e => handleChange('cvv', e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="•••"
                maxLength={4}
                className={`w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition ${errors.cvv ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white'}`}
              />
            </div>
            {errors.cvv && <p className="text-xs text-red-500 mt-1">{errors.cvv}</p>}
          </div>
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Amount (USD)</label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="number"
              value={formData.amount}
              onChange={e => handleChange('amount', e.target.value)}
              placeholder="0.00"
              min="0.01"
              step="0.01"
              className={`w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition ${errors.amount ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white'}`}
            />
          </div>
          {errors.amount && <p className="text-xs text-red-500 mt-1">{errors.amount}</p>}
        </div>

        {/* Submit Error */}
        {submitError && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200">
            <p className="text-sm text-red-600">{submitError}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitPayment.isPending}
          className="w-full py-3 rounded-xl bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
        >
          {submitPayment.isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Lock className="w-4 h-4" />
              Submit Payment
            </>
          )}
        </button>
      </form>
    </div>
  );
}
