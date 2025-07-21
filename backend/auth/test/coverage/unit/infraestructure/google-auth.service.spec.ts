import { AuthGoogleClient } from '../../../../src/common/infrastructure/google/AuthGoogleClient';

// Mock de GoogleAuth
jest.mock('google-auth-library', () => ({
  GoogleAuth: jest.fn().mockImplementation(() => ({
    getClient: jest.fn().mockResolvedValue('mocked-google-auth-client'),
  })),
}));

// Mock de Firestore
jest.mock('@google-cloud/firestore', () => ({
  Firestore: jest.fn().mockImplementation((config) => ({
    config,
    dummy: true, // propiedad mock para verificar la instancia
  })),
}));

describe('AuthGoogleClient', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.FIREBASE_PROJECT_ID = 'mock-project';
    process.env.FIRESTORE_BD_CONFIGURATION = 'config-db';
    process.env.FIRESTORE_BD_TRACKING = 'tracking-db';

    (AuthGoogleClient as any).instance = undefined;
  });

  

  it('debería retornar el cliente de Google Auth (getInstance)', async () => {
    const client = await AuthGoogleClient.getInstance();
    expect(client).toBe('mocked-google-auth-client');
  });

  it('debería convertir una respuesta FHIR a JSON', async () => {
    const fakeResponse = {
      data: {
        text: async () => '{"foo":"bar"}',
      },
    };

    const result = await AuthGoogleClient.convertFhirToJson(fakeResponse);
    expect(result).toEqual({ foo: 'bar' });
  });

  it('debería retornar instancia Firestore de configuración', async () => {
    const firestore =
      (await AuthGoogleClient.getFirestoreInstanceConfiguration()) as any;
    expect(firestore.dummy).toBe(true);
    expect(firestore.config.databaseId).toBe('config-db');
  });

  it('debería retornar instancia Firestore de tracking', async () => {
    const firestore =
      (await AuthGoogleClient.getFirestoreInstanceTracking()) as any;
    expect(firestore.dummy).toBe(true);
    expect(firestore.config.databaseId).toBe('tracking-db');
  });
});
