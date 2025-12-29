# API Documentation

Complete REST API documentation for the Home Inventory Management System.

## Base URL

```
http://localhost:3000/api
```

## Response Format

All responses follow this format:

```typescript
{
  success: boolean;
  data?: any;
  error?: string;
  message?: string;
}
```

## Endpoints

### Items

#### Get All Items

```http
GET /api/items
```

**Query Parameters:**

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| page | number | Page number | 1 |
| limit | number | Items per page (1-100) | 20 |
| sortBy | string | Field to sort by | timestamp |
| sortOrder | string | asc or desc | desc |
| location | string | Filter by location | - |
| classification | string | Filter by classification | - |
| brand | string | Filter by brand | - |
| owner | string | Filter by owner | - |
| search | string | Text search across fields | - |

**Example Request:**

```bash
curl "http://localhost:3000/api/items?page=1&limit=10&location=Office&search=camera"
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      "id": "uuid-here",
      "name": "Sony A7R III Camera",
      "brand": "Sony",
      "model": "ILCE-7RM3",
      ...
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 42,
    "totalPages": 5
  }
}
```

#### Get Single Item

```http
GET /api/items/:id
```

**Example Request:**

```bash
curl "http://localhost:3000/api/items/abc-123-def"
```

**Response:**

```json
{
  "success": true,
  "data": {
    "@context": "https://schema.org",
    "@type": "Product",
    "id": "abc-123-def",
    "name": "Sony A7R III Camera",
    ...
  }
}
```

#### Create Item

```http
POST /api/items
```

**Headers:**

```
Content-Type: application/json
```

**Body:**

```json
{
  "name": "MacBook Pro",
  "brand": "Apple",
  "model": "MacBook Pro 16-inch 2023",
  "serialNumber": "C02ZM263JV40",
  "classification": "Computer",
  "currentValue": 2999.00,
  "offers": {
    "price": 3499.00,
    "priceCurrency": "USD",
    "itemCondition": "New",
    "validFrom": "2023-05-15"
  },
  "ownershipInfo": {
    "owner": "Jane Smith",
    "location": "Office",
    "acquiredDate": "2023-05-15",
    "quantity": 1,
    "condition": "Excellent"
  },
  "warrantyInfo": {
    "durationOfWarranty": {
      "value": 36,
      "unitCode": "MON"
    }
  }
}
```

**Example Request:**

```bash
curl -X POST "http://localhost:3000/api/items" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "MacBook Pro",
    "brand": "Apple",
    "ownershipInfo": {
      "location": "Office",
      "quantity": 1
    }
  }'
```

**Response:**

```json
{
  "success": true,
  "data": {
    "@context": "https://schema.org",
    "@type": "Product",
    "id": "generated-uuid",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "lastModified": "2024-01-15T10:30:00.000Z",
    "name": "MacBook Pro",
    ...
  },
  "message": "Item created successfully"
}
```

#### Update Item

```http
PUT /api/items/:id
```

**Headers:**

```
Content-Type: application/json
```

**Body:** (same structure as POST, all fields optional)

```json
{
  "currentValue": 2500.00,
  "ownershipInfo": {
    "condition": "Good"
  }
}
```

**Example Request:**

```bash
curl -X PUT "http://localhost:3000/api/items/abc-123-def" \
  -H "Content-Type: application/json" \
  -d '{"currentValue": 2500.00}'
```

**Response:**

```json
{
  "success": true,
  "data": {
    "@context": "https://schema.org",
    "@type": "Product",
    "id": "abc-123-def",
    "lastModified": "2024-01-15T15:45:00.000Z",
    ...
  },
  "message": "Item updated successfully"
}
```

#### Delete Item

```http
DELETE /api/items/:id
```

**Example Request:**

```bash
curl -X DELETE "http://localhost:3000/api/items/abc-123-def"
```

**Response:**

```json
{
  "success": true,
  "message": "Item deleted successfully"
}
```

### Filters

#### Get Unique Field Values

Get unique values for any field to populate filter dropdowns.

```http
GET /api/filters/:field
```

**Example Requests:**

```bash
# Get all locations
curl "http://localhost:3000/api/filters/ownershipInfo.location"

# Get all classifications
curl "http://localhost:3000/api/filters/classification"

# Get all brands
curl "http://localhost:3000/api/filters/brand"
```

**Response:**

```json
{
  "success": true,
  "data": ["Office", "Garage", "Home Office", "Master Bedroom"]
}
```

### Statistics

#### Get Inventory Statistics

```http
GET /api/statistics
```

**Example Request:**

```bash
curl "http://localhost:3000/api/statistics"
```

**Response:**

