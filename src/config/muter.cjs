const multer = require('multer');
const { resolve } = require('node:path');
const { v4 } = require('uuid');

module.exports = {
  // 1. diskStorage configura o Multer para salvar o arquivo fisicamente no disco/HD do servidor
  storage: multer.diskStorage({
    // 2. destination: Usa a função "resolve" para navegar pelas pastas de forma segura e apontar para a pasta "uploads"
    destination: resolve(__dirname, '..', '..', 'uploads'),

    // 3. filename: Regra para dar nome ao arquivo salvo
    filename: (_request, file, callback) => {
      // IMPORTANTE: Gera uma hash única (UUID v4) e concatena (junta) com o nome original do arquivo.
      // Exemplo: 123e4567-e89b-12d3-a456-426614174000-foto.jpg
      // Isso impede que um novo upload substitua acidentalmente um arquivo antigo com o mesmo nome
      const uniqueName = v4().concat(`-${file.originalname}`);

      // Conclui repassando nenhum erro (null) e o nome exclusivo que foi gerado
      return callback(null, uniqueName);
    },
  }),
};
