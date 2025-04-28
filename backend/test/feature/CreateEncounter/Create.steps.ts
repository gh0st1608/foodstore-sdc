import { defineFeature, loadFeature } from 'jest-cucumber';
import DataTest from './Test.json';
import { PersonController } from '../../../src/person/infrastructure/controller/PersonController';
import { AddressCreateRepository } from '../../../src/person/domain/repository/AddressCreateRepository';
import { TestingModule } from '@nestjs/testing';
import { createMockPersonTestingModule } from '../helpers/MockPersonTestingModule';
import { HelperError, StructureError } from '../../../src/common/infrastructure/errors/HelperError';
import { HttpException } from '@nestjs/common';
import { CreateAddressDto } from '../../../src/person/application/dto/request/CreateAddressRequest.dto';
import { AddressResponseDto } from '../../../src/person/application/dto/response/AddressResponse.dto';
import { DocumentDomainErrorMessages } from '../../../src/person/domain/constants/AddressDomainErrorMessages';
import { HttpStatusResponse } from '../../../src/common/domain/constants/HttpStatusResponse';

const DataTestJson = JSON.parse(JSON.stringify(DataTest));

const feature = loadFeature('./CreateAddress.feature', {
    loadRelativePath: true,
    errors: true,
});

defineFeature(feature, (test) => {
    let controller: PersonController;
    const repositoryMock: AddressCreateRepository = {
        execute: jest.fn() // vacio
    };

    beforeEach(async () => {
        try {
            const module: TestingModule = await createMockPersonTestingModule({
                addressCreateRepository: repositoryMock,
            });
            controller = module.get<PersonController>(PersonController);
            if (!controller) throw new Error("Error: No se pudo inicializar PersonController");
        } catch (error) {
            console.error("Error en beforeEach:", error);
            throw error;
        }
    });

    test('Se crea el recurso address', ({ given, and, when, then }) => {
        let dataBody: CreateAddressDto;
        let dataParam: string
        let dataOutput: StructureError | AddressResponseDto | any;

        given(/^se llama al servicio con (.*)$/, (caseType) => {
            dataParam = DataTestJson[caseType].input.param;
            dataBody = DataTestJson[caseType].input.body;
        });

        and(/^se configura el mock con (.*)$/, async (caseType) => {
            const dataMock = DataTestJson[caseType].mock;

            if (dataMock.type === 'data') {
                repositoryMock.execute = jest.fn();
            } else if (dataMock.type === 'error') {
                repositoryMock.execute = jest.fn().mockImplementation(async () => {
                    throw new HttpException(DocumentDomainErrorMessages.ADDRESS_USE_ERROR,HttpStatusResponse.BAD_REQUEST);
                });
            }
        });

        when('se ejecuta la solicitud POST al servicio', async () => {
            try {
                dataOutput = await controller.createAddress(dataParam, dataBody);
            } catch (error) {
                dataOutput = HelperError.get(error);
            }
        });

        then(/^recibe una respuesta (.*)$/, (caseType) => {
            const expectedOutput = { ...DataTestJson[caseType].output.value };
            const actualOutput = { ...dataOutput };
            delete actualOutput.dateTime;
            // Comparar el actualOutput con el esperado
            expect(actualOutput).toEqual(expectedOutput);
        });
    });
});