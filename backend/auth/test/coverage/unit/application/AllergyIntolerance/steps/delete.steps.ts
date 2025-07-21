import { defineFeature, loadFeature } from 'jest-cucumber';
import { LoggerService } from '@nestjs/common';
import { AllergyIntoleranceApplication } from '../../../../../../src/allergyIntolerance/application/AllergyIntoleranceApplication';
import { AllergyIntoleranceDeleteRepository } from '../../../../../../src/allergyIntolerance/domain/repository/AllergyIntoleranceDeleteRepositoryImp';
import { AllergyIntoleranceGetRepository } from '../../../../../../src/allergyIntolerance/domain/repository/AllergyIntoleranceGetRepository';
import { DomainSuccessMessages } from '../../../../../../src/common/domain/constants/DomainMessages';
import { AllergyIntolerance } from 'fhir/r4';

const feature = loadFeature('./../delete.feature', {
  loadRelativePath: true,
  errors: true,
});

defineFeature(feature, (test) => {
  let appService: AllergyIntoleranceApplication;
  let mockDeleteRepo: AllergyIntoleranceDeleteRepository;
  let mockGetRepo: AllergyIntoleranceGetRepository;
  let response: any;
  const id = 'test-id';

  const existingAllergyIntolerance: AllergyIntolerance = {
    resourceType: 'AllergyIntolerance',
    id,
    clinicalStatus: {
      coding: [
        {
          system:
            'http://terminology.hl7.org/CodeSystem/allergyintolerance-clinical',
          code: 'active',
          display: 'Active',
        },
      ],
    },
    patient: {
      reference: 'Patient/123',
    },
  };

  beforeEach(() => {
    mockGetRepo = {
      execute: jest.fn().mockResolvedValue(existingAllergyIntolerance), // ✅ correcto
    };

    mockDeleteRepo = {
      execute: jest.fn().mockResolvedValue(undefined),
    };

    appService = new AllergyIntoleranceApplication(
      null as any,
      null as any,
      null as any,
      mockGetRepo,
      mockDeleteRepo,
    );
  });

  test('Elimina un AllergyIntolerance exitosamente', ({
    given,
    when,
    then,
  }) => {
    given('un ID válido de AllergyIntolerance existente', () => {
      // Preparado en beforeEach
    });

    when('ejecuto el método delete', async () => {
      response = await appService.delete(id);
    });

    then('debe retornar un mensaje de éxito con el ID eliminado', () => {
      expect(response).toEqual({
        id,
        statusCode: 200,
        message: DomainSuccessMessages.ALLERGY_INTOLERANCE_DELETE_SUCESS,
      });

      expect(mockGetRepo.execute).toHaveBeenCalledWith(id);
      expect(mockDeleteRepo.execute).toHaveBeenCalledWith(id);
    });
  });

  test('Error al eliminar un AllergyIntolerance', ({ given, when, then }) => {
    let caughtError: any;
  
    given('un ID válido de AllergyIntolerance existente', () => {
      mockGetRepo.execute = jest.fn().mockResolvedValue(existingAllergyIntolerance);
      mockDeleteRepo.execute = jest.fn().mockRejectedValue(new Error('Infra error'));
    });
  
    when('ejecuto el método delete y ocurre un error en la infraestructura', async () => {
      try {
        await appService.delete(id);
      } catch (error) {
        caughtError = error;
      }
    });
  
    then('debo recibir una excepción lanzada por la aplicación', () => {
      expect(caughtError).toBeInstanceOf(Error);
      expect(caughtError.message).toBe('Infra error');
    });
  });
  
});
