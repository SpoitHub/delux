import type { Payment } from '../../entities/types';

export interface MockChargePayload {
  order_id: number | string;
}

export async function mockCharge(payload: MockChargePayload): Promise<Payment> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Simulate 90% success rate for realism
  if (Math.random() < 0.1) {
    throw new Error('Payment declined. Please try again.');
  }

  return {
    id: Math.floor(Math.random() * 90000) + 10000,
    order: Number(payload.order_id),
    amount: 0, // actual amount set by backend from order
    status: 'completed',
    payment_method: 'mock_card',
    created_at: new Date().toISOString(),
  };
}
