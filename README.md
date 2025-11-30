# Ecommerce API - Primera Entrega

API RESTful para gestión de **productos** y **carritos de compra**, con persistencia en archivos JSON.

## Tecnologías

- **Node.js** (v20+)
- **Express.js**
- **ES Modules** (`import`/`export`)
- **Persistencia**: `src/data/products.json` y `src/data/carts.json`


## Estructura del Proyecto

```
ecommerce-api/
├── src/
│   ├── data/
│   │   ├── products.json     ← Productos
│   │   └── carts.json        ← Carritos
│   ├── managers/
│   │   ├── ProductManager.js
│   │   └── CartManager.js
│   ├── routes/
│   │   ├── products.router.js
│   │   └── carts.router.js
│   └── app.js
├── server.js                     ← Entry point
├── package.json
├── README.md
└── .gitignore
```

## Instalación

`git clone <tu-repositorio>`

`cd ecommerce-api`

`npm install`

## Ejecución

`npm run dev`

Servidor en: http://localhost:8080

## Endpoints

### Productos (/api/products)

| Método | Ruta    | Descripción               |
| ------ | ------- | ------------------------- |
| GET    | `/`     | Listar todos              |
| GET    | `/:pid` | Por ID                    |
| POST   | `/`     | Crear (ID autogenerado)   |
| PUT    | `/:pid` | Actualizar (sin tocar ID) |
| DELETE | `/:pid` | Eliminar                  |

Campos obligatorios (POST):
`{
  "title", "description", "code", "price", "stock", "category"
}`

### Carritos (/api/carts)

| Método | Ruta                 | Descripción                  |
| ------ | -------------------- | ---------------------------- |
| POST   | `/`                  | Crear carrito                |
| GET    | `/:cid`              | Ver productos del carrito    |
| POST   | `/:cid/product/:pid` | Agregar/incrementar producto |

Formato en carrito:
`{ "product": 2, "quantity": 3 }`


## Pruebas con Postman

### POST /api/products → Creamos dos productos

URL: http://localhost:8080/api/products

Body (raw JSON):

```
{
  "title": "Mouse Gamer",
  "description": "RGB, 16000 DPI",
  "code": "MOU001",
  "price": 59.99,
  "status": true,
  "stock": 20,
  "category": "Periféricos",
  "thumbnails": ["/img/mouse1.jpg"]
},
{
  "title": "Teclado Mecánico",
  "description": "Switch rojo, retroiluminado",
  "code": "TEC001",
  "price": 89.99,
  "stock": 15,
  "category": "Periféricos"
}
```

### GET /api/products → Listar todos

URL: http://localhost:8080/api/products

Respuesta:
```
[
  { "id": 1, "title": "Mouse Gamer", ... },
  { "id": 2, "title": "Teclado Mecánico", ... }
]
```

### GET /api/products/:pid → Obtener por ID

URL: http://localhost:8080/api/products/1

Respuesta:
```
{ "id": 1, "title": "Mouse Gamer", ... }
```

### PUT /api/products/:pid → Actualizar producto

URL: http://localhost:8080/api/products/1

Body:
```
{
  "price": 49.99,
  "stock": 30
}
```

### DELETE /api/products/:pid → Eliminar

URL: http://localhost:8080/api/products/1

Respuesta:
```
{ "message": "Producto eliminado" }
```

### POST /api/carts → Crear carrito

URL: http://localhost:8080/api/carts

Sin body

Respuesta:

```
{
  "id": 1,
  "products": []
}
```

### POST /api/carts/:cid/product/:pid → Agregar producto

URL: http://localhost:8080/api/carts/1/product/2

(Carrito 1, producto ID 2 = Teclado)

Respuesta:

```
{
  "id": 1,
  "products": [
    {
      "product": 2,
      "quantity": 1
    }
  ]
}
```

### POST → Agregar el mismo producto otra vez

URL: http://localhost:8080/api/carts/1/product/2

Respuesta:

```
"quantity": 2
```

### GET /api/carts/:cid → Ver productos del carrito

URL: http://localhost:8080/api/carts/1

Respuesta:
```
[
  {
    "product": 2,
    "quantity": 2
  }
]
```

## ACTUALIZACION: Segunda Entrega

## Estructura del Proyecto

```
ecommerce-api/
├── src/
│   ├── data/
│   │   ├── products.json
│   │   └── carts.json
│   ├── managers/
│   │   ├── ProductManager.js
│   │   └── CartManager.js
│   ├── routes/
│   │   ├── products.router.js
│   │   ├── carts.router.js
│   │   └── views.router.js               <-- Nuevo 
│   ├── views/
│   │   ├── layouts/
│   │   │   └── main.handlebars           <-- Nuevo
│   │   ├── home.handlebars               <-- Nuevo
│   │   └── realTimeProducts.handlebars   <-- Nuevo  
│   ├── public/
│   └── utils.js                          <-- Nuevo
├── server.js                             <-- Actualizado
└── package.json                          <-- Actualizado
```

