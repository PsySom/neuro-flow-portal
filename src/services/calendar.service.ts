import apiClient, { handleApiError } from './api.client';
import { 
  CalendarEvent, 
  CreateCalendarEventRequest
} from '../types/api.types';

class CalendarService {
  // Get calendar events for date range
  async getEvents(startDate: string, endDate: string): Promise<CalendarEvent[]> {
    try {
      const response = await apiClient.get<CalendarEvent[]>('/calendar/events', {
        params: { start_date: startDate, end_date: endDate }
      });
      return response.data;
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // Create calendar event
  async createEvent(data: CreateCalendarEventRequest): Promise<CalendarEvent> {
    try {
      const response = await apiClient.post<CalendarEvent>('/calendar/events', data);
      return response.data;
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // Update calendar event
  async updateEvent(id: number, data: Partial<CreateCalendarEventRequest>): Promise<CalendarEvent> {
    try {
      const response = await apiClient.put<CalendarEvent>(`/calendar/events/${id}`, data);
      return response.data;
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // Delete calendar event
  async deleteEvent(id: number): Promise<void> {
    try {
      await apiClient.delete(`/calendar/events/${id}`);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // Get events for specific date
  async getEventsForDate(date: string): Promise<CalendarEvent[]> {
    try {
      const response = await apiClient.get<CalendarEvent[]>(`/calendar/events/date/${date}`);
      return response.data;
    } catch (error: any) {
      throw handleApiError(error);
    }
  }
}

export const calendarService = new CalendarService();
export default calendarService;