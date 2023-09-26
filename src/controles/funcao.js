const checkBody = (res, bancodedados, paciente) => {
    if (!paciente.nome.trim() || !paciente.cpf.trim() || !paciente.dataNascimento.trim() || !paciente.celular.trim() || !paciente.email.trim() || !paciente.senha.trim()) {
      return res.status(400).json({ 'mensagem': 'Verificar se foi passado todos os campos no body da requisição' });
    }
  
    const verificarCpf = bancodedados.consultas.every((elemento) => {
      return elemento.paciente.cpf !== paciente.cpf;
    });
  
    if (!verificarCpf) {
      return res.status(400).json({ 'mensagem': 'Já existe uma consulta em andamento com o cpf informado!' });
    }
  
    const verificarEmail = bancodedados.consultas.every((elemento) => {return elemento.paciente.email !== paciente.email});
  
    if (!verificarEmail) {
      return res.status(400).json({ "mensagem": "Já existe uma consulta em andamento com o email informado!" });
    }
  };
  
  const procurandoIndiceDaConta = (bancodedados, numeroDaConta) => {
    const indice = bancodedados.findIndex((indice) => {
      return indice.identificador === numeroDaConta;
    });
  
    return indice;
  };
  
  const procurarConta = (bancodedados, numeroDaConta) => {
    return bancodedados.find((procurarConta) => {
      return procurarConta.identificador === numeroDaConta;
    });
  };
  
  const juntarConsultas = (bancodedados) => {
    const todasConsultas = [...bancodedados.consultas, ...bancodedados.consultasFinalizadas];
    todasConsultas.sort((a, b) => a.identificador - b.identificador);
    return todasConsultas;
  };
  
  module.exports = {
    checkBody,
    procurarConta,
    procurandoIndiceDaConta,
    juntarConsultas
  };