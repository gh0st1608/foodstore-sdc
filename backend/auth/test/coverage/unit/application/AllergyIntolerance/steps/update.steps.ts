import { defineFeature, loadFeature } from 'jest-cucumber';
import { AllergyIntoleranceApplication } from '../../../../../../src/allergyIntolerance/application/AllergyIntoleranceApplication';
import { AllergyIntoleranceUpdateRepository } from '../../../../../../src/allergyIntolerance/domain/repository/AllergyIntoleranceUpdateRepository';
import { AllergyIntoleranceGetRepository } from '../../../../../../src/allergyIntolerance/domain/repository/AllergyIntoleranceGetRepository';
import { UpdateAllergyIntoleranceDto } from '../../../../../../src/allergyIntolerance/application/dto/request/UpdateAllergyIntoleranceRequest.dto';
import { AllergyIntolerance } from 'fhir/r4';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { DomainSuccessMessages } from '../../../../../../src/common/domain/constants/DomainMessages';
import { AllergyIntoleranceDto } from '../../../../../../src/allergyIntolerance/application/dto/request/CreateAllergyIntoleranceRequest.dto';

const feature = loadFeature('./../update.feature', {
  loadRelativePath: true,
  errors: true,
});

defineFeature(feature, (test) => {
  let appService: AllergyIntoleranceApplication;
  let mockUpdateRepo: AllergyIntoleranceUpdateRepository;
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
          code: 'resolved',
          display: 'Resolved',
        },
      ],
    },
    patient: {
      reference: 'Patient/123',
    },
  };

  const updateDto: UpdateAllergyIntoleranceDto = {
    AllergyIntolerance: {
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
    },
  };

  beforeEach(() => {
    mockGetRepo = {
      execute: jest.fn().mockResolvedValue(existingAllergyIntolerance), // ✅ correcto
    };

    mockUpdateRepo = {
      execute: jest.fn().mockResolvedValue(undefined),
    };

    appService = new AllergyIntoleranceApplication(
      null as any,
      null as any,
      mockUpdateRepo,
      mockGetRepo,
      null as any,
    );
  });
  let expectedPlain: any;

  test('Actualiza un AllergyIntolerance exitosamente', ({
    given,
    when,
    then,
  }) => {
    given('un ID válido de AllergyIntolerance y nuevos datos', () => {
      // los mocks ya fueron definidos en beforeEach
    });

    when('ejecuto el método update', async () => {
      const merged = {
        ...existingAllergyIntolerance,
        ...updateDto.AllergyIntolerance,
      };
      const transformed = plainToInstance(AllergyIntoleranceDto, merged);
      expectedPlain = instanceToPlain(transformed);

      response = await appService.update(id, updateDto);
    });

    then('debe retornar un mensaje de éxito con el ID', () => {
      expect(response).toEqual({
        id: 'test-id',
        statusCode: 200,
        message: DomainSuccessMessages.ALLERGY_INTOLERANCE_UPDATE_SUCESS,
      });

      expect(mockGetRepo.execute).toHaveBeenCalledWith('test-id');
      expect(mockUpdateRepo.execute).toHaveBeenCalledWith(
        'test-id',
        expectedPlain,
      );
    });
  });

  test('Error al actualizar un AllergyIntolerance', ({ given, when, then }) => {
    let caughtError: any;
  
    given('un ID válido de AllergyIntolerance y nuevos datos', () => {
      mockGetRepo.execute = jest.fn().mockResolvedValue(existingAllergyIntolerance);
      mockUpdateRepo.execute = jest.fn().mockRejectedValue(new Error('Infra error'));
    });
  
    when('ejecuto el método update y ocurre un error en la infraestructura', async () => {
      try {
        await appService.update(id, updateDto);
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
