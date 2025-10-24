import { PrismaClient } from "@prisma/client";
import { IRepositoryFactory } from "./IRepositoryFactory";
import { IPieceRepository } from "../interfaces/IPieceRepository";
import { PrismaPieceRepository } from "../repositories/PrismaPieceRepository";
import { ICategoryRepository } from "../interfaces/ICategoryRepository";
import { PrismaCategoryRepository } from "../repositories/PrismaCategoryRepository";
import { IStoreSettingRepository } from "../interfaces/IStoreSettingRepository";
import { PrismaStoreSettingRepository } from "../repositories/PrismaStoreSettingRepository";
import { IHeroSettingRepository } from "../interfaces/IHeroSettingRepository";
import { PrismaHeroSettingRepository } from "../repositories/PrismaHeroSettingRepository";

// Injeção da dependência PrismaClient na Factory
export class PrismaRepositoryFactory implements IRepositoryFactory {
  private prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }

  createPieceRepository(): IPieceRepository {
    return new PrismaPieceRepository(this.prisma);
  }

  createCategoryRepository(): ICategoryRepository {
    return new PrismaCategoryRepository(this.prisma);
  }

  createStoreSettingRepository(): IStoreSettingRepository {
    return new PrismaStoreSettingRepository(this.prisma);
  }

  createHeroSettingRepository(): IHeroSettingRepository {
    return new PrismaHeroSettingRepository(this.prisma);
  }
}
