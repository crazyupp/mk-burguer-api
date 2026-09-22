import bcrypt from 'bcrypt';
import * as Yup from 'yup';
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

    return response.status(200).json({
      id: existingUser.id,
      name: existingUser.name,
      email: existingUser.email,
      admin: existingUser.admin,
    });
  }
}
export default new SessionController();
