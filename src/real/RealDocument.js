import { DocumentInterface } from '../interfaces/DocumentInterface.js';

/**
 * RealDocument
 * Implementação real do acesso a documentos.
 * Simula o carregamento de um documento remoto com delay de 2.5 segundos.
 */
export class RealDocument extends DocumentInterface {
    /**
     * Baixa o documento do "servidor" remoto.
     * Esta é a operação custosa que o Proxy procura evitar.
     * @param {string} filename - Nome do arquivo a ser baixado
     * @returns {Promise<string>} - Promessa que resolve com o conteúdo do documento após delay
     */
    async download(filename) {
        console.log(`  [RealDocument] Iniciando download de '${filename}'...`);
        
        // Simula uma requisição de rede custosa com delay de 2.5 segundos
        await new Promise(resolve => setTimeout(resolve, 2500));
        
        // Simula o retorno do conteúdo do documento
        const content = `[Conteúdo do documento: ${filename}]`;
        console.log(`  [RealDocument] Download concluído após 2.5s`);
        
        return content;
    }
}
