import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import { ServiceError } from '@grpc/grpc-js';

const PROTO_PATH = path.resolve(__dirname, '../proto/filmes.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true, longs: String, enums: String, defaults: true, oneofs: true,
});

const proto = grpc.loadPackageDefinition(packageDefinition).filmes as any;


type GeneroResponseType = typeof proto.GeneroResponse;
type GenerosResponseType = typeof proto.GenerosResponse;
type AtorResponseType = typeof proto.AtorResponse;
type AtoresResponseType = typeof proto.AtoresResponse;
type FilmeResponseType = typeof proto.FilmeResponse;
type FilmesResponseType = typeof proto.FilmesResponse;
type Empty = typeof proto.Empty;


const generoClient = new proto.GeneroService('127.0.0.1:50051', grpc.credentials.createInsecure());
const atorClient = new proto.AtorService('127.0.0.1:50051', grpc.credentials.createInsecure());
const filmeClient = new proto.FilmeService('127.0.0.1:50051', grpc.credentials.createInsecure());


async function main() {
    try {
        console.log('--- 1. PREPARAÇÃO: Criando dados base (gêneros e atores) ---');

        const generoBase1 = await new Promise<any>((resolve, reject) => {
            generoClient.CriarGenero({ nome: 'Aventura' }, (err: ServiceError, res: GeneroResponseType) => {
                if (err) reject(err); else resolve(res.genero);
            });
        });
        const atorBase1 = await new Promise<any>((resolve, reject) => {
            atorClient.CriarAtor({ nome: 'Harrison Ford', data_nascimento: '1942-07-13' }, (err: ServiceError, res: AtorResponseType) => {
                if (err) reject(err); else resolve(res.ator);
            });
        });
        const atorBase2 = await new Promise<any>((resolve, reject) => {
            atorClient.CriarAtor({ nome: 'Sean Connery', data_nascimento: '1930-08-25' }, (err: ServiceError, res: AtorResponseType) => {
                if (err) reject(err); else resolve(res.ator);
            });
        });
        console.log('Dados base criados com sucesso!');
        
        console.log('\n\n--- 2. TESTANDO CRUD COMPLETO: GENERO ---');
        const generoTeste = await new Promise<any>((resolve, reject) => {
            generoClient.CriarGenero({ nome: 'Comédia' }, (err: ServiceError, res: GeneroResponseType) => {
                if (err) reject(err); else resolve(res.genero);
            });
        });
        console.log('\n- Gênero de Teste Criado:', generoTeste);
        
        const { generos: listaGeneros } = await new Promise<any>((resolve, reject) => {
            generoClient.ListarGeneros({}, (err: ServiceError, res: GenerosResponseType) => {
                if (err) reject(err); else resolve(res);
            });
        });
        console.log('- Lista de Gêneros:', listaGeneros);

        const generoObtido = await new Promise<any>((resolve, reject) => {
            generoClient.ObterGenero({ id: generoTeste.id }, (err: ServiceError, res: GeneroResponseType) => {
                if (err) reject(err); else resolve(res.genero);
            });
        });
        console.log('- Gênero Obtido por ID:', generoObtido);

        const generoAtualizado = await new Promise<any>((resolve, reject) => {
            generoClient.AtualizarGenero({ id: generoTeste.id, nome: 'Comédia Romântica' }, (err: ServiceError, res: GeneroResponseType) => {
                if (err) reject(err); else resolve(res.genero);
            });
        });
        console.log('- Gênero Atualizado:', generoAtualizado);

        await new Promise<any>((resolve, reject) => {
            generoClient.DeletarGenero({ id: generoTeste.id }, (err: ServiceError, res: Empty) => {
                if (err) reject(err); else resolve(res);
            });
        });
        console.log(`- Gênero de Teste ID ${generoTeste.id} deletado.`);


        console.log('\n\n--- 3. TESTANDO CRUD COMPLETO: ATOR ---');
        const atorTeste = await new Promise<any>((resolve, reject) => {
            atorClient.CriarAtor({ nome: 'Carrie-Anne Moss', data_nascimento: '1967-08-21' }, (err: ServiceError, res: AtorResponseType) => {
                if (err) reject(err); else resolve(res.ator);
            });
        });
        console.log('\n- Ator de Teste Criado:', atorTeste);

        const { atores: listaAtores } = await new Promise<any>((resolve, reject) => {
            atorClient.ListarAtores({}, (err: ServiceError, res: AtoresResponseType) => {
                if (err) reject(err); else resolve(res);
            });
        });
        console.log('- Lista de Atores:', listaAtores);
        
        const atorObtido = await new Promise<any>((resolve, reject) => {
            atorClient.ObterAtor({ id: atorTeste.id }, (err: ServiceError, res: AtorResponseType) => {
                if (err) reject(err); else resolve(res.ator);
            });
        });
        console.log('- Ator Obtido por ID:', atorObtido);

        const atorAtualizado = await new Promise<any>((resolve, reject) => {
            atorClient.AtualizarAtor({ id: atorTeste.id, nome: 'C. A. Moss' }, (err: ServiceError, res: AtorResponseType) => {
                if (err) reject(err); else resolve(res.ator);
            });
        });
        console.log('- Ator Atualizado:', atorAtualizado);

        await new Promise<any>((resolve, reject) => {
            atorClient.DeletarAtor({ id: atorTeste.id }, (err: ServiceError, res: Empty) => {
                if (err) reject(err); else resolve(res);
            });
        });
        console.log(`- Ator de Teste ID ${atorTeste.id} deletado.`);


        console.log('\n\n--- 4. TESTANDO CRUD COMPLETO: FILME E ASSOCIAÇÕES ---');
        
        const filmeCriado = await new Promise<any>((resolve, reject) => {
            const filmeData = {
                nome: 'Indiana Jones e a Última Cruzada',
                ano_lancamento: 1989,
                sinopse: 'O arqueólogo aventureiro busca seu pai e o Santo Graal.',
                atoresIds: [atorBase1.id],
                generosIds: [generoBase1.id],
            };
            filmeClient.CriarFilme(filmeData, (err: ServiceError, res: FilmeResponseType) => {
                if (err) reject(err); else resolve(res.filme);
            });
        });
        console.log('\n- Filme Criado:', JSON.stringify(filmeCriado, null, 2));
        const filmeId = filmeCriado.id;

        const { filme: filmeObtido } = await new Promise<any>((resolve, reject) => {
            filmeClient.ObterFilme({ id: filmeId }, (err: ServiceError, res: FilmeResponseType) => {
                if (err) reject(err); else resolve(res);
            });
        });
        console.log('- Filme Obtido por ID:', JSON.stringify(filmeObtido, null, 2));

        const { filme: filmeComNovoAtor } = await new Promise<any>((resolve, reject) => {
            filmeClient.AdicionarAtorEmFilme({ filmeId: filmeId, atorId: atorBase2.id }, (err: ServiceError, res: FilmeResponseType) => {
                if (err) reject(err); else resolve(res);
            });
        });
        console.log('- Elenco após adicionar ator:', JSON.stringify(filmeComNovoAtor.atores, null, 2));

        const { atores: atoresDoFilme } = await new Promise<any>((resolve, reject) => {
            filmeClient.ListarAtoresDeFilme({ id: filmeId }, (err: ServiceError, res: AtoresResponseType) => {
                if (err) reject(err); else resolve(res);
            });
        });
        console.log(`- Atores do Filme ID ${filmeId}:`, JSON.stringify(atoresDoFilme, null, 2));

        const { filme: filmeAtualizado } = await new Promise<any>((resolve, reject) => {
            filmeClient.AtualizarFilme({ id: filmeId, sinopse: 'Pai e filho na maior aventura de suas vidas.' }, (err: ServiceError, res: FilmeResponseType) => {
                if (err) reject(err); else resolve(res);
            });
        });
        console.log('- Filme Atualizado:', JSON.stringify(filmeAtualizado, null, 2));

        await new Promise<any>((resolve, reject) => {
            filmeClient.DeletarFilme({ id: filmeId }, (err: ServiceError, res: Empty) => {
                if (err) reject(err); else resolve(res);
            });
        });
        console.log(`- Filme com ID ${filmeId} deletado com sucesso.`);

    } catch (error) {
        console.error('\n--- OCORREU UM ERRO NO CLIENTE ---');
        console.error(error);
    }
}

main();