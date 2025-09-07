import { AtorDatasource } from "./ator.datasource";


export class AtorService {
    constructor(private datasource: AtorDatasource) {}

    async criarAtor(data: { nome: string, data_nascimento: string }) {
        return this.datasource.create(data);
    }

    async listarAtores() {
        return this.datasource.findAll();
    }

    async obterAtor(id: number) {
        const ator = await this.datasource.findById(id);
        if (!ator) {
            throw new Error('Ator não encontrado.');
        }
        return ator;
    }

    async atualizarAtor(id: number, data: { nome?: string, data_nascimento?: string }) {
        await this.obterAtor(id);
        return this.datasource.update(id, data);
    }

    async deletarAtor(id: number) {
        await this.obterAtor(id);
        return this.datasource.remove(id);
    }
}