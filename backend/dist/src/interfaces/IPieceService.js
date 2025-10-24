"use strict";
// backend/src/services/PieceService.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.PieceService = void 0;
class PieceService {
    constructor(repositoryFactory) {
        this.pieceRepository = repositoryFactory.createPieceRepository();
    }
    async getAllPieces(filter) {
        // Aqui poderia haver lógica de cache, paginação ou validação de filtro
        return this.pieceRepository.findAll(filter);
    }
    // Lógica para obter uma peça por ID
    async getPieceById(id) {
        return this.pieceRepository.findById(id);
    }
    // Lógica para criar uma nova peça
    async createPiece(data) {
        // Aqui poderia haver validação de dados Zod mais complexa
        return this.pieceRepository.create(data);
    }
    // Lógica para atualizar uma peça
    async updatePiece(id, data) {
        // Aqui você garante que apenas campos permitidos sejam atualizados
        return this.pieceRepository.update(id, data);
    }
    // Lógica para deletar uma peça
    async deletePiece(id) {
        // Lógica para verificar dependências antes de deletar, se necessário
        return this.pieceRepository.delete(id);
    }
    // Lógica para alternar o status (usado na gestão de peças do Admin)
    async toggleStatus(id, currentStatus) {
        const newStatus = currentStatus === "available" ? "rented" : "available";
        return this.pieceRepository.update(id, { status: newStatus });
    }
}
exports.PieceService = PieceService;
