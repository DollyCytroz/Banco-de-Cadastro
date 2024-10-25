const Sequelize = require("sequelize");


const conexaoComBanco = new Sequelize("cadastro", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

const Empresa = conexaoComBanco.define("empresa", {
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

const Departamento = conexaoComBanco.define("departamento", {
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

  const Funcionario = conexaoComBanco.define("funcionario", {
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
      allowNull: true,
    },
    salario: {
      type: Sequelize.DECIMAL(10, 2),
    },
    rendimento_funcionario: {
      type: Sequelize.STRING,
    },
  });

Empresa.async({force: true});
Funcionario.async({force: true});
Departamento.async({force: true});




  Departamento.create({
    nome_departamento: "Departamento de Administração",
    localizacao_departamento: "Dentro de Narnia",
    num_funcionarios: 20
  });

  Funcionario.create({
    nome_funcionario: "Danilo",
    cpf_funcionario: "18426027806",
    cargo_funcionario: "CEO",
    data_contratacao_funcionario: "2015-10-26",
    data_demissao_funcionario:"",
    salario: 20000.00,
    rendimento_funcionario: "Sua administração ampliou o lucro em 40% no último trimestre",
  });

  Empresa.create({
    nome_empresa: "Danilo Motors",
    endereco_empresa: "Narnia",
    cnpj: "35875408000191",
    num_departamentos: 20,
  });