const ThemeController = require('../controllers/ThemeController');
const Theme = require('../models/Theme');

// Mock the response object
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('ThemeController', () => {
  describe('createTheme', () => {
    it('should create a new theme', async () => {
        const req = {
          body: {
            name: 'Test Theme',
            categoryId: '123456',
            allowImages: true,
            allowVideos: false,
            allowTexts: true,
          },
        };
        const res = mockResponse();
      
        await ThemeController.createTheme(req, res);
      
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(expect.any(Object));
      
        // Optionally, you can assert specific properties of the response object
        const createdTheme = res.json.mock.calls[0][0];
        expect(createdTheme.name).toEqual('Test Theme');
        expect(createdTheme.categoryId).toEqual('123456');
        expect(createdTheme.allowImages).toEqual(true);
        expect(createdTheme.allowVideos).toEqual(false);
        expect(createdTheme.allowTexts).toEqual(true);
      });
      

    it('should handle errors and send an error response', async () => {
      const req = {
        body: {
          // Invalid request body to trigger an error
          // ...
        },
      };
      const res = mockResponse();

      await ThemeController.createTheme(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.any(Object));

      // Optionally, you can assert the error message in the response object
      const errorResponse = res.json.mock.calls[0][0];
      expect(errorResponse.error).toBeDefined();
    });
  });

  describe('getThemes', () => {
    it('should get all themes', async () => {
      const req = {};
      const res = mockResponse();

      // Mock the Theme.findAll() method to return test data
      Theme.findAll = jest.fn().mockResolvedValue([
        { name: 'Theme 1', categoryId: '123' },
        { name: 'Theme 2', categoryId: '456' },
      ]);

      await ThemeController.getThemes(req, res);

      expect(res.json).toHaveBeenCalledWith([
        { name: 'Theme 1', categoryId: '123' },
        { name: 'Theme 2', categoryId: '456' },
      ]);
    });

    it('should handle errors and send an error response', async () => {
      const req = {};
      const res = mockResponse();

      // Mock the Theme.findAll() method to throw an error
      Theme.findAll = jest.fn().mockRejectedValue(new Error('Database error'));

      await ThemeController.getThemes(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.any(Object));

      // Optionally, you can assert the error message in the response object
      const errorResponse = res.json.mock.calls[0][0];
      expect(errorResponse.error).toBeDefined();
    });
  });
});
