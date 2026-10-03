import jwt from 'jsonwebtoken';
import authConfig from '../../config/auth.js';

const authMiddelware = (request, response, next) => {
  const authToken = request.headers.authorization;
  console.log('NOSSO TOKEN => ', authToken);
  if (!authToken) {
    return response.status(401).json({ error: 'Token not provided' });
  }

  const token = authToken.split(' ')[1];

  try {
    jwt.verify(token, authConfig.secret, (error, decoded) => {
      if (error) {
        throw Error();
      }
      console.log(decoded);
      request.userIsAdmin = decoded.admin;
      request.userName = decoded.name;
    });
  } catch (_error) {
    return response.status(401).json({ error: 'Token  is invalid' });
  }
  return next();
};

export default authMiddelware;
