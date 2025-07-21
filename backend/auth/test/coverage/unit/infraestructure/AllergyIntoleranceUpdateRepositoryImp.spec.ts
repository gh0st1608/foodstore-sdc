import { AllergyIntoleranceUpdateRepositoryImp } from '../../../../src/allergyIntolerance/infrastructure/repository/AllergyIntoleranceUpdateRepositoryImp';
import { AuthGoogleClient } from '../../../../src/common/infrastructure/google/AuthGoogleClient';
import { ResourceTypeEnum } from '../../../../src/common/infrastructure/google/ResourceType.enum';

jest.mock('../../../../src/common/infrastructure/google/AuthGoogleClient');

describe('AllergyIntoleranceUpdateRepositoryImp', () => {
  let repository: AllergyIntoleranceUpdateRepositoryImp;

  beforeEach(() => {
    repository = new AllergyIntoleranceUpdateRepositoryImp();
  });

  it('debe hacer un PATCH exitoso al recurso AllergyIntolerance', async () => {
    const mockClient = {
      request: jest.fn().mockResolvedValue({}),
    };

    (AuthGoogleClient.getInstance as jest.Mock).mockResolvedValue(mockClient);

    const input = {
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
    };

    await repository.execute('allergy-123', input);

    expect(mockClient.request).toHaveBeenCalledWith(
      expect.objectContaining({
        url: expect.stringContaining(
          `/${ResourceTypeEnum.ALLERGY_INTOLERANCE}/allergy-123`,
        ),
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json-patch+json',
        },
        data: [
          {
            op: 'replace',
            path: '/clinicalStatus',
            value: input.clinicalStatus,
          },
        ],
      }),
    );
  });

  it('debe lanzar error si PATCH falla', async () => {
    const mockClient = {
      request: jest.fn().mockRejectedValue(new Error('FHIR error')),
    };

    (AuthGoogleClient.getInstance as jest.Mock).mockResolvedValue(mockClient);

    await expect(
      repository.execute('allergy-456', { criticality: 'high' } as any),
    ).rejects.toThrow('FHIR error');
  });
});