### **En server.js:**

| Cambio                | Tipo                | Propósito                  |
| --------------------- | ------------------- | -------------------------- |
| `express-handlebars`  | Import nuevo        | Motor de plantillas        |
| `http.createServer()` | Configuración nueva | Servidor para WebSockets   |
| `Socket.io`           | Configuración nueva | Comunicación tiempo real   |
| Handlebars config     | Configuración nueva | Renderizar vistas          |
| Ruta `/`              | Ruta nueva          | Servir vistas Handlebars   |
| Eventos WebSocket     | Lógica nueva        | Comunicación bidireccional |

### **En package.json:**

**DEPENDENCIAS AGREGADAS:**

**1. express-handlebars: ^7.1.2**

    Propósito: Motor de plantillas para renderizar vistas HTML
  
    Función: Convertir archivos .handlebars en HTML renderizado

    Uso: En server.js con app.engine('handlebars', engine())

**2. socket.io: ^4.7.5**

    Propósito: Comunicación en tiempo real entre cliente y servidor

    Función: WebSockets para actualizaciones automáticas

    Uso: En server.js con new Server(httpServer)

Para agregar estas dependencias, ejecutar:

`npm install express-handlebars socket.io`

## ACTUALIZACION: Tercera Entrega

API de ecommerce desarrollada con Node.js, Express, MongoDB y Handlebars que implementa un sistema completo de productos y carritos de compras con gestión de sesiones, paginación, filtros y WebSockets.

## Estructura del Proyecto

```
ecommerce-api/
├── src/
│   ├── config/
│   │   ├── database.js          # Configuración MongoDB
│   │   └── seed.js              # Datos de prueba
│   ├── models/
│   │   ├── Product.js           # Modelo Producto
│   │   └── Cart.js              # Modelo Carrito
│   ├── managers/
│   │   ├── ProductManager.js    # Lógica de productos
│   │   └── CartManager.js       # Lógica de carritos
│   ├── routes/
│   │   ├── products.router.js   # Rutas API productos
│   │   ├── carts.router.js      # Rutas API carritos
│   │   └── views.router.js      # Rutas vistas Handlebars
│   ├── views/
│   │   ├── layouts/
│   │   │   └── main.handlebars  # Layout principal
│   │   ├── home.handlebars      # Página de inicio
│   │   ├── products.handlebars  # Lista de productos
│   │   ├── productDetail.handlebars # Detalle de producto
│   │   ├── cart.handlebars      # Carrito de compras
│   │   └── realTimeProducts.handlebars # Productos tiempo real
│   ├── public/                  # Archivos estáticos
│   └── utils.js                 # Utilidades
├── server.js                    # Servidor principal
└── package.json
```

## Funcionalidades Principales

- Gestión de productos con CRUD completo
- Carritos por sesión (cada usuario tiene su carrito independiente)
- Paginación profesional con límites, ordenamiento y filtros
- Vistas dinámicas con Handlebars
- Tiempo real con Socket.io
- Persistencia con MongoDB
- Gestión de sesiones con express-session

## Tecnologías Utilizadas

| Tecnología      | Versión  | Propósito                   |
| --------------- | -------- | --------------------------- |
| Node.js         | >=20.0.0 | Runtime JavaScript          |
| Express.js      | ^4.18.2  | Framework web               |
| MongoDB         | -        | Base de datos NoSQL         |
| Mongoose        | ^8.0.3   | ODM para MongoDB            |
| Handlebars      | ^7.1.3   | Motor de plantillas         |
| Socket.io       | ^4.8.1   | Comunicación en tiempo real |
| Express-session | ^1.17.3  | Gestión de sesiones         |
| Bootstrap       | 5.3.0    | Framework CSS               |

## Endpoints de la API

### 📦 Productos

|Método|Endpoint|Descripción|
|---|---|---|
|`GET`|`/api/products`|Obtener productos (con paginación)|
|`GET`|`/api/products/:pid`|Obtener producto por ID|
|`POST`|`/api/products`|Crear nuevo producto|
|`PUT`|`/api/products/:pid`|Actualizar producto|
|`DELETE`|`/api/products/:pid`|Eliminar producto|

### 🛒 Carritos

|Método|Endpoint|Descripción|
|---|---|---|
|`POST`|`/api/carts`|Crear nuevo carrito|
|`GET`|`/api/carts/:cid`|Obtener carrito por ID|
|`POST`|`/api/carts/:cid/product/:pid`|Agregar producto al carrito|
|`DELETE`|`/api/carts/:cid/products/:pid`|Eliminar producto del carrito|
|`PUT`|`/api/carts/:cid`|Actualizar todos los productos|
|`PUT`|`/api/carts/:cid/products/:pid`|Actualizar cantidad de producto|
|`DELETE`|`/api/carts/:cid`|Vaciar carrito|

