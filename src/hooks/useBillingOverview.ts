/**
 * FILE SUMMARY:
 * Aggregates all unbilled service logs for a financial overview.
 * Risk Zone: YELLOW (Business Logic).
 * Path: src/hooks/useBillingOverview.ts
 */

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { crumb } from '@/lib/logger';

export const useBillingOverview = () => {
  const [totalAccrued, setTotalAccrued] = useState(0);

  useEffect(() => {
    const fetchAccruals = async () => {
      crumb('billing', 'Calculating total unbilled revenue');
      const { data } = await supabase
        .from('service_logs')
        .select('fixed_price')
        .eq('is_billed', false);

      const total = data?.reduce((acc, curr) => acc + curr.fixed_price, 0) || 0;
      setTotalAccrued(total);
    };

    fetchAccruals();
  }, []);

  return { totalAccrued };
};
