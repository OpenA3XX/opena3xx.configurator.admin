import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

export interface SearchFilter {
  field: string;
  operator: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'greaterThan' | 'lessThan' | 'in' | 'notIn';
  value: any;
  caseSensitive?: boolean;
}

export interface SearchOptions {
  query: string;
  filters?: SearchFilter[];
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
  highlight?: boolean;
  fuzzy?: boolean;
  searchFields?: string[];
  excludeFields?: string[];
}

export interface SearchResult<T = any> {
  item: T;
  score: number;
  highlights?: { field: string; snippet: string }[];
  matchedFields?: string[];
}

export interface SearchMetadata {
  totalResults: number;
  queryTime: number;
  suggestions?: string[];
  facets?: { field: string; values: { value: string; count: number }[] }[];
}

export interface SearchResponse<T = any> {
  results: SearchResult<T>[];
  metadata: SearchMetadata;
}

export interface SearchHistoryItem {
  query: string;
  timestamp: Date;
  resultCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class AdvancedSearchService {
  private searchHistory = new BehaviorSubject<SearchHistoryItem[]>([]);
  private searchSuggestions = new BehaviorSubject<string[]>([]);
  private recentSearches = new BehaviorSubject<string[]>([]);

  constructor() {
    this.loadSearchHistory();
  }

  // Main search method
  search<T>(data: T[], options: SearchOptions): Observable<SearchResponse<T>> {
    const startTime = performance.now();

    try {
      let results = this.performSearch(data, options);

      // Apply sorting
      if (options.sortBy) {
        results = this.sortResults(results, options.sortBy, options.sortOrder || 'asc');
      }

      // Apply pagination
      const paginatedResults = this.applyPagination(results, options.limit, options.offset);

      // Generate highlights if requested
      if (options.highlight) {
        paginatedResults.results = this.generateHighlights(paginatedResults.results, options.query);
      }

      // Update search history
      this.updateSearchHistory(options.query, paginatedResults.results.length);

      const metadata: SearchMetadata = {
        totalResults: results.length,
        queryTime: performance.now() - startTime,
        suggestions: this.generateSuggestions(options.query, data),
        facets: this.generateFacets(results, options)
      };

      return of({
        results: paginatedResults.results,
        metadata
      });
    } catch (error) {
      console.error('Search error:', error);
      return of({
        results: [],
        metadata: {
          totalResults: 0,
          queryTime: 0
        }
      });
    }
  }

  // Hardware-specific search methods
  searchHardwarePanels(panels: any[], options: SearchOptions): Observable<SearchResponse> {
    const searchOptions = {
      ...options,
      searchFields: options.searchFields || ['name', 'description', 'category', 'status'],
      excludeFields: options.excludeFields || ['id', 'createdAt', 'updatedAt']
    };
    return this.search(panels, searchOptions);
  }

  searchHardwareInputTypes(inputTypes: any[], options: SearchOptions): Observable<SearchResponse> {
    const searchOptions = {
      ...options,
      searchFields: options.searchFields || ['name', 'description', 'category'],
      excludeFields: options.excludeFields || ['id']
    };
    return this.search(inputTypes, searchOptions);
  }

  searchHardwareOutputTypes(outputTypes: any[], options: SearchOptions): Observable<SearchResponse> {
    const searchOptions = {
      ...options,
      searchFields: options.searchFields || ['name', 'description', 'category'],
      excludeFields: options.excludeFields || ['id']
    };
    return this.search(outputTypes, searchOptions);
  }

  searchAircraftModels(models: any[], options: SearchOptions): Observable<SearchResponse> {
    const searchOptions = {
      ...options,
      searchFields: options.searchFields || ['name', 'manufacturer', 'type', 'description'],
      excludeFields: options.excludeFields || ['id', 'createdAt', 'updatedAt']
    };
    return this.search(models, searchOptions);
  }

  // Search history management
  getSearchHistory(): Observable<SearchHistoryItem[]> {
    return this.searchHistory.asObservable();
  }

  getRecentSearches(): Observable<string[]> {
    return this.recentSearches.asObservable();
  }

  getSearchSuggestions(): Observable<string[]> {
    return this.searchSuggestions.asObservable();
  }

  clearSearchHistory(): void {
    this.searchHistory.next([]);
    localStorage.removeItem('searchHistory');
  }

  // Auto-complete functionality
  getAutoCompleteSuggestions(query: string, data: any[], fields: string[] = []): Observable<string[]> {
    if (!query || query.length < 2) {
      return of([]);
    }

    const suggestions = new Set<string>();
    const searchFields = fields.length > 0 ? fields : Object.keys(data[0] || {});

    data.forEach(item => {
      searchFields.forEach(field => {
        const value = this.getNestedValue(item, field);
        if (value && typeof value === 'string') {
          const words = value.toLowerCase().split(/\s+/);
          words.forEach(word => {
            if (word.startsWith(query.toLowerCase()) && word !== query.toLowerCase()) {
              suggestions.add(word);
            }
          });
        }
      });
    });

    return of(Array.from(suggestions).slice(0, 10));
  }

  // Private helper methods
  private performSearch<T>(data: T[], options: SearchOptions): SearchResult<T>[] {
    const results: SearchResult<T>[] = [];
    const query = options.query.toLowerCase();
    const searchFields = options.searchFields || Object.keys(data[0] || {});
    const excludeFields = options.excludeFields || [];

    data.forEach(item => {
      let score = 0;
      const matchedFields: string[] = [];
      const highlights: { field: string; snippet: string }[] = [];

      // Search in specified fields
      searchFields.forEach(field => {
        if (excludeFields.includes(field)) return;

        const value = this.getNestedValue(item, field);
        if (!value) return;

        const stringValue = String(value).toLowerCase();

        // Exact match gets highest score
        if (stringValue === query) {
          score += 100;
          matchedFields.push(field);
          highlights.push({ field, snippet: this.highlightText(String(value), query) });
        }
        // Starts with gets high score
        else if (stringValue.startsWith(query)) {
          score += 50;
          matchedFields.push(field);
          highlights.push({ field, snippet: this.highlightText(String(value), query) });
        }
        // Contains gets medium score
        else if (stringValue.includes(query)) {
          score += 25;
          matchedFields.push(field);
          highlights.push({ field, snippet: this.highlightText(String(value), query) });
        }
        // Fuzzy match gets low score
        else if (options.fuzzy && this.fuzzyMatch(stringValue, query)) {
          score += 10;
          matchedFields.push(field);
          highlights.push({ field, snippet: this.highlightText(String(value), query) });
        }
      });

      // Apply filters
      if (options.filters) {
        const passesFilters = this.applyFilters(item, options.filters);
        if (!passesFilters) return;
      }

      if (score > 0) {
        results.push({
          item,
          score,
          highlights: highlights.length > 0 ? highlights : undefined,
          matchedFields: matchedFields.length > 0 ? matchedFields : undefined
        });
      }
    });

    // Sort by score (highest first)
    return results.sort((a, b) => b.score - a.score);
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  private fuzzyMatch(text: string, query: string): boolean {
    const queryWords = query.split(/\s+/);
    return queryWords.every(word =>
      text.includes(word) ||
      this.levenshteinDistance(text, word) <= 2
    );
  }

  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));

    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator
        );
      }
    }

    return matrix[str2.length][str1.length];
  }

  private applyFilters(item: any, filters: SearchFilter[]): boolean {
    return filters.every(filter => {
      const value = this.getNestedValue(item, filter.field);
      const filterValue = filter.value;
      const itemValue = filter.caseSensitive ? value : String(value).toLowerCase();
      const compareValue = filter.caseSensitive ? filterValue : String(filterValue).toLowerCase();

      switch (filter.operator) {
        case 'equals':
          return itemValue === compareValue;
        case 'contains':
          return String(itemValue).includes(compareValue);
        case 'startsWith':
          return String(itemValue).startsWith(compareValue);
        case 'endsWith':
          return String(itemValue).endsWith(compareValue);
        case 'greaterThan':
          return Number(itemValue) > Number(compareValue);
        case 'lessThan':
          return Number(itemValue) < Number(compareValue);
        case 'in':
          return Array.isArray(filterValue) && filterValue.includes(itemValue);
        case 'notIn':
          return Array.isArray(filterValue) && !filterValue.includes(itemValue);
        default:
          return true;
      }
    });
  }

  private sortResults<T>(results: SearchResult<T>[], sortBy: string, sortOrder: 'asc' | 'desc'): SearchResult<T>[] {
    return results.sort((a, b) => {
      const aValue = this.getNestedValue(a.item, sortBy);
      const bValue = this.getNestedValue(b.item, sortBy);

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }

  private applyPagination<T>(results: SearchResult<T>[], limit?: number, offset?: number): { results: SearchResult<T>[]; total: number } {
    const total = results.length;
    const start = offset || 0;
    const end = limit ? start + limit : total;

    return {
      results: results.slice(start, end),
      total
    };
  }

  private generateHighlights<T>(results: SearchResult<T>[], query: string): SearchResult<T>[] {
    return results.map(result => {
      if (!result.highlights) {
        result.highlights = [];
      }
      return result;
    });
  }

  private highlightText(text: string, query: string): string {
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }

  private generateSuggestions(query: string, data: any[]): string[] {
    const suggestions = new Set<string>();
    const words = query.toLowerCase().split(/\s+/);

    data.forEach(item => {
      Object.values(item).forEach(value => {
        if (typeof value === 'string') {
          const itemWords = value.toLowerCase().split(/\s+/);
          itemWords.forEach(word => {
            words.forEach(queryWord => {
              if (word.startsWith(queryWord) && word !== queryWord) {
                suggestions.add(word);
              }
            });
          });
        }
      });
    });

    return Array.from(suggestions).slice(0, 5);
  }

  private generateFacets<T>(results: SearchResult<T>[], options: SearchOptions): { field: string; values: { value: string; count: number }[] }[] {
    const facets: { field: string; values: { value: string; count: number }[] }[] = [];

    // Generate facets for common fields
    const facetFields = ['category', 'status', 'type'];

    facetFields.forEach(field => {
      const values: { [key: string]: number } = {};

      results.forEach(result => {
        const value = this.getNestedValue(result.item, field);
        if (value) {
          const stringValue = String(value);
          values[stringValue] = (values[stringValue] || 0) + 1;
        }
      });

      if (Object.keys(values).length > 0) {
        facets.push({
          field,
          values: Object.entries(values).map(([value, count]) => ({ value, count }))
        });
      }
    });

    return facets;
  }

  private updateSearchHistory(query: string, resultCount: number): void {
    const history = this.searchHistory.value;
    const newItem: SearchHistoryItem = {
      query,
      timestamp: new Date(),
      resultCount
    };

    // Remove duplicate entries
    const filteredHistory = history.filter(item => item.query !== query);
    const updatedHistory = [newItem, ...filteredHistory].slice(0, 50); // Keep last 50 searches

    this.searchHistory.next(updatedHistory);
    this.saveSearchHistory(updatedHistory);
  }

  private loadSearchHistory(): void {
    try {
      const saved = localStorage.getItem('searchHistory');
      if (saved) {
        const history = JSON.parse(saved);
        this.searchHistory.next(history);
      }
    } catch (error) {
      console.error('Error loading search history:', error);
    }
  }

  private saveSearchHistory(history: SearchHistoryItem[]): void {
    try {
      localStorage.setItem('searchHistory', JSON.stringify(history));
    } catch (error) {
      console.error('Error saving search history:', error);
    }
  }
}
