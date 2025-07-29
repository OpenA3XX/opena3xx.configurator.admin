import { Injectable, signal, computed, effect } from '@angular/core';
import { Observable, switchMap, catchError, of, interval } from 'rxjs';
import { ConsoleMessage, ConsoleCommand, ConsoleSession, ConsoleConfig } from '../services/console.service';
import { ConsoleService } from '../services/console.service';

export interface ConsoleState {
  messages: ConsoleMessage[];
  commands: ConsoleCommand[];
  sessions: ConsoleSession[];
  config: ConsoleConfig | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  isConnected: boolean;
}

export interface ConsoleFilters {
  searchTerm: string;
  level: string | null;
  source: string | null;
  timeRange: { start: Date; end: Date } | null;
}

@Injectable({
  providedIn: 'root'
})
export class ConsoleStore {
  // State signals
  private _state = signal<ConsoleState>({
    messages: [],
    commands: [],
    sessions: [],
    config: null,
    loading: false,
    error: null,
    lastUpdated: null,
    isConnected: false
  });

  private _filters = signal<ConsoleFilters>({
    searchTerm: '',
    level: null,
    source: null,
    timeRange: null
  });

  // Public state signals
  readonly state = this._state.asReadonly();
  readonly filters = this._filters.asReadonly();

  // Computed selectors
  readonly messages = computed(() => this.state().messages);
  readonly commands = computed(() => this.state().commands);
  readonly sessions = computed(() => this.state().sessions);
  readonly config = computed(() => this.state().config);
  readonly loading = computed(() => this.state().loading);
  readonly error = computed(() => this.state().error);
  readonly lastUpdated = computed(() => this.state().lastUpdated);
  readonly isConnected = computed(() => this.state().isConnected);

