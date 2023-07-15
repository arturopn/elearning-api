const CategoryController = require('../controllers/CategoryController');
const Category = require('../models/Category');

// Mock the response object
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('CategoryController', () => {
  describe('createCategory', () => {
    it('should create a new category', async () => {
      const req = {
        body: {
          name: 'Test Category',
          coverImage: '/path/to/image.jpg',
        },
      };
      const res = mockResponse();

      await CategoryController.createCategory(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.any(Object));

      // Optionally, you can assert specific properties of the response object
      const createdCategory = res.json.mock.calls[0][0];
      expect(createdCategory.name).toEqual('Test Category');
      expect(createdCategory.coverImage).toEqual('/path/to/image.jpg');
    });

    it('should handle errors and send an error response', async () => {
      const req = {
        body: {
          // Invalid request body to trigger an error
          // ...
        },
      };
      const res = mockResponse();

      await CategoryController.createCategory(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.any(Object));

      // Optionally, you can assert the error message in the response object
      const errorResponse = res.json.mock.calls[0][0];
      expect(errorResponse.error).toBeDefined();
    });
  });

  describe('getCategories', () => {
    it('should get all categories', async () => {
      const req = {};
      const res = mockResponse();

      // Mock the Category.findAll() method to return test data
      Category.findAll = jest.fn().mockResolvedValue([
        { name: 'Category 1', coverImage: '/path/to/image1.jpg' },
        { name: 'Category 2', coverImage: '/path/to/image2.jpg' },
      ]);

      await CategoryController.getCategories(req, res);

      expect(res.json).toHaveBeenCalledWith([
        { name: 'Category 1', coverImage: '/path/to/image1.jpg' },
        { name: 'Category 2', coverImage: '/path/to/image2.jpg' },
      ]);
    });

    it('should handle errors and send an error response', async () => {
      const req = {};
      const res = mockResponse();

      // Mock the Category.findAll() method to throw an error
      Category.findAll = jest.fn().mockRejectedValue(new Error('Database error'));

      await CategoryController.getCategories(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.any(Object));

      // Optionally, you can assert the error message in the response object
      const errorResponse = res.json.mock.calls[0][0];
      expect(errorResponse.error).toBeDefined();
    });
  });
});
