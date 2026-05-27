/**
 * CacheManager
 * Gerenciador de cache em memória para documentos.
 * Responsável por armazenar, verificar e recuperar documentos utilizando um Map.
 */
export class CacheManager {
    constructor() {
        /** @type {Map<string, string>} */
        this._store = new Map();
    }

    /**
     * Verifica se o documento está em cache.
     * @param {string} filename - Nome do arquivo
     * @returns {boolean} - true se exite em cache, false caso contrário
     */
    has(filename) {
        return this._store.has(filename);
    }

    /**
     * Recupera o documento do cache.
     * @param {string} filename - Nome do arquivo
     * @returns {string|null} - Conteúdo do documento ou null se não encontrado
     */
    get(filename) {
        return this._store.get(filename) ?? null;
    }

    /**
     * Armazena o documento no cache.
     * @param {string} filename - Nome do arquivo
     * @param {string} content - Conteúdo do documento a ser armazenado
     */
    set(filename, content) {
        this._store.set(filename, content);
    }
}
