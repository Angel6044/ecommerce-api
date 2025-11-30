import express from 'express';
import session from 'express-session'; // ← Nueva importación
import { engine } from 'express-handlebars';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { projectDir } from './src/utils.js';
import connectDB from './src/config/database.js';
import productsRouter from './src/routes/products.router.js';
import cartsRouter from './src/routes/carts.router.js';
import viewsRouter from './src/routes/views.router.js';
import ProductManager from './src/managers/ProductManager.js';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

// Conectar a MongoDB
connectDB();

// Configuración de sesiones ← NUEVA CONFIGURACIÓN
app.use(session({
    secret: 'ecommerce-secret-key', // Cambia esto en producción
    resave: false,
    saveUninitialized: true,
    cookie: { 
        secure: false, // En producción usar true con HTTPS
        maxAge: 1000 * 60 * 60 * 24 // 24 horas
    }
}));

// Configuración de Handlebars
app.engine('handlebars', engine({
    helpers: {
        eq: function (a, b) {
            return a === b;
        },
        multiply: function (a, b) {
            return a * b;
        },
        calculateTotal: function (products) {
            return products.reduce((total, item) => {
                return total + (item.product.price * item.quantity);
            }, 0);
        },
        range: function (start, end) {
            const result = [];
            for (let i = start; i <= end; i++) {
                result.push(i);
            }
            return result;
        }
    }
}));
app.set('view engine', 'handlebars');
app.set('views', `${projectDir}/src/views`);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${projectDir}/src/public`));

// Middleware para gestionar carrito por sesión ← NUEVO MIDDLEWARE
app.use(async (req, res, next) => {
    if (!req.session.cartId) {
        // Si no hay carrito en la sesión, crear uno nuevo
        try {
            const Cart = (await import('./src/models/Cart.js')).default;
            const newCart = new Cart({ products: [] });
            await newCart.save();
            req.session.cartId = newCart._id.toString();
            console.log('Nuevo carrito creado para sesión:', req.session.cartId);
        } catch (error) {
            console.error('Error creando carrito:', error);
        }
    }
    next();
});

// Routes
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

// Configuración de WebSockets
io.on('connection', async (socket) => {
    console.log('Cliente conectado');
    
    try {
        const result = await ProductManager.getProducts({ limit: 50, page: 1 });
        socket.emit('productsUpdated', result.payload);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        socket.emit('error', 'Error al cargar productos');
    }
    
    socket.on('addProduct', async (productData) => {
        try {
            await ProductManager.addProduct(productData);
            const result = await ProductManager.getProducts({ limit: 50, page: 1 });
            io.emit('productsUpdated', result.payload);
        } catch (error) {
            socket.emit('error', error.message);
        }
    });
    
    socket.on('deleteProduct', async (productId) => {
        try {
            await ProductManager.deleteProduct(productId);
            const result = await ProductManager.getProducts({ limit: 50, page: 1 });
            io.emit('productsUpdated', result.payload);
        } catch (error) {
            socket.emit('error', error.message);
        }
    });
    
    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

const PORT = 8080;

httpServer.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});