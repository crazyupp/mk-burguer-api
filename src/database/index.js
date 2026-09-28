import { Sequelize } from 'sequelize';
import Category from '../app/models/category.js';
import Product from '../app/models/Product.js';
import User from '../app/models/User.js';
import databaseConfig from '../config/database.cjs';

const models = [User, Product, Category];

class Database {
  constructor() {
    this.init();
  }

  // // Inicialização do banco de dados e vinculação dos modelos do Sequelize

  init() {
    // Define o método 'init' encarregado de rodar a inicialização da base de dados.
    this.connection = new Sequelize(databaseConfig); // Cria a conexão com o banco de dados passando as configurações do arquivo de config.
    models // Acessa o array contendo todos os modelos da aplicação (ex: User, Product, etc.).
      .map((model) => model.init(this.connection)) // Executa o método '.init()' de cada modelo, passando a conexão criada.
      .map(
        // Mapeia novamente os modelos para configurar os relacionamentos.
        (model) => model.associate && model.associate(this.connection.models), // Se o método '.associate' existir no modelo, chama ele passando todos os modelos carregados.
      ); // Finaliza o encadeamento dos métodos.
  } // Fecha o bloco do método 'init'.
}
export default new Database();
