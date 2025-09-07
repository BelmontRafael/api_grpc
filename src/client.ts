import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import { ServiceError } from '@grpc/grpc-js';

const PROTO_PATH = path.resolve(__dirname, '../proto/filmes.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});

const filmesProto = grpc.loadPackageDefinition(packageDefinition).filmes as any;

type GeneroResponseType = typeof filmesProto.GeneroResponse;
type GenerosResponseType = typeof filmesProto.GenerosResponse;
type AtorResponseType = typeof filmesProto.AtorResponse;
type AtoresResponseType = typeof filmesProto.AtoresResponse;
type Empty = typeof filmesProto.Empty;

const generoClient = new filmesProto.GeneroService('127.0.0.1:50051', grpc.credentials.createInsecure());
const atorClient = new filmesProto.AtorService('127.0.0.1:50051', grpc.credentials.createInsecure());

async function main() {
    console.log('--- Testando o serviço de Gêneros ---');

    // Criar um Gênero
    const novoGenero = await new Promise<any>((resolve, reject) => {
        generoClient.CriarGenero({ nome: 'Aventura' }, (error: ServiceError, response: GeneroResponseType) => {
            if (error) reject(error); else resolve(response.genero);
        });
    });
    console.log('Gênero Criado:', novoGenero);
    const generoId = (novoGenero as any).id;

    // Criar outro Gênero
    await new Promise<any>((resolve, reject) => {
        generoClient.CriarGenero({ nome: 'Comédia' }, (error: ServiceError, response: GeneroResponseType) => {
            if (error) reject(error); else resolve(response.genero);
        });
    });

    // Listar todos os Gêneros
    const generos = await new Promise<any>((resolve, reject) => {
        generoClient.ListarGeneros({}, (error: ServiceError, response: GenerosResponseType) => {
            if (error) reject(error); else resolve(response.generos);
        });
    });
    console.log('\nLista de Gêneros:', generos);

    // Obter um Gênero por ID
    const generoObtido = await new Promise<any>((resolve, reject) => {
        generoClient.ObterGenero({ id: generoId }, (error: ServiceError, response: GeneroResponseType) => {
            if (error) reject(error); else resolve(response.genero);
        });
    });
    console.log('\nGênero Obtido por ID:', generoObtido);

    // Atualizar um Gênero
    const generoAtualizado = await new Promise<any>((resolve, reject) => {
        generoClient.AtualizarGenero({ id: generoId, nome: 'Aventura & Fantasia' }, (error: ServiceError, response: GeneroResponseType) => {
            if (error) reject(error); else resolve(response.genero);
        });
    });
    console.log('\nGênero Atualizado:', generoAtualizado);

    // Deletar um Gênero
    await new Promise<any>((resolve, reject) => {
        generoClient.DeletarGenero({ id: generoId }, (error: ServiceError, response: Empty) => {
            if (error) reject(error); else resolve(response);
        });
    });
    console.log(`\nGênero com ID ${generoId} deletado com sucesso.`);

    // Verificar a lista final de Gêneros
    const generosFinal = await new Promise<any>((resolve, reject) => {
        generoClient.ListarGeneros({}, (error: ServiceError, response: GenerosResponseType) => {
            if (error) reject(error); else resolve(response.generos);
        });
    });
    console.log('\nLista de Gêneros Final:', generosFinal);

    // --- Testes para o serviço de Atores ---
    console.log('\n\n--- Testando o serviço de Atores ---');

    const novoAtor = await new Promise<any>((resolve, reject) => {
        atorClient.CriarAtor({ nome: 'Harrison Ford', data_nascimento: '1942-07-13' }, (error: ServiceError, response: AtorResponseType) => {
            if (error) reject(error); else resolve(response.ator);
        });
    });
    console.log('Ator Criado:', novoAtor);
    const atorId = novoAtor.id;

    const atores = await new Promise<any>((resolve, reject) => {
        atorClient.ListarAtores({}, (error: ServiceError, response: AtoresResponseType) => {
            if (error) reject(error); else resolve(response.atores);
        });
    });
    console.log('\nLista de Atores:', atores);

    const atorObtido = await new Promise<any>((resolve, reject) => {
        atorClient.ObterAtor({ id: atorId }, (error: ServiceError, response: AtorResponseType) => {
            if (error) reject(error); else resolve(response.ator);
        });
    });
    console.log('\nAtor Obtido por ID:', atorObtido);

    const atorAtualizado = await new Promise<any>((resolve, reject) => {
        atorClient.AtualizarAtor({ id: atorId, nome: 'Harrison Ford Jr.' }, (error: ServiceError, response: AtorResponseType) => {
            if (error) reject(error); else resolve(response.ator);
        });
    });
    console.log('\nAtor Atualizado:', atorAtualizado);

    await new Promise<any>((resolve, reject) => {
        atorClient.DeletarAtor({ id: atorId }, (error: ServiceError, response: Empty) => {
            if (error) reject(error); else resolve(response);
        });
    });
    console.log(`\nAtor com ID ${atorId} deletado com sucesso.`);

    const atoresFinal = await new Promise<any>((resolve, reject) => {
        atorClient.ListarAtores({}, (error: ServiceError, response: AtoresResponseType) => {
            if (error) reject(error); else resolve(response.atores);
        });
    });
    console.log('\nLista de Atores Final:', atoresFinal);
}

main();