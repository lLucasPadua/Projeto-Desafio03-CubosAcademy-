const express = require("express");
const usuario = require("./controladores/usuarios");
const login = require("./controladores/login");
const produtos = require("./controladores/produtos");
const verificaLogin = require("./filtro/verificalogin");

const rotas = express();

// Cadastro Usuário
rotas.post("/usuario", usuario.cadastrarUsuario);

// Login
rotas.post("/login", login.login);

// Filtro
rotas.use(verificaLogin);

// Usuário
rotas.get("/usuario", usuario.detalharUsuario);
rotas.put("/usuario", usuario.atualizarUsuario);

// Produto
rotas.get("/produtos", produtos.listarProdutosUsuario);
rotas.get("/produtos/:id", produtos.detalharProdutoUsuario);
rotas.post("/produtos", produtos.cadastrarProdutos);
rotas.put("/produtos/:id", produtos.atualizarProdutoUsuario);
rotas.delete("/produtos/:id", produtos.deletarProdutoUsuario);

module.exports = rotas;
