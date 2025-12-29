/**
 * Schema.org compatible types for Home Inventory System
 * Based on: https://schema.org/Product and related types
 */

/**
 * Base Thing type from schema.org
 */
export interface Thing {
  '@context'?: string;
  '@type': string;
  '@id'?: string;
  identifier?: string;
  name: string;
  description?: string;
  image?: string | string[];
  url?: string;
}

/**
 * Product type from schema.org
 * Represents a physical item in the inventory
 */
export interface Product extends Thing {
  '@type': 'Product';
  brand?: string;
  model?: string;
  gtin?: string; // UPC/EAN/ISBN
  serialNumber?: string;
  mpn?: string; // Model/Part Number
  category?: string;
  offers?: Offer;
  ownershipInfo?: OwnershipInfo;
  warrantyInfo?: WarrantyPromise;
  additionalProperty?: PropertyValue[];
}

/**
 * Offer type from schema.org
 * Represents purchase/acquisition information
 */
export interface Offer {
  '@type': 'Offer';
  price: number;
  priceCurrency?: string;
  priceSpecification?: PriceSpecification;
  availability?: string;
  itemCondition?: string;
  validFrom?: string; // Acquisition date
  seller?: string;
  url?: string; // Receipt URL
}

/**
 * Price specification with additional details
 */
export interface PriceSpecification {
  '@type': 'PriceSpecification';
  price: number;
  priceCurrency?: string;
  valueAddedTaxIncluded?: boolean;
  validFrom?: string;
}

/**
 * Warranty information from schema.org
 */
export interface WarrantyPromise {
  '@type': 'WarrantyPromise';
  durationOfWarranty?: QuantitativeValue;
  warrantyScope?: string;
  warrantyURL?: string;
}

/**
 * Quantitative value for warranty duration
 */
export interface QuantitativeValue {
  '@type': 'QuantitativeValue';
  value: number;
  unitCode?: string; // MON for months, ANN for years
  unitText?: string;
}

/**
 * Property-value pairs for additional custom fields
 */
export interface PropertyValue {
  '@type': 'PropertyValue';
  name: string;
  value: string | number | boolean;
  propertyID?: string;
}

/**
 * Custom extension for ownership tracking
 */
export interface OwnershipInfo {
  '@type': 'OwnershipInfo';
  owner: string;
  acquiredDate: string;
  location: string;
  quantity: number;
  quantityOnHand: number;
  quantityAcquired: number;
  quantityRemoved?: number;
  disposalDate?: string;
  condition?: string;
  conditionWhenPurchased?: string;
  notes?: string;
  photoURL?: string;
  receiptURL?: string;
}

/**
 * Complete Inventory Item with all schema.org properties
 */
export interface InventoryItem extends Product {
  // System fields
  id: string;
  timestamp: string;
  lastModified: string;
  
  // User fields
  email?: string;
  
  // Extended fields
  valueSource?: string;
  currentValue?: number;
  classification?: string;
}

/**
 * Filter and search criteria
 */
export interface InventoryFilter {
  location?: string;
  classification?: string;
  brand?: string;
  owner?: string;
  minValue?: number;
  maxValue?: number;
  hasWarranty?: boolean;
  search?: string;
}

/**
 * API Response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
