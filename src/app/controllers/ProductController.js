import * as Yup from 'yup';
import Category from './../models/Category.js';
import Product from './../models/Product.js';

class ProductController {
  async store(request, response) {
    const schema = Yup.object({
      name: Yup.string().required(),
      price: Yup.number().required(),
      category_id: Yup.number().required(), // Recomendado mudar para number
      offer: Yup.boolean(),
    });

    // 1. TRY/CATCH da Validação dos dados (Yup)
    try {
      // Como estamos recebendo FormData, é mais seguro usar validação assíncrona
      await schema.validate(request.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({ error: err.errors });
    }

    // 2. TRY/CATCH do Banco de Dados (Sequelize)
    try {
      const { name, price, category_id, offer } = request.body;
      const { filename } = request.file;

      const newProduct = await Product.create({
        name,
        price,
        category_id,
        path: filename,
        offer,
      });

      return response.status(201).json(newProduct);
    } catch (err) {
      // AQUI ESTÁ O SEGREDO: Vamos imprimir o erro exato do PostgreSQL
      console.log('🔥 ERRO EXATO DO BANCO DE DADOS:', err.message);

      // Retornamos o erro no Insomnia para você não precisar ficar caçando no terminal
      return response.status(500).json({
        error: 'Falha ao salvar no banco de dados',
        motivo: err.message,
      });
    }
  }

  async update(request, response) {
    const schema = Yup.object({
      name: Yup.string(),
      price: Yup.number(),
      category_id: Yup.number(), // Recomendado mudar para number
      offer: Yup.boolean(),
    });

    // 1. TRY/CATCH da Validação dos dados (Yup)
    try {
      // Como estamos recebendo FormData, é mais seguro usar validação assíncrona
      await schema.validate(request.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({ error: err.errors });
    }

    // 2. TRY/CATCH do Banco de Dados (Sequelize)
    try {
      const { name, price, category_id, offer } = request.body;
      const { id } = request.params;

      let path;
      if (request.file) {
        const { filename } = request.file;
        path = filename;
      }

      await Product.update(
        {
          name,
          price,
          category_id,
          path,
          offer,
        },
        {
          where: {
            id,
          },
        },
      );

      return response.status(201).json();
    } catch (err) {
      // AQUI ESTÁ O SEGREDO: Vamos imprimir o erro exato do PostgreSQL
      console.log('🔥 ERRO EXATO DO BANCO DE DADOS:', err.message);

      // Retornamos o erro no Insomnia para você não precisar ficar caçando no terminal
      return response.status(500).json({
        error: 'Falha ao salvar no banco de dados',
        motivo: err.message,
      });
    }
  }

  async index(_request, response) {
    const products = await Product.findAll({
      include: {
        model: Category,
        as: 'category',
        attributes: ['id', 'name'],
      },
    });

    return response.status(200).json(products);
  }
}

export default new ProductController();
