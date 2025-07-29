import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiService } from '../../../core/services/base-api.service';
import { ConfigurationService } from '../../../core/services/configuration.service';

export interface ConsoleMessage {
  id: string;
  timestamp: Date;
  level: 'info' | 'warning' | 'error' | 'debug';
  message: string;
  source: string;
  metadata?: Record<string, any>;
}

export interface ConsoleCommand {
  id: string;
  command: string;
  parameters?: Record<string, any>;
  timestamp: Date;
  status: 'pending' | 'executing' | 'completed' | 'failed';
  result?: any;
  error?: string;
}

export interface ConsoleSession {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'error';
  createdAt: Date;
  lastActivity: Date;
  messageCount: number;
}

export interface ConsoleConfig {
  maxMessages: number;
  autoScroll: boolean;
  showTimestamps: boolean;
  logLevel: 'debug' | 'info' | 'warning' | 'error';
  refreshInterval: number;
}

@Injectable({
  providedIn: 'root'
})
export class ConsoleService extends BaseApiService<ConsoleMessage> {
  protected override endpoint = 'console';

  constructor(
    protected override http: HttpClient,
    protected override configurationService: ConfigurationService
  ) {
    super(http, configurationService);
  }

  // Console Message Operations
  getConsoleMessages(limit?: number, level?: string): Observable<ConsoleMessage[]> {
    const params: Record<string, string> = {};
    if (limit) params['limit'] = limit.toString();
    if (level) params['level'] = level;
    return this.customGet<ConsoleMessage[]>('/messages', params);
  }

  getConsoleMessageById(id: string): Observable<ConsoleMessage> {
    return this.customGet<ConsoleMessage>(`/messages/${id}`);
  }

  clearConsoleMessages(): Observable<void> {
    return this.customDelete('/messages');
  }

  // Console Command Operations
  executeCommand(command: string, parameters?: Record<string, any>): Observable<ConsoleCommand> {
    return this.customPost<ConsoleCommand>('/commands', {
      command,
      parameters
    });
  }

  getCommandHistory(limit?: number): Observable<ConsoleCommand[]> {
    const params = limit ? { limit: limit.toString() } : {};
    return this.customGet<ConsoleCommand[]>('/commands/history', params);
  }

  getCommandById(id: string): Observable<ConsoleCommand> {
    return this.customGet<ConsoleCommand>(`/commands/${id}`);
  }

  cancelCommand(id: string): Observable<void> {
    return this.customDelete(`/commands/${id}`);
  }

  // Console Session Operations
  getActiveSessions(): Observable<ConsoleSession[]> {
    return this.customGet<ConsoleSession[]>('/sessions');
  }

  createSession(name: string): Observable<ConsoleSession> {
    return this.customPost<ConsoleSession>('/sessions', { name });
  }

  getSessionById(id: string): Observable<ConsoleSession> {
    return this.customGet<ConsoleSession>(`/sessions/${id}`);
  }

  closeSession(id: string): Observable<void> {
    return this.customDelete(`/sessions/${id}`);
  }

  // Real-time Operations
  getMessageStream(): Observable<ConsoleMessage[]> {
    return this.customGet<ConsoleMessage[]>('/messages/stream');
  }

  getCommandStream(): Observable<ConsoleCommand[]> {
    return this.customGet<ConsoleCommand[]>('/commands/stream');
  }

  // Configuration Operations
  getConsoleConfig(): Observable<ConsoleConfig> {
    return this.customGet<ConsoleConfig>('/config');
  }

  updateConsoleConfig(config: Partial<ConsoleConfig>): Observable<ConsoleConfig> {
    return this.customPatch<ConsoleConfig>('/config', config);
  }

  // Log Level Operations
  setLogLevel(level: ConsoleConfig['logLevel']): Observable<void> {
    return this.customPost<void>('/config/log-level', { level });
  }

  getLogLevel(): Observable<ConsoleConfig['logLevel']> {
    return this.customGet<ConsoleConfig['logLevel']>('/config/log-level');
  }

  // Filtering and Search
  searchMessages(query: string, level?: string): Observable<ConsoleMessage[]> {
    const params: Record<string, string> = { q: query };
    if (level) params['level'] = level;
    return this.customGet<ConsoleMessage[]>('/messages/search', params);
  }

  getMessagesBySource(source: string, limit?: number): Observable<ConsoleMessage[]> {
    const params: Record<string, string> = { source };
    if (limit) params['limit'] = limit.toString();
    return this.customGet<ConsoleMessage[]>(`/messages/source/${source}`, params);
  }

  // Export Operations
  exportMessages(format: 'json' | 'csv' | 'txt', filters?: Record<string, any>): Observable<Blob> {
    const params: Record<string, string> = { format };
    if (filters) {
      Object.keys(filters).forEach(key => {
        params[key] = filters[key].toString();
      });
    }
    return this.customGet<Blob>('/messages/export', params);
  }

  // System Operations
  getSystemInfo(): Observable<any> {
    return this.customGet<any>('/system/info');
  }

  getSystemStatus(): Observable<any> {
    return this.customGet<any>('/system/status');
  }

  // Performance Operations
  getPerformanceMetrics(): Observable<any> {
    return this.customGet<any>('/performance/metrics');
  }

  getPerformanceHistory(hours: number = 24): Observable<any[]> {
    return this.customGet<any[]>('/performance/history', { hours: hours.toString() });
  }
}
