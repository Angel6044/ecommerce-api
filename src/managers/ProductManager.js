import Product from '../models/Product.js';

class ProductManager {
    async getProducts(options = {}) {
        try {
            const {
                limit = 10,
                page = 1,
                sort,
                query,
                category,
                availability
            } = options;

            // Construir filtro
            const filter = {};
            
            if (query) {
                filter.$or = [
                    { title: { $regex: query, $options: 'i' } },
                    { description: { $regex: query, $options: 'i' } },
                    { category: { $regex: query, $options: 'i' } }
                ];
            }

            if (category) {
                filter.category = { $regex: category, $options: 'i' };
            }

            if (availability !== undefined) {
                if (availability === 'true' || availability === true) {
                    filter.status = true;
                } else if (availability === 'false' || availability === false) {
                    filter.status = false;
                }
            }

            // Construir opciones de consulta
            const queryOptions = {
                limit: parseInt(limit),
                skip: (parseInt(page) - 1) * parseInt(limit)
            };

            if (sort) {
                queryOptions.sort = { price: sort === 'asc' ? 1 : -1 };
            }

            // Ejecutar consulta
            const products = await Product.find(filter)
                .limit(queryOptions.limit)
                .skip(queryOptions.skip)
                .sort(queryOptions.sort || {})
                .lean();

            // Obtener total para paginación
            const totalProducts = await Product.countDocuments(filter);
            const totalPages = Math.ceil(totalProducts / limit);
            const hasPrevPage = page > 1;
            const hasNextPage = page < totalPages;

            // Construir links
            const baseUrl = '/api/products?';
            const prevLink = hasPrevPage 
                ? `${baseUrl}limit=${limit}&page=${parseInt(page) - 1}${sort ? `&sort=${sort}` : ''}${query ? `&query=${query}` : ''}${category ? `&category=${category}` : ''}${availability ? `&availability=${availability}` : ''}`
                : null;
            
            const nextLink = hasNextPage 
                ? `${baseUrl}limit=${limit}&page=${parseInt(page) + 1}${sort ? `&sort=${sort}` : ''}${query ? `&query=${query}` : ''}${category ? `&category=${category}` : ''}${availability ? `&availability=${availability}` : ''}`
                : null;

            return {
                status: 'success',
                payload: products,
                totalPages,
                prevPage: hasPrevPage ? parseInt(page) - 1 : null,
                nextPage: hasNextPage ? parseInt(page) + 1 : null,
                page: parseInt(page),
                hasPrevPage,
                hasNextPage,
                prevLink,
                nextLink
            };

        } catch (error) {
            throw new Error(`Error al obtener productos: ${error.message}`);
        }
    }

    async getProductById(id) {
        try {
            const product = await Product.findById(id).lean();
            return product;
        } catch (error) {
            throw new Error(`Error al obtener producto: ${error.message}`);
        }
    }

    async addProduct(productData) {
        try {
            // Validar campos obligatorios
            const requiredFields = ['title', 'description', 'code', 'price', 'stock', 'category'];
            const missingFields = requiredFields.filter(field => !productData[field]);
            
            if (missingFields.length > 0) {
                throw new Error(`Campos obligatorios faltantes: ${missingFields.join(', ')}`);
            }

            // Verificar si el código ya existe
            const existingProduct = await Product.findOne({ code: productData.code });
            if (existingProduct) {
                throw new Error('El código del producto ya existe');
            }

            const product = new Product({
                title: productData.title,
                description: productData.description,
                code: productData.code,
                price: parseFloat(productData.price),
                status: productData.status !== undefined ? productData.status : true,
                stock: parseInt(productData.stock),
                category: productData.category,
                thumbnails: productData.thumbnails || []
            });

            await product.save();
            return product;
        } catch (error) {
            throw new Error(`Error al agregar producto: ${error.message}`);
        }
    }

    async updateProduct(id, updates) {
        try {
            // Evitar actualización del ID
            if (updates._id || updates.id) {
                delete updates._id;
                delete updates.id;
            }

            const product = await Product.findByIdAndUpdate(
                id,
                updates,
                { new: true, runValidators: true }
            ).lean();

            if (!product) {
                throw new Error('Producto no encontrado');
            }

            return product;
        } catch (error) {
            throw new Error(`Error al actualizar producto: ${error.message}`);
        }
    }

    async deleteProduct(id) {
        try {
            const product = await Product.findByIdAndDelete(id);
            if (!product) {
                throw new Error('Producto no encontrado');
            }
            return true;
        } catch (error) {
            throw new Error(`Error al eliminar producto: ${error.message}`);
        }
    }
}

export default new ProductManager();