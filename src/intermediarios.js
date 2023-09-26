const bancoDeDados = require('./bancodedados');

const validarSenha = (req,res,next)=>{
const{cnes_consultorio, senha_consultorio} = req.query;

if (!cnes_consultorio || !senha_consultorio){
    return res.status(400).json({mensagem: ' CNES e senha são obrigatórios!'});
}
if (
    cnes_consultorio !== bancoDeDados.consultorio.cnes ||senha_consultorio !== bancoDeDados.consultorio.senha
  ) {
    return res.status(401).json({ mensagem: 'CNES ou senha inválidos!' });
  }
next();
}
const validarConsulta = (req,res,next)=>{
    const {tipoConsulta,valorConsulta,paciente}=req.body;
    if (!tipoConsulta || !valorConsulta || !paciente){
        return res.status(400).json({mensagem:'Todos os campos são obrigatórios!'})
    }
    if(typeof valorConsulta!=='number'){
        return res.status(400).json({mensagem:'O valor da consulta deve ser numérico!'})
    }
    next()
} 
const verificarConsulta = (req,res,next)=>{
    const {cpf,email} = req.body.paciente;
    const verificador = bancoDeDados.consultas.find(consulta =>(consulta.paciente.cpf === cpf || consulta.paciente.email === email)&& !consulta.finalizada);
    if(verificador){
        return res.status(400).json({mensagem:'Já Existe uma consulta em andamento com o CPF ou e-mail informado'})
    }
    next()
}



module.exports = {
    validarSenha,
    validarConsulta,
    verificarConsulta,

}