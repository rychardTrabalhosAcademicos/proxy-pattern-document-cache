/**
 * DocumentInterface
 * Contrato abstrato que define a interface para documentos.
 * Tanto RealDocument quanto ProxyDocument devem implementar este contrato.
 */
export class DocumentInterface {
    /**
     * Baixa o documento especificado.
     * @param {string} filename - Nome do arquivo a ser baixado
     * @returns {Promise<string>} - Promessa que resolve com o conteúdo do documento
     * @throws {Error} - Deve ser implementado pelas subclasses
     */
    async download(filename) {
        throw new Error("Método 'download()' deve ser implementado.");
    }
}
