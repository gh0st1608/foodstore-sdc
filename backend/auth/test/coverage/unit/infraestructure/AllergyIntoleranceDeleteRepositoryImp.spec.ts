import { AllergyIntoleranceDeleteRepositoryImp } from '../../../../src/allergyIntolerance/infrastructure/repository/AllergyIntoleranceDeleteRepositoryImp';
import { AuthGoogleClient } from '../../../../src/common/infrastructure/google/AuthGoogleClient';
import { ResourceTypeEnum } from '../../../../src/common/infrastructure/google/ResourceType.enum';

jest.mock('../../../../src/common/infrastructure/google/AuthGoogleClient');

describe('AllergyIntoleranceDeleteRepositoryImp', () => {
  let repository: AllergyIntoleranceDeleteRepositoryImp;

  beforeEach(() => {
    repository = new AllergyIntoleranceDeleteRepositoryImp();
  });

  it('debe desactivar una AllergyIntolerance (clinicalStatus: inactive)', async () => {
    const mockClient = {
      request: jest.fn().mockResolvedValue({ status: 200 }),
    };

    (AuthGoogleClient.getInstance as jest.Mock).mockResolvedValue(mockClient);

    const id = 'test-allergy-id';

    await repository.execute(id);

    expect(mockClient.request).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'PATCH',
        url: expect.stringContaining(
          `/${ResourceTypeEnum.ALLERGY_INTOLERANCE}/${id}`,
        ),
        headers: {
          'Content-Type': 'application/json-patch+json',
        },
        data: expect.arrayContaining([
          expect.objectContaining({
            op: 'replace',
            path: '/clinicalStatus',
            value: expect.objectContaining({
              coding: expect.arrayContaining([
                expect.objectContaining({ code: 'inactive' }),
              ]),
            }),
          }),
        ]),
      }),
    );
  });

  it('debe lanzar error si la petición falla', async () => {
    const mockClient = {
      request: jest.fn().mockRejectedValue(new Error('Error de red')),
    };

    (AuthGoogleClient.getInstance as jest.Mock).mockResolvedValue(mockClient);

    await expect(repository.execute('fallo-id')).rejects.toThrow(
      'Error de red',
    );
  });
});
