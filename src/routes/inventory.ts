import { Router, Request, Response } from 'express';
import { body, query, validationResult } from 'express-validator';
import { DataStore } from '../services/dataStore';
import { InventoryItem, InventoryFilter, ApiResponse, PaginatedResponse } from '../types/schema';

const router = Router();
const dataStore = new DataStore();

/**
 * Validation middleware
 */
const validateRequest = (req: Request, res: Response, next: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false, 
      error: 'Validation failed', 
      details: errors.array() 
    });
  }
  next();
};

/**
 * GET /api/items
 * Get all inventory items with optional filtering and pagination
 */
router.get('/items',
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('sortBy').optional().isString(),
  query('sortOrder').optional().isIn(['asc', 'desc']),
  query('location').optional().isString(),
  query('classification').optional().isString(),
  query('brand').optional().isString(),
  query('owner').optional().isString(),
  query('search').optional().isString(),
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const filter: InventoryFilter = {
        location: req.query.location as string,
        classification: req.query.classification as string,
        brand: req.query.brand as string,
        owner: req.query.owner as string,
        search: req.query.search as string,
      };

      const pagination = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 20,
        sortBy: (req.query.sortBy as string) || 'timestamp',
        sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc'
      };

      const { items, total } = await dataStore.getPaginated(filter, pagination);
      
      const response: PaginatedResponse<InventoryItem> = {
        success: true,
        data: items,
        pagination: {
          page: pagination.page,
          limit: pagination.limit,
          total,
          totalPages: Math.ceil(total / pagination.limit)
        }
      };

      res.json(response);
    } catch (error) {
      console.error('Error fetching items:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch inventory items' 
      });
    }
  }
);

/**
 * GET /api/items/:id
 * Get a single inventory item by ID
 */
router.get('/items/:id', async (req: Request, res: Response) => {
  try {
    const item = await dataStore.getById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ 
        success: false, 
        error: 'Item not found' 
      });
    }

    const response: ApiResponse<InventoryItem> = {
      success: true,
      data: item
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching item:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch item' 
    });
  }
});

/**
 * POST /api/items
 * Create a new inventory item
 */
router.post('/items',
  body('name').notEmpty().trim().withMessage('Name is required'),
  body('brand').optional().trim(),
  body('model').optional().trim(),
  body('gtin').optional().trim(),
  body('serialNumber').optional().trim(),
  body('classification').optional().trim(),
  body('ownershipInfo.location').optional().trim(),
  body('ownershipInfo.owner').optional().trim(),
  body('ownershipInfo.acquiredDate').optional().isISO8601(),
  body('ownershipInfo.quantity').optional().isInt({ min: 0 }),
  body('offers.price').optional().isFloat({ min: 0 }),
  body('currentValue').optional().isFloat({ min: 0 }),
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const itemData = req.body;
      const newItem = await dataStore.create(itemData);

      const response: ApiResponse<InventoryItem> = {
        success: true,
        data: newItem,
        message: 'Item created successfully'
      };

      res.status(201).json(response);
    } catch (error) {
      console.error('Error creating item:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to create item' 
      });
    }
  }
);

/**
 * PUT /api/items/:id
 * Update an existing inventory item
 */
router.put('/items/:id',
  body('name').optional().notEmpty().trim(),
  body('brand').optional().trim(),
  body('model').optional().trim(),
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const updates = req.body;
      const updatedItem = await dataStore.update(req.params.id, updates);

      if (!updatedItem) {
        return res.status(404).json({ 
          success: false, 
          error: 'Item not found' 
        });
      }

      const response: ApiResponse<InventoryItem> = {
        success: true,
        data: updatedItem,
        message: 'Item updated successfully'
      };

      res.json(response);
    } catch (error) {
      console.error('Error updating item:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to update item' 
      });
    }
  }
);

/**
 * DELETE /api/items/:id
 * Delete an inventory item
 */
router.delete('/items/:id', async (req: Request, res: Response) => {
  try {
    const success = await dataStore.delete(req.params.id);

    if (!success) {
      return res.status(404).json({ 
        success: false, 
        error: 'Item not found' 
      });
    }

    const response: ApiResponse<null> = {
      success: true,
      message: 'Item deleted successfully'
    };

    res.json(response);
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to delete item' 
    });
  }
});

/**
 * GET /api/statistics
 * Get inventory statistics
 */
router.get('/statistics', async (req: Request, res: Response) => {
  try {
    const stats = await dataStore.getStatistics();
    
    const response: ApiResponse<any> = {
      success: true,
      data: stats
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch statistics' 
    });
  }
});

/**
 * GET /api/filters/:field
 * Get unique values for a field (for dropdown filters)
 */
router.get('/filters/:field', async (req: Request, res: Response) => {
  try {
    const { field } = req.params;
    const values = await dataStore.getUniqueValues(field);
    
    const response: ApiResponse<string[]> = {
      success: true,
      data: values
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching filter values:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch filter values' 
    });
  }
});

/**
 * GET /api/export
 * Export inventory as JSON-LD
 */
router.get('/export', async (req: Request, res: Response) => {
  try {
    const jsonLD = await dataStore.exportJsonLD();
    
    res.setHeader('Content-Type', 'application/ld+json');
    res.setHeader('Content-Disposition', 'attachment; filename=inventory-export.json');
    res.send(jsonLD);
  } catch (error) {
    console.error('Error exporting data:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to export data' 
    });
  }
});

/**
 * POST /api/import
 * Import inventory items
 */
router.post('/import', async (req: Request, res: Response) => {
  try {
    const items = req.body.items || req.body;
    
    if (!Array.isArray(items)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid import format. Expected an array of items.' 
      });
    }

    const count = await dataStore.importItems(items);

    const response: ApiResponse<{ imported: number }> = {
      success: true,
      data: { imported: count },
      message: `Successfully imported ${count} items`
    };

    res.json(response);
  } catch (error) {
    console.error('Error importing data:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to import data' 
    });
  }
});

export default router;
