import * as fs from 'fs';
import { Project } from 'ts-morph';
import { createFeature, createCombine, createCombineAndFeature } from '../use-cases/feature';

// Mock dos módulos
jest.mock('fs');
jest.mock('ts-morph');

describe('Feature Module', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createFeature', () => {
    it('should create a new feature with all necessary files and directories', () => {
      const featureName = 'testFeature';
      (fs.existsSync as jest.Mock).mockReturnValue(false);
      (fs.mkdirSync as jest.Mock).mockImplementation(() => {});
      (fs.writeFileSync as jest.Mock).mockImplementation(() => {});

      createFeature(featureName);

      // Verifica se os diretórios foram criados
      expect(fs.mkdirSync).toHaveBeenCalledWith(`src/redux-store/features/${featureName}/use-cases`, { recursive: true });
      expect(fs.mkdirSync).toHaveBeenCalledWith(`src/redux-store/features/${featureName}/reducer`, { recursive: true });
      expect(fs.mkdirSync).toHaveBeenCalledWith(`src/redux-store/features/${featureName}`, { recursive: true });

      // Verifica se os arquivos foram criados
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        `src/redux-store/features/${featureName}/${featureName}.slice.ts`,
        expect.any(String)
      );
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        `src/redux-store/features/${featureName}/${featureName}.module.ts`,
        expect.any(String)
      );
    });

    it('should not create feature if it already exists', () => {
      const featureName = 'existingFeature';
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      const consoleSpy = jest.spyOn(console, 'error');

      createFeature(featureName);

      expect(consoleSpy).toHaveBeenCalledWith(`Feature ${featureName} already exists`);
      expect(fs.mkdirSync).not.toHaveBeenCalled();
    });
  });

  describe('createCombine', () => {
    it('should create a new combine with all necessary files', () => {
      const combineName = 'testCombine';
      (fs.mkdirSync as jest.Mock).mockImplementation(() => {});
      (fs.writeFileSync as jest.Mock).mockImplementation(() => {});

      createCombine(combineName);

      expect(fs.mkdirSync).toHaveBeenCalledWith(`src/redux-store/features/${combineName}`, { recursive: true });
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        `src/redux-store/features/${combineName}/${combineName}.slice.ts`,
        ""
      );
    });
  });

  describe('createCombineAndFeature', () => {
    it('should create both combine and feature when neither exists', () => {
      const featureName = 'testFeature';
      const combineName = 'testCombine';
      (fs.existsSync as jest.Mock).mockImplementation((path) => {
        if (path.includes(combineName)) return false;
        if (path.includes(featureName)) return false;
        return false;
      });
      (fs.mkdirSync as jest.Mock).mockImplementation(() => {});
      (fs.writeFileSync as jest.Mock).mockImplementation(() => {});

      createCombineAndFeature(featureName, combineName);

      // Verifica se o combine foi criado
      expect(fs.mkdirSync).toHaveBeenCalledWith(`src/redux-store/features/${combineName}`, { recursive: true });
      
      // Verifica se a feature foi criada
      expect(fs.mkdirSync).toHaveBeenCalledWith(
        `src/redux-store/features/${combineName}/${featureName}/use-cases`,
        { recursive: true }
      );
    });

    it('should not create feature if it already exists in the combine', () => {
      const featureName = 'existingFeature';
      const combineName = 'testCombine';
      (fs.existsSync as jest.Mock).mockImplementation((path) => {
        if (path.includes(featureName)) return true;
        return false;
      });
      const consoleSpy = jest.spyOn(console, 'error');

      createCombineAndFeature(featureName, combineName);

      expect(consoleSpy).toHaveBeenCalledWith(`Feature ${featureName} already exists in ${combineName}`);
      expect(fs.mkdirSync).not.toHaveBeenCalled();
    });
  });
}); 