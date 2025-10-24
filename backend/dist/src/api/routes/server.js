"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importStar(require("express"));
const cors_1 = __importDefault(require("cors"));
const PrismaRepositoryFactory_1 = require("@/factories/PrismaRepositoryFactory");
const prisma_1 = require("@/database/prisma");
const pieces_route_1 = require("@/api/routes/pieces.route");
const admin_route_1 = require("@/api/routes/admin.route");
const hero_route_1 = require("@/api/routes/hero.route");
require("dotenv/config");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Configurações
app.use((0, cors_1.default)({ origin: "http://localhost:8080" })); // Ajuste a origem para o seu frontend
app.use((0, express_1.json)());
// 1. Inicializa o cliente Prisma
const prisma = (0, prisma_1.createPrismaClient)();
// 2. Inicializa a Factory
const repositoryFactory = new PrismaRepositoryFactory_1.PrismaRepositoryFactory(prisma);
// 3. Conecta as Rotas à Factory
app.use("/api/pieces", (0, pieces_route_1.createPieceRouter)(repositoryFactory));
app.use("/api/admin", (0, admin_route_1.createAdminRouter)(repositoryFactory));
app.use("/api/hero", (0, hero_route_1.createHeroRouter)(repositoryFactory));
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
