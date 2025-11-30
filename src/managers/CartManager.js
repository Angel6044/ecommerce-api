import mongoose from 'mongoose';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

class CartManager {
    async createCart() {
        try {
            const cart = new Cart({
                products: []
            });
            await cart.save();
            return cart;
        } catch (error) {
            throw new Error(`Error al crear carrito: ${error.message}`);
        }
    }

    async getCartById(cid) {
        try {
            // Si cid es "1", crear o buscar un carrito por defecto
            if (cid === '1') {
                let cart = await Cart.findOne({ _id: 'default_cart' });
                if (!cart) {
                    cart = new Cart({ 
                        _id: 'default_cart',
                        products: [] 
                    });
                    await cart.save();
                }
                return await Cart.findById('default_cart').populate('products.product').lean();
            }

            // Para otros IDs, validar que sea un ObjectId válido
            if (!mongoose.Types.ObjectId.isValid(cid)) {
                throw new Error('ID de carrito no válido');
            }

            const cart = await Cart.findById(cid)
                .populate('products.product')
                .lean();
            
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            return cart;
        } catch (error) {
            throw new Error(`Error al obtener carrito: ${error.message}`);
        }
    }

    async addProductToCart(cid, pid) {
        try {
            let cartId = cid;
            
            // Si el carrito es "1", usar el carrito por defecto
            if (cid === '1') {
                cartId = 'default_cart';
            }

            // Verificar que el producto existe
            if (!mongoose.Types.ObjectId.isValid(pid)) {
                throw new Error('ID de producto no válido');
            }

            const product = await Product.findById(pid);
            if (!product) {
                throw new Error('Producto no encontrado');
            }

            let cart = await Cart.findById(cartId);
            if (!cart) {
                // Si no existe y no es el carrito por defecto, crear uno nuevo
                if (cid === '1') {
                    cart = new Cart({ 
                        _id: 'default_cart',
                        products: [] 
                    });
                } else {
                    throw new Error('Carrito no encontrado');
                }
            }

            // Buscar si el producto ya está en el carrito
            const existingProductIndex = cart.products.findIndex(
                item => item.product.toString() === pid
            );

            if (existingProductIndex !== -1) {
                // Incrementar cantidad si ya existe
                cart.products[existingProductIndex].quantity += 1;
            } else {
                // Agregar nuevo producto al carrito
                cart.products.push({
                    product: pid,
                    quantity: 1
                });
            }

            await cart.save();
            return await this.getCartById(cid); // Retornar carrito poblado
        } catch (error) {
            throw new Error(`Error al agregar producto al carrito: ${error.message}`);
        }
    }

    async deleteProductFromCart(cid, pid) {
        try {
            let cartId = cid;
            
            if (cid === '1') {
                cartId = 'default_cart';
            }

            const cart = await Cart.findById(cartId);
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            const initialLength = cart.products.length;
            cart.products = cart.products.filter(
                item => item.product.toString() !== pid
            );

            if (cart.products.length === initialLength) {
                throw new Error('Producto no encontrado en el carrito');
            }

            await cart.save();
            return await this.getCartById(cid);
        } catch (error) {
            throw new Error(`Error al eliminar producto del carrito: ${error.message}`);
        }
    }

    async updateCartProducts(cid, products) {
        try {
            let cartId = cid;
            
            if (cid === '1') {
                cartId = 'default_cart';
            }

            const cart = await Cart.findById(cartId);
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            // Validar que todos los productos existen
            for (const item of products) {
                if (!mongoose.Types.ObjectId.isValid(item.product)) {
                    throw new Error(`ID de producto ${item.product} no válido`);
                }
                
                const product = await Product.findById(item.product);
                if (!product) {
                    throw new Error(`Producto con ID ${item.product} no encontrado`);
                }
            }

            cart.products = products;
            await cart.save();
            return await this.getCartById(cid);
        } catch (error) {
            throw new Error(`Error al actualizar productos del carrito: ${error.message}`);
        }
    }

    async updateProductQuantity(cid, pid, quantity) {
        try {
            if (quantity <= 0) {
                throw new Error('La cantidad debe ser mayor a 0');
            }

            let cartId = cid;
            
            if (cid === '1') {
                cartId = 'default_cart';
            }

            const cart = await Cart.findById(cartId);
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            const productItem = cart.products.find(
                item => item.product.toString() === pid
            );

            if (!productItem) {
                throw new Error('Producto no encontrado en el carrito');
            }

            productItem.quantity = quantity;
            await cart.save();
            return await this.getCartById(cid);
        } catch (error) {
            throw new Error(`Error al actualizar cantidad del producto: ${error.message}`);
        }
    }

    async deleteAllProductsFromCart(cid) {
        try {
            let cartId = cid;
            
            if (cid === '1') {
                cartId = 'default_cart';
            }

            const cart = await Cart.findById(cartId);
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            cart.products = [];
            await cart.save();
            return await this.getCartById(cid);
        } catch (error) {
            throw new Error(`Error al vaciar carrito: ${error.message}`);
        }
    }
}

export default new CartManager();