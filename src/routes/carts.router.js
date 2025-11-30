import { Router } from 'express';
import CartManager from '../managers/CartManager.js';

const router = Router();

// POST /api/carts
router.post('/', async (req, res) => {
    try {
        const cart = await CartManager.createCart();
        res.status(201).json({
            status: 'success',
            payload: cart
        });
    } catch (error) {
        res.status(500).json({ 
            status: 'error',
            error: error.message 
        });
    }
});

// GET /api/carts/:cid
router.get('/:cid', async (req, res) => {
    try {
        const cart = await CartManager.getCartById(req.params.cid);
        res.json({
            status: 'success',
            payload: cart
        });
    } catch (error) {
        res.status(500).json({ 
            status: 'error',
            error: error.message 
        });
    }
});

// POST /api/carts/:cid/product/:pid
router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cart = await CartManager.addProductToCart(req.params.cid, req.params.pid);
        res.json({
            status: 'success',
            payload: cart
        });
    } catch (error) {
        res.status(500).json({ 
            status: 'error',
            error: error.message 
        });
    }
});

// DELETE /api/carts/:cid/products/:pid
router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const cart = await CartManager.deleteProductFromCart(req.params.cid, req.params.pid);
        res.json({
            status: 'success',
            payload: cart
        });
    } catch (error) {
        res.status(500).json({ 
            status: 'error',
            error: error.message 
        });
    }
});

// PUT /api/carts/:cid
router.put('/:cid', async (req, res) => {
    try {
        const { products } = req.body;
        
        if (!Array.isArray(products)) {
            return res.status(400).json({ 
                status: 'error',
                error: 'El campo products debe ser un array' 
            });
        }

        const cart = await CartManager.updateCartProducts(req.params.cid, products);
        res.json({
            status: 'success',
            payload: cart
        });
    } catch (error) {
        res.status(500).json({ 
            status: 'error',
            error: error.message 
        });
    }
});

// PUT /api/carts/:cid/products/:pid
router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const { quantity } = req.body;
        
        if (!quantity || quantity <= 0) {
            return res.status(400).json({ 
                status: 'error',
                error: 'La cantidad debe ser un número mayor a 0' 
            });
        }

        const cart = await CartManager.updateProductQuantity(
            req.params.cid, 
            req.params.pid, 
            quantity
        );
        
        res.json({
            status: 'success',
            payload: cart
        });
    } catch (error) {
        res.status(500).json({ 
            status: 'error',
            error: error.message 
        });
    }
});

// DELETE /api/carts/:cid
router.delete('/:cid', async (req, res) => {
    try {
        const cart = await CartManager.deleteAllProductsFromCart(req.params.cid);
        res.json({
            status: 'success',
            payload: cart
        });
    } catch (error) {
        res.status(500).json({ 
            status: 'error',
            error: error.message 
        });
    }
});

export default router;