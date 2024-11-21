const express = require("express");
const rotas = express();
const Sequelize = require("sequelize");
const cors = require('cors');

rotas.use(cors()); 

//###Banco de dados###
const conexaoBanco = new Sequelize("cadastro", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

//###Modelos###
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

// Cria as tabelas no banco de dados
async function syncModels() {
  await conexaoBanco.sync({ force: false });
}
syncModels();

//###Rotas###
rotas.get("/", function (req, res) {
  res.send("Rota principal");
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
    res.status(500).json({mesage: `Erro ao buscar alunos: ${error}`})
}
});

rotas.get("/mostrar_departamentos", async function (req, res) {
    const departamentos = await Departamento.findAll();
    res.json(departamentos);
  });

  rotas.get("/mostrar_funcionarios", async function (req, res) {
    const funcionarios = await Funcionario.findAll();
    res.json(funcionarios);
  });


  // Excluir
  // Talvez você precise mudar para .delet
  rotas.get("/deletar_empresa/:id", async function (req, res) {
    const { id } = req.params;
    const idNumber = parseInt(id, 10); // Converte o ID para número
  
    const deleted = await Empresa.destroy({
      where: { id: idNumber },
    });
  
    if (deleted) {
      res.json({ mensagem: "Empresa deletada com sucesso" });
    } else {
      res.status(404).json({ mensagem: "Empresa não encontrado" });
    }
  });

  rotas.get("/deletar_departamento/:id", async function (req, res) {
    const { id } = req.params;
    const idNumber = parseInt(id, 10); // Converte o ID para número
  
    const deleted = await Departamento.destroy({
      where: { id: idNumber },
    });
  
    if (deleted) {
      res.json({ mensagem: "Departamento deletado com sucesso" });
    } else {
      res.status(404).json({ mensagem: "Departamento não encontrado" });
    }
  });

  rotas.delete("/deletar_funcionario/:id", async function (req, res) {
    const { id } = req.params;
    const idNumber = parseInt(id, 10); // Converte o ID para número
  
    const deleted = await Funcionario.destroy({
      where: { id: idNumber },
    });
  
    if (deleted) {
      res.json({ mensagem: "Funcionario deletado com sucesso" });
    } else {
      res.status(404).json({ mensagem: "Funcionario não encontrado" });
    }
  });


  // Editar aluno via ID, nome e idade como parâmetros
rotas.get("/editarEmpresa/:id/:nome_empresa/:endereco_empresa/:cnpj/:num_departamentos", async function (req, res) {
    const { id, nome_empresa, endereco_empresa, cnpj, num_departamentos } = req.params;
    const idNumber = parseInt(id, 10); // Converte o ID para número
  
    const [updated] = await Empresa.update(
      { nome_empresa, endereco_empresa, cnpj, num_departamentos },
      {
        where: { id: idNumber }, // Usa o ID numérico
      }
    );
  
    res.json({
      mensagem: "Empresa atualizada com sucesso",
    });
  });

  rotas.get("/editarDepartamento/:id/:nome_departamento/:localizacao_departamento/:num_funcionarios", async function (req, res) {
    const { id, nome_departamento, localizacao_departamento, num_funcionarios} = req.params;
    const idNumber = parseInt(id, 10); // Converte o ID para número
  
    const [updated] = await Departamento.update(
      { nome_departamento, localizacao_departamento, num_funcionarios},
      {
        where: { id: idNumber }, // Usa o ID numérico
      }
    );
  
    res.json({
      mensagem: "Departamento atualizado com sucesso",
    });
  });


  rotas.get("/editarFuncionarios/:id/:nome_funcionario/:cpf_funcionario/:cargo_funcionario/:data_contratacao_funcionario/:data_demissao_funcionario/:salario/:rendimento_funcionario", async function (req, res) {
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

//###Servidor###
rotas.listen(3031, function () {
  console.log("Server is running on port 3031");
});