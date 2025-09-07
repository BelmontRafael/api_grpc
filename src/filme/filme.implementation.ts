import * as grpc from '@grpc/grpc-js';
import { FilmeService } from './filme.service';

export const getFilmeImplementation = (filmeService: FilmeService) => {
    return {
        ListarFilmes: async (_: any, callback: any) => {
            try {
                const filmes = await filmeService.listarFilmes();
                callback(null, { filmes });
            } catch (error: unknown) {
                let errorMessage = "Erro ao listar filmes.";
                if (error instanceof Error) {
                    errorMessage = error.message;
                }
                callback({ code: grpc.status.INTERNAL, message: errorMessage });
            }
        },
        ObterFilme: async (call: any, callback: any) => {
            try {
                const filme = await filmeService.obterFilme(call.request.id);
                callback(null, { filme });
            } catch (error: unknown) {
                let errorMessage = "Erro ao obter o filme.";
                if (error instanceof Error) {
                    errorMessage = error.message;
                }
                callback({ code: grpc.status.NOT_FOUND, message: errorMessage });
            }
        },
        CriarFilme: async (call: any, callback: any) => {
            try {
                const filme = await filmeService.criarFilme(call.request);
                callback(null, { filme });
            } catch (error: unknown) {
                let errorMessage = "Erro ao criar o filme.";
                if (error instanceof Error) {
                    errorMessage = error.message;
                }
                callback({ code: grpc.status.INVALID_ARGUMENT, message: errorMessage });
            }
        },
        AtualizarFilme: async (call: any, callback: any) => {
            try {
                const filme = await filmeService.atualizarFilme(call.request.id, call.request);
                callback(null, { filme });
            } catch (error: unknown) {
                let errorMessage = "Erro ao atualizar o filme.";
                if (error instanceof Error) {
                    errorMessage = error.message;
                }
                callback({ code: grpc.status.NOT_FOUND, message: errorMessage });
            }
        },
        DeletarFilme: async (call: any, callback: any) => {
            try {
                await filmeService.deletarFilme(call.request.id);
                callback(null, {});
            } catch (error: unknown) {
                let errorMessage = "Erro ao deletar o filme.";
                if (error instanceof Error) {
                    errorMessage = error.message;
                }
                callback({ code: grpc.status.NOT_FOUND, message: errorMessage });
            }
        },
        ListarAtoresDeFilme: async (call: any, callback: any) => {
             try {
                const atores = await filmeService.listarAtoresDeFilme(call.request.id);
                callback(null, { atores });
            } catch (error: unknown) {
                let errorMessage = "Erro ao listar atores do filme.";
                if (error instanceof Error) {
                    errorMessage = error.message;
                }
                callback({ code: grpc.status.NOT_FOUND, message: errorMessage });
            }
        },
        AdicionarAtorEmFilme: async (call: any, callback: any) => {
            try {
                const filme = await filmeService.adicionarAtorEmFilme(call.request.filmeId, call.request.atorId);
                callback(null, { filme });
            } catch (error: unknown) {
                let errorMessage = "Erro ao adicionar ator ao filme.";
                if (error instanceof Error) {
                    errorMessage = error.message;
                }
                callback({ code: grpc.status.NOT_FOUND, message: errorMessage });
            }
        },
    };
};