import { MoodEntry, ThoughtEntry, SleepEntry, DiaryQueryParams } from './backend-diary.service';

class MockDiaryService {
  private mockMoodEntries: MoodEntry[] = [];
  private mockThoughtEntries: ThoughtEntry[] = [];
  private mockSleepEntries: SleepEntry[] = [];

  // === MOOD DIARY MOCK ===
  
  async createMoodEntry(entry: MoodEntry): Promise<MoodEntry> {
    console.log('🟡 Mock: Creating mood entry', entry);
    
    const mockEntry: MoodEntry = {
      ...entry,
      id: `mood_${Date.now()}`,
      user_id: 'mock_user_123',
      timestamp: entry.timestamp || new Date().toISOString()
    };

    this.mockMoodEntries.push(mockEntry);
    
    // Сохраняем в localStorage для персистентности
    localStorage.setItem('mock_mood_entries', JSON.stringify(this.mockMoodEntries));
    
    // Принудительно уведомляем о изменении
    console.log('🔔 Mock: Triggering storage event for mood entry');
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'mock_mood_entries',
      newValue: JSON.stringify(this.mockMoodEntries),
      storageArea: localStorage
    }));
    
    console.log('✅ Mock: Mood entry saved', mockEntry);
    return mockEntry;
  }

  async getMoodEntries(params?: DiaryQueryParams): Promise<MoodEntry[]> {
    console.log('🟡 Mock: Getting mood entries with params:', params);
    
    // Загружаем из localStorage
    const saved = localStorage.getItem('mock_mood_entries');
    if (saved) {
      this.mockMoodEntries = JSON.parse(saved);
    }
    
    let entries = [...this.mockMoodEntries];
    
    // Применяем фильтры если переданы параметры
    if (params?.start_date) {
      entries = entries.filter(entry => 
        new Date(entry.timestamp) >= new Date(params.start_date!)
      );
    }
    
    if (params?.end_date) {
      entries = entries.filter(entry => 
        new Date(entry.timestamp) <= new Date(params.end_date!)
      );
    }
    
    // Сортировка
    if (params?.sort_desc) {
      entries.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    } else {
      entries.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    }
    
    console.log(`✅ Mock: Found ${entries.length} mood entries`);
    return entries;
  }

  async getMoodEntry(entryId: string): Promise<MoodEntry> {
    const saved = localStorage.getItem('mock_mood_entries');
    if (saved) {
      this.mockMoodEntries = JSON.parse(saved);
    }
    
    const entry = this.mockMoodEntries.find(e => e.id === entryId);
    if (!entry) {
      throw new Error(`Mood entry with id ${entryId} not found`);
    }
    return entry;
  }

  async updateMoodEntry(entryId: string, updates: Partial<MoodEntry>): Promise<MoodEntry> {
    const saved = localStorage.getItem('mock_mood_entries');
    if (saved) {
      this.mockMoodEntries = JSON.parse(saved);
    }
    
    const index = this.mockMoodEntries.findIndex(e => e.id === entryId);
    if (index === -1) {
      throw new Error(`Mood entry with id ${entryId} not found`);
    }
    
    this.mockMoodEntries[index] = { ...this.mockMoodEntries[index], ...updates };
    localStorage.setItem('mock_mood_entries', JSON.stringify(this.mockMoodEntries));
    
    return this.mockMoodEntries[index];
  }

  async deleteMoodEntry(entryId: string): Promise<void> {
    const saved = localStorage.getItem('mock_mood_entries');
    if (saved) {
      this.mockMoodEntries = JSON.parse(saved);
    }
    
    this.mockMoodEntries = this.mockMoodEntries.filter(e => e.id !== entryId);
    localStorage.setItem('mock_mood_entries', JSON.stringify(this.mockMoodEntries));
  }

  // === THOUGHT DIARY MOCK ===
  
  async createThoughtEntry(entry: ThoughtEntry): Promise<ThoughtEntry> {
    console.log('🟡 Mock: Creating thought entry', entry);
    
    const mockEntry: ThoughtEntry = {
      ...entry,
      id: `thought_${Date.now()}`,
      user_id: 'mock_user_123',
      timestamp: entry.timestamp || new Date().toISOString()
    };

    this.mockThoughtEntries.push(mockEntry);
    localStorage.setItem('mock_thought_entries', JSON.stringify(this.mockThoughtEntries));
    
    console.log('✅ Mock: Thought entry saved', mockEntry);
    return mockEntry;
  }

  async getThoughtEntries(params?: DiaryQueryParams): Promise<ThoughtEntry[]> {
    const saved = localStorage.getItem('mock_thought_entries');
    if (saved) {
      this.mockThoughtEntries = JSON.parse(saved);
    }
    return this.mockThoughtEntries;
  }

  // === SLEEP DIARY MOCK ===
  
  async createSleepEntry(entry: SleepEntry): Promise<SleepEntry> {
    console.log('🟡 Mock: Creating sleep entry', entry);
    
    const mockEntry: SleepEntry = {
      ...entry,
      id: `sleep_${Date.now()}`,
      user_id: 'mock_user_123',
      timestamp: entry.timestamp || new Date().toISOString()
    };

    this.mockSleepEntries.push(mockEntry);
    localStorage.setItem('mock_sleep_entries', JSON.stringify(this.mockSleepEntries));
    
    console.log('✅ Mock: Sleep entry saved', mockEntry);
    return mockEntry;
  }

  async getSleepEntries(params?: DiaryQueryParams): Promise<SleepEntry[]> {
    const saved = localStorage.getItem('mock_sleep_entries');
    if (saved) {
      this.mockSleepEntries = JSON.parse(saved);
    }
    return this.mockSleepEntries;
  }

  // === STATS MOCK ===
  
  async getMoodStats(): Promise<any> {
    return {
      average_mood: 2.5,
      total_entries: this.mockMoodEntries.length,
      most_common_emotion: 'спокойствие'
    };
  }

  async getSleepStats(): Promise<any> {
    return {
      average_duration: 7.5,
      average_quality: 3,
      total_entries: this.mockSleepEntries.length
    };
  }
}

export const mockDiaryService = new MockDiaryService();