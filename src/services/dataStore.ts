import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { InventoryItem, InventoryFilter, PaginationParams } from '../types/schema';

/**
 * JSON-based data store for inventory items
 */
export class DataStore {
  private dataPath: string;
  private backupPath: string;

  constructor(dataDir: string = './data') {
    this.dataPath = path.join(dataDir, 'inventory.json');
    this.backupPath = path.join(dataDir, 'backups');
  }

  /**
   * Initialize the data store and create necessary directories
   */
  async initialize(): Promise<void> {
    const dataDir = path.dirname(this.dataPath);
    
    try {
      await fs.mkdir(dataDir, { recursive: true });
      await fs.mkdir(this.backupPath, { recursive: true });
      
      // Create empty inventory file if it doesn't exist
      try {
        await fs.access(this.dataPath);
      } catch {
        await this.writeData([]);
      }
    } catch (error) {
      console.error('Failed to initialize data store:', error);
      throw error;
    }
  }

  /**
   * Read all items from the data store
   */
  private async readData(): Promise<InventoryItem[]> {
    try {
      const data = await fs.readFile(this.dataPath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Failed to read data:', error);
      return [];
    }
  }

  /**
   * Write items to the data store with backup
   */
  private async writeData(items: InventoryItem[]): Promise<void> {
    try {
      // Create backup before writing
      await this.createBackup();
      
      const data = JSON.stringify(items, null, 2);
      await fs.writeFile(this.dataPath, data, 'utf-8');
    } catch (error) {
      console.error('Failed to write data:', error);
      throw error;
    }
  }

  /**
   * Create a timestamped backup of the current data
   */
  private async createBackup(): Promise<void> {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupFile = path.join(this.backupPath, `inventory-${timestamp}.json`);
      
      try {
        await fs.access(this.dataPath);
        await fs.copyFile(this.dataPath, backupFile);
        
        // Keep only last 10 backups
        await this.cleanupOldBackups(10);
      } catch {
        // File doesn't exist yet, skip backup
      }
    } catch (error) {
      console.error('Failed to create backup:', error);
    }
  }

  /**
   * Remove old backups, keeping only the specified number
   */
  private async cleanupOldBackups(keepCount: number): Promise<void> {
    try {
      const files = await fs.readdir(this.backupPath);
      const backupFiles = files
        .filter(f => f.startsWith('inventory-') && f.endsWith('.json'))
        .sort()
        .reverse();
      
      // Delete old backups
      for (let i = keepCount; i < backupFiles.length; i++) {
        await fs.unlink(path.join(this.backupPath, backupFiles[i]));
      }
    } catch (error) {
      console.error('Failed to cleanup old backups:', error);
    }
  }

  /**
   * Get all inventory items
   */
  async getAll(): Promise<InventoryItem[]> {
    return this.readData();
  }

  /**
   * Get a single item by ID
   */
  async getById(id: string): Promise<InventoryItem | null> {
    const items = await this.readData();
    return items.find(item => item.id === id) || null;
  }

  /**
   * Create a new inventory item
   */
  async create(itemData: Omit<InventoryItem, 'id' | 'timestamp' | 'lastModified'>): Promise<InventoryItem> {
    const items = await this.readData();
    
    const newItem: InventoryItem = {
      '@context': 'https://schema.org',

      id: uuidv4(),
      timestamp: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      ...itemData
    };
    
    items.push(newItem);
    await this.writeData(items);
    
    return newItem;
  }

  /**
   * Update an existing inventory item
   */
  async update(id: string, updates: Partial<InventoryItem>): Promise<InventoryItem | null> {
    const items = await this.readData();
    const index = items.findIndex(item => item.id === id);
    
    if (index === -1) {
      return null;
    }
    
    items[index] = {
      ...items[index],
      ...updates,
      id, // Ensure ID doesn't change
      timestamp: items[index].timestamp, // Keep original timestamp
      lastModified: new Date().toISOString()
    };
    
    await this.writeData(items);
    return items[index];
  }

  /**
   * Delete an inventory item
   */
  async delete(id: string): Promise<boolean> {
    const items = await this.readData();
    const filteredItems = items.filter(item => item.id !== id);
    
    if (filteredItems.length === items.length) {
      return false; // Item not found
    }
    
    await this.writeData(filteredItems);
    return true;
  }

