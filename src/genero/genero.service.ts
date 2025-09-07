import { GeneroDatasource } from "./genero.datasource";

export class GeneroService {
    constructor(private datasource: GeneroDatasource) {}

    async criarGenero(data: { nome: string }) {
        return this.datasource.create(data);
    }

    async listarGeneros() {
        return this.datasource.findAll();
    }

    async obterGenero(id: number) {
        const genero = await this.datasource.findById(id);
        if (!genero) {
            throw new Error('Gênero não encontrado.');
        }
        return genero;
    }

    async atualizarGenero(id: number, data: { nome?: string }) {
        await this.obterGenero(id);
        return this.datasource.update(id, data);
    }

    async deletarGenero(id: number) {
        await this.obterGenero(id);
        return this.datasource.remove(id);
    }
}