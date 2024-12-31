import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

// Determinar el directorio actual
const __dirname = dirname(fileURLToPath(import.meta.url));
const modulesDir = path.join(__dirname, '');

// Contadores globales
let totalFilesProcessed = 0;
let totalFilesLoaded = 0;

// Función para verificar si un archivo es válido según la extensión
const isValidFile = (file, validExtensions = ['.js']) => {
    return validExtensions.includes(path.extname(file));
};


// Función para cargar un módulo individual
const loadModule = async (filePath) => {
    totalFilesProcessed++;
    const moduleURL = pathToFileURL(filePath).href;

    try {
        await import(moduleURL);
        totalFilesLoaded++;
        console.log(`✅ Módulo cargado exitosamente: ${moduleURL}`);
    } catch (error) {
        console.error(`❌ Error al cargar el módulo ${filePath}:`, error.message);
    }
};

// Función para cargar módulos desde un directorio dado
const loadModulesFromDir = async (dir) => {
    const files = fs.readdirSync(dir);

    const loadPromises = files.map(async (file) => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            // Recursión para explorar subdirectorios
            await loadModulesFromDir(filePath);
        } else if (isValidFile(file)) {
            // Intentar cargar el módulo si tiene una extensión válida
            await loadModule(filePath);
        } else {
            console.log(`⏩ Archivo ignorado: ${filePath}`);
        }
    });

    // Esperar a que todos los módulos se carguen
    await Promise.all(loadPromises);
};


// Cargar los archivos
(async () => {
    try {
        console.log(`🔍 Iniciando la carga de módulos desde: ${modulesDir}`);
        await loadModulesFromDir(modulesDir);
        console.log(`📊 Total de archivos procesados: ${totalFilesProcessed}`);
        console.log(`📊 Total de módulos cargados exitosamente: ${totalFilesLoaded}`);
    } catch (error) {
        console.error('❌ Error general al cargar módulos:', error.message);
    }
})();