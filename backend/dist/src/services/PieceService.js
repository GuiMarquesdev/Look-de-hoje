"use strict";
// backend/src/services/PieceService.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.PieceService = void 0;
class PieceService {
    constructor(pieceRepository) {
        this.pieceRepository = pieceRepository;
    }
    async getAllPieces() {
        return this.pieceRepository.findAll();
    }
    async getPieceById(id) {
        return this.pieceRepository.findById(id);
    }
    async createPiece(data) {
        // Adicionar validações de negócio aqui, se necessário
        // Ex: Verificar se a category_id existe
        return this.pieceRepository.create(data);
    }
    async updatePiece(id, data) {
        // Adicionar validações de negócio aqui, se necessário
        return this.pieceRepository.update(id, data);
    }
    async deletePiece(id) {
        // Adicionar validações de negócio aqui, se necessário
        await this.pieceRepository.delete(id);
    }
}
exports.PieceService = PieceService;