### 🌐 Vistas

| Ruta                | Descripción                                |
| ------------------- | ------------------------------------------ |
| `/`                 | Página de inicio con productos destacados  |
| `/products`         | Lista completa de productos con paginación |
| `/products/:pid`    | Detalle de producto individual             |
| `/carts/my-cart`    | Carrito personal del usuario               |
| `/realtimeproducts` | Gestión de productos en tiempo real        |

## 🔧 Configuración e Instalación

### 1. Prerrequisitos

- Node.js >= 20.0.0
- MongoDB local o en la nube
- npm o yarn

### 2. Instalación

```
# Clonar el proyecto
git clone <repository-url>
cd ecommerce-api

# Instalar dependencias
npm install
```

### 3. Configuración de MongoDB

```
// En src/config/database.js
mongoose.connect('mongodb://localhost:27017/ecommerce', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
```

### 4. Inicializar datos de prueba

```
npm run seed
```

### 5. Ejecutar la aplicación

```
# Desarrollo
npm run dev

# Producción
npm start
```

##  Características de Paginación

### Parámetros de consulta para `/api/products`

- `limit`: Número de productos por página (default: 10)
- `page`: Página a mostrar (default: 1)
- `sort`: Ordenamiento (`asc` o `desc` por precio)
- `query`: Búsqueda por título, descripción o categoría
- `category`: Filtrar por categoría específica
- `availability`: Filtrar por disponibilidad (`true`/`false`)

### Ejemplo de respuesta paginada

```
{
  "status": "success",
  "payload": [...],
  "totalPages": 5,
  "prevPage": 2,
  "nextPage": 4,
  "page": 3,
  "hasPrevPage": true,
  "hasNextPage": true,
  "prevLink": "/api/products?page=2&limit=10",
  "nextLink": "/api/products?page=4&limit=10"
}
```

## Vistas y Frontend

### Layout Principal (`main.handlebars`)

- Navbar responsive con Bootstrap
- Inyección de variables globales (`cartId`)    
- Estilos y scripts comunes

### Vistas Implementadas

1. **Home**: Productos destacados
2. **Products**: Lista completa con filtros y paginación
3. **Product Detail**: Detalle individual con botón agregar al carrito
4. **Cart**: Carrito personal con gestión de cantidades
5. **Real Time Products**: Gestión en tiempo real con WebSockets

## Gestión de Sesiones

### Implementación

```
app.use(session({
    secret: 'ecommerce-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { 
        secure: false,
        maxAge: 1000 * 60 * 60 * 24 // 24 horas
    }
}));
```
### Características

- **Carrito por sesión**: Cada usuario tiene su carrito independiente
- **Persistencia**: El carrito se mantiene durante 24 horas
- **Middleware automático**: Creación de carrito al iniciar sesión
- **Identificación única**: Session ID como identificador

## Modelos de Datos

### Producto

```
{
  title: String,        // Requerido
  description: String,  // Requerido
  code: String,         // Requerido, único
  price: Number,        // Requerido, mínimo 0
  status: Boolean,      // Default: true
  stock: Number,        // Requerido, mínimo 0
  category: String,     // Requerido
  thumbnails: [String]  // Array de URLs
}
```
### Carrito

```
{
  products: [{
    product: ObjectId,  // Referencia a Product
    quantity: Number    // Mínimo 1, default: 1
  }]
}
```

## URLs de la Aplicación

- **Aplicación**: [http://localhost:8080](http://localhost:8080/)
- **API Products**: [http://localhost:8080/api/products](http://localhost:8080/api/products)
- **API Carts**: [http://localhost:8080/api/carts](http://localhost:8080/api/carts)
- **Mi Carrito**: [http://localhost:8080/carts/my-cart](http://localhost:8080/carts/my-cart)
- **Productos Tiempo Real**: [http://localhost:8080/realtimeproducts](http://localhost:8080/realtimeproducts)

## Características Destacadas

### ✅ Implementadas

- Paginación profesional con metadata completa
- Filtros por categoría y disponibilidad
- Ordenamiento ascendente/descendente por precio
- Búsqueda por texto en título, descripción y categoría
- Gestión completa de carritos (CRUD)
- Carritos por sesión de usuario
- Vistas responsivas con Bootstrap
- WebSockets para tiempo real
- Validaciones de datos
- Manejo de errores

### 🔮 Posibles Mejoras Futuras

- Sistema de autenticación de usuarios
- Roles y permisos (admin/user)
- Pasarela de pagos
- Sistema de órdenes/pedidos
- Notificaciones por email
- Dashboard administrativo
- Tests automatizados
- Dockerización
- Deployment en la nube

