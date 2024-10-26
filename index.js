const express = require('express');
const { create } = require("express-handlebars");
 
 
const app = express();
 
 
app.get("/", function (req, res) {
  res.send("Hello World");
});
 
app.get("/teste", function (req, res) {
  res.send("Hello Teste");
});
 
app.get("/empresa/:nome/:endereco/:cnpj/:num_departamentos", function (req, res) {
    res.send(req.params);
  });
 
app.get("/departamento/:nome/:localizacao/:num_funcionarios", function (req, res) {
  res.send(req.params);
  });
 
app.get("/funcionario/:nome/:cargo/:cpf/:data_contratacao/:salario/:rendimento", function (req, res) {
  res.send(req.params);
  });
 
app.get("/htmlteste", function (req,res) {
  res.sendFile(__dirname + "/html/index.html");
});

app.get("/cad", function (req, res) {
  res.render("form");
});


const abs = create({ defaultLayout: "main" });
app.engine("handlebars", abs.engine);
app.set("view engine", "handlebars");
 
 
app.listen(3031, function () {
  console.log("Server is running on port 3031");
});