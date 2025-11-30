import mongoose from 'mongoose';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';
import connectDB from './database.js';

const seedProducts = [
    {
        title: "Teclado Mecánico RGB",
        description: "Teclado mecánico con switches azules y retroiluminación RGB",
        code: "TEC001",
        price: 89.99,
        status: true,
        stock: 15,
        category: "Periféricos",
        thumbnails: ["https://example.com/teclado1.jpg", "https://example.com/teclado2.jpg"]
    },
    {
        title: "Mouse Gamer",
        description: "Mouse gaming con sensor óptico de alta precisión",
        code: "MOU001",
        price: 45.50,
        status: true,
        stock: 20,
        category: "Periféricos",
        thumbnails: ["https://example.com/mouse1.jpg"]
    },
    {
        title: "Monitor 24\" Full HD",
        description: "Monitor LED 24 pulgadas resolución 1920x1080",
        code: "MON001",
        price: 199.99,
        status: true,
        stock: 8,
        category: "Monitores",
        thumbnails: ["https://example.com/monitor1.jpg"]
    },
    {
        title: "Auriculares Inalámbricos",
        description: "Auriculares Bluetooth con cancelación de ruido",
        code: "AUR001",
        price: 129.99,
        status: true,
        stock: 12,
        category: "Audio",
        thumbnails: ["https://example.com/auriculares1.jpg"]
    },
    {
        title: "Silla Gamer Ergonómica",
        description: "Silla gaming con soporte lumbar y reposacabezas",
        code: "SIL001",
        price: 299.99,
        status: true,
        stock: 5,
        category: "Muebles",
        thumbnails: ["https://example.com/silla1.jpg"]
    },
    {
        title: "SSD 1TB NVMe",
        description: "Disco sólido NVMe de 1TB para gaming",
        code: "SSD001",
        price: 89.99,
        status: true,
        stock: 25,
        category: "Almacenamiento",
        thumbnails: ["https://example.com/ssd1.jpg"]
    },
    {
        title: "Memoria RAM 16GB DDR4",
        description: "Módulo de memoria RAM 16GB 3200MHz",
        code: "RAM001",
        price: 65.00,
        status: true,
        stock: 30,
        category: "Memoria",
        thumbnails: ["https://example.com/ram1.jpg"]
    },
    {
        title: "Tablet 10\" Android",
        description: "Tablet Android con pantalla Full HD",
        code: "TAB001",
        price: 159.99,
        status: true,
        stock: 7,
        category: "Tablets",
        thumbnails: ["https://example.com/tablet1.jpg"]
    },
    {
        title: "Smartwatch Deportivo",
        description: "Reloj inteligente con GPS y monitor cardiaco",
        code: "SWT001",
        price: 79.99,
        status: true,
        stock: 18,
        category: "Wearables",
        thumbnails: ["https://example.com/smartwatch1.jpg"]
    },
    {
        title: "Cámara Web 4K",
        description: "Cámara web con resolución 4K y micrófono integrado",
        code: "CAM001",
        price: 119.99,
        status: true,
        stock: 10,
        category: "Video",
        thumbnails: ["https://example.com/webcam1.jpg"]
    },
    {
        title: "Router WiFi 6",
        description: "Router inalámbrico con tecnología WiFi 6",
        code: "ROU001",
        price: 149.99,
        status: true,
        stock: 6,
        category: "Redes",
        thumbnails: ["https://example.com/router1.jpg"]
    },
    {
        title: "Impresora Láser",
        description: "Impresora láser monocromática multifunción",
        code: "IMP001",
        price: 179.99,
        status: true,
        stock: 4,
        category: "Impresión",
        thumbnails: ["https://example.com/impresora1.jpg"]
    }
];

const seedDatabase = async () => {
    try {
        await connectDB();
        
        console.log('Eliminando datos existentes...');
        await Product.deleteMany({});
        await Cart.deleteMany({});
        
        console.log('Insertando productos de prueba...');
        const products = await Product.insertMany(seedProducts);
        console.log(`${products.length} productos insertados`);
        
        // Crear un carrito de ejemplo con algunos productos
        const sampleCart = new Cart({
            products: [
                {
                    product: products[0]._id,
                    quantity: 2
                },
                {
                    product: products[1]._id,
                    quantity: 1
                },
                {
                    product: products[3]._id,
                    quantity: 1
                }
            ]
        });
        
        await sampleCart.save();
        console.log('Carrito de ejemplo creado');
        
        console.log('Base de datos inicializada exitosamente!');
        console.log('\nDatos creados:');
        console.log('- 12 productos en diferentes categorías');
        console.log('- 1 carrito con 3 productos');
        console.log('\nPuedes acceder a:');
        console.log('http://localhost:8080/ - Home con productos');
        console.log('http://localhost:8080/products - Todos los productos con paginación');
        console.log('http://localhost:8080/carts/1 - Carrito de ejemplo');
        console.log('http://localhost:8080/realtimeproducts - Productos en tiempo real');
        
        process.exit(0);
    } catch (error) {
        console.error('Error inicializando la base de datos:', error);
        process.exit(1);
    }
};

seedDatabase();