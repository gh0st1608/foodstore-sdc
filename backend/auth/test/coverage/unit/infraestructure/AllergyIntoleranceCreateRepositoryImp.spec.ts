import { AllergyIntoleranceCreateRepositoryImp } from '../../../../src/allergyIntolerance/infrastructure/repository/AllergyIntoleranceCreateRepositoryImp';
import { AuthGoogleClient } from '../../../../src/common/infrastructure/google/AuthGoogleClient';
import { ResourceTypeEnum } from '../../../../src/common/infrastructure/google/ResourceType.enum';
import { AllergyIntolerance } from 'fhir/r4';

jest.mock('../../../../src/common/infrastructure/google/AuthGoogleClient');

describe('AllergyIntoleranceCreateRepositoryImp', () => {
  let repository: AllergyIntoleranceCreateRepositoryImp;

  beforeEach(() => {
    repository = new AllergyIntoleranceCreateRepositoryImp();
  });

  it('debe crear un AllergyIntolerance y retornar su ID', async () => {
    const mockClient = {
      request: jest.fn().mockResolvedValue({
        data: {
          text: () => Promise.resolve(JSON.stringify({ id: 'allergy-123' })),
        },
      }),
    };

    (AuthGoogleClient.getInstance as jest.Mock).mockResolvedValue(mockClient);

    const input: AllergyIntolerance = {
      resourceType: 'AllergyIntolerance',
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
      patient: {
        reference: 'Patient/123',
      },
      meta: {
        profile: [
          'https://fhir.onehealth.com.pe/StructureDefinition/AllergyIntoleranceOH|0.8.9',
        ],
      },
    } as any;

    const result = await repository.execute(input);

    expect(result).toBe('allergy-123');
    expect(mockClient.request).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'POST',
        url: expect.stringContaining(
          `/${ResourceTypeEnum.ALLERGY_INTOLERANCE}`,
        ),
        data: expect.objectContaining({ resourceType: 'AllergyIntolerance' }),
      }),
    );
  });

  it('debe lanzar error si la creación falla', async () => {
    const mockError = new Error('Request failed');
    const mockClient = {
      request: jest.fn().mockRejectedValue(mockError),
    };

    (AuthGoogleClient.getInstance as jest.Mock).mockResolvedValue(mockClient);

    await expect(
      repository.execute({
        resourceType: ResourceTypeEnum.ALLERGY_INTOLERANCE,
      } as any),
    ).rejects.toThrow();
  });
});
