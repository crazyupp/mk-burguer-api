import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as Yup from 'yup';
import autoConfig from './../../config/auth.js';
import User from '../models/User.js';

class SessionController {
  async store(request, response) {
    const schema = Yup.object({
      email: Yup.string().email().required(),
      password: Yup.string().min(6).required(),
    });

    const isValid = await schema.isValid(request.body, {
      abortEarly: false,
      strict: true,
    });

    const emailOrPasseordIncorrect = () => {
      return response
        .status(400)
        .json({ error: 'Email or password incorrect !' });
    };
    if (!isValid) {
      emailOrPasseordIncorrect();
    }
    const { email, password } = request.body;
    //Tratando caso de quando usuario busca cadastrar com o mesmo e-mail
    const existingUser = await User.findOne({
      where: {
        email,
      },
    });
    //validacao para ver se o usuário existe
    if (!existingUser) {
      emailOrPasseordIncorrect();
    }
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password_hash,
    );
    if (!isPasswordCorrect) {
      emailOrPasseordIncorrect();
    }

    // ---------------------------------------------------------
    // Backend CrazyUp - Geração do Token JWT com Novo Secret
    // ---------------------------------------------------------
    const token = jwt.sign(
      {
        id: existingUser.id,
        admin: existingUser.admin,
        name: existingUser.name,
      }, // Payload com os dados do utilizador
      autoConfig.secret, // O nosso novo Secret MD5 exclusivo da API
      { expiresIn: autoConfig.expiresIn }, // Tempo de validade do token
    );

    return response.status(200).json({
      id: existingUser.id,
      name: existingUser.name,
      email: existingUser.email,
      admin: existingUser.admin,
      token,
    });
  }
}
export default new SessionController();
