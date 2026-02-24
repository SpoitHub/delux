import { useQuery } from '@tanstack/react-query';
import { getEvents, getEvent, getEventTickets } from '../../shared/api/events';
import type { EventFilters } from '../../entities/types';

export function useEvents(filters?: EventFilters) {
  return useQuery({
    queryKey: ['events', filters],
    queryFn: () => getEvents(filters),
  });
}

export function useEvent(id: number | string) {
  return useQuery({
    queryKey: ['event', id],
    queryFn: () => getEvent(id),
    enabled: !!id,
  });
}

export function useEventTickets(id: number | string) {
  return useQuery({
    queryKey: ['event-tickets', id],
    queryFn: () => getEventTickets(id),
    enabled: !!id,
  });
}
