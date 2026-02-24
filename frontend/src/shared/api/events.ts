import type { Event, EventsResponse, EventFilters, TicketType } from '../../entities/types';
import { getMockEvents, getMockEvent } from './mock-data';

export async function getEvents(filters?: EventFilters): Promise<EventsResponse> {
  return getMockEvents(filters);
}

export async function getEvent(id: number | string): Promise<Event> {
  const event = getMockEvent(id);
  if (!event) throw new Error('Event not found');
  return event;
}

export async function getEventTickets(id: number | string): Promise<TicketType[]> {
  const event = getMockEvent(id);
  return event?.ticket_types ?? [];
}
