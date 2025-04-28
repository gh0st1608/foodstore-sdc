import { defineFeature, loadFeature } from 'jest-cucumber';
import DataTest from './Test.json';
import { PersonController } from '../../../src/person/infrastructure/controller/PersonController';
import { TestingModule } from '@nestjs/testing';
import { createMockPersonTestingModule } from '../helpers/MockPersonTestingModule';
import { HelperError, StructureError } from '../../../src/common/infrastructure/errors/HelperError';
import { HttpException } from '@nestjs/common';
import { AddressResponseDto } from '../../../src/person/application/dto/response/AddressResponse.dto';
import { DocumentDomainErrorMessages } from '../../../src/person/domain/constants/AddressDomainErrorMessages';
import { HttpStatusResponse } from '../../../src/common/domain/constants/HttpStatusResponse';
import { AddressDeleteRepository } from '../../../src/person/domain/repository/AddressDeleteRepository';

const DataTestJson = JSON.parse(JSON.stringify(DataTest));

const feature = loadFeature('./DeleteAddress.feature', {
    loadRelativePath: true,
    errors: true,
});

defineFeature(feature, (test) => {
    let controller: PersonController;
    const repositoryMock: AddressDeleteRepository = {
        execute: jest.fn() // vacio
    };

    beforeEach(async () => {
        try {
            const module: TestingModule = await createMockPersonTestingModule({
                addressDeleteRepository: repositoryMock,
            });
            controller = module.get<PersonController>(PersonController);
            if (!controller) throw new Error("Error: No se pudo inicializar PersonController");
        } catch (error) {
            console.error("Error en beforeEach:", error);
            throw error;
        }
    });

    test('Se elimina el recurso address', ({ given, and, when, then }) => {
        let dataParamPerson: string
        let dataParamAddress: string
        let dataOutput: StructureError | AddressResponseDto | any;

        given(/^se llama al servicio con (.*)$/, (caseType) => {
            dataParamPerson = DataTestJson[caseType].input.params.idPerson
            dataParamAddress = DataTestJson[caseType].input.params.idAddress
        });

        and(/^se configura el mock con (.*)$/, async (caseType) => {
            const dataMock = DataTestJson[caseType].mock;

            if (dataMock.type === 'data') {
                repositoryMock.execute = jest.fn();
            } else if (dataMock.type === 'error') {
                repositoryMock.execute = jest.fn().mockImplementation(async () => {
                    throw new HttpException(DocumentDomainErrorMessages.ADDRESS_NOT_FOUND,HttpStatusResponse.NOT_FOUND);
                });
            }
        });

        when('se ejecuta la solicitud DELETE al servicio', async () => {
            try {
                dataOutput = await controller.deleteAddress(dataParamPerson, dataParamAddress);
            } catch (error) {
                dataOutput = HelperError.get(error);
            }
        });

        then(/^recibe una respuesta (.*)$/, (caseType) => {
            const expectedOutput = { ...DataTestJson[caseType].output.value };
            const actualOutput = { ...dataOutput };
            delete actualOutput.dateTime;
            expect(actualOutput).toEqual(expectedOutput);
        });
    });
});