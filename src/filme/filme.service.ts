import { AtorService } from "src/ator/ator.service";
import { FilmeDatasource } from "./filme.datasource";
import { GeneroService } from "src/genero/genero.service";

export class FilmeService {
    constructor(
        private datasource: FilmeDatasource,
        private atorService: AtorService,
        private generoService: GeneroService,
    ) {}

    async criarFilme(data: { nome: string; ano_lancamento: number; sinopse: string; atoresIds: number[]; generosIds: number[] }) {
        await Promise.all(data.atoresIds.map(id => this.atorService.obterAtor(id)));
        await Promise.all(data.generosIds.map(id => this.generoService.obterGenero(id)));

        const novoFilme = await this.datasource.create(data);
        return this.datasource.buildCompleto(novoFilme);
    }

    async listarFilmes() {
        const todosFilmes = await this.datasource.findAll();
        return Promise.all(todosFilmes.map(f => this.datasource.buildCompleto(f)));
    }

    async obterFilme(id: number) {
        const filme = await this.datasource.findById(id);
        if (!filme) {
            throw new Error('Filme não encontrado.');
        }
        return this.datasource.buildCompleto(filme);
    }

    async atualizarFilme(id: number, data: { nome?: string; ano_lancamento?: number; sinopse?: string }) {
        const filme = await this.obterFilme(id);
        const filmeAtualizado = await this.datasource.update(id, data);
        return this.datasource.buildCompleto(filmeAtualizado!);
    }

    async deletarFilme(id: number) {
        await this.obterFilme(id);
        return this.datasource.remove(id);
    }

    async listarAtoresDeFilme(id: number) {
        const filmeCompleto = await this.obterFilme(id);
        return filmeCompleto.atores;
    }

    async adicionarAtorEmFilme(filmeId: number, atorId: number) {
        const filme = await this.datasource.findById(filmeId);
        if (!filme) throw new Error('Filme não encontrado.');

        await this.atorService.obterAtor(atorId); // Valida se o ator existe

        if (filme.atoresIds.includes(atorId)) {
            return this.datasource.buildCompleto(filme);
        }

        filme.atoresIds.push(atorId);
        const filmeAtualizado = await this.datasource.update(filmeId, { atoresIds: filme.atoresIds });
        return this.datasource.buildCompleto(filmeAtualizado!);
    }
}