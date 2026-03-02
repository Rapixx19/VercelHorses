/**
 * FILE SUMMARY:
 * Service to record actions performed on horses.
 * Risk Zone: YELLOW (Impacts Billing).
 * Path: src/services/logService.ts
 */

import { supabase } from '@/lib/supabase';
import { crumb, errorCrumb } from '@/lib/logger';
import { STABLE_SERVICES, ServiceID } from '@/lib/constants';

export const logHorseService = async (horseId: string, serviceId: ServiceID) => {
  const service = STABLE_SERVICES[serviceId];
  crumb('billing', `Logging ${serviceId} for Horse ${horseId}`);

  const { error } = await supabase
    .from('service_logs')
    .insert({
      horse_id: horseId,
      service_type: serviceId,
      fixed_price: service.price,
      is_billed: false
    });

  if (error) {
    errorCrumb('billing', 'Failed to log service', error);
    throw error;
  }

  crumb('billing', 'Service log successfully recorded');
  return true;
};
