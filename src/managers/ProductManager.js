import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const productsFilePath = path.join(__dirname, '../data/products.json');

class ProductManager {
  async getProducts() {
    try {
      if (fs.existsSync(productsFilePath)) {
        const data = await fs.promises.readFile(productsFilePath, 'utf-8');
        return JSON.parse(data);
      }
      return [];
    } catch (error) {
      throw new Error('Error al leer productos');
    }
  }

  async addProduct(product) {
    const products = await this.getProducts();
    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;

    const newProduct = {
      id: newId,
      title: product.title,
      description: product.description,
      code: product.code,
      price: product.price,
      status: product.status ?? true,
      stock: product.stock,
      category: product.category,
      thumbnails: product.thumbnails || []
    };

    products.push(newProduct);
    await fs.promises.writeFile(productsFilePath, JSON.stringify(products, null, 2));
    return newProduct;
  }

  async getProductById(id) {
    const products = await this.getProducts();
    return products.find(p => p.id === parseInt(id));
  }

  async updateProduct(id, updates) {
    const products = await this.getProducts();
    const index = products.findIndex(p => p.id === parseInt(id));
    if (index === -1) return null;

    products[index] = { ...products[index], ...updates, id: products[index].id };
    await fs.promises.writeFile(productsFilePath, JSON.stringify(products, null, 2));
    return products[index];
  }

  async deleteProduct(id) {
    const products = await this.getProducts();
    const filtered = products.filter(p => p.id !== parseInt(id));
    if (filtered.length === products.length) return false;

    await fs.promises.writeFile(productsFilePath, JSON.stringify(filtered, null, 2));
    return true;
  }
}

export default new ProductManager();