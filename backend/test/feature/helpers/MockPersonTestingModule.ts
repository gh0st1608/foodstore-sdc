import { Test } from "@nestjs/testing";
import { GetPersonRepository, GetPersonRepositorySymbol } from "../../../src/person/domain/repository/GetPersonRepository";
import { UpdateContactRepository, UpdateContactRepositorySymbol } from "../../../src/person/domain/repository/UpdateContactRepository";
import { Provider } from "@nestjs/common";
import { PersonAplication } from "../../../src/person/application/PersonApplication";
import { PersonController } from "../../../src/person/infrastructure/controller/PersonController";
import { AddressCreateRepository, AddressCreateRepositorySymbol } from "../../../src/person/domain/repository/AddressCreateRepository";
import { AddressDeleteRepository, AddressDeleteRepositorySymbol } from "../../../src/person/domain/repository/AddressDeleteRepository";
import { AddressUpdateRepository, AddressUpdateRepositorySymbol } from "../../../src/person/domain/repository/AddressUpdateRepository";
interface RepositoriesMock {
    getPersonRepository?: GetPersonRepository;
    updateContactRepository?: UpdateContactRepository;
    addressUpdateRepository?: AddressUpdateRepository;
    addressCreateRepository?: AddressCreateRepository;
    addressDeleteRepository?: AddressDeleteRepository;
}

export async function createMockPersonTestingModule(repositoriesMock: RepositoriesMock) {
    return Test.createTestingModule({
        providers: [...createMockProviders(repositoriesMock), {
            provide: PersonAplication,
            useClass: PersonAplication
        }],
        controllers: [PersonController]
    }).compile();
}

function createMockProviders(repositoriesMock: RepositoriesMock): Provider[] {
    const repositorySymbols = [
        {
            repository: repositoriesMock.getPersonRepository,
            symbol: GetPersonRepositorySymbol
        },
        {
            repository: repositoriesMock.updateContactRepository,
            symbol: UpdateContactRepositorySymbol
        },
        {
            repository: repositoriesMock.addressCreateRepository,
            symbol: AddressCreateRepositorySymbol
        },
        {
            repository: repositoriesMock.addressUpdateRepository,
            symbol: AddressUpdateRepositorySymbol
        },
        {
            repository: repositoriesMock.addressDeleteRepository,
            symbol: AddressDeleteRepositorySymbol
        },
    ];

    return repositorySymbols.map(({ repository, symbol }) => {
        return { provide: symbol, useValue: repository };
    });
}