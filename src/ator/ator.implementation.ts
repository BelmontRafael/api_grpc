
import * as grpc from '@grpc/grpc-js';
import { AtorService } from './ator.service';

export const getAtorImplementation = (atorService: AtorService) => {
    return {

        ListarAtores: async (_: any, callback: any) => {
            try {
                const atores = await atorService.listarAtores();
                callback(null, { atores });
            } catch (error: any) {
                callback(error);
            }
        },
        ObterAtor: async (call: any, callback: any) => {
            try {
                const ator = await atorService.obterAtor(call.request.id);
                callback(null, { ator });
            } catch (error: any) {
                callback({ code: grpc.status.NOT_FOUND, message: error.message });
            }
        },
        CriarAtor: async (call: any, callback: any) => {
            try {
                const ator = await atorService.criarAtor(call.request);
                callback(null, { ator });
            } catch (error: any) {
                callback(error);
            }
        },
        AtualizarAtor: async (call: any, callback: any) => {
            try {
                const ator = await atorService.atualizarAtor(call.request.id, call.request);
                callback(null, { ator });
            } catch (error: any) {
                 callback({ code: grpc.status.NOT_FOUND, message: error.message });
            }
        },
        DeletarAtor: async (call: any, callback: any) => {
            try {
                await atorService.deletarAtor(call.request.id);
                callback(null, {});
            } catch (error: any) {
                 callback({ code: grpc.status.NOT_FOUND, message: error.message });
            }
        },
    };
};