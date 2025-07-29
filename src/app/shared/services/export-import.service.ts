import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface ExportOptions {
  format: 'json' | 'csv' | 'xlsx';
  includeMetadata?: boolean;
  compress?: boolean;
  filter?: any;
}

export interface ImportOptions {
  validateData?: boolean;
  overwriteExisting?: boolean;
  createBackup?: boolean;
}

export interface ExportResult {
  success: boolean;
  data?: any;
  filename?: string;
  error?: string;
  metadata?: {
    exportDate: Date;
    recordCount: number;
    format: string;
    version: string;
  };
}

export interface ImportResult {
  success: boolean;
  importedCount?: number;
  errors?: string[];
  warnings?: string[];
  metadata?: {
    importDate: Date;
    sourceFile: string;
    format: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ExportImportService {
  private readonly VERSION = '1.0.0';

  constructor(private http: HttpClient) {}

  // Export functionality
  exportData(data: any[], options: ExportOptions): Observable<ExportResult> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `export-${timestamp}.${options.format}`;

    try {
      let exportData: any;

      switch (options.format) {
        case 'json':
          exportData = this.exportToJson(data, options);
          break;
        case 'csv':
          exportData = this.exportToCsv(data, options);
          break;
        case 'xlsx':
          exportData = this.exportToXlsx(data, options);
          break;
        default:
          throw new Error(`Unsupported export format: ${options.format}`);
      }

      const result: ExportResult = {
        success: true,
        data: exportData,
        filename,
        metadata: {
          exportDate: new Date(),
          recordCount: data.length,
          format: options.format,
          version: this.VERSION
        }
      };

      this.downloadFile(exportData, filename, options.format);
      return of(result);
    } catch (error) {
      return of({
        success: false,
        error: error instanceof Error ? error.message : 'Export failed'
      });
    }
  }

  // Import functionality
  importData(file: File, options: ImportOptions = {}): Observable<ImportResult> {
    return new Observable(observer => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const fileExtension = file.name.split('.').pop()?.toLowerCase();

          let importedData: any[];

          switch (fileExtension) {
            case 'json':
              importedData = this.importFromJson(content);
              break;
            case 'csv':
              importedData = this.importFromCsv(content);
              break;
            case 'xlsx':
              importedData = this.importFromXlsx(content);
              break;
            default:
              throw new Error(`Unsupported file format: ${fileExtension}`);
          }

          const result: ImportResult = {
            success: true,
            importedCount: importedData.length,
            metadata: {
              importDate: new Date(),
              sourceFile: file.name,
              format: fileExtension || 'unknown'
            }
          };

          observer.next(result);
          observer.complete();
        } catch (error) {
          observer.next({
            success: false,
            errors: [error instanceof Error ? error.message : 'Import failed']
          });
          observer.complete();
        }
      };

      reader.onerror = () => {
        observer.next({
          success: false,
          errors: ['Failed to read file']
        });
        observer.complete();
      };

      reader.readAsText(file);
    });
  }

  // Hardware-specific export methods
  exportHardwarePanels(panels: any[], options: ExportOptions = { format: 'json' }): Observable<ExportResult> {
    return this.exportData(panels, options);
  }

  exportHardwareInputTypes(inputTypes: any[], options: ExportOptions = { format: 'json' }): Observable<ExportResult> {
    return this.exportData(inputTypes, options);
  }

  exportHardwareOutputTypes(outputTypes: any[], options: ExportOptions = { format: 'json' }): Observable<ExportResult> {
    return this.exportData(outputTypes, options);
  }

  exportAircraftModels(models: any[], options: ExportOptions = { format: 'json' }): Observable<ExportResult> {
    return this.exportData(models, options);
  }

  // Configuration export/import
  exportConfiguration(config: any, options: ExportOptions = { format: 'json' }): Observable<ExportResult> {
    const configData = {
      version: this.VERSION,
      exportDate: new Date().toISOString(),
      configuration: config
    };

    return this.exportData([configData], options);
  }

  importConfiguration(file: File): Observable<ImportResult> {
    return this.importData(file, { validateData: true });
  }

  // Backup and restore functionality
  createBackup(data: any): Observable<ExportResult> {
    const backupData = {
      version: this.VERSION,
      backupDate: new Date().toISOString(),
      data: data
    };

    return this.exportData([backupData], {
      format: 'json',
      includeMetadata: true,
      compress: true
    });
  }

  restoreFromBackup(file: File): Observable<ImportResult> {
    return this.importData(file, {
      validateData: true,
      createBackup: true
    });
  }

  // Private helper methods
  private exportToJson(data: any[], options: ExportOptions): string {
    const exportData = options.includeMetadata ? {
      version: this.VERSION,
      exportDate: new Date().toISOString(),
      data: data
    } : data;

    return JSON.stringify(exportData, null, 2);
  }

  private exportToCsv(data: any[], options: ExportOptions): string {
    if (!data.length) return '';

    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(',')];

    for (const row of data) {
      const values = headers.map(header => {
        const value = row[header];
        return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value;
      });
      csvRows.push(values.join(','));
    }

    return csvRows.join('\n');
  }

  private exportToXlsx(data: any[], options: ExportOptions): any {
    // This would require a library like xlsx
    // For now, we'll return a placeholder
    return {
      type: 'xlsx',
      data: data,
      message: 'XLSX export requires additional library'
    };
  }

  private importFromJson(content: string): any[] {
    const parsed = JSON.parse(content);

    // Handle both direct array and wrapped data
    if (Array.isArray(parsed)) {
      return parsed;
    } else if (parsed.data && Array.isArray(parsed.data)) {
      return parsed.data;
    } else {
      throw new Error('Invalid JSON format');
    }
  }

  private importFromCsv(content: string): any[] {
    const lines = content.split('\n');
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim());
    const data: any[] = [];

    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;

      const values = lines[i].split(',').map(v => v.trim());
      const row: any = {};

      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });

      data.push(row);
    }

    return data;
  }

  private importFromXlsx(content: string): any[] {
    // This would require a library like xlsx
    // For now, we'll return an empty array
    return [];
  }

  private downloadFile(data: any, filename: string, format: string): void {
    let content: string;
    let mimeType: string;

    switch (format) {
      case 'json':
        content = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
        mimeType = 'application/json';
        break;
      case 'csv':
        content = data;
        mimeType = 'text/csv';
        break;
      case 'xlsx':
        // For XLSX, we'd need to create a blob
        content = JSON.stringify(data);
        mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        break;
      default:
        content = data;
        mimeType = 'text/plain';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  // Validation methods
  validateImportData(data: any[]): { isValid: boolean; errors: string[]; warnings: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!Array.isArray(data)) {
      errors.push('Data must be an array');
      return { isValid: false, errors, warnings };
    }

    if (data.length === 0) {
      warnings.push('No data found in import file');
    }

    // Add more validation logic as needed
    data.forEach((item, index) => {
      if (!item || typeof item !== 'object') {
        errors.push(`Invalid item at index ${index}`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }
}
