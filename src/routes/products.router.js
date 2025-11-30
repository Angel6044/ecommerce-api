import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';

const router = Router();

// GET /api/products - Con paginación, filtros y ordenamiento
router.get('/', async (req, res) => {
    try {
        const { limit, page, sort, query, category, availability } = req.query;
        
        const result = await ProductManager.getProducts({
            limit: limit || 10,
            page: page || 1,
            sort,
            query,
            category,
            availability
        });

        res.json(result);
    } catch (error) {
        res.status(500).json({ 
            status: 'error',
            error: error.message 
        });
    }
});

// GET /api/products/:pid
router.get('/:pid', async (req, res) => {
    try {
        const product = await ProductManager.getProductById(req.params.pid);
        if (!product) {
            return res.status(404).json({ 
                status: 'error',
                error: 'Producto no encontrado' 
            });
        }
        res.json({
            status: 'success',
            payload: product
        });
    } catch (error) {
        res.status(500).json({ 
            status: 'error',
            error: error.message 
        });
    }
});

// POST /api/products
router.post('/', async (req, res) => {
    try {
        const { title, description, code, price, stock, category, thumbnails } = req.body;
        
        if (!title || !description || !code || !price || !stock || !category) {
            return res.status(400).json({ 
                status: 'error',
                error: 'Todos los campos son obligatorios excepto thumbnails' 
            });
        }

        const product = await ProductManager.addProduct(req.body);
        res.status(201).json({
            status: 'success',
            payload: product
        });
    } catch (error) {
        res.status(500).json({ 
            status: 'error',
            error: error.message 
        });
    }
});

// PUT /api/products/:pid
router.put('/:pid', async (req, res) => {
    try {
        const updated = await ProductManager.updateProduct(req.params.pid, req.body);
        if (!updated) {
            return res.status(404).json({ 
                status: 'error',
                error: 'Producto no encontrado' 
            });
        }
        res.json({
            status: 'success',
            payload: updated
        });
    } catch (error) {
        res.status(500).json({ 
            status: 'error',
            error: error.message 
        });
    }
});

// DELETE /api/products/:pid
router.delete('/:pid', async (req, res) => {
    try {
        const deleted = await ProductManager.deleteProduct(req.params.pid);
        if (!deleted) {
            return res.status(404).json({ 
                status: 'error',
                error: 'Producto no encontrado' 
            });
        }
        res.json({ 
            status: 'success',
            message: 'Producto eliminado' 
        });
    } catch (error) {
        res.status(500).json({ 
            status: 'error',
            error: error.message 
        });
    }
});

export default router;