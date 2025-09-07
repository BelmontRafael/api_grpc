import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';

const PROTO_PATH = path.resolve(__dirname, '../proto/filmes.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});

const filmesProto = grpc.loadPackageDefinition(packageDefinition).filmes as any;

const generoClient = new filmesProto.GeneroService(
    '127.0.0.1:50051',
    grpc.credentials.createInsecure()
);

async function main() {
    console.log('--- Testando o serviço de Gêneros ---');

    // Criar um Gênero
    const novoGenero = await new Promise((resolve, reject) => {
        generoClient.CriarGenero({ nome: 'Aventura' }, (error: any, response: any) => {
            if (error) reject(error);
            else resolve(response.genero);
        });
    });
    console.log('Gênero Criado:', novoGenero);
    const generoId = (novoGenero as any).id;

    // Criar outro Gênero
    await new Promise((resolve, reject) => {
        generoClient.CriarGenero({ nome: 'Comédia' }, (error: any, response: any) => {
            if (error) reject(error);
            else resolve(response.genero);
        });
    });

    // Listar todos os Gêneros
    const generos = await new Promise((resolve, reject) => {
        generoClient.ListarGeneros({}, (error: any, response: any) => {
            if (error) reject(error);
            else resolve(response.generos);
        });
    });
    console.log('\nLista de Gêneros:', generos);

    // Obter um Gênero por ID
    const generoObtido = await new Promise((resolve, reject) => {
        generoClient.ObterGenero({ id: generoId }, (error: any, response: any) => {
            if (error) reject(error);
            else resolve(response.genero);
        });
    });
    console.log('\nGênero Obtido por ID:', generoObtido);

    // Atualizar um Gênero
    const generoAtualizado = await new Promise((resolve, reject) => {
        generoClient.AtualizarGenero({ id: generoId, nome: 'Aventura & Fantasia' }, (error: any, response: any) => {
            if (error) reject(error);
            else resolve(response.genero);
        });
    });
    console.log('\nGênero Atualizado:', generoAtualizado);

    // Deletar um Gênero
    await new Promise((resolve, reject) => {
        generoClient.DeletarGenero({ id: generoId }, (error: any, response: any) => {
            if (error) reject(error);
            else resolve(response);
        });
    });
    console.log(`\nGênero com ID ${generoId} deletado com sucesso.`);

    // Verificar a lista final
    const generosFinal = await new Promise((resolve, reject) => {
        generoClient.ListarGeneros({}, (error: any, response: any) => {
            if (error) reject(error);
            else resolve(response.generos);
        });
    });
    console.log('\nLista de Gêneros Final:', generosFinal);
}

main();