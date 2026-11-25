
const express = require('express');
const app = express();

const apiKey = "00a1812af15a2eafa871fe8071eb4c60";
const cidades = ["São Paulo", "Rio de Janeiro", "Curitiba"];

async function analisarClimaCidades() {
  try {
    // Buscar os dados das cidades usando map()
    const requisicoes = cidades.map(cidade =>
      fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cidade)}&appid=${apiKey}&units=metric&lang=pt_br`)
        .then(resposta => {
          if (!resposta.ok) {
            throw new Error(`Erro na API: ${resposta.status}`);
          }
          return resposta.json();
        })
    );

    const dadosCidades = await Promise.all(requisicoes);

    // 1 - Exibir apenas as temperaturas
    const temperaturas = dadosCidades.map(cidade => cidade.main.temp);

    console.log("\n1 - Apenas as temperaturas:");
    console.log(temperaturas);

    // 2 - Exibir cidades e temperaturas
    const cidadesTemperaturas = dadosCidades.map(cidade => ({
      cidade: cidade.name,
      temperatura: cidade.main.temp
    }));

    console.log("\n2 - Cidades e temperaturas:");
    console.log(cidadesTemperaturas);

    // 3 - Calcular a média das temperaturas usando reduce()
    const somaTemperaturas = temperaturas.reduce(
      (total, temperatura) => total + temperatura, 0
    );

    const media = somaTemperaturas / temperaturas.length;

    console.log("\n3 - Média das temperaturas:");
    console.log(media.toFixed(2) + " °C");

    // 4 - Filtrar temperaturas acima de 26 graus
    const temperaturasAltas = dadosCidades
      .filter(cidade => cidade.main.temp > 26)
      .map(cidade => ({
        cidade: cidade.name,
        temperatura: cidade.main.temp
      }));

    console.log("\n4 - Cidades com temperatura acima de 26°C:");
    console.log(temperaturasAltas);

    return {
      temperaturas,
      cidadesTemperaturas,
      media: Number(media.toFixed(2)),
      temperaturasAltas
    };

  } catch (erro) {
    console.error("Erro ao buscar os dados da API:", erro);
    throw erro;
  }
}

// Rota principal
app.get('/', (req, res) => {
  res.send('Servidor funcionando!');
});

// Rota para executar a análise do clima
app.get('/clima', async (req, res) => {
  try {
    const resultado = await analisarClimaCidades();
    res.json(resultado);
  } catch (erro) {
    res.status(500).json({
      erro: "Não foi possível consultar o clima."
    });
  }
});

app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});
