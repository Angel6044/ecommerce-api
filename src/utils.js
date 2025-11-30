import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Exportar __dirname desde la raíz del proyecto
export const projectDir = dirname(__dirname);
export { __dirname };