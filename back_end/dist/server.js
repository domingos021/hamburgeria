"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// Criando o servidor Express
const server = (0, express_1.default)();
/*
// Aqui você vai adicionar:
// - rotas (server.get, server.post, etc.)
// - middlewares (server.use, body-parser, etc.)
// - configurações gerais do servidor
*/
// Iniciando o servidor na porta 3000
server.listen(3000, () => {
    console.log("Servidor rodando na porta 3000 🚀");
});
//# sourceMappingURL=server.js.map