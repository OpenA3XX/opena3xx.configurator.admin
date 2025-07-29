import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map, catchError, delay } from 'rxjs/operators';

export interface BulkOperation {
  id: string;
  type: 'delete' | 'update' | 'import' | 'export';
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  progress: number;
  totalItems: number;
  processedItems: number;
  successfulItems: number;
  failedItems: number;
  errors: BulkOperationError[];
  startTime?: Date;
  endTime?: Date;
  description: string;
  data?: any;
}

export interface BulkOperationError {
  itemId: string;
  itemName: string;
  error: string;
  field?: string;
}

export interface BulkOperationConfig {
  batchSize?: number;
  delayBetweenBatches?: number;
  retryAttempts?: number;
  retryDelay?: number;
  validateBeforeOperation?: boolean;
  showProgress?: boolean;
  allowCancellation?: boolean;
}

export interface BulkDeleteConfig extends BulkOperationConfig {
  confirmDeletion?: boolean;
  softDelete?: boolean;
  cascadeDelete?: boolean;
}

export interface BulkUpdateConfig extends BulkOperationConfig {
  updateFields: string[];
  validationRules?: { [field: string]: any };
}

export interface BulkImportConfig extends BulkOperationConfig {
  validateData?: boolean;
  overwriteExisting?: boolean;
  createBackup?: boolean;
  mappingRules?: { [sourceField: string]: string };
}

export interface BulkExportConfig extends BulkOperationConfig {
  format: 'json' | 'csv' | 'xlsx';
  includeMetadata?: boolean;
  compress?: boolean;
  filter?: any;
}

@Injectable({
  providedIn: 'root'
})
export class BulkOperationsService {
  private operations = new BehaviorSubject<BulkOperation[]>([]);
  private activeOperation = new BehaviorSubject<BulkOperation | null>(null);

  constructor() {}

  // Public API
  getOperations(): Observable<BulkOperation[]> {
    return this.operations.asObservable();
  }

  getActiveOperation(): Observable<BulkOperation | null> {
    return this.activeOperation.asObservable();
  }

  // Bulk Delete Operations
  bulkDelete<T>(
    items: T[],
    deleteFunction: (item: T) => Observable<any>,
    config: BulkDeleteConfig = {}
  ): Observable<BulkOperation> {
    const operation = this.createOperation('delete', items.length, 'Deleting items...');

    return this.executeBulkOperation(
      operation,
      items,
      deleteFunction,
      config
    );
  }

  // Bulk Update Operations
  bulkUpdate<T>(
    items: T[],
    updateData: Partial<T>,
    updateFunction: (item: T, data: Partial<T>) => Observable<any>,
    config: BulkUpdateConfig
  ): Observable<BulkOperation> {
    const operation = this.createOperation('update', items.length, 'Updating items...');

    return this.executeBulkOperation(
      operation,
      items,
      (item) => updateFunction(item, updateData),
      config
    );
  }

  // Bulk Import Operations
  bulkImport<T>(
    data: T[],
    importFunction: (item: T) => Observable<any>,
    config: BulkImportConfig = {}
  ): Observable<BulkOperation> {
    const operation = this.createOperation('import', data.length, 'Importing items...');

    return this.executeBulkOperation(
      operation,
      data,
      importFunction,
      config
    );
  }

  // Bulk Export Operations
  bulkExport<T>(
    items: T[],
    exportFunction: (items: T[]) => Observable<any>,
    config: BulkExportConfig
  ): Observable<BulkOperation> {
    const operation = this.createOperation('export', items.length, 'Exporting items...');

    return this.executeBulkOperation(
      operation,
      items,
      (item) => exportFunction([item]),
      config
    );
  }

  // Hardware-specific bulk operations
  bulkDeleteHardwarePanels(
    panels: any[],
    deleteFunction: (panel: any) => Observable<any>,
    config: BulkDeleteConfig = {}
  ): Observable<BulkOperation> {
    const operation = this.createOperation('delete', panels.length, 'Deleting hardware panels...');
    return this.executeBulkOperation(operation, panels, deleteFunction, config);
  }

  bulkUpdateHardwarePanels(
    panels: any[],
    updateData: Partial<any>,
    updateFunction: (panel: any, data: Partial<any>) => Observable<any>,
    config: BulkUpdateConfig
  ): Observable<BulkOperation> {
    const operation = this.createOperation('update', panels.length, 'Updating hardware panels...');
    return this.executeBulkOperation(operation, panels, (panel) => updateFunction(panel, updateData), config);
  }

  bulkDeleteHardwareInputTypes(
    inputTypes: any[],
    deleteFunction: (inputType: any) => Observable<any>,
    config: BulkDeleteConfig = {}
  ): Observable<BulkOperation> {
    const operation = this.createOperation('delete', inputTypes.length, 'Deleting hardware input types...');
    return this.executeBulkOperation(operation, inputTypes, deleteFunction, config);
  }

  bulkDeleteHardwareOutputTypes(
    outputTypes: any[],
    deleteFunction: (outputType: any) => Observable<any>,
    config: BulkDeleteConfig = {}
  ): Observable<BulkOperation> {
    const operation = this.createOperation('delete', outputTypes.length, 'Deleting hardware output types...');
    return this.executeBulkOperation(operation, outputTypes, deleteFunction, config);
  }

  // Operation management
  cancelOperation(operationId: string): void {
    const operations = this.operations.value;
    const operation = operations.find(op => op.id === operationId);

    if (operation && operation.status === 'running') {
      operation.status = 'cancelled';
      operation.endTime = new Date();
      this.operations.next([...operations]);

      if (this.activeOperation.value?.id === operationId) {
        this.activeOperation.next(null);
      }
    }
  }

