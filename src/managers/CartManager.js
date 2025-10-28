import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const cartsFilePath = path.join(__dirname, '../data/carts.json');

class CartManager {
  async getCarts() {
    try {
      if (fs.existsSync(cartsFilePath)) {
        const data = await fs.promises.readFile(cartsFilePath, 'utf-8');
        return JSON.parse(data);
      }
      return [];
    } catch (error) {
      throw new Error('Error al leer carritos');
    }
  }

  async createCart() {
    const carts = await this.getCarts();
    const newId = carts.length > 0 ? Math.max(...carts.map(c => c.id)) + 1 : 1;

    const newCart = {
      id: newId,
      products: []
    };

    carts.push(newCart);
    await fs.promises.writeFile(cartsFilePath, JSON.stringify(carts, null, 2));
    return newCart;
  }

  async getCartById(cid) {
    const carts = await this.getCarts();
    return carts.find(c => c.id === parseInt(cid));
  }

  async addProductToCart(cid, pid) {
    const carts = await this.getCarts();
    const cartIndex = carts.findIndex(c => c.id === parseInt(cid));
    if (cartIndex === -1) return null;

    const productInCart = carts[cartIndex].products.find(p => p.product === parseInt(pid));
    if (productInCart) {
      productInCart.quantity += 1;
    } else {
      carts[cartIndex].products.push({ product: parseInt(pid), quantity: 1 });
    }

    await fs.promises.writeFile(cartsFilePath, JSON.stringify(carts, null, 2));
    return carts[cartIndex];
  }
}

export default new CartManager();