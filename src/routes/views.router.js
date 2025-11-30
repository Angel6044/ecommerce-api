import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';
import CartManager from '../managers/CartManager.js';

const router = Router();

// Middleware para inyectar cartId en todas las vistas
router.use((req, res, next) => {
    // Hacer disponible el cartId en todas las vistas
    res.locals.cartId = req.session.cartId;
    next();
});

// Vista home
router.get('/', async (req, res) => {
    try {
        const result = await ProductManager.getProducts({ limit: 10, page: 1 });
        res.render('home', { 
            title: 'Home - Productos',
            products: result.payload,
            pagination: result,
            cartId: req.session.cartId // ← Inyectar cartId
        });
    } catch (error) {
        console.error('Error al cargar productos:', error);
        res.status(500).render('home', { 
            title: 'Home - Productos',
            products: [],
            error: 'Error al cargar productos',
            cartId: req.session.cartId
        });
    }
});

// Vista productos con paginación
router.get('/products', async (req, res) => {
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

        res.render('products', {
            title: 'Productos',
            products: result.payload,
            pagination: result,
            queryParams: req.query,
            cartId: req.session.cartId // ← Inyectar cartId
        });
    } catch (error) {
        console.error('Error al cargar productos:', error);
        res.status(500).render('products', {
            title: 'Productos',
            products: [],
            error: 'Error al cargar productos',
            cartId: req.session.cartId
        });
    }
});

// Vista detalle de producto
router.get('/products/:pid', async (req, res) => {
    try {
        const product = await ProductManager.getProductById(req.params.pid);
        if (!product) {
            return res.status(404).render('home', {
                title: 'Producto no encontrado',
                products: [],
                error: 'El producto solicitado no existe',
                cartId: req.session.cartId
            });
        }

        res.render('productDetail', {
            title: product.title,
            product,
            cartId: req.session.cartId // ← Inyectar cartId
        });
    } catch (error) {
        console.error('Error al cargar producto:', error);
        res.status(500).render('home', {
            title: 'Error',
            products: [],
            error: 'Error al cargar el producto',
            cartId: req.session.cartId
        });
    }
});

// Vista carrito - Ahora usa el carrito de la sesión
router.get('/carts/my-cart', async (req, res) => {
    try {
        if (!req.session.cartId) {
            return res.render('cart', {
                title: 'Carrito de Compras',
                cart: { products: [] },
                error: 'No tienes un carrito activo',
                cartId: null
            });
        }

        const cart = await CartManager.getCartById(req.session.cartId);
        
        res.render('cart', {
            title: 'Mi Carrito',
            cart,
            cartId: req.session.cartId
        });
    } catch (error) {
        console.error('Error al cargar carrito:', error);
        res.status(500).render('cart', {
            title: 'Error',
            cart: { products: [] },
            error: 'Error al cargar el carrito: ' + error.message,
            cartId: req.session.cartId
        });
    }
});

// Redirección para /carts/ al carrito personal
router.get('/carts', (req, res) => {
    res.redirect('/carts/my-cart');
});

// Redirección para /carts/1, /carts/2, etc. al carrito personal
router.get('/carts/:id', (req, res) => {
    res.redirect('/carts/my-cart');
});

// Vista productos en tiempo real
router.get('/realtimeproducts', async (req, res) => {
    try {
        const result = await ProductManager.getProducts({ limit: 50, page: 1 });
        res.render('realTimeProducts', { 
            title: 'Productos en Tiempo Real',
            products: result.payload,
            cartId: req.session.cartId // ← Inyectar cartId
        });
    } catch (error) {
        console.error('Error al cargar productos en tiempo real:', error);
        res.status(500).render('realTimeProducts', { 
            title: 'Productos en Tiempo Real',
            products: [],
            error: 'Error al cargar productos',
            cartId: req.session.cartId
        });
    }
});

export default router;