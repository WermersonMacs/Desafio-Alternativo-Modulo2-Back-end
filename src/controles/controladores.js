const bancoDeDados = require('../bancodedados');
const { checkBody, procurarConta, procurandoIndiceDaConta, juntarConsultas } = require('./funcao.js');

const listarConsultas = (req, res) => {
  const { cnes_consultorio, senha_consultorio } = req.query;
  const todasConsultas = juntarConsultas(bancoDeDados);
  
  if (cnes_consultorio !== "1001" || senha_consultorio !== "CubosHealth@2022") {
    return res.status(401).json({ mensagem: "Cnes ou senha inválidos!" });
  }
  
  if (todasConsultas.length === 0) {
    return res.status(204).json();
  }
  
  return res.status(200).json(todasConsultas);
};

let criarConsulta = (req, res) => {
  const { tipoConsulta, valorConsulta, paciente } = req.body;
  const todasConsultas = juntarConsultas(bancoDeDados);
  
  if (!tipoConsulta.trim() || !valorConsulta) {
    return res.status(400).json({ mensagem: 'Verificar se foram passados todos os campos no body da requisição' });
  }
  
  if (typeof valorConsulta !== "number") {
    return res.status(400).json({ mensagem: 'Verificar se o valor da consulta é numérico' });
  }
  
  const verificar = checkBody(res, bancoDeDados, paciente);
  if (verificar) {
    return verificar;
  }
  
  const medico = bancoDeDados.consultorio.medicos.find((medico) => medico.especialidade === tipoConsulta);
  
  if (!medico) {
    return res.status(400).json({ mensagem: "Tipo de consulta não consta nas especialidades dos médicos na base" });
  }
  
  const numeroDaConta = todasConsultas.reduce((max, consulta) => Math.max(max, consulta.identificador), 0) + 1;
  
  const consulta = {
    identificador: numeroDaConta,
    tipoConsulta,
    identificadorMedico: medico.identificador,
    finalizada: false,
    valorConsulta,
    paciente: { ...paciente }
  };
  
  bancoDeDados.consultas.push(consulta);
  return res.status(201).json();
};

const atualizarConsulta = (req, res) => {
  const numeroDaConta = Number(req.params.identificadorConsulta);
  const pacienteAtualizar = req.body;
  const todasConsultas = juntarConsultas(bancoDeDados);
  
  const consulta = procurarConta(todasConsultas, numeroDaConta);
  
  if (!consulta) {
    return res.status(404).json({ mensagem: "Conta não encontrada. Identificador da consulta passado como parâmetro na URL é válido" });
  }
  
  if (consulta.finalizada) {
    return res.status(400).json({ mensagem: 'Não é possível atualizar os dados porque a consulta já foi finalizada.' });
  }
  
  const indice = procurandoIndiceDaConta(bancoDeDados.consultas, numeroDaConta);
  
  bancoDeDados.consultas.splice(indice, 1);
  
  const verificar = checkBody(res, bancoDeDados, pacienteAtualizar);
  
  if (verificar) {
    bancoDeDados.consultas.splice(indice, 0, consulta);
    return verificar;
  }
  
  consulta = {
    identificador: consulta.identificador,
    tipoConsulta: consulta.tipoConsulta,
    identificadorMedico: consulta.identificadorMedico,
    finalizada: consulta.finalizada,
    valorConsulta: consulta.valorConsulta,
    paciente: { ...pacienteAtualizar }
  };
  
  bancoDeDados.consultas.splice(indice, 0, consulta);
  
  return res.status(204).json();
};

const deletarConsulta = (req, res) => {
  const numeroDaConta = Number(req.params.identificadorConsulta);
  const todasConsultas = juntarConsultas(bancoDeDados);
  
  const consulta = procurarConta(todasConsultas, numeroDaConta);
  
  if (!consulta) {
    return res.status(404).json({ mensagem: "Conta não encontrada. Identificador da consulta passado como parâmetro na URL é válido" });
  }
  
  if (consulta.finalizada) {
    return res.status(400).json({ mensagem: 'Não é possível cancelar porque a consulta já foi finalizada.' });
  }
  
  const indiceDaConsulta = procurandoIndiceDaConta(bancoDeDados.consultas, numeroDaConta);
  
  bancoDeDados.consultas.splice(indiceDaConsulta, 1);
  
  return res.status(204).json();
};
const finalizarConsulta = (req, res) => {
    const { identificadorConsulta, textoMedico } = req.body;
  
    if (!identificadorConsulta || !textoMedico) {
      return res.status(400).json({ mensagem: 'Verificar se foram passados todos os campos no body da requisição' });
    }
  
    const todasConsultas = juntarConsultas(bancoDeDados);
    const consulta = procurarConta(todasConsultas, identificadorConsulta);
  
    if (!consulta) {
      return res.status(404).json({ mensagem: 'Consulta não encontrada' });
    }
  
    if (consulta.status === 'Finalizada') {
      return res.status(400).json({ mensagem: 'Consulta já foi finalizada' });
    }
  
    consulta.status = 'Finalizada';
    consulta.textoMedico = textoMedico;
  
    const indiceConsulta = procurandoIndiceDaConta(todasConsultas, identificadorConsulta);
    todasConsultas[indiceConsulta] = consulta;
  
    return res.status(200).json({ mensagem: 'Consulta finalizada com sucesso' });
  };
  const laudo = (req, res) => {
    const identificadorConsulta = Number(req.query.identificador_consulta);
    const senha = Number(req.query.senha);
    const todasConsultas = juntarConsultas(bancoDeDados);
    if (!identificadorConsulta || !senha) {
      return res.status(400).json({ mensagem: 'Verificar se foram passados todos os campos no body da requisição' });
    }
  
    const consulta = procurarConta(todasConsultas, identificadorConsulta);
    if (!consulta) {
      return res.status(404).json({ mensagem: 'Consulta não encontrada' });
    }
    if (consulta.status !== 'Finalizada') {
      return res.status(400).json({ mensagem: 'Apenas consultas finalizadas podem ter laudo' });
    }
    consulta.textoLaudo = textoLaudo;
    const indiceConsulta = procurandoIndiceDaConta(todasConsultas, identificadorConsulta);
    todasConsultas[indiceConsulta] = consulta;
    return res.status(200).json({ mensagem: 'Laudo adicionado com sucesso' });
  };
  
  const medico = (req, res) => {
    const { identificadorMedico } = req.params;
  
    const todasConsultas = juntarConsultas(bancoDeDados);
    const consultasMedico = todasConsultas.filter(consulta => consulta.identificadorMedico === identificadorMedico);
  
    return res.status(200).json(consultasMedico);
  };


  module.exports = {
    listarConsultas,
    criarConsulta,
    atualizarConsulta,
    deletarConsulta,
    finalizarConsulta,
    laudo,
    medico
};
