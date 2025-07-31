import { AllergyIntoleranceGetRepositoryImp } from '../../../../src/allergyIntolerance/infrastructure/repository/AllergyIntoleranceGetRepositoryImp';
import { AuthGoogleClient } from '../../../../src/common/infrastructure/google/AuthGoogleClient';
import { ResourceTypeEnum } from '../../../../src/common/infrastructure/google/ResourceType.enum';
import {
  DomainErrorMessages,
  ServerErrorMessages,
} from '../../../../src/common/domain/constants/DomainMessages';

jest.mock('../../../../src/common/infrastructure/google/AuthGoogleClient');

describe('AllergyIntoleranceGetRepositoryImp', () => {
  let repository: AllergyIntoleranceGetRepositoryImp;

  beforeEach(() => {
    repository = new AllergyIntoleranceGetRepositoryImp();
  });

  it('debe lanzar error si no se proporciona un ID', async () => {
    await expect(repository.execute('')).rejects.toThrow(
      DomainErrorMessages.ALLERGY_INTOLERANCE_ID_REQUIRED,
    );
  });

  it('debe obtener una AllergyIntolerance correctamente', async () => {
    const mockClient = {
      request: jest.fn().mockResolvedValue({
        data: {
          text: () =>
            Promise.resolve(
              JSON.stringify({
                entry: [
                  {
                    resource: {
                      id: 'test-id',
                      resourceType: ResourceTypeEnum.ALLERGY_INTOLERANCE,
                    },
                  },
                ],
              }),
            ),
        },
      }),
    };

    (AuthGoogleClient.getInstance as jest.Mock).mockResolvedValue(mockClient);

    const result = await repository.execute('test-id');

    expect(result).toEqual(
      expect.objectContaining({
        id: 'test-id',
        resourceType: ResourceTypeEnum.ALLERGY_INTOLERANCE,
      }),
    );

    expect(mockClient.request).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'GET',
        url: expect.stringContaining(`?_id=test-id`),
      }),
    );
  });

  it('debe lanzar error si FHIR no responde', async () => {
    const mockClient = {
      request: jest.fn().mockResolvedValue({ data: null }),
    };

    (AuthGoogleClient.getInstance as jest.Mock).mockResolvedValue(mockClient);

    await expect(repository.execute('id')).rejects.toThrow(
      ServerErrorMessages.FHIR_NOT_RESPONDING,
    );
  });
});
