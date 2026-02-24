import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Truck, Package, MapPin } from 'lucide-react';
import { useCart } from '../features/cart/hooks';
import { useCreateOrder } from '../features/orders/hooks';
import { formatPrice } from '../shared/lib/formatters';
import { PageSpinner } from '../shared/ui/Spinner';
import { EmptyState } from '../shared/ui/EmptyState';
import { useToast } from '../shared/ui/toast-context';

const checkoutSchema = z.discriminatedUnion('delivery_type', [
  z.object({
    delivery_type: z.literal('none'),
    contact_name: z.string().min(2, 'Please enter your name'),
    contact_phone: z.string().min(10, 'Please enter a valid phone number'),
    city: z.string().optional(),
    address_line: z.string().optional(),
    postal_code: z.string().optional(),
  }),
  z.object({
    delivery_type: z.literal('pickup'),
    contact_name: z.string().min(2, 'Please enter your name'),
    contact_phone: z.string().min(10, 'Please enter a valid phone number'),
    city: z.string().optional(),
    address_line: z.string().optional(),
    postal_code: z.string().optional(),
  }),
  z.object({
    delivery_type: z.literal('delivery'),
    contact_name: z.string().min(2, 'Please enter your name'),
    contact_phone: z.string().min(10, 'Please enter a valid phone number'),
    city: z.string().min(2, 'Please enter a city'),
    address_line: z.string().min(5, 'Please enter a delivery address'),
    postal_code: z.string().optional(),
  }),
]);

type CheckoutFormData = z.infer<typeof checkoutSchema>;

