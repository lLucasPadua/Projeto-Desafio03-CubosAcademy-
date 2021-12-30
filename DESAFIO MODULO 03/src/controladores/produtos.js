const jwt = require("jsonwebtoken");
const segredo = require("../segredo");
const conexao = require("../conexao");

const cadastrarProdutos = async (req, res) => {
  const { nome, quantidade, categoria, preco, descricao, imagem } = req.body;
  const { usuario } = req;

  if (!nome) {
    return res.status(404).json("Campo nome é obrigatorios");
  }
  if (!quantidade) {
    return res.status(404).json("Campo quantidade é obrigatorios");
  }

  if (!categoria) {
    return res.status(404).json("Campo categoria é obrigatorios");
  }
  if (!preco) {
    return res.status(404).json("Campo preço é obrigatorios");
  }
  if (!descricao) {
    return res.status(404).json("Campo descrição é obrigatorios");
  }

  try {
    const queryProduto =
      "insert into produtos (usuario_id, nome, quantidade, categoria, preco, descricao, imagem) values ($1, $2, $3, $4, $5, $6, $7)";
    const produto = await conexao.query(queryProduto, [
      usuario.id,
      nome,
      quantidade,
      categoria,
      preco,
      descricao,
      imagem,
    ]);

    if (produto === 0) {
      return res.status(400).json("Não foi possivel cadastrar produto");
    }

    return res.status(200).send();
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

const listarProdutosUsuario = async (req, res) => {
  const { usuario } = req;
  const { categoria } = req.query;

  try {
    let produtos;
    if (!categoria) {
      produtos = await conexao.query(
        "select * from produtos where usuario_id = $1",
        [usuario.id]
      );
    } else {
      produtos = await conexao.query(
        "select * from produtos where usuario_id = $1 and categoria = $2",
        [usuario.id, categoria]
      );
    }
    let httpStatusCode = produtos.rowCount > 0 ? 200 : 204;

    return res.status(httpStatusCode).json(produtos.rows);
  } catch (error) {
    return res
      .status(401)
      .json(
        `mensagem: Para acessar este recurso um token de autenticação válido deve ser enviado.`
      );
  }
};

const detalharProdutoUsuario = async (req, res) => {
  const { usuario } = req;
  const { id } = req.params;

  try {
    const queryProdutoExistente =
      "select * from produtos where id = $1 and usuario_id = $2";
    const produtoExistente = await conexao.query(queryProdutoExistente, [
      id,
      usuario.id,
    ]);

    if (produtoExistente.rowCount === 0) {
      return res
        .status(401)
        .json(`mensagem : Não existe produto cadastrado com ID ${id}.`);
    }

    const query = "select * from produtos where usuario_id = $1 and id = $2";
    const produtoDetalhado = await conexao.query(query, [usuario.id, id]);
    res.status(200).json(produtoDetalhado.rows);
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

const atualizarProdutoUsuario = async (req, res) => {
  const { usuario } = req;
  const { id } = req.params;
  const { nome, quantidade, categoria, preco, descricao, imagem } = req.body;

  if (!nome) {
    return res.status(404).json("Campo nome é obrigatorios");
  }
  if (!quantidade) {
    return res.status(404).json("Campo quantidade é obrigatorios");
  }
  if (!preco) {
    return res.status(404).json("Campo preco é obrigatorios");
  }
  if (!descricao) {
    return res.status(404).json("Campo descrição é obrigatorios");
  }

  try {
    const queryProdutoExistente =
      "select * from produtos where id = $1 and usuario_id = $2";
    const produtoExistente = await conexao.query(queryProdutoExistente, [
      id,
      usuario.id,
    ]);

    if (produtoExistente.rowCount === 0) {
      return res
        .status(401)
        .json(`mensagem : Não existe produto cadastrado com ID ${id}.`);
    }

    const query =
      "update produtos set nome = $1, quantidade = $2, categoria = $3, preco = $4, descricao = $5, imagem = $6 where id = $7 and usuario_id = $8";
    const produtoAtualizado = await conexao.query(query, [
      nome,
      quantidade,
      categoria,
      preco,
      descricao,
      imagem,
      id,
      usuario.id,
    ]);

    if (produtoAtualizado.rowCount === 0) {
      return res.status(400).json("Não foi possivel atualizar produto");
    }

    return res.status(200).send();
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

const deletarProdutoUsuario = async (req, res) => {
  const { usuario } = req;
  const { id } = req.params;

  try {
    const queryProdutoExistente =
      "select * from produtos where id = $1 and usuario_id = $2";
    const produtoExistente = await conexao.query(queryProdutoExistente, [
      id,
      usuario.id,
    ]);

    if (produtoExistente.rowCount === 0) {
      return res
        .status(401)
        .json(`mensagem : Não existe produto cadastrado com ID ${id}.`);
    }

    const { rowCount } = await conexao.query(
      "delete from produtos where id = $1",
      [id]
    );

    if (rowCount === 0) {
      return res
        .status(400)
        .json(
          `mensagem: O usuário autenticado não tem permissão para excluir este produto.`
        );
    }

    return res.status(200).send();
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

module.exports = {
  cadastrarProdutos,
  listarProdutosUsuario,
  detalharProdutoUsuario,
  atualizarProdutoUsuario,
  deletarProdutoUsuario,
};
