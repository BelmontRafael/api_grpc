import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import { GeneroDatasource } from './genero/genero.datasource';
import { GeneroService } from './genero/genero.service';
import { getGeneroImplementation } from './genero/genero.implementation';
import { AtorDatasource } from './ator/ator.datasource';
import { AtorService } from './ator/ator.service';
import { getAtorImplementation } from './ator/ator.implementation';
import { getFilmeImplementation } from './filme/filme.implementation';
import { FilmeService } from './filme/filme.service';
import { FilmeDatasource } from './filme/filme.datasource';

const PROTO_PATH = path.resolve(__dirname, '../proto/filmes.proto');

export function startGrpcServer() {

    const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true,
    });

    const filmesProto = grpc.loadPackageDefinition(packageDefinition).filmes as any;

    const generoDatasource = new GeneroDatasource();
    const generoService = new GeneroService(generoDatasource);
    const generoImplementation = getGeneroImplementation(generoService);

    const atorDatasource = new AtorDatasource();
    const atorService = new AtorService(atorDatasource);
    const atorImplementation = getAtorImplementation(atorService);

    const filmeDatasource = new FilmeDatasource(atorDatasource, generoDatasource);
    const filmeService = new FilmeService(filmeDatasource, atorService, generoService);
    const filmeImplementation = getFilmeImplementation(filmeService);
    
    const server = new grpc.Server();

    server.addService(filmesProto.GeneroService.service, generoImplementation);
    server.addService(filmesProto.AtorService.service, atorImplementation);
    server.addService(filmesProto.FilmeService.service, filmeImplementation);

    server.bindAsync('127.0.0.1:50051', grpc.ServerCredentials.createInsecure(), (err, port) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(`Servidor gRPC rodando na porta ${port}`);
        server.start();
    });
}