"use strict";
// backend/src/factories/PrismaRepositoryFactory.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaRepositoryFactory = void 0;
const PrismaPieceRepository_1 = require("../repositories/PrismaPieceRepository");
const PrismaCategoryRepository_1 = require("../repositories/PrismaCategoryRepository");
const PrismaStoreSettingRepository_1 = require("../repositories/PrismaStoreSettingRepository");
const PrismaHeroSettingRepository_1 = require("../repositories/PrismaHeroSettingRepository");
class PrismaRepositoryFactory {
    constructor(prisma) {
        this.prisma = prisma;
    }
    createPieceRepository() {
        return new PrismaPieceRepository_1.PrismaPieceRepository(this.prisma);
    }
    createCategoryRepository() {
        return new PrismaCategoryRepository_1.PrismaCategoryRepository(this.prisma);
    }
    createStoreSettingRepository() {
        return new PrismaStoreSettingRepository_1.PrismaStoreSettingRepository(this.prisma);
    }
    // USO CORRETO
    createHeroSettingRepository() {
        return new PrismaHeroSettingRepository_1.PrismaHeroSettingRepository(this.prisma);
    }
}
exports.PrismaRepositoryFactory = PrismaRepositoryFactory;