const DELIVERY_OPTIONS = [
  { value: 'none' as const, label: 'No Delivery', desc: 'Tickets / digital items only', icon: Package },
  { value: 'pickup' as const, label: 'Pickup', desc: 'I will pick it up myself', icon: MapPin },
  { value: 'delivery' as const, label: 'Delivery', desc: 'Courier delivery', icon: Truck },
];

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const { data: cart, isLoading: cartLoading } = useCart();
  const createOrder = useCreateOrder();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      delivery_type: 'none',
      contact_name: '',
      contact_phone: '',
      city: '',
      address_line: '',
      postal_code: '',
    },
  });

  const deliveryType = watch('delivery_type');

  if (cartLoading) return <PageSpinner />;

  if (!cart || cart.items.length === 0) {
    return (
      <EmptyState
        title="Cart is Empty"
        description="Nothing to checkout. Add products or tickets to your cart."
        actionLabel="Go to Shop"
        actionTo="/shop"
      />
    );
  }

  const onSubmit = (data: CheckoutFormData) => {
    const payload = {
      delivery_type: data.delivery_type,
      contact: {
        name: data.contact_name,
        phone: data.contact_phone,
      },
      ...(data.delivery_type === 'delivery' && {
        shipping_address: {
          city: data.city ?? '',
          address_line: data.address_line ?? '',
          postal_code: data.postal_code || '',
        },
      }),
    };

    createOrder.mutate(payload, {
      onSuccess: (order) => {
        toast('Order created successfully!', 'success');
        navigate(`/orders/${order.id}`);
      },
      onError: () => {
        toast('Failed to create order. Please try again.', 'error');
      },
    });
  };

  const inputClass = (hasError: boolean) =>
    `w-full bg-white/5 border ${hasError ? 'border-red-500/50' : 'border-white/10'} rounded-lg py-3 px-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#39ff14] focus:ring-1 focus:ring-[#39ff14] transition-all duration-300`;

  return (
    <div className="flex flex-col w-full pb-24">
      {/* Back */}
      <Link to="/cart" className="flex items-center gap-2 text-gray-400 hover:text-white text-xs font-bold tracking-widest uppercase mb-8 transition-colors w-fit">
        <ArrowLeft size={14} />
        Back to Cart
      </Link>

      <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-none mb-12">
        <span className="text-white block">PLACE</span>
        <span className="text-[#39ff14] block">ORDER</span>
      </h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Contact Info */}
            <div className="bg-[#111] border border-white/5 rounded-2xl p-6 md:p-8">
              <h2 className="text-lg font-bold text-white mb-6 tracking-wider uppercase">
                Contact Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contact_name" className="block text-gray-400 text-xs font-bold mb-2 uppercase tracking-widest">
                    Name
                  </label>
                  <input
                    {...register('contact_name')}
                    id="contact_name"
                    placeholder="Your name"
                    className={inputClass(!!errors.contact_name)}
                  />
                  {errors.contact_name && (
                    <p className="text-red-400 text-xs mt-1">{errors.contact_name.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="contact_phone" className="block text-gray-400 text-xs font-bold mb-2 uppercase tracking-widest">
                    Phone
                  </label>
                  <input
                    {...register('contact_phone')}
                    id="contact_phone"
                    placeholder="+1 (___) ___-____"
                    className={inputClass(!!errors.contact_phone)}
                  />
                  {errors.contact_phone && (
                    <p className="text-red-400 text-xs mt-1">{errors.contact_phone.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Delivery Type */}
            <div className="bg-[#111] border border-white/5 rounded-2xl p-6 md:p-8">
              <h2 className="text-lg font-bold text-white mb-6 tracking-wider uppercase">
                Delivery Method
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {DELIVERY_OPTIONS.map((option) => {
                  const Icon = option.icon;
                  const isSelected = deliveryType === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setValue('delivery_type', option.value, { shouldValidate: true })}
                      className={`p-4 rounded-xl border text-left transition-all duration-300 ${
                        isSelected
                          ? 'border-[#39ff14]/50 bg-[#39ff14]/5 shadow-[0_0_15px_rgba(57,255,20,0.1)]'
                          : 'border-white/5 hover:border-white/20'
                      }`}
                    >
                      <Icon size={20} className={isSelected ? 'text-[#39ff14] mb-2' : 'text-gray-500 mb-2'} />
                      <p className={`font-bold text-sm ${isSelected ? 'text-[#39ff14]' : 'text-white'}`}>
                        {option.label}
                      </p>
                      <p className="text-gray-500 text-xs mt-0.5">{option.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Delivery Address */}
            {deliveryType === 'delivery' && (
              <div className="bg-[#111] border border-white/5 rounded-2xl p-6 md:p-8">
                <h2 className="text-lg font-bold text-white mb-6 tracking-wider uppercase">
                  Delivery Address
                </h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="city" className="block text-gray-400 text-xs font-bold mb-2 uppercase tracking-widest">
                      City
                    </label>
                    <input
                      {...register('city')}
                      id="city"
                      placeholder="New York"
                      className={inputClass(!!errors.city)}
                    />
                    {errors.city && (
                      <p className="text-red-400 text-xs mt-1">{errors.city.message}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="address_line" className="block text-gray-400 text-xs font-bold mb-2 uppercase tracking-widest">
                      Address
                    </label>
                    <input
                      {...register('address_line')}
                      id="address_line"
                      placeholder="123 Main St, Apt 42"
                      className={inputClass(!!errors.address_line)}
                    />
                    {errors.address_line && (
                      <p className="text-red-400 text-xs mt-1">{errors.address_line.message}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="postal_code" className="block text-gray-400 text-xs font-bold mb-2 uppercase tracking-widest">
                      Postal Code (optional)
                    </label>
                    <input
                      {...register('postal_code')}
                      id="postal_code"
                      placeholder="050000"
                      className={inputClass(false)}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div>
            <div className="bg-[#111] border border-white/5 rounded-2xl p-6 sticky top-28">
              <h2 className="text-lg font-bold text-white mb-6 tracking-wider uppercase">
                Your Order
              </h2>

              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                {cart.items.map((item) => {
                  const name = item.item_type === 'ticket'
                    ? `${item.event?.title ?? 'Ticket'} — ${item.ticket_type?.name ?? ''}`
                    : item.product?.title ?? 'Product';

                  return (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-400 truncate mr-2">
                        {name} × {item.quantity}
                      </span>
                      <span className="text-white font-bold whitespace-nowrap">
                        {formatPrice(item.total_price)}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-white/5 pt-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-white font-bold text-lg">Total</span>
                  <span className="text-[#39ff14] font-black text-2xl">{formatPrice(cart.total)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={createOrder.isPending}
                className="w-full bg-[#39ff14] hover:bg-[#32e612] text-black font-bold uppercase tracking-widest text-xs py-4 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(57,255,20,0.3)] hover:shadow-[0_0_30px_rgba(57,255,20,0.5)] disabled:opacity-50"
              >
                {createOrder.isPending ? 'Processing...' : 'Confirm Order'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};