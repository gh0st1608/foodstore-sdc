import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AllergyIntoleranceModule } from '../../../src/allergyIntolerance/AllergyIntoleranceModule';
import { TransformInterceptor } from '../../../src/common/infrastructure/interceptors/TransformInterceptor';
import { HttpErrorFilter } from '../../../src/common/infrastructure/errors/HttpErrorFilter';
import { AllergyIntoleranceApplication } from '../../../src/allergyIntolerance/application/AllergyIntoleranceApplication';
import { DomainErrorMessages } from '../../../src/common/domain/constants/DomainMessages';
import { ResourceTypeEnum } from '../../../src/common/infrastructure/google/ResourceType.enum';
import { AllergyIntoleranceDto } from '../../../src/allergyIntolerance/application/dto/request/CreateAllergyIntoleranceRequest.dto';

const baseUrl = '/allergies';

describe(`AllergyIntoleranceController ${baseUrl} (e2e)`, () => {
  let app: INestApplication;
  let server: any;
  const validPatientId = '550e8400-e29b-41d4-a716-446655440000';
  const invalidPatientId = '00000000-xxxx-yyyy-zzzz-000000000000';

  const mockAllergyIntolerance: AllergyIntoleranceDto = {
    resourceType: ResourceTypeEnum.ALLERGY_INTOLERANCE,
    meta: {
      profile: [
        'https://fhir.onehealth.com.pe/StructureDefinition/AllergyIntoleranceOH',
      ],
    },
    patient: {
      reference: `Patient/${validPatientId}`,
    },
    verificationStatus: {
      coding: [
        {
          system:
            'http://terminology.hl7.org/CodeSystem/allergyintolerance-verification',
          code: 'confirmed',
          display: 'Confirmed',
        },
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
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AllergyIntoleranceModule],
    })
      .overrideProvider(AllergyIntoleranceApplication)
      .useValue({
        getCustom: jest.fn().mockResolvedValue({
          PageToken: null,
          AllergyIntolerance: [mockAllergyIntolerance],
        }),
        create: jest.fn().mockResolvedValue({
          id: 'test-id',
          statusCode: 200,
          message: 'AllergyIntolerance creado con éxito',
        }),
        update: jest.fn().mockResolvedValue({
          id: 'test-id',
          statusCode: 200,
          message: 'AllergyIntolerance actualizado con éxito',
        }),
        getById: jest.fn().mockResolvedValue({
          AllergyIntolerance: mockAllergyIntolerance,
          statusCode: 200,
          message: 'AllergyIntolerance obtenido con éxito',
        }),
        delete: jest.fn().mockResolvedValue({
          id: 'test-id',
          statusCode: 200,
          message: 'AllergyIntolerance eliminado con éxito',
        }),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalFilters(new HttpErrorFilter());
    app.useGlobalInterceptors(new TransformInterceptor());
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: false,
        forbidNonWhitelisted: false,
        skipMissingProperties: false,
      }),
    );
    await app.init();
    server = app.getHttpServer();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /intolerances', () => {
    it('Devuelve resultados cuando se proporciona un patient válido', async () => {
      const res = await request(server)
        .get(`${baseUrl}/intolerances`)
        .query({ patient: validPatientId })
        .expect(200);

      expect(res.body.Data).toEqual({
        PageToken: null,
        AllergyIntolerance: [mockAllergyIntolerance],
      });
    });

    it('Devuelve error si no hay datos para el patient', async () => {
      const res = await request(server)
        .get(`${baseUrl}/intolerances`)
        .query({ patient: invalidPatientId })
        .expect(400);

      expect(res.body.Error.message).toContain(
        DomainErrorMessages.ALLERGY_INTOLERANCE_INVALID_ID,
      );
    });
  });

  describe('POST /intolerances/register', () => {
    it('Crea un AllergyIntolerance exitosamente', async () => {
      const res = await request(server)
        .post(`${baseUrl}/intolerances/register`)
        .send({ AllergyIntolerance: mockAllergyIntolerance })
        .expect(201);

      expect(res.body.Data).toEqual({
        id: 'test-id',
        statusCode: 200,
        message: 'AllergyIntolerance creado con éxito',
      });
    });

    it('Crea con wrapper Data (para cubrir interceptor)', async () => {
      const res = await request(server)
        .post(`${baseUrl}/intolerances/register`)
        .send({
          Data: {
            AllergyIntolerance: mockAllergyIntolerance,
          },
        })
        .expect(201);

      expect(res.body.Data).toEqual({
        id: 'test-id',
        statusCode: 200,
        message: 'AllergyIntolerance creado con éxito',
      });
    });
  });

  describe('PATCH /intolerances/:id', () => {
    it('Actualiza un AllergyIntolerance correctamente', async () => {
      const res = await request(server)
        .patch(`${baseUrl}/intolerances/test-id`)
        .send({ AllergyIntolerance: mockAllergyIntolerance })
        .expect(200);

      expect(res.body.Data).toEqual({
        id: 'test-id',
        statusCode: 200,
        message: 'AllergyIntolerance actualizado con éxito',
      });
    });

    it('Actualiza con wrapper Data (para cubrir interceptor)', async () => {
      const res = await request(server)
        .patch(`${baseUrl}/intolerances/test-id`)
        .send({
          Data: {
            AllergyIntolerance: mockAllergyIntolerance,
          },
        })
        .expect(200);

      expect(res.body.Data).toEqual({
        id: 'test-id',
        statusCode: 200,
        message: 'AllergyIntolerance actualizado con éxito',
      });
    });
  });

  describe('GET /intolerances/:id', () => {
    it('Obtiene un AllergyIntolerance por ID', async () => {
      const res = await request(server)
        .get(`${baseUrl}/intolerances/test-id`)
        .expect(200);

      expect(res.body.Data).toEqual({
        AllergyIntolerance: mockAllergyIntolerance,
        statusCode: 200,
        message: 'AllergyIntolerance obtenido con éxito',
      });
    });
  });

  describe('DELETE /intolerances/:id', () => {
    it('Elimina un AllergyIntolerance exitosamente', async () => {
      const res = await request(server)
        .delete(`${baseUrl}/intolerances/test-id`)
        .expect(200);

      expect(res.body.Data).toEqual({
        id: 'test-id',
        statusCode: 200,
        message: 'AllergyIntolerance eliminado con éxito',
      });
    });
  });
});
