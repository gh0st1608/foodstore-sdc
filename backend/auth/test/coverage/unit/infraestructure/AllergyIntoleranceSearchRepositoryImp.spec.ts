import { AllergyIntoleranceSearchRepositoryImp } from '../../../../src/allergyIntolerance/infrastructure/repository/AllergyIntoleranceSearchRepositoryImp';
import { AuthGoogleClient } from '../../../../src/common/infrastructure/google/AuthGoogleClient';
import { Blob } from 'buffer';
import { GaxiosError } from 'gaxios';
import { AllergyIntolerance, Bundle, OperationOutcome } from 'fhir/r4';

jest.mock('../../../../src/common/infrastructure/google/AuthGoogleClient');

describe('AllergyIntoleranceSearchRepositoryImp', () => {
  let repository: AllergyIntoleranceSearchRepositoryImp;

  beforeEach(() => {
    repository = new AllergyIntoleranceSearchRepositoryImp();
    jest.clearAllMocks();
  });

  it('✅ debe retornar FhirQueryResult<AllergyIntolerance> cuando hay datos', async () => {
    const fakeAllergy: AllergyIntolerance = {
      resourceType: 'AllergyIntolerance',
      id: 'test-allergy-id',
      category: ['food'],
    } as AllergyIntolerance;

    const fakeBundle: Bundle = {
      resourceType: 'Bundle',
      type: 'searchset',
      total: 1,
      entry: [{ resource: fakeAllergy }],
    };

    const mockClient = {
      request: jest.fn().mockResolvedValue({
        data: {
          text: () => Promise.resolve(JSON.stringify(fakeBundle)),
        },
      }),
    };

    (AuthGoogleClient.getInstance as jest.Mock).mockResolvedValue(mockClient);

    const result = await repository.execute({ category: 'food' });

    expect(result.data).toEqual([fakeAllergy]);
    expect(result.token).toBeNull();
  });

  it('🛑 debe lanzar HttpException si no se encuentra data', async () => {
    const emptyBundle: Bundle = {
      resourceType: 'Bundle',
      type: 'searchset',
      total: 0,
      entry: [],
    };

    const mockClient = {
      request: jest.fn().mockResolvedValue({
        data: {
          text: () => Promise.resolve(JSON.stringify(emptyBundle)),
        },
      }),
    };

    (AuthGoogleClient.getInstance as jest.Mock).mockResolvedValue(mockClient);

    try {
      await repository.execute({ category: 'medication' });
      fail('Debe lanzar HttpException, pero no lo hizo');
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
      expect(e.message).toBe(
        'El recurso Allergy Intolerance de FHIR no tiene datos válidos.',
      );
    }
  });

  it('🔒 debe lanzar Error si falla la autenticación', async () => {
    (AuthGoogleClient.getInstance as jest.Mock).mockResolvedValue(null);

    try {
      await repository.execute({ category: 'food' });
      fail('Debe lanzar Error, pero no lo hizo');
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
      expect(e.message).toBe(
        'No se pudo obtener el cliente autenticado con Google.',
      );
    }
  });

  it('⚠️ debe lanzar HttpException si algún recurso tiene tipo inválido', async () => {
    const badBundle: Bundle<object> = {
      resourceType: 'Bundle',
      type: 'searchset',
      total: 1,
      entry: [
        {
          resource: {
            resourceType: 'Observation', // inválido para esta búsqueda
            id: 'wrong-id',
          },
        },
      ],
    };

    const mockClient = {
      request: jest.fn().mockResolvedValue({
        data: {
          text: () => Promise.resolve(JSON.stringify(badBundle)),
        },
      }),
    };

    (AuthGoogleClient.getInstance as jest.Mock).mockResolvedValue(mockClient);

    try {
      await repository.execute({ category: 'food' });
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
      expect(e.message).toContain(
        'Uno de los recursos no es de tipo AllergyIntolerance.',
      );
    }
  });

  it('🚨 debe manejar un GaxiosError con estructura FHIR', async () => {
    const operationOutcome: OperationOutcome = {
      resourceType: 'OperationOutcome',
      issue: [
        {
          severity: 'error',
          code: 'invalid',
          diagnostics: 'Invalid parameter value',
          details: { text: 'El parámetro "category" no es válido' },
          expression: ['AllergyIntolerance.category'],
        },
      ],
    };

    const blob = new Blob([JSON.stringify(operationOutcome)], {
      type: 'application/fhir+json',
    });

    const gaxiosError = new GaxiosError('Simulated Gaxios Error', {
      url: 'https://fake-url.com',
      method: 'GET',
    });

    gaxiosError.response = {
      status: 400,
      statusText: 'Bad Request',
      headers: { 'content-type': 'application/fhir+json' },
      config: {},
      data: blob,
      request: {
        responseURL: 'https://fake-url.com', // ✅ Propiedad requerida
      },
    };

    const mockClient = {
      request: jest.fn().mockRejectedValue(gaxiosError),
    };

    (AuthGoogleClient.getInstance as jest.Mock).mockResolvedValue(mockClient);

    try {
      await repository.execute({ category: 'invalid-value' });
      fail('Debe lanzar HttpException, pero no lo hizo');
    } catch (e: any) {
      expect(e).toBeInstanceOf(GaxiosError);
      expect(e.response?.status).toBe(400);

      const text = await e.response?.data.text();
      const parsed = JSON.parse(text);

      expect(parsed.resourceType).toBe('OperationOutcome');
      expect(parsed.issue?.[0]?.expression?.[0]).toBe(
        'AllergyIntolerance.category',
      );
    }
  });
});
