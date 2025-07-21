import { HelperError } from '../../../../src/common/infrastructure/errors/HelperError';
import { BadRequestException, HttpException } from '@nestjs/common';
import { GaxiosError } from 'gaxios';
import { OperationOutcome } from 'fhir/r4';
import { DomainErrorMessages } from '../../../../src/common/domain/constants/DomainMessages';

describe('HelperError', () => {
  it('📌 debe manejar BadRequestException con arreglo de mensajes', async () => {
    const error = new BadRequestException({
      message: ['campo1 inválido', 'campo2 requerido'],
    });

    const result = await HelperError.get(error);
    expect(result.Error.code).toBe(400);
    expect(result.Error.message).toContain('campo1 inválido');
  });

  it('📌 debe manejar BadRequestException con mensaje string', async () => {
    const error = new BadRequestException({
      message: 'Error simple',
    });

    const result = await HelperError.get(error);
    expect(result.Error.message).toContain('Error simple');
  });

  it('📌 debe manejar GaxiosError con OperationOutcome', async () => {
    const outcome: OperationOutcome = {
      resourceType: 'OperationOutcome',
      issue: [
        {
          severity: 'error',
          code: 'invalid',
          diagnostics: 'Parametro inválido',
          details: { text: 'Campo inválido' },
          expression: ['AllergyIntolerance.category'],
        },
      ],
    };

    const blob = new Blob([JSON.stringify(outcome)], {
      type: 'application/fhir+json',
    });

    const gaxiosError = new GaxiosError('Fallo FHIR', {
      url: '',
      method: 'GET',
    });
    gaxiosError.response = {
      status: 400,
      statusText: 'Bad Request',
      config: {},
      headers: {},
      data: blob,
      request: {
        responseURL: 'https://fake-url.com', // ✅ Propiedad requerida
      },
    };

    const result = await HelperError.get(gaxiosError);
    expect(result.Error.message).toContain('AllergyIntolerance.category');
  });

  it('📌 debe manejar HttpException sin código de dominio', async () => {
    const error = new HttpException('Un mensaje cualquiera', 400);
    const result = await HelperError.get(error);
    expect(result.Error.status).toBe('BAD_REQUEST');
    expect(result.Error.message).toBe('Un mensaje cualquiera');
  });

  it('📌 debe manejar HttpException con código de dominio', async () => {
    const error = new HttpException(
      'El recurso Allergy Intolerance de FHIR no tiene datos válidos.',
      400,
    );
    const result = await HelperError.get(error);
    expect(result.Error.status).toBe('NOT_FOUND');
    expect(result.Error.message).toContain('Allergy Intolerance');
  });

  it('📌 debe manejar Error genérico con código de dominio', async () => {
    const error = new Error(DomainErrorMessages.ALLERGY_INTOLERANCE_DUPLICATE);
    const result = await HelperError.get(error);
    expect(result.Error.status).toBe('CONFLICT');
    expect(result.Error.message).toContain('conflicto');
  });

  it('📌 debe retornar error genérico si no se reconoce', async () => {
    const error = new Error('Algo completamente inesperado');
    const result = await HelperError.get(error);
    expect(result.Error.code).toBe(500);
    expect(result.Error.title).toBe('Error general en el servidor');
  });
});
