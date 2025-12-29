# Home Inventory App - Quick Reference

## 🚀 Quick Start

```bash
# 1. Navigate to project directory
cd home-inventory-app

# 2. Run setup script (Mac/Linux)
./quick-start.sh

# Or manually:
npm install
npm run build

# 3. Start the server
npm start

# 4. Open browser
open http://localhost:3000
```

## 📁 Project Structure

```
home-inventory-app/
├── src/                    # TypeScript source code
│   ├── types/schema.ts    # Schema.org types
│   ├── services/          # Business logic
│   ├── routes/            # API routes
│   └── server.ts          # Main server
├── public/                # Frontend
│   └── index.html         # Single-page app
├── data/                  # Auto-created
│   ├── inventory.json     # Your data
│   └── backups/           # Auto backups
├── package.json           # Dependencies
├── tsconfig.json          # TypeScript config
└── README.md              # Full documentation
```

## 🔑 Key Features

✅ Schema.org compatible JSON-LD format
✅ RESTful API with full CRUD operations
✅ Beautiful, responsive web interface
✅ Search and filter capabilities
✅ Automatic data backups
✅ Import/Export functionality
✅ Statistics dashboard
✅ No database required (JSON file-based)

## 📝 Common Tasks

### Add Item via UI
1. Click "Add New Item"
2. Fill in form
3. Click "Save"

### Import from Google Sheets
1. Export Google Sheet as CSV
2. Run: `node migrate-from-csv.js export.csv data.json`
3. Import via API or web interface

### Export Data
- Via UI: Click "Export Data"
- Via API: `curl http://localhost:3000/api/export -o backup.json`

### View Statistics
Click "Statistics" in the navigation

## 🌐 API Endpoints

- `GET /api/items` - List all items
- `GET /api/items/:id` - Get single item
- `POST /api/items` - Create item
- `PUT /api/items/:id` - Update item
- `DELETE /api/items/:id` - Delete item
- `GET /api/statistics` - Get stats
- `GET /api/export` - Export JSON-LD
- `POST /api/import` - Import items

See API.md for complete documentation.

## 🎨 Schema.org Structure

Your items use standard schema.org types:

- **Product** - Core item info
- **Offer** - Purchase details
- **OwnershipInfo** - Location & ownership
- **WarrantyPromise** - Warranty info

This makes your data:
- Interoperable with other systems
- SEO-friendly
- Future-proof
- Standard-compliant

## 🛠️ Development

```bash
# Development mode (auto-reload)
npm run dev

# Build TypeScript
npm run build

# Production mode
npm start
```

## 📦 Files Included

1. **README.md** - Complete documentation
2. **API.md** - Full API reference
3. **example-data.json** - Sample data
4. **migrate-from-csv.js** - CSV converter
5. **quick-start.sh** - Setup script
6. **.env.example** - Config template

## 🔒 Security Notes

This is designed for local/personal use. For production:

- Add authentication
- Use HTTPS
- Implement rate limiting
- Add input sanitization
- Configure CORS properly
- Use environment variables

## 💡 Tips

- Search is case-insensitive
- Filters combine with AND logic
- Data auto-backs up on every save
- Last 10 backups kept automatically
- Export to JSON-LD for portability
- All dates use ISO 8601 format

## 🐛 Troubleshooting

**Port in use?**
```bash
PORT=3001 npm start
```

**Build errors?**
```bash
rm -rf node_modules dist
npm install
npm run build
```

**Data issues?**
Check `data/backups/` for previous versions

## 📚 Documentation

- **README.md** - Setup & usage
- **API.md** - Complete API docs
- **src/types/schema.ts** - TypeScript types
- **example-data.json** - Data format examples

## 🎯 Next Steps

1. Customize the UI colors/fonts in `public/index.html`
2. Add your own fields to the schema
3. Implement photo uploads
4. Add more statistics
5. Create mobile app version
6. Integrate with cloud storage

---

**Enjoy your new inventory management system!**
