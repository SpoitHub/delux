import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CreditCard, Shield, CheckCircle, Lock } from 'lucide-react';
import { useOrder } from '../features/orders/hooks';
import { formatPrice } from '../shared/lib/formatters';
import { useToast } from '../shared/ui/toast-context';
import { PageSpinner } from '../shared/ui/Spinner';

export const PaymentPage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { toast } = useToast();
  const { data: order, isLoading } = useOrder(orderId ?? '');
  const [processing, setProcessing] = useState(false);
  const [paid, setPaid] = useState(false);

  if (isLoading) return <PageSpinner />;

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <h2 className="text-3xl font-black text-white mb-3">Order Not Found</h2>
        <p className="text-gray-400 text-sm mb-6">We couldn't find this order. It may not have been created yet.</p>
        <Link to="/" className="text-[#39ff14] text-xs font-bold tracking-widest uppercase hover:underline">
          Go Home
        </Link>
      </div>
    );
  }

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setPaid(true);
      order.payment_status = 'paid';
      toast('Payment successful!', 'success');
    }, 2000);
  };

  if (paid) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="w-20 h-20 rounded-full bg-[#39ff14]/10 flex items-center justify-center mb-6">
          <CheckCircle size={40} className="text-[#39ff14]" />
        </div>
        <h2 className="text-3xl font-black text-white mb-3">Payment Successful</h2>
        <p className="text-gray-400 text-sm mb-2">Order #{order.id} has been paid.</p>
        <p className="text-[#39ff14] text-2xl font-black mb-8">{formatPrice(order.total)}</p>
        <Link
          to={`/orders/${order.id}`}
          className="bg-[#39ff14] text-black px-8 py-4 rounded-xl text-xs font-bold tracking-widest uppercase hover:bg-[#32e612] transition-colors shadow-[0_0_15px_rgba(57,255,20,0.3)]"
        >
          View Order
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full pb-24">
      {/* Back */}
      <Link to={`/orders/${order.id}`} className="flex items-center gap-2 text-gray-400 hover:text-white text-xs font-bold tracking-widest uppercase mb-8 transition-colors w-fit">
        <ArrowLeft size={14} />
        Back to Order
      </Link>

      <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-none mb-12">
        <span className="text-white block">SECURE</span>
        <span className="text-[#39ff14] block">PAYMENT</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Payment Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#111] border border-white/5 rounded-2xl p-6 md:p-8 space-y-5">
            <h2 className="text-lg font-bold text-white tracking-wider uppercase flex items-center gap-2">
              <CreditCard size={18} className="text-[#39ff14]" />
              Card Details
            </h2>
            <div>
              <label htmlFor="card-number" className="block text-gray-400 text-xs font-bold mb-2 uppercase tracking-widest">Card Number</label>
              <input
                id="card-number"
                type="text"
                placeholder="4242 4242 4242 4242"
                maxLength={19}
                className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#39ff14] transition-colors"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="card-expiry" className="block text-gray-400 text-xs font-bold mb-2 uppercase tracking-widest">Expiry</label>
                <input
                  id="card-expiry"
                  type="text"
                  placeholder="MM / YY"
                  maxLength={7}
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#39ff14] transition-colors"
                />
              </div>
              <div>
                <label htmlFor="card-cvc" className="block text-gray-400 text-xs font-bold mb-2 uppercase tracking-widest">CVC</label>
                <input
                  id="card-cvc"
                  type="text"
                  placeholder="123"
                  maxLength={4}
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#39ff14] transition-colors"
                />
              </div>
            </div>
            <div>
              <label htmlFor="cardholder-name" className="block text-gray-400 text-xs font-bold mb-2 uppercase tracking-widest">Cardholder Name</label>
              <input
                id="cardholder-name"
                type="text"
                placeholder="JOHN DOE"
                className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#39ff14] transition-colors"
              />
            </div>
          </div>

          {/* Security Note */}
          <div className="flex items-center gap-3 bg-[#111] border border-white/5 rounded-2xl p-4 text-gray-400 text-xs">
            <Shield size={18} className="text-[#39ff14] flex-shrink-0" />
            <p>Your payment details are processed securely. We do not store card information. This is a demo — no real charges will be made.</p>
          </div>
        </div>

        {/* Sidebar — Order Summary */}
        <div className="space-y-6">
          <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
            <h3 className="text-white text-sm font-bold tracking-widest uppercase mb-4">Order Summary</h3>
            <div className="space-y-3 mb-6">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <span className="text-gray-400 truncate mr-2">
                    {item.item_type === 'ticket'
                      ? `${item.event?.title ?? 'Event'} — ${item.ticket_type?.name ?? 'Ticket'}`
                      : item.product?.title ?? 'Product'}
                    {item.quantity > 1 && ` ×${item.quantity}`}
                  </span>
                  <span className="text-white font-bold flex-shrink-0">{formatPrice(item.total_price)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-white/5 pt-4 flex justify-between items-center">
              <span className="text-gray-400 text-xs font-bold tracking-widest uppercase">Total</span>
              <span className="text-2xl font-black text-[#39ff14]">{formatPrice(order.total)}</span>
            </div>
          </div>

          <button
            onClick={handlePay}
            disabled={processing}
            className="w-full bg-[#39ff14] text-black px-6 py-4 rounded-xl text-xs font-bold tracking-widest uppercase hover:bg-[#32e612] transition-all shadow-[0_0_20px_rgba(57,255,20,0.3)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processing ? (
              <>
                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Lock size={14} />
                Pay {formatPrice(order.total)}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};