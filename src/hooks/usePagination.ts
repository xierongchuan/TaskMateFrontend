import { useBotConfig } from './useSettings';
import { useAuth } from './useAuth';

export const usePagination = () => {
  const { user } = useAuth();
  // Pass undefined if dealership_id is null/undefined to match hook signature or fix it
  const dealershipId = user?.dealership_id ?? undefined;
  const { data: botConfig } = useBotConfig(dealershipId);

  // Default to 15 rows per page
  const limit = botConfig?.data?.rows_per_page || 15;

  return { limit };
};
