const express = require("express");
const Sequelize = require("sequelize");
const cors = require('cors');

// Iniciando o express e configurando o CORS
const rotas = express();
rotas.use(cors()); 
rotas.use(express.json());  // Permite que o Express interprete JSON nas requisições

//### Banco de dados ###
const conexaoBanco = new Sequelize("cadastro", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

//### Modelos ###
// Modelo Empresa
const Empresa = conexaoBanco.define("empresa", {
  nome_empresa: {
    type: Sequelize.STRING,
  },
  endereco_empresa: {
    type: Sequelize.STRING,
  },
  cnpj: {
    type: Sequelize.STRING,
  },
  num_departamentos: {
    type: Sequelize.INTEGER,
  },
});

// Modelo Departamento
const Departamento = conexaoBanco.define("departamento", {
  nome_departamento: {
    type: Sequelize.STRING,
  },
  localizacao_departamento: {
    type: Sequelize.STRING,
  },
  num_funcionarios: {
    type: Sequelize.INTEGER,
  },
});

// Modelo Funcionario
const Funcionario = conexaoBanco.define("funcionario", {
  nome_funcionario: {
    type: Sequelize.STRING,
  },
  cpf_funcionario: {
    type: Sequelize.STRING,
  },
  cargo_funcionario: {
    type: Sequelize.STRING,
  },
  data_contratacao_funcionario: {
    type: Sequelize.DATE,
  },
  data_demissao_funcionario: {
    type: Sequelize.DATE,
  },
  salario: {
    type: Sequelize.FLOAT,
  },
  rendimento_funcionario: {
    type: Sequelize.FLOAT,
  },
});

// Criação das tabelas no banco
async function syncModels() {
  await conexaoBanco.sync({ force: false });
}
syncModels();

//### Rotas ###

// Rota principal
rotas.get("/", function (req, res) {
  res.send("Rota principal do servidor");
});

// Rota para salvar uma empresa
rotas.get("/salvar_empresa/empresa/:nome_empresa/:endereco_empresa/:cnpj/:num_departamentos", async function (req, res) {
  const { nome_empresa, endereco_empresa, cnpj, num_departamentos } = req.params;
  const novaEmpresa = await Empresa.create({ nome_empresa, endereco_empresa, cnpj, num_departamentos });
  
  res.json({
    resposta: "Empresa cadastrada com sucesso",
    empresa: novaEmpresa,
  });
});

// Rota para salvar um departamento
rotas.get("/salvar_departamento/:nome_departamento/:localizacao_departamento/:num_funcionarios", async function (req, res) {
  const { nome_departamento, localizacao_departamento, num_funcionarios } = req.params;
  const novoDepartamento = await Departamento.create({ nome_departamento, localizacao_departamento, num_funcionarios });
  
  res.json({
    resposta: "Departamento criado com sucesso",
    departamento: novoDepartamento,
  });
});

// Rota para salvar um funcionário
rotas.get("/salvar_funcionario/:nome_funcionario/:cpf_funcionario/:cargo_funcionario/:data_contratacao_funcionario/:data_demissao_funcionario/:salario/:rendimento_funcionario", async function (req, res) {
  const { nome_funcionario, cpf_funcionario, cargo_funcionario, data_contratacao_funcionario, data_demissao_funcionario, salario, rendimento_funcionario } = req.params;
  const novoFuncionario = await Funcionario.create({
    nome_funcionario,
    cpf_funcionario,
    cargo_funcionario,
    data_contratacao_funcionario,
    data_demissao_funcionario: data_demissao_funcionario === "null" ? null : data_demissao_funcionario, // Tratamento explícito
    salario,
    rendimento_funcionario,
  });

  res.json({
    resposta: "Funcionário criado com sucesso",
    funcionario: novoFuncionario,
  });
});

// Rota para mostrar todas as empresas
rotas.get("/mostrar_empresas", async function (req, res) {
  try {
    const empresas = await Empresa.findAll();
    res.json(empresas);
  } catch (error) {
    res.status(500).json({ message: `Erro ao buscar empresas: ${error}` });
  }
});

// Rota para mostrar todos os departamentos
rotas.get("/mostrar_departamentos", async function (req, res) {
  const departamentos = await Departamento.findAll();
  res.json(departamentos);
});

// Rota para mostrar todos os funcionários
rotas.get("/mostrar_funcionarios", async function (req, res) {
  const funcionarios = await Funcionario.findAll();
  res.json(funcionarios);
});

// Rota para buscar um funcionário por ID
rotas.get("/mostrar_funcionario/:id", async function (req, res) {
  const { id } = req.params;
  const idNumber = parseInt(id, 10); // Converte o ID para número
  const funcionario = await Funcionario.findOne({ where: { id: idNumber } });

  if (funcionario) {
    res.json(funcionario);
  } else {
    res.status(404).json({ mensagem: "Funcionário não encontrado" });
  }
});

// Rota para excluir um funcionário
rotas.delete("/deletar_funcionario/:id", async function (req, res) {
  const { id } = req.params;
  const idNumber = parseInt(id, 10); // Converte o ID para número

  const deleted = await Funcionario.destroy({
    where: { id: idNumber },
  });

  if (deleted) {
    res.json({ mensagem: "Funcionário deletado com sucesso" });
  } else {
    res.status(404).json({ mensagem: "Funcionário não encontrado" });
  }
});

// Rota para editar um funcionário
rotas.get("/editarFuncionario/:id/:nome_funcionario/:cpf_funcionario/:cargo_funcionario/:data_contratacao_funcionario/:data_demissao_funcionario/:salario/:rendimento_funcionario", async function (req, res) {
  const { id, nome_funcionario, cpf_funcionario, cargo_funcionario, data_contratacao_funcionario, data_demissao_funcionario, salario, rendimento_funcionario} = req.params;
  const idNumber = parseInt(id, 10); // Converte o ID para número

  // Se a data de demissão for "null" (vazio no frontend), definimos como null
  const dataDemissao = data_demissao_funcionario === "null" ? null : data_demissao_funcionario;

  // Atualiza o funcionário no banco de dados
  const [updated] = await Funcionario.update(
    { 
      nome_funcionario, 
      cpf_funcionario, 
      cargo_funcionario, 
      data_contratacao_funcionario, 
      data_demissao_funcionario: dataDemissao, // Atualiza com a data de demissão correta
      salario, 
      rendimento_funcionario
    },
    {
      where: { id: idNumber }, // Usa o ID numérico
    }
  );

  if (updated) {
      res.json({
          mensagem: "Funcionário atualizado com sucesso",
      });
  } else {
      res.status(404).json({ mensagem: "Funcionário não encontrado" });
  }
});

//### Servidor ###
rotas.listen(3031, function () {
  console.log("Servidor rodando na porta 3031");
});
