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

