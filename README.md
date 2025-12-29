# Home Inventory Management System

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)

A modern, schema.org-compatible home inventory management application built with Node.js, TypeScript, and a clean JSON data store. Replace your Google Sheets and Forms with a beautiful, self-hosted solution.

**Repository:** https://github.com/jwilleke/mjs-inventory

## Features

- ✨ **Schema.org Compatibility**: Data structured using schema.org types (Product, Offer, OwnershipInfo, WarrantyPromise)
- 📦 **Complete CRUD Operations**: Create, read, update, and delete inventory items
- 🔍 **Advanced Search & Filtering**: Filter by location, classification, brand, owner, and more
- 📊 **Statistics Dashboard**: Track total items, value, and warranty status
- 💾 **JSON-LD Export**: Export your inventory in JSON-LD format for interoperability
- 🎨 **Beautiful UI**: Distinctive, production-grade interface with refined aesthetics
- 🔄 **Automatic Backups**: Data automatically backed up with every change
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile devices

## Technology Stack

- **Backend**: Node.js, Express, TypeScript
- **Data Store**: JSON file-based storage (no database required)
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Schema**: schema.org compatible data structures

## Installation

### Prerequisites

- Node.js 18+ and npm

### Setup

1. **Clone or download the project**

2. **Install dependencies**
   ```bash
   ```

3. **Build the TypeScript code**
   ```bash
   npm run build
   ```

4. **Start the server**
   ```bash
   npm start
   ```

   For development with auto-reload:
   ```bash
   npm run dev
   ```

5. **Access the application**
   Open your browser to: `http://localhost:3000`

## Project Structure

```
home-inventory-app/
├── src/
│   ├── types/
│   │   └── schema.ts          # Schema.org compatible TypeScript types
│   ├── services/
│   │   └── dataStore.ts       # JSON data store service
│   ├── routes/
│   │   └── inventory.ts       # API routes
│   └── server.ts              # Express server setup
├── public/
│   └── index.html             # Frontend application
├── data/
│   ├── inventory.json         # Main data file (auto-created)
│   └── backups/               # Automatic backups (auto-created)
├── package.json
├── tsconfig.json
└── README.md
```

## Usage

### Adding Items

1. Click **"Add New Item"** in the navigation
2. Fill in the item details:
   - **Required**: Item name
   - **Optional**: Brand, model, serial number, UPC, classification, location, owner, purchase date, price, current value, condition, warranty period, notes
3. Click **"Save Item"**

### Viewing Inventory

1. Click **"View Inventory"** to see all items
2. Use the search bar to find specific items
3. Filter by location or classification using the dropdown menus
4. Click **"Edit"** to modify an item
5. Click **"Delete"** to remove an item

### Statistics

Click **"Statistics"** to view:
- Total number of items
- Total inventory value
- Number of items with active warranties

### Exporting Data

Click **"Export Data"** to download your complete inventory as a JSON-LD file. This format is:
- Schema.org compatible
- Machine-readable
- Interoperable with other systems
- Easy to import into other applications

## API Endpoints

### Items

- `GET /api/items` - Get all items (supports filtering and pagination)
- `GET /api/items/:id` - Get a single item
- `POST /api/items` - Create a new item
- `PUT /api/items/:id` - Update an item
- `DELETE /api/items/:id` - Delete an item

### Filters

- `GET /api/filters/:field` - Get unique values for a field

### Statistics

- `GET /api/statistics` - Get inventory statistics

### Export/Import

- `GET /api/export` - Export inventory as JSON-LD
- `POST /api/import` - Import inventory items

## Query Parameters

### GET /api/items

```
?page=1                    # Page number (default: 1)
&limit=20                  # Items per page (default: 20)
&sortBy=timestamp          # Field to sort by
&sortOrder=desc            # Sort order (asc/desc)
&location=Office           # Filter by location
&classification=Computer   # Filter by classification
&brand=Sony                # Filter by brand
&owner=John                # Filter by owner
&search=camera             # Text search
```

## Schema.org Mapping

The application uses the following schema.org types:

### Product
Maps to inventory items with properties:
- `name`, `brand`, `model`, `gtin` (UPC), `serialNumber`, `mpn`, `category`

### Offer
Captures purchase information:
- `price`, `priceCurrency`, `itemCondition`, `validFrom` (acquisition date)

### OwnershipInfo (Custom Extension)
Tracks ownership details:
- `owner`, `acquiredDate`, `location`, `quantity`, `condition`, `notes`

### WarrantyPromise
Records warranty information:
- `durationOfWarranty` with `QuantitativeValue`

## Data Storage

- **Primary Storage**: `data/inventory.json`
- **Backups**: `data/backups/` (last 10 backups retained)
- **Format**: JSON-LD compatible with schema.org
- **Automatic Backups**: Created before every write operation

## Migrating from Google Sheets

To migrate your existing Google Sheets data:

1. Export your Google Sheet as CSV
2. Convert CSV to JSON with the following structure:

```json
[
  {
    "name": "Item Name",
    "brand": "Brand Name",
    "model": "Model Number",
    "gtin": "UPC Code",
    "serialNumber": "Serial Number",
    "classification": "Category",
    "currentValue": 100.00,
    "offers": {
      "price": 100.00,
      "priceCurrency": "USD",
      "itemCondition": "New",
      "validFrom": "2024-01-01"
    },
    "ownershipInfo": {
      "owner": "Owner Name",
      "location": "Location",
      "acquiredDate": "2024-01-01",
      "quantity": 1,
      "condition": "New"
    },
    "warrantyInfo": {
      "durationOfWarranty": {
        "value": 12,
        "unitCode": "MON"
      }
    }
  }
]
```

3. Import using the API:

```bash
curl -X POST http://localhost:3000/api/import \
  -H "Content-Type: application/json" \
  -d @your-data.json
```

## Environment Variables

Optional environment variables:

```bash
PORT=3000                    # Server port (default: 3000)
NODE_ENV=production          # Environment mode
CORS_ORIGIN=*                # CORS allowed origins
```

## Security Considerations

This application is designed for **local/private use**. For production deployment:

1. Add authentication middleware
2. Use HTTPS
3. Implement rate limiting
4. Add input sanitization beyond validation
5. Set up proper CORS policies
6. Use environment-based configuration
7. Add database encryption if storing sensitive data

## Development

### Running in Development Mode

```bash
npm run dev
```

This uses `ts-node-dev` for automatic reloading on file changes.

### Building

```bash
npm run build
```

Compiles TypeScript to JavaScript in the `dist/` directory.

### Linting

```bash
npm run lint
```

## Troubleshooting

### Port Already in Use

If port 3000 is in use, set a different port:

```bash
PORT=3001 npm start
```

### Data File Not Found

The application automatically creates `data/inventory.json` on first run. If you see errors, check that the application has write permissions to the `data/` directory.

### Import Errors

When importing data, ensure:
- The JSON is valid
- The structure matches the schema
- Required fields (`name`) are present

## License

MIT License - Feel free to use and modify for your needs.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Repository

This project is hosted at: https://github.com/jwilleke/mjs-inventory

## Support

For issues or questions:
1. Check this README
2. Review the API documentation above
3. Examine the TypeScript types in `src/types/schema.ts`

## Future Enhancements

Potential additions:
- Photo upload and storage
- Receipt/document upload
- Barcode scanning
- Mobile app
- Multi-user support
- Cloud backup integration
- Advanced reporting
- Price tracking and depreciation
- Insurance valuation reports

---

**Built with ❤️ using TypeScript, Express, and schema.org**
