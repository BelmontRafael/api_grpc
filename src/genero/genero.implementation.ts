
import * as grpc from '@grpc/grpc-js';
import { GeneroService } from './genero.service';


export const getGeneroImplementation = (generoService: GeneroService) => {
    return {
        ListarGeneros: async (_: any, callback: any) => {
            try {
                const generos = await generoService.listarGeneros();
                callback(null, { generos });
            } catch (error) {
                callback(error);
            }
        },
        ObterGenero: async (call: any, callback: any) => {
            try {
                const genero = await generoService.obterGenero(call.request.id);
                callback(null, { genero });
            } catch (error: any) {
                callback({
                    code: grpc.status.NOT_FOUND,
                    message: error.message,
                });
            }
        },
        CriarGenero: async (call: any, callback: any) => {
            try {
                const genero = await generoService.criarGenero(call.request);
                callback(null, { genero });
            } catch (error) {
                callback(error);
            }
        },
        AtualizarGenero: async (call: any, callback: any) => {
            try {
                const genero = await generoService.atualizarGenero(call.request.id, { nome: call.request.nome });
                callback(null, { genero });
            } catch (error: any) {
                 callback({
                    code: grpc.status.NOT_FOUND,
                    message: error.message,
                });
            }
        },
        DeletarGenero: async (call: any, callback: any) => {
            try {
                await generoService.deletarGenero(call.request.id);
                callback(null, {});
            } catch (error: any) {
                callback({
                    code: grpc.status.NOT_FOUND,
                    message: error.message,
                });
            }
        },
    };
};