import { defineFeature, loadFeature } from 'jest-cucumber';
import { AllergyIntoleranceApplication } from '../../../../../../src/allergyIntolerance/application/AllergyIntoleranceApplication';
import {
  DomainErrorMessages,
  DomainSuccessMessages,
} from '../../../../../../src/common/domain/constants/DomainMessages';
import { AllergyIntoleranceEntity } from '../../../../../../src/allergyIntolerance/domain/entities/AllergyIntolerance.entity';

const feature = loadFeature('./../getById.feature', {
  loadRelativePath: true,
  errors: true,
});

defineFeature(feature, (test) => {
  let service: AllergyIntoleranceApplication;
  let mockGetRepository: any;
  let result: any;
  let error: Error;

  beforeEach(() => {
    mockGetRepository = {
      execute: jest.fn(),
    };

    service = new AllergyIntoleranceApplication(
      undefined,
      undefined,
      undefined,
      mockGetRepository,
      undefined,
    );

    // Omitimos logger real
    /* service['logger'] = new Logger(); */
  });

  test('Obtener un AllergyIntolerance existente y activo', ({
    given,
    when,
    then,
  }) => {
    given('un ID válido de AllergyIntolerance', () => {
      mockGetRepository.execute.mockResolvedValue({
        id: 'valid-id',
        resourceType: 'AllergyIntolerance',
        clinicalStatus: {
          coding: [{ code: 'active' }],
        },
      } as AllergyIntoleranceEntity);
    });

    when('se llama a getById con ese ID', async () => {
      result = await service.getById('valid-id');
    });

    then('se debe retornar el recurso con mensaje de éxito', () => {
      expect(result).toEqual({
        AllergyIntolerance: expect.any(Object),
        statusCode: 200,
        message: DomainSuccessMessages.ALLERGY_INTOLERANCE_GET_SUCESS,
      });
    });
  });

  test('Falla al obtener AllergyIntolerance inexistente', ({
    given,
    when,
    then,
  }) => {
    given('un ID inválido de AllergyIntolerance', () => {
      mockGetRepository.execute.mockResolvedValue(undefined);
    });

    when('se llama a getById con ese ID', async () => {
      try {
        await service.getById('invalid-id');
      } catch (err) {
        error = err;
      }
    });

    then('se debe lanzar un error de no encontrado', () => {
      expect(error).toBeDefined();
      expect(error.message).toBe(
        DomainErrorMessages.ALLERGY_INTOLERANCE_NOT_FOUND,
      );
    });
  });

  test('Falla al obtener AllergyIntolerance inactivo', ({
    given,
    when,
    then,
  }) => {
    given('un ID de AllergyIntolerance inactivo', () => {
      mockGetRepository.execute.mockResolvedValue({
        id: 'inactive-id',
        clinicalStatus: {
          coding: [{ code: 'inactive' }],
        },
      } as AllergyIntoleranceEntity);
    });

    when('se llama a getById con ese ID', async () => {
      try {
        await service.getById('inactive-id');
      } catch (err) {
        error = err;
      }
    });

    then('se debe lanzar un error de inactividad', () => {
      expect(error).toBeDefined();
      expect(error.message).toBe(
        DomainErrorMessages.ALLERGY_INTOLERANCE_INACTIVE,
      );
    });
  });
});