  // Filtered data
  readonly filteredMessages = computed(() => {
    const messages = this.messages();
    const filters = this.filters();

    return messages.filter(message => {
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        if (!message.message.toLowerCase().includes(searchLower) &&
            !message.source.toLowerCase().includes(searchLower)) {
          return false;
        }
      }

      if (filters.level && message.level !== filters.level) {
        return false;
      }

      if (filters.source && message.source !== filters.source) {
        return false;
      }

      if (filters.timeRange) {
        const messageTime = new Date(message.timestamp);
        if (messageTime < filters.timeRange.start || messageTime > filters.timeRange.end) {
          return false;
        }
      }

      return true;
    });
  });

  readonly filteredCommands = computed(() => {
    const commands = this.commands();
    const filters = this.filters();

    return commands.filter(command => {
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        if (!command.command.toLowerCase().includes(searchLower)) {
          return false;
        }
      }

      if (filters.timeRange) {
        const commandTime = new Date(command.timestamp);
        if (commandTime < filters.timeRange.start || commandTime > filters.timeRange.end) {
          return false;
        }
      }

      return true;
    });
  });

  // Grouped data
  readonly messagesByLevel = computed(() => {
    const messages = this.messages();
    const grouped = new Map<string, ConsoleMessage[]>();

    messages.forEach(message => {
      const level = message.level;
      if (!grouped.has(level)) {
        grouped.set(level, []);
      }
      grouped.get(level)!.push(message);
    });

    return grouped;
  });

  readonly messagesBySource = computed(() => {
    const messages = this.messages();
    const grouped = new Map<string, ConsoleMessage[]>();

    messages.forEach(message => {
      const source = message.source;
      if (!grouped.has(source)) {
        grouped.set(source, []);
      }
      grouped.get(source)!.push(message);
    });

    return grouped;
  });

  // Statistics
  readonly stats = computed(() => {
    const messages = this.messages();
    const commands = this.commands();
    const sessions = this.sessions();

    return {
      totalMessages: messages.length,
      totalCommands: commands.length,
      totalSessions: sessions.length,
      messagesByLevel: new Map(
        Object.entries(
          messages.reduce((acc, message) => {
            acc[message.level] = (acc[message.level] || 0) + 1;
            return acc;
          }, {} as Record<string, number>)
        )
      ),
      commandsByStatus: new Map(
        Object.entries(
          commands.reduce((acc, command) => {
            acc[command.status] = (acc[command.status] || 0) + 1;
            return acc;
          }, {} as Record<string, number>)
        )
      ),
      activeSessions: sessions.filter(s => s.status === 'active').length,
      recentMessages: messages.slice(-10),
      recentCommands: commands.slice(-5)
    };
  });

  constructor(private consoleService: ConsoleService) {
    // Set up effects for automatic data refresh and real-time updates
    this.setupEffects();
  }

  // Actions
  setLoading(loading: boolean): void {
    this._state.update(state => ({ ...state, loading, error: null }));
  }

  setError(error: string): void {
    this._state.update(state => ({ ...state, error, loading: false }));
  }

  setConnectionStatus(isConnected: boolean): void {
    this._state.update(state => ({ ...state, isConnected }));
  }

  setFilters(filters: Partial<ConsoleFilters>): void {
    this._filters.update(current => ({ ...current, ...filters }));
  }

  clearFilters(): void {
    this._filters.set({
      searchTerm: '',
      level: null,
      source: null,
      timeRange: null
    });
  }

  // Data loading actions
  loadMessages(limit?: number, level?: string): void {
    this.setLoading(true);

    this.consoleService.getConsoleMessages(limit, level).subscribe({
      next: (messages) => {
        this._state.update(state => ({
          ...state,
          messages,
          loading: false,
          error: null,
          lastUpdated: new Date()
        }));
      },
      error: (error) => {
        this.setError(error.message || 'Failed to load console messages');
      }
    });
  }

  loadCommands(limit?: number): void {
    this.setLoading(true);

    this.consoleService.getCommandHistory(limit).subscribe({
      next: (commands) => {
        this._state.update(state => ({
          ...state,
          commands,
          loading: false,
          error: null,
          lastUpdated: new Date()
        }));
      },
      error: (error) => {
        this.setError(error.message || 'Failed to load command history');
      }
    });
  }

  loadSessions(): void {
    this.setLoading(true);

    this.consoleService.getActiveSessions().subscribe({
      next: (sessions) => {
        this._state.update(state => ({
          ...state,
          sessions,
          loading: false,
          error: null,
          lastUpdated: new Date()
        }));
      },
      error: (error) => {
        this.setError(error.message || 'Failed to load sessions');
      }
    });
  }

  loadConfig(): void {
    this.setLoading(true);

    this.consoleService.getConsoleConfig().subscribe({
      next: (config) => {
        this._state.update(state => ({
          ...state,
          config,
          loading: false,
          error: null,
          lastUpdated: new Date()
        }));
      },
      error: (error) => {
        this.setError(error.message || 'Failed to load console config');
      }
    });
  }

  // Real-time operations
  startMessageStream(): void {
    this.consoleService.getMessageStream().subscribe({
      next: (messages) => {
        this._state.update(state => ({
          ...state,
          messages,
          lastUpdated: new Date(),
          isConnected: true
        }));
      },
      error: (error) => {
        this.setConnectionStatus(false);
        this.setError(error.message || 'Message stream disconnected');
      }
    });
  }

  startCommandStream(): void {
    this.consoleService.getCommandStream().subscribe({
      next: (commands) => {
        this._state.update(state => ({
          ...state,
          commands,
          lastUpdated: new Date(),
          isConnected: true
        }));
      },
      error: (error) => {
        this.setConnectionStatus(false);
        this.setError(error.message || 'Command stream disconnected');
      }
    });
  }

  // CRUD operations
  executeCommand(command: string, parameters?: Record<string, any>): Observable<ConsoleCommand> {
    return this.consoleService.executeCommand(command, parameters).pipe(
      switchMap((newCommand) => {
        this.loadCommands();
        return of(newCommand);
      }),
      catchError((error) => {
        this.setError(error.message || 'Failed to execute command');
        throw error;
      })
    );
  }

  createSession(name: string): Observable<ConsoleSession> {
    return this.consoleService.createSession(name).pipe(
      switchMap((session) => {
        this.loadSessions();
        return of(session);
      }),
      catchError((error) => {
        this.setError(error.message || 'Failed to create session');
        throw error;
      })
    );
  }

  closeSession(id: string): Observable<void> {
    return this.consoleService.closeSession(id).pipe(
      switchMap(() => {
        this.loadSessions();
        return of(void 0);
      }),
      catchError((error) => {
        this.setError(error.message || 'Failed to close session');
        throw error;
      })
    );
  }

  cancelCommand(id: string): Observable<void> {
    return this.consoleService.cancelCommand(id).pipe(
      switchMap(() => {
        this.loadCommands();
        return of(void 0);
      }),
      catchError((error) => {
        this.setError(error.message || 'Failed to cancel command');
        throw error;
      })
    );
  }

  // Configuration operations
  updateConfig(config: Partial<ConsoleConfig>): Observable<ConsoleConfig> {
    return this.consoleService.updateConsoleConfig(config).pipe(
      switchMap((updatedConfig) => {
        this._state.update(state => ({
          ...state,
          config: updatedConfig,
          lastUpdated: new Date()
        }));
        return of(updatedConfig);
      }),
      catchError((error) => {
        this.setError(error.message || 'Failed to update config');
        throw error;
      })
    );
  }

  setLogLevel(level: ConsoleConfig['logLevel']): Observable<void> {
    return this.consoleService.setLogLevel(level).pipe(
      switchMap(() => {
        this.loadConfig();
        return of(void 0);
      }),
      catchError((error) => {
        this.setError(error.message || 'Failed to set log level');
        throw error;
      })
    );
  }

  // Search operations
  searchMessages(query: string, level?: string): Observable<ConsoleMessage[]> {
    return this.consoleService.searchMessages(query, level);
  }

  getMessagesBySource(source: string, limit?: number): Observable<ConsoleMessage[]> {
    return this.consoleService.getMessagesBySource(source, limit);
  }

  // Export operations
  exportMessages(format: 'json' | 'csv' | 'txt', filters?: Record<string, any>): Observable<Blob> {
    return this.consoleService.exportMessages(format, filters);
  }

  // Cache management
  clearCache(): void {
    this._state.update(state => ({
      ...state,
      messages: [],
      commands: [],
      sessions: [],
      lastUpdated: null
    }));
  }

  clearMessages(): void {
    this.consoleService.clearConsoleMessages().subscribe({
      next: () => {
        this._state.update(state => ({
          ...state,
          messages: [],
          lastUpdated: new Date()
        }));
      },
      error: (error) => {
        this.setError(error.message || 'Failed to clear messages');
      }
    });
  }

  refreshData(): void {
    this.loadMessages();
    this.loadCommands();
    this.loadSessions();
    this.loadConfig();
  }

  // Private methods
  private setupEffects(): void {
    // Auto-refresh data every 30 seconds if connected
    effect(() => {
      const isConnected = this.isConnected();
      const lastUpdated = this.lastUpdated();

      if (isConnected && lastUpdated) {
        const timeSinceUpdate = Date.now() - lastUpdated.getTime();
        const thirtySeconds = 30 * 1000;

        if (timeSinceUpdate > thirtySeconds) {
          this.refreshData();
        }
      }
    });

    // Start real-time streams when component initializes
    effect(() => {
      const isConnected = this.isConnected();
      if (isConnected) {
        this.startMessageStream();
        this.startCommandStream();
      }
    });
  }
}
