import { defineFeature, loadFeature } from 'jest-cucumber';
import { AllergyIntoleranceApplication } from '../../../../../../src/allergyIntolerance/application/AllergyIntoleranceApplication';
import { CreateAllergyIntoleranceDto } from '../../../../../../src/allergyIntolerance/application/dto/request/CreateAllergyIntoleranceRequest.dto';
import { DomainSuccessMessages } from '../../../../../../src/common/domain/constants/DomainMessages';
import { ResourceTypeEnum } from '../../../../../../src/common/infrastructure/google/ResourceType.enum';

const feature = loadFeature('./../create.feature', {
  loadRelativePath: true,
  errors: true,
});

defineFeature(feature, (test) => {
  let application: AllergyIntoleranceApplication;
  let response: any;
  let mockCreateRepository: any;

  const mockInput: CreateAllergyIntoleranceDto = {
    AllergyIntolerance: {
      resourceType: ResourceTypeEnum.ALLERGY_INTOLERANCE,
      meta: {
        profile: [
          'https://fhir.onehealth.com.pe/StructureDefinition/AllergyIntoleranceOH|0.8.9',
        ],
      },
      clinicalStatus: {
        coding: [
          {
            system:
              'http://terminology.hl7.org/CodeSystem/allergyintolerance-clinical',
            code: 'active',
          },
        ],
      },
      verificationStatus: {
        coding: [
          {
            system:
              'http://terminology.hl7.org/CodeSystem/allergyintolerance-verification',
            code: 'confirmed',
          },
        ],
      },
      patient: {
        reference: 'Patient/1234',
      },
    },
  };

  beforeEach(() => {
    mockCreateRepository = {
      execute: jest.fn().mockResolvedValue('test-id'),
    };

    application = new AllergyIntoleranceApplication(
      {} as any, // searchRepository
      mockCreateRepository, // createRepository
      {} as any, // updateRepository
      {} as any, // getRepository
      {} as any, // deleteRepository
    );
  });

  test('Crear una nueva AllergyIntolerance exitosamente', ({
    given,
    when,
    then,
  }) => {
    given('una solicitud válida para crear un AllergyIntolerance', () => {
      // mockInput ya está definido
    });

    when('ejecuto el método create', async () => {
      response = await application.create(mockInput);
    });

    then('debo recibir un mensaje de éxito con el ID generado', () => {
      expect(response).toEqual({
        id: 'test-id',
        statusCode: 200,
        message: DomainSuccessMessages.ALLERGY_INTOLERANCE_CREATE_SUCESS,
      });
    });
  });

  test('Error al crear un AllergyIntolerance', ({ given, when, then }) => {
    let caughtError: any;
  
    given('una solicitud válida para crear un AllergyIntolerance', () => {
      // El mismo mockInput ya definido
      mockCreateRepository.execute = jest.fn().mockRejectedValue(new Error('Infra error'));
    });
  
    when('ejecuto el método create y ocurre un error en la infraestructura', async () => {
      try {
        await application.create(mockInput);
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
