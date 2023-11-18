// VARIÁVEIS E SELEÇÃO DE ELEMENTOS:
/**
 * Chave da API utilizada para acessar serviços relacionados a bandeiras de países.
 * @type {string}
 */
const chaveApi = "aa7200e4615d31b9498da5897f85680f";

const apiUnsplash = "https://source.unsplash.com/1600x900/?";


/**
 * Representa um campo de entrada de cidade na página.
 * @type {HTMLInputElement}
 */
const entradaCidade = document.querySelector("#city-input");

/**
 * Representa um botão de pesquisa na página.
 * @type {HTMLButtonElement}
 */
const pesquisaBtn = document.querySelector("#search");


/**
 * Representa o elemento HTML associado à cidade.
 * @type {HTMLElement}
 */
const elementoCidade = document.querySelector("#city");

/**
 * Representa o elemento HTML associado à temperatura.
 * @type {HTMLElement}
 */
const tempElemento = document.querySelector("#temperature span");

/**
 * Representa o elemento HTML associado à descrição do clima.
 * @type {HTMLElement}
 */
const descElemento = document.querySelector("#description");

/**
 * Representa o elemento HTML associado ao ícone do clima.
 * @type {HTMLElement}
 */
const climaIconeElemento = document.querySelector("#weather-icon");


/**
 * Representa o elemento HTML associado à umidade.
 * @type {HTMLElement}
 */
const umidadeElemento = document.querySelector("#umidity span");

/**
 * Representa o elemento HTML associado ao vento.
 * @type {HTMLElement}
 */
const ventoElemento = document.querySelector("#wind span");


/**
 * Representa o contêiner HTML que armazena dados relacionados ao clima.
 * @type {HTMLElement}
 */
const containerClima = document.querySelector("#weather-data");

const erroMensagemContainer = document.querySelector("#error-message");
const carregador = document.querySelector("#loader");

const sugestaoContainer = document.querySelector("#suggestions");
const sugestaoBotao = document.querySelectorAll("#suggestions button");

/**
 * Alterna a visibilidade do carregador (loader) adicionando ou removendo a classe "hide".
 * @function
 * @returns {void}
 */
const alternarCarregador = () => {
  loader.classList.toggle("hide");
};



//FUNÇÕES:

/**
 * Obtém dados de clima para uma cidade específica através de uma API de clima.
 *
 * @async
 * @function
 * @param {string} cidade - O nome da cidade para a qual obter dados de clima.
 * @returns {Promise<Object>} Uma promessa que resolve para um objeto contendo dados de clima.
 */
const obterDadosTempo = async (cidade) => {
  // Alterna a visibilidade do carregador antes de fazer a solicitação.
  alternarCarregador();
  
  // Constrói a URL da API de clima com base na cidade fornecida.
  const apiClimaURL = `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&units=metric&appid=${chaveApi}&lang=pt_br`;

  // Faz uma solicitação assíncrona para a API de clima.
  const res = await fetch(apiClimaURL);

  // Aguarda a resposta e a converte para JSON.
  const dados = await res.json();

  // Alterna a visibilidade do carregador novamente após a conclusão da solicitação.
  alternarCarregador();

  // Retorna os dados obtidos.
  return dados;
};


// TRATAMENTO DE ERRO:

/**
 * Exibe a mensagem de erro ocultando a classe "hide" do contêiner de mensagens de erro.
 * @function
 * @returns {void}
 */
const mostrarMensagemErro = () => {
  erroMensagemContainer.classList.remove("hide");
};


/**
 * Oculta as informações, adicionando a classe "hide" a contêineres específicos.
 * @function
 * @returns {void}
 */
const ocultarInformacoes = () => {
  erroMensagemContainer.classList.add("hide");
  containerClima.classList.add("hide");

  sugestaoContainer.classList.add("hide");
};


  /**
 * Mostra dados de clima para uma cidade na interface do usuário.
 * @async
 * @function
 * @param {string} cidade - O nome da cidade para a qual exibir os dados de clima.
 * @returns {Promise<void>} Uma promessa que se resolve quando os dados de clima são exibidos.
 */
const mostrarDadosTempo = async (cidade) => {
  // Oculta informações anteriores antes de exibir novos dados.
  ocultarInformacoes();
  
  // Obtém dados de clima para a cidade fornecida.
  const dados = await obterDadosTempo(cidade);

  // Verifica se ocorreu um erro (código 404) ao obter os dados.
  if (dados.cod === "404") {
    // Exibe uma mensagem de erro e encerra a função.
    mostrarMensagemErro();
    return;
  }

  // Atualiza elementos na interface do usuário com os dados obtidos.
  elementoCidade.innerText = dados.name;
  tempElemento.innerText = parseInt(dados.main.temp);
  descElemento.innerText = dados.weather[0].description;
  climaIconeElemento.setAttribute(
    "src", 
    `http://openweathermap.org/img/wn/${dados.weather[0].icon}.png`
  );
  umidadeElemento.innerText = `${dados.main.humidity}%`;
  ventoElemento.innerText = `${dados.wind.speed}km/h`;

  // Altera a imagem de fundo do corpo do documento.
  document.body.style.backgroundImage = `url("${apiUnsplash + cidade}")`;

  // Torna visíveis os elementos de clima.
  containerClima.classList.remove("hide");
};



//EVENTOS:

/**
 * Manipula o evento de clique no botão de pesquisa.
 * Impede o comportamento padrão de recarregar a página,
 * obtém o valor do campo de entrada da cidade e chama a função para mostrar os dados do tempo.
 *
 * @param {Event} e - O objeto de evento associado ao clique no botão de pesquisa.
 */
pesquisaBtn.addEventListener("click", (e) => {
    // Impede o comportamento padrão do clique no botão dentro de um formulário.
    e.preventDefault();

    // Obtém o valor do campo de entrada da cidade.
    const cidade = entradaCidade.value;

    // Chama a função para mostrar os dados do tempo para a cidade fornecida.
    mostrarDadosTempo(cidade);
});

/**
 * Adiciona um ouvinte de evento ao campo de entrada da cidade para lidar com a tecla "Enter".
 *
 * @param {KeyboardEvent} e - O objeto de evento associado à tecla pressionada.
 */
entradaCidade.addEventListener("keyup", (e) => {
    // Verifica se a tecla pressionada é a tecla "Enter".
    if (e.code === "Enter") {
        // Obtém o valor do campo de entrada da cidade.
        const cidade = e.target.value;

        // Chama a função para mostrar os dados de clima para a cidade fornecida.
        mostrarDadosTempo(cidade);
    }
});

//SUGESTÃO:

/**
 * Adiciona um ouvinte de evento de clique a cada botão de sugestão.
 *
 * @param {HTMLElement} btn - O botão ao qual o ouvinte de evento está sendo adicionado.
 */
sugestaoBotao.forEach((btn) => {
  btn.addEventListener("click", () => {
    // Obtém o nome da cidade associado ao botão clicado.
    const cidade = btn.getAttribute("id");

    // Chama a função para mostrar os dados de clima para a cidade fornecida.
    mostrarDadosTempo(cidade);
  });
});


