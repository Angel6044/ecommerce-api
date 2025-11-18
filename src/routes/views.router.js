import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';

const router = Router();

router.get('/', async (req, res) => {
    try {
        const products = await ProductManager.getProducts();
        res.render('home', { 
            title: 'Home - Productos',
            products 
        });
    } catch (error) {
        res.status(500).render('home', { 
            title: 'Home - Productos',
            products: [],
            error: 'Error al cargar productos'
        });
    }
});

router.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await ProductManager.getProducts();
        res.render('realTimeProducts', { 
            title: 'Productos en Tiempo Real',
            products 
        });
    } catch (error) {
        res.status(500).render('realTimeProducts', { 
            title: 'Productos en Tiempo Real',
            products: [],
            error: 'Error al cargar productos'
        });
    }
});

export default router;