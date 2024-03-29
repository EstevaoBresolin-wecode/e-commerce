import { client } from "../db/client.js";

export const login = async (req, res) => {
  const { body } = req;

  const usuarioQuery = await client.query(
    "SELECT * FROM login WHERE usuario = $1",
    [body["usuario"]]
  );

  if (usuarioQuery.rowCount) {
    return res.status(403).json({ mensagem: "Usuário já existente" });
  }

  try {
    await client.query(
      "INSERT INTO cliente (nome, rua, numero, complemento, bairro, cidade, uf, cep) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
      [
        body["nome"],
        body["rua"],
        body["numero"],
        body["complemento"],
        body["bairro"],
        body["cidade"],
        body["uf"],
        body["cep"],
      ]
    );
  } catch (e) {
    console.log(e);

    return res
      .status(400)
      .json({ mensagem: "Algo deu errado ao tentar cadastrar o usuário" });
  }

  const codigoUltimoClienteQuery = await client.query(
    "SELECT codigo_cliente FROM cliente ORDER BY codigo_cliente DESC LIMIT 1"
  );
  const codigoUltimoCliente = codigoUltimoClienteQuery.rows[0].codigo_cliente;

  try {
    await client.query(
      "INSERT INTO login (usuario, senha, codigo_cliente) VALUES ($1, $2, $3)",
      [body["usuario"], body["senha"], codigoUltimoCliente]
    );
  } catch (e) {
    console.log(e);

    return res
      .status(400)
      .json({ mensagem: "Algo deu errado ao tentar cadastrar o usuário" });
  }

  return res.status(200);
};
