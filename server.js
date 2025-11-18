import express from 'express';
import { engine } from 'express-handlebars';        // ← NUEVO IMPORT
import { createServer } from 'http';                // ← NUEVO IMPORT  
import { Server } from 'socket.io';                 // ← NUEVO IMPORT
import { __dirname } from './src/utils.js';         // ← NUEVO IMPORT
import productsRouter from './src/routes/products.router.js';
import cartsRouter from './src/routes/carts.router.js';
import viewsRouter from './src/routes/views.router.js';  // ← NUEVO IMPORT
import ProductManager from './src/managers/ProductManager.js'; // ← NUEVO IMPORT

const app = express();
const httpServer = createServer(app);  // ← NUEVO: Servidor HTTP para WebSockets
const io = new Server(httpServer);     // ← NUEVO: Instancia de Socket.io

// ↓↓↓ NUEVA CONFIGURACIÓN HANDLEBARS ↓↓↓
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/views`);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/src/public`));  // ← NUEVO: Archivos estáticos

// Routes
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);  // ← NUEVA RUTA: Vistas Handlebars

// ↓↓↓ NUEVA CONFIGURACIÓN WEBSOCKETS ↓↓↓
io.on('connection', async (socket) => {
    console.log('Cliente conectado');
    
    try {
        const products = await ProductManager.getProducts();
        socket.emit('productsUpdated', products);  // ← Enviar productos al conectar
    } catch (error) {
        console.error('Error al obtener productos:', error);
    }
    
    // NUEVO EVENTO: Agregar producto
    socket.on('addProduct', async (productData) => {
        try {
            await ProductManager.addProduct(productData);
            const products = await ProductManager.getProducts();
            io.emit('productsUpdated', products);  // ← Notificar a TODOS los clientes
        } catch (error) {
            socket.emit('error', error.message);   // ← Enviar error solo a este cliente
        }
    });
    
    // NUEVO EVENTO: Eliminar producto  
    socket.on('deleteProduct', async (productId) => {
        try {
            await ProductManager.deleteProduct(productId);
            const products = await ProductManager.getProducts();
            io.emit('productsUpdated', products);  // ← Notificar a TODOS los clientes
        } catch (error) {
            socket.emit('error', error.message);   // ← Enviar error solo a este cliente
        }
    });
    
    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

const PORT = 8080;

// CAMBIO: Usar httpServer en lugar de app
httpServer.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});