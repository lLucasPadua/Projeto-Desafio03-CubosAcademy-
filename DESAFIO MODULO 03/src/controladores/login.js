const conexao = require("../conexao");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const segredo = require("../segredo");

const login = async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    res.status(404).json("O campo email e senha são obrigatórios.");
  }

  try {
    const queryEmail = "select * from usuarios where email = $1";
    const { rows, rowCount } = await conexao.query(queryEmail, [email]);

    if (rowCount === 0) {
      res.status(404).json("Usuário não encontrado");
    }

    const usuario = rows[0];

    const senhaVerificada = await bcrypt.compare(senha, usuario.senha);

    if (!senhaVerificada) {
      res.status(400).json("Usuário e/ou senha invalido");
    }

    const token = jwt.sign({ id: usuario.id }, segredo, {
      expiresIn: "1d",
    });
    return res.status(200).json({
      token,
    });
  } catch (error) {
    res.status(400).json(error.message);
  }
};

module.exports = {
  login,
};
