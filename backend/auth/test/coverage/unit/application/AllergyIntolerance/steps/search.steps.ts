import { defineFeature, loadFeature } from 'jest-cucumber';
import { AllergyIntoleranceApplication } from '../../../../../../src/allergyIntolerance/application/AllergyIntoleranceApplication';
import { AllergyIntoleranceSearchRepositoryImp } from '../../../../../../src/allergyIntolerance/infrastructure/repository/AllergyIntoleranceSearchRepositoryImp';
import { SearchAllergyIntoleranceRequestDto } from '../../../../../../src/allergyIntolerance/application/dto/request/SearchAllergyIntoleranceRequest.dto';
import { SuccessResponseListCustomDto } from '../../../../../../src/allergyIntolerance/application/dto/response/AllergyIntoleranceListResponse.dto';
import { AllergyIntolerance } from 'fhir/r4';

const feature = loadFeature('./../search.feature', {
  loadRelativePath: true,
  errors: true,
});

defineFeature(feature, (test) => {
  let service: AllergyIntoleranceApplication;
  let mockSearchRepository: jest.Mocked<AllergyIntoleranceSearchRepositoryImp>;
  let result: SuccessResponseListCustomDto;
  let params: SearchAllergyIntoleranceRequestDto;

  beforeEach(() => {
    mockSearchRepository = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<AllergyIntoleranceSearchRepositoryImp>;

    service = new AllergyIntoleranceApplication(
      mockSearchRepository, // searchRepository
      {} as any, // createRepository
      {} as any, // updateRepository
      {} as any, // getRepository
      {} as any, // deleteRepository
    );
  });

  test('Buscar alergias exitosamente', ({ given, and, when, then }) => {
    given('parámetros válidos de búsqueda', () => {
      params = {
        patient: 'Patient/1234',
        category: 'food',
      };
    });

    and('el repositorio retorna resultados de alergias', () => {
      mockSearchRepository.execute.mockResolvedValue({
        data: [
          {
            resourceType: 'AllergyIntolerance',
            id: 'allergy-1',
            patient: { reference: 'Patient/1234' },
            category: ['food'],
          } as AllergyIntolerance,
        ],
        token: 'next-page-token',
      });
    });

    when('se ejecuta getCustom', async () => {
      result = await service.getCustom(params);
    });

    then('se retorna una respuesta con PageToken y resultados', () => {
      expect(result.PageToken).toBe('next-page-token');
      expect(result.AllergyIntolerance.length).toBe(1);
      expect(result.AllergyIntolerance[0].id).toBe('allergy-1');
    });
  });

  test('Buscar alergias sin resultados', ({ given, and, when, then }) => {
    given('parámetros válidos de búsqueda', () => {
      params = {
        patient: 'Patient/1234',
        category: 'food',
      };
    });

    and('el repositorio retorna una lista vacía', () => {
      mockSearchRepository.execute.mockResolvedValue({
        data: [],
        token: null,
      });
    });

    when('se ejecuta getCustom', async () => {
      result = await service.getCustom(params);
    });

    then('se retorna una respuesta con PageToken null y lista vacía', () => {
      expect(result.PageToken).toBeNull();
      expect(result.AllergyIntolerance).toHaveLength(0);
    });
  });

  test('Error al buscar AllergyIntolerance', ({ given, and, when, then }) => {
    let error: any;
  
    given('parámetros válidos de búsqueda', () => {
      params = {
        patient: 'Patient/1234',
        category: 'food',
      };
    });
  
    and('el repositorio lanza un error', () => {
      mockSearchRepository.execute.mockRejectedValue(new Error('Error inesperado en la búsqueda'));
    });
  
    when('se ejecuta getCustom', async () => {
      try {
        await service.getCustom(params);
      } catch (err) {
        error = err;
      }
    });
  
    then('se debe lanzar una excepción con el mensaje esperado', () => {
      expect(error).toBeDefined();
      expect(error.message).toBe('Error inesperado en la búsqueda');
    });
  });
  
});
