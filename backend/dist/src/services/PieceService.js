"use strict";
// backend/src/services/PieceService.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.PieceService = void 0;
class PieceService {
    // Usa o Factory Method para criar a dependência (PrismaPieceRepository)
    constructor(repositoryFactory) {
        this.pieceRepository = repositoryFactory.createPieceRepository();
    }
    // Lógica para listar todas as peças
    async getAllPieces(filter) {
        return this.pieceRepository.findAll(filter);
    }
    // Lógica para obter uma peça por ID
    async getPieceById(id) {
        return this.pieceRepository.findById(id);
    }
    // Lógica para criar uma nova peça
    async createPiece(data) {
        return this.pieceRepository.create(data);
    }
    // Lógica para atualizar uma peça
    async updatePiece(id, data) {
        return this.pieceRepository.update(id, data);
    }
    // Lógica para deletar uma peça
    async deletePiece(id) {
        return this.pieceRepository.delete(id);
    }
    // Lógica para alternar o status
    async toggleStatus(id, currentStatus) {
        const newStatus = currentStatus === "available" ? "rented" : "available";
        return this.pieceRepository.update(id, { status: newStatus });
    }
}
exports.PieceService = PieceService;