```json
{
  "success": true,
  "data": {
    "totalItems": 42,
    "totalValue": 15234.50,
    "byLocation": {
      "Office": 15,
      "Garage": 8,
      "Home Office": 12,
      "Master Bedroom": 7
    },
    "byClassification": {
      "Computer": 10,
      "Photography": 15,
      "Tools": 8,
      "Appliance": 9
    },
    "itemsWithWarranty": 28
  }
}
```

### Import/Export

#### Export Inventory

Export entire inventory as JSON-LD.

```http
GET /api/export
```

**Example Request:**

```bash
curl "http://localhost:3000/api/export" -o inventory-export.json
```

**Response:**

Returns a JSON-LD file with all inventory items:

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Product",
      "id": "abc-123",
      ...
    },
    ...
  ]
}
```

#### Import Inventory

Import items from JSON array or JSON-LD format.

```http
POST /api/import
```

**Headers:**

```
Content-Type: application/json
```

**Body:**

```json
{
  "items": [
    {
      "name": "Item 1",
      "brand": "Brand",
      ...
    },
    {
      "name": "Item 2",
      ...
    }
  ]
}
```

Or directly as an array:

```json
[
  {
    "name": "Item 1",
    ...
  },
  {
    "name": "Item 2",
    ...
  }
]
```

**Example Request:**

```bash
curl -X POST "http://localhost:3000/api/import" \
  -H "Content-Type: application/json" \
  -d @inventory-data.json
```

**Response:**

```json
{
  "success": true,
  "data": {
    "imported": 42
  },
  "message": "Successfully imported 42 items"
}
```

## Schema.org Data Structure

All items follow schema.org standards:

### Product

Core product information:

```typescript
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": string,              // Required
  "brand": string,
  "model": string,
  "gtin": string,              // UPC/EAN
  "serialNumber": string,
  "mpn": string,               // Model/Part Number
  "category": string,
  "description": string,
  "image": string | string[]
}
```

### Offer

Purchase/pricing information:

```typescript
{
  "@type": "Offer",
  "price": number,
  "priceCurrency": string,     // e.g., "USD"
  "itemCondition": string,     // "New", "Used", etc.
  "validFrom": string,         // ISO date (acquisition)
  "seller": string,
  "url": string                // Receipt URL
}
```

### OwnershipInfo

Custom extension for ownership tracking:

```typescript
{
  "@type": "OwnershipInfo",
  "owner": string,
  "location": string,
  "acquiredDate": string,      // ISO date
  "quantity": number,
  "quantityAcquired": number,
  "quantityOnHand": number,
  "quantityRemoved": number,
  "condition": string,
  "conditionWhenPurchased": string,
  "disposalDate": string,      // ISO date
  "notes": string,
  "photoURL": string,
  "receiptURL": string
}
```

### WarrantyPromise

Warranty information:

```typescript
{
  "@type": "WarrantyPromise",
  "durationOfWarranty": {
    "@type": "QuantitativeValue",
    "value": number,
    "unitCode": string,        // "MON" or "ANN"
    "unitText": string         // "months" or "years"
  },
  "warrantyURL": string
}
```

## Error Responses

### 400 Bad Request

```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    {
      "field": "name",
      "message": "Name is required"
    }
  ]
}
```

### 404 Not Found

```json
{
  "success": false,
  "error": "Item not found"
}
```

### 500 Internal Server Error

```json
{
  "success": false,
  "error": "Internal server error",
  "message": "Detailed error message (in development mode)"
}
```

## Rate Limiting

Currently no rate limiting is implemented. Consider adding rate limiting for production use.

## Authentication

Currently no authentication is implemented. This is designed for local/private use. For production:

1. Add JWT or session-based authentication
2. Implement role-based access control
3. Add API key authentication for programmatic access

## CORS

Default CORS policy allows all origins (`*`). Configure via `CORS_ORIGIN` environment variable:

```bash
CORS_ORIGIN=http://localhost:3000,https://yourdomain.com
```

## Pagination Best Practices

- Default page size: 20 items
- Maximum page size: 100 items
- Use `page` and `limit` parameters
- Check `totalPages` in response for navigation

## Search Best Practices

- Text search is case-insensitive
- Searches across: name, brand, model, classification, description
- Combine with filters for refined results
- Use debouncing on frontend to avoid excessive requests

## Sorting

Available sort fields:
- `timestamp` - Creation date
- `lastModified` - Last update date
- `name` - Item name
- `currentValue` - Current value
- `brand` - Brand name
- `ownershipInfo.location` - Location

## Data Backup

- Automatic backups created before each write
- Backups stored in `data/backups/`
- Last 10 backups retained
- Manual backup: Copy `data/inventory.json`

## Health Check

```http
GET /health
```

**Response:**

```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "version": "1.0.0"
}
```