  clearCompletedOperations(): void {
    const operations = this.operations.value;
    const activeOperations = operations.filter(op =>
      op.status === 'pending' || op.status === 'running'
    );
    this.operations.next(activeOperations);
  }

  retryOperation(operationId: string): Observable<BulkOperation> {
    const operations = this.operations.value;
    const operation = operations.find(op => op.id === operationId);

    if (!operation || operation.status !== 'failed') {
      return throwError(() => new Error('Operation cannot be retried'));
    }

    // Reset operation for retry
    operation.status = 'pending';
    operation.progress = 0;
    operation.processedItems = 0;
    operation.successfulItems = 0;
    operation.failedItems = 0;
    operation.errors = [];
    operation.startTime = undefined;
    operation.endTime = undefined;

    this.operations.next([...operations]);

    // Return the operation for retry (implementation would depend on the original operation type)
    return of(operation);
  }

  // Private helper methods
  private createOperation(
    type: BulkOperation['type'],
    totalItems: number,
    description: string
  ): BulkOperation {
    const operation: BulkOperation = {
      id: `bulk_${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      status: 'pending',
      progress: 0,
      totalItems,
      processedItems: 0,
      successfulItems: 0,
      failedItems: 0,
      errors: [],
      description
    };

    const operations = this.operations.value;
    this.operations.next([...operations, operation]);

    return operation;
  }

  private executeBulkOperation<T>(
    operation: BulkOperation,
    items: T[],
    processFunction: (item: T) => Observable<any>,
    config: BulkOperationConfig = {}
  ): Observable<BulkOperation> {
    const {
      batchSize = 10,
      delayBetweenBatches = 100,
      retryAttempts = 3,
      retryDelay = 1000,
      validateBeforeOperation = true,
      showProgress = true,
      allowCancellation = true
    } = config;

    return new Observable(observer => {
      operation.status = 'running';
      operation.startTime = new Date();
      this.activeOperation.next(operation);
      this.updateOperation(operation);

      let currentIndex = 0;
      const processBatch = async () => {
        const batch = items.slice(currentIndex, currentIndex + batchSize);

        for (const item of batch) {
          // Check for cancellation
          if (operation.status === 'cancelled') {
            observer.complete();
            return;
          }

          try {
            // Validate item if required
            if (validateBeforeOperation && !this.validateItem(item, config)) {
              operation.errors.push({
                itemId: this.getItemId(item),
                itemName: this.getItemName(item),
                error: 'Validation failed'
              });
              operation.failedItems++;
            } else {
              // Process item with retry logic
              await this.processItemWithRetry(item, processFunction, retryAttempts, retryDelay);
              operation.successfulItems++;
            }
          } catch (error) {
            operation.errors.push({
              itemId: this.getItemId(item),
              itemName: this.getItemName(item),
              error: error instanceof Error ? error.message : 'Unknown error'
            });
            operation.failedItems++;
          }

          operation.processedItems++;
          operation.progress = (operation.processedItems / operation.totalItems) * 100;
          this.updateOperation(operation);

          if (showProgress) {
            observer.next(operation);
          }
        }

        currentIndex += batchSize;

        if (currentIndex < items.length) {
          // Add delay between batches
          setTimeout(processBatch, delayBetweenBatches);
        } else {
          // Operation completed
          operation.status = operation.failedItems === 0 ? 'completed' : 'failed';
          operation.endTime = new Date();
          this.activeOperation.next(null);
          this.updateOperation(operation);
          observer.next(operation);
          observer.complete();
        }
      };

      processBatch();
    });
  }

  private async processItemWithRetry<T>(
    item: T,
    processFunction: (item: T) => Observable<any>,
    retryAttempts: number,
    retryDelay: number
  ): Promise<void> {
    let lastError: any;

    for (let attempt = 0; attempt <= retryAttempts; attempt++) {
      try {
        await processFunction(item).toPromise();
        return;
      } catch (error) {
        lastError = error;
        if (attempt < retryAttempts) {
          await new Promise(resolve => setTimeout(resolve, retryDelay));
        }
      }
    }

    throw lastError;
  }

  private validateItem(item: any, config: BulkOperationConfig): boolean {
    // Basic validation - can be extended based on specific requirements
    return item && typeof item === 'object';
  }

  private getItemId(item: any): string {
    return item.id || item.name || 'unknown';
  }

  private getItemName(item: any): string {
    return item.name || item.title || item.id || 'Unknown Item';
  }

  private updateOperation(operation: BulkOperation): void {
    const operations = this.operations.value;
    const index = operations.findIndex(op => op.id === operation.id);

    if (index !== -1) {
      operations[index] = { ...operation };
      this.operations.next([...operations]);
    }
  }

  // Utility methods
  getOperationById(operationId: string): BulkOperation | null {
    return this.operations.value.find(op => op.id === operationId) || null;
  }

  getOperationStats(): {
    total: number;
    pending: number;
    running: number;
    completed: number;
    failed: number;
    cancelled: number;
  } {
    const operations = this.operations.value;
    return {
      total: operations.length,
      pending: operations.filter(op => op.status === 'pending').length,
      running: operations.filter(op => op.status === 'running').length,
      completed: operations.filter(op => op.status === 'completed').length,
      failed: operations.filter(op => op.status === 'failed').length,
      cancelled: operations.filter(op => op.status === 'cancelled').length
    };
  }

  // Cleanup
  ngOnDestroy(): void {
    this.operations.complete();
    this.activeOperation.complete();
  }
}
