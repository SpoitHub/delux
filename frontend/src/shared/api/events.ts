import type { Event, EventsResponse, EventFilters, TicketType } from '../../entities/types';
import { apiRequest } from './client';

function buildQuery(filters?: EventFilters): string {
  if (!filters) return '';
  const params = new URLSearchParams();
  if (filters.search)              params.set('search', filters.search);
  if (filters.format)              params.set('format', filters.format);
  if (filters.is_free !== undefined) params.set('is_free', String(filters.is_free));
  if (filters.city)                params.set('city', filters.city);
  if (filters.date_from)           params.set('date_from', filters.date_from);
  if (filters.date_to)             params.set('date_to', filters.date_to);
  if (filters.page)                params.set('page', String(filters.page));
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

export async function getEvents(filters?: EventFilters): Promise<EventsResponse> {
  return apiRequest<EventsResponse>(`/events/${buildQuery(filters)}`);
}

export async function getEvent(id: number | string): Promise<Event> {
  return apiRequest<Event>(`/events/${id}/`);
}

export async function getEventTickets(id: number | string): Promise<TicketType[]> {
  return apiRequest<TicketType[]>(`/events/${id}/tickets/`);
}
