import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';

export function useSubmitPayment() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (data: {
      fullName: string;
      address: string;
      email: string;
      cardNumber: string;
      expirationDate: string;
      amount: bigint;
    }) => {
      if (!actor) throw new Error('Actor not available. Please try again.');
      try {
        await actor.submitPayment(
          data.fullName,
          data.address,
          data.email,
          data.cardNumber,
          data.expirationDate,
          data.amount,
        );
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        console.error('[useSubmitPayment] Backend error:', message);
        if (message.includes('Unauthorized') || message.includes('Only users')) {
          throw new Error('You must be logged in to submit a payment.');
        }
        throw new Error(message || 'Payment submission failed. Please try again.');
      }
    },
  });
}

export function useGetAllPaymentRecords(password: string, enabled: boolean) {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['paymentRecords', password],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getAllPaymentRecords(password);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        console.error('[useGetAllPaymentRecords] Backend error:', message);
        throw new Error(message || 'Failed to fetch payment records.');
      }
    },
    enabled: !!actor && !isFetching && enabled && !!password,
  });
}

export function useVerifyAdminPassword() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (password: string): Promise<boolean> => {
      if (!actor) throw new Error('Actor not available. Please try again.');
      try {
        const result = await actor.isAdminPanelAccessGranted(password);
        return result;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        console.error('[useVerifyAdminPassword] Backend error:', message);
        if (message.includes('Unauthorized') || message.includes('Only admins')) {
          throw new Error('Admin access required. Please ensure you are logged in as an admin.');
        }
        throw new Error(message || 'Password verification failed. Please try again.');
      }
    },
  });
}
