const ContentController = require('../controllers/ContentController');
const Content = require('../models/Content');
const Theme = require('../models/Theme');

// Mock the response object
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('ContentController', () => {
  describe('createContent', () => {
    it('should create a new content', async () => {
      const req = {
        body: {
          type: 'image',
          themeId: '123456',
          userId: '789',
          credits: 10,
        },
        file: {
          path: '/path/to/image.jpg',
        },
      };
      const res = mockResponse();

      // Mock the Theme.findByPk() method to return a theme
      Theme.findByPk = jest.fn().mockResolvedValue({
        allowImages: true,
        allowVideos: false,
        allowTexts: true,
      });

      await ContentController.createContent(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.any(Object));

      // Optionally, you can assert specific properties of the response object
      const createdContent = res.json.mock.calls[0][0];
      expect(createdContent.type).toEqual('image');
      expect(createdContent.themeId).toEqual('123456');
      expect(createdContent.userId).toEqual('789');
      expect(createdContent.credits).toEqual(10);
      expect(createdContent.filePath).toEqual('/path/to/image.jpg');
    });

    it('should handle errors and send an error response', async () => {
      const req = {
        body: {
          // Invalid request body to trigger an error
          // ...
        },
      };
      const res = mockResponse();

      await ContentController.createContent(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.any(Object));

      // Optionally, you can assert the error message in the response object
      const errorResponse = res.json.mock.calls[0][0];
      expect(errorResponse.error).toBeDefined();
    });
  });

  describe('getContents', () => {
    it('should get all contents', async () => {
      const req = {};
      const res = mockResponse();

      // Mock the Content.findAll() method to return test data
      Content.findAll = jest.fn().mockResolvedValue([
        { type: 'image', themeId: '123', userId: '456', credits: 10 },
        { type: 'video', themeId: '789', userId: '012', credits: 5 },
      ]);

      await ContentController.getContents(req, res);

      expect(res.json).toHaveBeenCalledWith([
        { type: 'image', themeId: '123', userId: '456', credits: 10 },
        { type: 'video', themeId: '789', userId: '012', credits: 5 },
      ]);
    });

    it('should handle errors and send an error response', async () => {
      const req = {};
      const res = mockResponse();

      // Mock the Content.findAll() method to throw an error
      Content.findAll = jest.fn().mockRejectedValue(new Error('Database error'));

      await ContentController.getContents(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.any(Object));

      // Optionally, you can assert the error message in the response object
      const errorResponse = res.json.mock.calls[0][0];
      expect(errorResponse.error).toBeDefined();
    });
  });
});
