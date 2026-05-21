// src/real/RealDocument.js
import { DocumentInterface } from '../interfaces/DocumentInterface.js';

export class RealDocument extends DocumentInterface {
    constructor() {
        super();
    }

    async download(filename) {
        console.log(`\n🌐 [Servidor] Iniciando download pesado de: ${filename}...`);
        
        // Simula o tempo de download na rede (2.5 segundos)
        await new Promise(resolve => setTimeout(resolve, 2500));
        
        console.log(`✅ [Servidor] Download concluído: ${filename}`);
        
        // Retorna um conteúdo simulado do arquivo
        return `[Conteúdo do arquivo ${filename} - Baixado em ${new Date().toLocaleTimeString()}]`;
    }
}