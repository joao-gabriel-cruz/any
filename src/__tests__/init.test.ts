import * as fs from 'fs';
import * as path from 'path';
import { Project } from 'ts-morph';
import { initStore } from '../use-cases/init';

// Mock dos módulos
jest.mock('fs');
jest.mock('path');
jest.mock('ts-morph');
jest.mock('figlet');

describe('Init Module', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (path.join as jest.Mock).mockImplementation((...args) => args.join('/'));
  });

  it('should initialize the store with all necessary files and directories', async () => {
    // Mock das funções do fs
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockReturnValue('{}');
    (fs.writeFileSync as jest.Mock).mockImplementation(() => {});

    // Mock do Project
    const mockProject = {
      createDirectory: jest.fn(),
      createSourceFile: jest.fn().mockReturnValue({
        save: jest.fn()
      }),
      save: jest.fn()
    };
    (Project as jest.Mock).mockImplementation(() => mockProject);

    await initStore();

    // Verifica se o tsconfig.json foi atualizado
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      'tsconfig.json',
      expect.stringContaining('"@/*": ["src/*"]')
    );

    // Verifica se os diretórios foram criados
    expect(mockProject.createDirectory).toHaveBeenCalledWith('src/redux-store/hooks');
    expect(mockProject.createDirectory).toHaveBeenCalledWith('src/@types/redux');
    expect(mockProject.createDirectory).toHaveBeenCalledWith('src/utils/redux');

    // Verifica se os arquivos foram criados
    expect(mockProject.createSourceFile).toHaveBeenCalledWith(
      'src/utils/redux/index.ts',
      expect.any(Object),
      { overwrite: true }
    );
    expect(mockProject.createSourceFile).toHaveBeenCalledWith(
      'src/@types/redux/index.d.ts',
      expect.any(Object),
      { overwrite: true }
    );
    expect(mockProject.createSourceFile).toHaveBeenCalledWith(
      'src/redux-store/store.ts',
      expect.any(Object),
      { overwrite: true }
    );
    expect(mockProject.createSourceFile).toHaveBeenCalledWith(
      'src/redux-store/root-reducer.ts',
      expect.any(Object),
      { overwrite: true }
    );
    expect(mockProject.createSourceFile).toHaveBeenCalledWith(
      'src/redux-store/hooks/index.ts',
      expect.any(Object),
      { overwrite: true }
    );

    // Verifica se o projeto foi salvo
    expect(mockProject.save).toHaveBeenCalled();
  });

  it('should handle existing tsconfig.json correctly', async () => {
    const existingConfig = {
      compilerOptions: {
        target: "es5",
        lib: ["dom", "dom.iterable", "esnext"],
        allowJs: true,
        skipLibCheck: true,
        strict: true,
        forceConsistentCasingInFileNames: true,
        noEmit: true,
        esModuleInterop: true,
        module: "esnext",
        moduleResolution: "node",
        resolveJsonModule: true,
        isolatedModules: true,
        jsx: "preserve",
        incremental: true
      }
    };

    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(existingConfig));
    (fs.writeFileSync as jest.Mock).mockImplementation(() => {});

    const mockProject = {
      createDirectory: jest.fn(),
      createSourceFile: jest.fn().mockReturnValue({
        save: jest.fn()
      }),
      save: jest.fn()
    };
    (Project as jest.Mock).mockImplementation(() => mockProject);

    await initStore();

    // Verifica se o tsconfig.json foi atualizado mantendo as configurações existentes
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      'tsconfig.json',
      expect.stringContaining('"target": "es5"')
    );
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      'tsconfig.json',
      expect.stringContaining('"@/*": ["src/*"]')
    );
  });
}); 