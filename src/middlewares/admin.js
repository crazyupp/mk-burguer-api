const adminMiddelware = (request, response, next) => {
  // Pega o token de autorização que o usuário envia dentro do cabeçalho (header) da requisição.
  const isUserAdmin = request.userIsAdmin;

  if (!isUserAdmin) {
    return response.status(401).json();
  }
  return next();
};

// Exporta o middleware para que ele possa ser importado e usado em outros arquivos (como o arquivo de rotas).
export default adminMiddelware;
