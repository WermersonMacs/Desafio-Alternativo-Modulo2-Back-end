const express = require('express');
const { listarConsultas, criarConsulta, atualizarConsulta, deletarConsulta, finalizarConsulta, laudo, medico } = require('./controles/controladores')
const rota = express();

rota.get('/consultas', listarConsultas);
rota.post('/consulta', criarConsulta);
rota.put('/consulta/:identificadorConsulta/paciente', atualizarConsulta);
rota.delete('/consulta/:identificadorConsulta', deletarConsulta);
rota.post('/consulta/finalizar', finalizarConsulta);
rota.get('/consulta/laudo', laudo);
rota.get('/consultas/medico', medico);

module.exports = rota;