  /**
   * Search and filter inventory items
   */
  async search(filter: InventoryFilter): Promise<InventoryItem[]> {
    const items = await this.readData();
    
    return items.filter(item => {
      // Location filter
      if (filter.location && item.ownershipInfo?.location !== filter.location) {
        return false;
      }
      
      // Classification filter
      if (filter.classification && item.classification !== filter.classification) {
        return false;
      }
      
      // Brand filter
      if (filter.brand && item.brand !== filter.brand) {
        return false;
      }
      
      // Owner filter
      if (filter.owner && item.ownershipInfo?.owner !== filter.owner) {
        return false;
      }
      
      // Value range filters
      if (filter.minValue && (item.currentValue || 0) < filter.minValue) {
        return false;
      }
      
      if (filter.maxValue && (item.currentValue || 0) > filter.maxValue) {
        return false;
      }
      
      // Warranty filter
      if (filter.hasWarranty !== undefined) {
        const hasWarranty = !!item.warrantyInfo;
        if (filter.hasWarranty !== hasWarranty) {
          return false;
        }
      }
      
      // Text search (searches in name, brand, model, classification)
      if (filter.search) {
        const searchLower = filter.search.toLowerCase();
        const searchableText = [
          item.name,
          item.brand,
          item.model,
          item.classification,
          item.description
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        
        if (!searchableText.includes(searchLower)) {
          return false;
        }
      }
      
      return true;
    });
  }

  /**
   * Get paginated results
   */
  async getPaginated(
    filter: InventoryFilter,
    params: PaginationParams
  ): Promise<{ items: InventoryItem[]; total: number }> {
    const { page = 1, limit = 20, sortBy = 'timestamp', sortOrder = 'desc' } = params;
    
    let items = await this.search(filter);
    const total = items.length;
    
    // Sort
    items.sort((a, b) => {
      const aVal = this.getNestedValue(a, sortBy);
      const bVal = this.getNestedValue(b, sortBy);
      
      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    
    // Paginate
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    items = items.slice(startIndex, endIndex);
    
    return { items, total };
  }

  /**
   * Get value from nested object path
   */
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj) || '';
  }

  /**
   * Get unique values for a field (useful for filters)
   */
  async getUniqueValues(field: keyof InventoryItem | string): Promise<string[]> {
    const items = await this.readData();
    const values = new Set<string>();
    
    items.forEach(item => {
      const value = this.getNestedValue(item, field);
      if (value) {
        values.add(String(value));
      }
    });
    
    return Array.from(values).sort();
  }

  /**
   * Get statistics about the inventory
   */
  async getStatistics(): Promise<{
    totalItems: number;
    totalValue: number;
    byLocation: Record<string, number>;
    byClassification: Record<string, number>;
    itemsWithWarranty: number;
  }> {
    const items = await this.readData();
    
    const stats = {
      totalItems: items.length,
      totalValue: 0,
      byLocation: {} as Record<string, number>,
      byClassification: {} as Record<string, number>,
      itemsWithWarranty: 0
    };
    
    items.forEach(item => {
      // Total value
      stats.totalValue += item.currentValue || 0;
      
      // By location
      const location = item.ownershipInfo?.location || 'Unknown';
      stats.byLocation[location] = (stats.byLocation[location] || 0) + 1;
      
      // By classification
      const classification = item.classification || 'Uncategorized';
      stats.byClassification[classification] = (stats.byClassification[classification] || 0) + 1;
      
      // Warranty count
      if (item.warrantyInfo) {
        stats.itemsWithWarranty++;
      }
    });
    
    return stats;
  }

  /**
   * Export data as JSON-LD
   */
  async exportJsonLD(): Promise<string> {
    const items = await this.readData();
    
    const jsonLD = {
      '@context': 'https://schema.org',
      '@graph': items
    };
    
    return JSON.stringify(jsonLD, null, 2);
  }

  /**
   * Import items from array
   */
  async importItems(items: InventoryItem[]): Promise<number> {
    const existingItems = await this.readData();
    
    // Merge items, replacing by ID if exists
    const itemMap = new Map(existingItems.map(item => [item.id, item]));
    
    items.forEach(item => {
      if (!item.id) {
        item.id = uuidv4();
      }
      item.lastModified = new Date().toISOString();
      itemMap.set(item.id, item);
    });
    
    const mergedItems = Array.from(itemMap.values());
    await this.writeData(mergedItems);
    
    return items.length;
  }
}
