// src/interfaces/DocumentInterface.js

export class DocumentInterface {
    constructor() {
        if (this.constructor === DocumentInterface) {
            throw new Error("Classe Abstrata não pode ser instanciada diretamente.");
        }
    }

    /**
     * @param {string} filename 
     * @returns {Promise<string>} O conteúdo do documento
     */
    async download(filename) {
        throw new Error("Método 'download()' deve ser implementado.");
    }
}