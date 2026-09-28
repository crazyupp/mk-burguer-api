// Importa a biblioteca 'jsonwebtoken', que é usada para criar e validar os tokens de autenticação (os "ingressos virtuais").
import jwt from 'jsonwebtoken';

// Importa o nosso arquivo de configurações de autenticação.
// É lá que guardamos a chave secreta (secret) usada para criptografar e descriptografar os tokens.
import authConfig from '../../config/auth.js';

// Cria a função do Middleware, que atuará como um "guarda-costas" antes de acessar rotas protegidas.
// Recebe a requisição (request), a resposta (response) e a função next (para permitir que o código continue a execução).
const authMiddelware = (request, response, next) => {
  // Pega o token de autorização que o usuário envia dentro do cabeçalho (header) da requisição.
  const authToken = request.headers.authorization;

  // Verifica se o token existe. Se o usuário não enviou o token...
  if (!authToken) {
    // ...interrompe a requisição e retorna um erro de status 401 (Não Autorizado) avisando que o token faltou.
    return response.status(401).json({ error: 'Token not provided' });
  }

  // O token geralmente chega no formato "Bearer token_gigante_aqui".
  // O split(' ') divide a string no espaço vazio e o [1] pega apenas a segunda parte (o token real).
  const token = authToken.split(' ')[1];

  // Inicia um bloco try-catch para tentar verificar o token e capturar possíveis erros de forma segura.
  try {
    // A função jwt.verify checa se o token enviado é válido usando a nossa chave secreta (authConfig.secret).
    // O callback retorna dois parâmetros: 'error' (caso dê erro na validação) ou 'decoded' (os dados escondidos dentro do token).
    jwt.verify(token, authConfig.secret, (error, decoded) => {
      //console.log('DECODIFICANDO -> ', decoded);

      if (error) {
        throw Error();
      }
      console.log(decoded);
      request.userIsAdmin = decoded.admin;
      request.userName = decoded.name;
      request.userId = decoded.id;
      // Exibe no terminal as informações decodificadas do token (como o id do usuário, data de criação e validade).
      //console.log('DECODED:', decoded);
    });
  } catch (_error) {
    // Se algo der muito errado no processo de verificação, o erro cai aqui (atualmente o bloco está vazio e não trata o erro).
    return response.status(401).json({ error: 'Token  is invalid' });
  }
  return next();
};

// Exporta o middleware para que ele possa ser importado e usado em outros arquivos (como o arquivo de rotas).
export default authMiddelware;
