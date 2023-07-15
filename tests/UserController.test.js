const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const UserController = require('../controllers/UserController');

// Mock dependencies
jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('../models/User');

describe('UserController', () => {
  describe('registerUser', () => {
    it('should register a new user', async () => {
      const req = {
        body: {
          username: 'testuser',
          email: 'test@example.com',
          password: 'password',
          role: 'user',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue(req.body);
      bcrypt.hash.mockResolvedValue('hashedPassword');

      await UserController.registerUser(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ where: { username: req.body.username } });
      expect(User.create).toHaveBeenCalledWith({
        username: req.body.username,
        email: req.body.email,
        password: 'hashedPassword',
        role: req.body.role,
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(req.body);
    });

    it('should return an error if username already exists', async () => {
      const req = {
        body: {
          username: 'testuser',
          email: 'test@example.com',
          password: 'password',
          role: 'user',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      User.findOne.mockResolvedValue({});

      await UserController.registerUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Username already exists' });
    });

    it('should return an error if email already exists', async () => {
      const req = {
        body: {
          username: 'testuser',
          email: 'test@example.com',
          password: 'password',
          role: 'user',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      User.findOne.mockResolvedValueOnce(null);
      User.findOne.mockResolvedValue({});

      await UserController.registerUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Email already exists' });
    });

    it('should return an error if an exception occurs', async () => {
      const req = {
        body: {
          username: 'testuser',
          email: 'test@example.com',
          password: 'password',
          role: 'user',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      User.findOne.mockRejectedValue(new Error('Database error'));

      await UserController.registerUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Database error' });
    });
  });

  describe('loginUser', () => {
    it('should login a user with valid credentials', async () => {
      const req = {
        body: {
          username: 'testuser',
          password: 'password',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const user = { id: 1, username: 'testuser', password: 'hashedPassword', role: 'user' };
      User.findOne.mockResolvedValue(user);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('token');

      await UserController.loginUser(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ where: { username: req.body.username } });
      expect(bcrypt.compare).toHaveBeenCalledWith(req.body.password, user.password);
      expect(jwt.sign).toHaveBeenCalledWith(
        { userId: user.id, username: user.username, role: user.role },
        'your_secret_key'
      );
      expect(res.json).toHaveBeenCalledWith({ token: 'token' });
    });

    it('should return an error if user does not exist', async () => {
      const req = {
        body: {
          username: 'testuser',
          password: 'password',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      User.findOne.mockResolvedValue(null);

      await UserController.loginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    });

    it('should return an error if password is invalid', async () => {
      const req = {
        body: {
          username: 'testuser',
          password: 'password',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const user = { id: 1, username: 'testuser', password: 'hashedPassword', role: 'user' };
      User.findOne.mockResolvedValue(user);
      bcrypt.compare.mockResolvedValue(false);

      await UserController.loginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid password' });
    });

    it('should return an error if an exception occurs', async () => {
      const req = {
        body: {
          username: 'testuser',
          password: 'password',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      User.findOne.mockRejectedValue(new Error('Database error'));

      await UserController.loginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Database error' });
    });
  });
});
