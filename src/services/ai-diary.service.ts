import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

export class AIDiaryService {
  private realtimeChannel: RealtimeChannel | null = null;
  private userId: string | null = null;
  
  constructor() {
    this.initUser();
  }
  
  private async initUser() {
    const { data: { user } } = await supabase.auth.getUser();
    this.userId = user?.id || null;
  }
  
  async ensureSessionExists(sessionId: string): Promise<void> {
    if (!this.userId) return;
    
    const { data: existing } = await supabase
      .from('ai_diary_sessions')
      .select('id')
      .eq('session_id', sessionId)
      .single();
      
    if (!existing) {
      await supabase.from('ai_diary_sessions').insert({
        user_id: this.userId,
        session_id: sessionId,
        started_at: new Date().toISOString()
      });
    }
  }
  
  getCurrentSessionId(): string | null {
    // Use sessionStorage for better security (cleared on browser close)
    return sessionStorage.getItem('ai_diary_session_id');
  }
  
  subscribeToMessages(sessionId: string, onNewMessage: (message: any) => void) {
    if (this.realtimeChannel) {
      this.realtimeChannel.unsubscribe();
    }
    
    this.realtimeChannel = supabase
      .channel(`ai_diary_${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'ai_diary_messages',
          filter: `session_id=eq.${sessionId}`
        },
        (payload) => {
          if (payload.new.message_type === 'ai') {
            onNewMessage(payload.new);
          }
        }
      )
      .subscribe();
      
    return this.realtimeChannel;
  }
  
  async sendMessage(message: string, sessionId: string): Promise<any> {
    if (!this.userId) {
      const { data: { user } } = await supabase.auth.getUser();
      this.userId = user?.id || null;
    }
    
    if (!this.userId) {
      throw new Error('User not authenticated');
    }
    
    try {
      await this.ensureSessionExists(sessionId);
      
      const { data, error } = await supabase
        .from('ai_diary_messages')
        .insert({
          user_id: this.userId,
          session_id: sessionId,
          message_type: 'user',
          content: message,
          metadata: {
            timestamp: new Date().toISOString(),
            source: 'free_chat'
          }
        })
        .select()
        .single();
        
      if (error) throw error;
      
      return { 
        success: true, 
        messageId: data.id,
        ai_response: 'AI обрабатывает ваше сообщение...',
        session_id: sessionId 
      };
    } catch (error) {
      console.error('Error sending message:', error);
      return { 
        success: false, 
        error: error.message,
        ai_response: 'Произошла ошибка при отправке сообщения'
      };
    }
  }
  
  async loadSessionHistory(sessionId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('ai_diary_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });
      
    if (error) {
      console.error('Error loading history:', error);
      return [];
    }
    
    return data || [];
  }
  
  async startNewSession(): Promise<string> {
    const newSessionId = `ai_diary_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    // Use sessionStorage for better security (cleared on browser close)
    sessionStorage.setItem('ai_diary_session_id', newSessionId);
    
    if (this.userId) {
      await supabase.from('ai_diary_sessions').insert({
        user_id: this.userId,
        session_id: newSessionId,
        started_at: new Date().toISOString()
      });
    }
    
    return newSessionId;
  }
  
  async endSession(sessionId: string): Promise<void> {
    if (this.userId && sessionId) {
      await supabase
        .from('ai_diary_sessions')
        .update({ ended_at: new Date().toISOString() })
        .eq('session_id', sessionId);
    }
    
    // Clear from sessionStorage
    sessionStorage.removeItem('ai_diary_session_id');
    this.unsubscribe();
  }
  
  unsubscribe() {
    if (this.realtimeChannel) {
      this.realtimeChannel.unsubscribe();
      this.realtimeChannel = null;
    }
  }
}

export default new AIDiaryService();