const conexao = require("../conexao");
const bcrypt = require("bcrypt");

const cadastrarUsuario = async (req, res) => {
  const { nome, email, senha, nome_loja } = req.body;

  if (!nome) {
    return res.status(404).json("O campo nome é obrigatorio!");
  }
  if (!email) {
    return res.status(404).json("O campo email é obrigatorio!");
  }
  if (!senha) {
    return res.status(404).json("O campo senha é obrigatorio!");
  }
  if (!nome_loja) {
    return res.status(404).json("O campo nome da loja é obrigatorio!");
  }

  try {
    const verificaEmail = "select * from usuarios where email = $1 ";
    const { rowCount } = await conexao.query(verificaEmail, [email]);

    if (rowCount > 0) {
      return res.status(400).json("O email informado já possui um cadastro!");
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const query =
      "insert into usuarios (nome, email, senha, nome_loja) values ($1, $2, $3, $4)";
    const usuarioCadastrado = await conexao.query(query, [
      nome,
      email,
      senhaCriptografada,
      nome_loja,
    ]);

    if (usuarioCadastrado.rowCount === 0) {
      return res.status(400).json("Não foi possivel cadastrar usuário.");
    }

    return res.status(200).send();
  } catch (error) {
    return res.status(404).json(error);
  }
};

const detalharUsuario = async (req, res) => {
  const { usuario } = req;

  try {
    const queryUsuarioExistente = "select * from usuarios where id = $1";
    const usuarioExistente = await conexao.query(queryUsuarioExistente, [
      usuario.id,
    ]);

    if (usuarioExistente.rowCount === 0) {
      return res
        .status(401)
        .json(
          `mensagem : Para acessar este recurso um token de autenticação válido deve ser enviado..`
        );
    }

    return res.status(200).json(usuario);
  } catch (error) {
    return res
      .status(404)
      .json(
        "mensagem: Para acessar este recurso um token de autenticação válido deve ser enviado."
      );
  }
};

const atualizarUsuario = async (req, res) => {
  const { usuario } = req;
  const { nome, email, senha, nome_loja } = req.body;

  if (!nome) {
    return res.status(404).json("O campo nome é obrigatorio!");
  }
  if (!email) {
    return res.status(404).json("O campo email é obrigatorio!");
  }
  if (!senha) {
    return res.status(404).json("O campo senha é obrigatorio!");
  }
  if (!nome_loja) {
    return res.status(404).json("O campo nome da loja é obrigatorio!");
  }

  try {
    const verificaEmail =
      "select * from usuarios where email = $1 and id <> $2";
    const { rowCount } = await conexao.query(verificaEmail, [
      email,
      usuario.id,
    ]);

    if (rowCount > 0) {
      return res
        .status(400)
        .json("O email informado já está sendo utilizado por outro usuário.");
    }

    const query =
      "update usuarios set nome = $1, email = $2, senha = $3, nome_loja = $4 where id = $5";

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const usuarioAtualizado = await conexao.query(query, [
      nome,
      email,
      senhaCriptografada,
      nome_loja,
      usuario.id,
    ]);

    if (usuarioAtualizado.rowCount === 0) {
      return res.status(401).json("Não foi possivel Atualizar usuário.");
    }

    return res.status(200).send();
  } catch (error) {
    return res.status(404).json(error.message);
  }
};

module.exports = {
  cadastrarUsuario,
  detalharUsuario,
  atualizarUsuario,
};
