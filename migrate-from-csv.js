/**
 * CSV to JSON Migration Script
 * Converts Google Sheets export to schema.org compatible JSON format
 * 
 * Usage: node migrate-from-csv.js input.csv output.json
 */

const fs = require('fs');
const path = require('path');

// Column mapping from Google Sheets to our schema
const COLUMN_MAP = {
  'Timestamp': 'timestamp',
  'Email Address': 'email',
  'Location': 'location',
  'Item': 'name',
  'Brand': 'brand',
  'Model Number': 'model',
  'UPC': 'gtin',
  'Serial Number': 'serialNumber',
  'Acquired Date': 'acquiredDate',
  'Acquire Cost / Unit': 'price',
  'QTY Acquired': 'quantityAcquired',
  'Value': 'currentValue',
  'Value Source': 'valueSource',
  'Condition': 'condition',
  'Disposal Date': 'disposalDate',
  'QTY Removed': 'quantityRemoved',
  'QTY Held': 'quantity',
  'Notes': 'notes',
  'Photo of Item': 'photoURL',
  'Receipt': 'receiptURL',
  'Classification': 'classification',
  'Enter Warranty Information': 'hasWarranty',
  'Warranty Period': 'warrantyPeriod',
  'Warranty Document': 'warrantyURL',
  'To:': 'owner',
  'Condition when Purchased': 'conditionWhenPurchased',
  'Qty On Hand': 'quantityOnHand',
  'Warranty Expiration': 'warrantyExpiration'
};

function parseCSV(csvText) {
  const lines = csvText.split('\n');
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;

    // Simple CSV parsing (doesn't handle commas inside quotes perfectly)
    const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
    const row = {};

    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });

    rows.push(row);
  }

  return rows;
}

function convertToSchemaFormat(row) {
  const item = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: row['Item'] || 'Unknown Item',
    brand: row['Brand'] || undefined,
    model: row['Model Number'] || undefined,
    gtin: row['UPC'] || undefined,
    serialNumber: row['Serial Number'] || undefined,
    mpn: row['Model Number'] || undefined,
    classification: row['Classification'] || undefined,
    description: row['Notes'] || undefined,
  };

  // Offer (purchase information)
  const price = parseFloat(row['Acquire Cost / Unit'] || row['Value']);
  if (!isNaN(price) && price > 0) {
    item.offers = {
      '@type': 'Offer',
      price: price,
      priceCurrency: 'USD',
      itemCondition: row['Condition when Purchased'] || row['Condition'] || 'Used',
      validFrom: row['Acquired Date'] || undefined,
      url: row['Receipt'] || undefined
    };
  }

  // Current value
  const currentValue = parseFloat(row['Value']);
  if (!isNaN(currentValue) && currentValue > 0) {
    item.currentValue = currentValue;
    item.valueSource = row['Value Source'] || undefined;
  }

  // Ownership information
  item.ownershipInfo = {
    '@type': 'OwnershipInfo',
    owner: row['To:'] || undefined,
    location: row['Location'] || undefined,
    acquiredDate: row['Acquired Date'] || undefined,
    quantity: parseInt(row['QTY Held'] || row['Qty On Hand']) || 1,
    quantityAcquired: parseInt(row['QTY Acquired']) || undefined,
    quantityRemoved: parseInt(row['QTY Removed']) || undefined,
    quantityOnHand: parseInt(row['Qty On Hand']) || undefined,
    condition: row['Condition'] || undefined,
    conditionWhenPurchased: row['Condition when Purchased'] || undefined,
    disposalDate: row['Disposal Date'] || undefined,
    notes: row['Notes'] || undefined,
    photoURL: row['Photo of Item'] || undefined,
    receiptURL: row['Receipt'] || undefined
  };

  // Warranty information
  const warrantyPeriod = parseInt(row['Warranty Period']);
  if (!isNaN(warrantyPeriod) && warrantyPeriod > 0) {
    item.warrantyInfo = {
      '@type': 'WarrantyPromise',
      durationOfWarranty: {
        '@type': 'QuantitativeValue',
        value: warrantyPeriod,
        unitCode: 'MON',
        unitText: 'months'
      },
      warrantyURL: row['Warranty Document'] || undefined
    };
  }

  // System fields
  item.timestamp = row['Timestamp'] || new Date().toISOString();
  item.lastModified = new Date().toISOString();
  item.email = row['Email Address'] || undefined;

  // Clean up undefined values
  return JSON.parse(JSON.stringify(item));
}

function migrate(inputFile, outputFile) {
  try {
    console.log(`Reading CSV file: ${inputFile}`);
    const csvText = fs.readFileSync(inputFile, 'utf-8');
    
    console.log('Parsing CSV...');
    const rows = parseCSV(csvText);
    console.log(`Found ${rows.length} rows`);
    
    console.log('Converting to schema.org format...');
    const items = rows
      .filter(row => row['Item'] && row['Item'].trim())
      .map(convertToSchemaFormat);
    
    console.log(`Converted ${items.length} items`);
    
    console.log(`Writing to JSON file: ${outputFile}`);
    fs.writeFileSync(outputFile, JSON.stringify(items, null, 2));
    
    console.log('✅ Migration complete!');
    console.log(`\nTo import into the application:`);
    console.log(`  1. Start the server: npm start`);
    console.log(`  2. Run: curl -X POST http://localhost:3000/api/import -H "Content-Type: application/json" -d @${outputFile}`);
    console.log(`\nOr use the web interface to import the file.`);
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

// Main execution
const args = process.argv.slice(2);

if (args.length < 2) {
  console.log('Usage: node migrate-from-csv.js <input.csv> <output.json>');
  console.log('\nExample:');
  console.log('  node migrate-from-csv.js inventory-export.csv data/inventory.json');
  process.exit(1);
}

const [inputFile, outputFile] = args;

if (!fs.existsSync(inputFile)) {
  console.error(`Error: Input file not found: ${inputFile}`);
  process.exit(1);
}

migrate(inputFile, outputFile);
