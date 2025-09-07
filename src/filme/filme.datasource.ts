import { AtorDatasource } from "src/ator/ator.datasource";
import { GeneroDatasource } from "src/genero/genero.datasource";
import { Ator } from "src/types/ator";
import { Filme, FilmeCompleto } from "src/types/filme";
import { Genero } from "src/types/genero";

const filmes: Filme[] = [];
let idCounter = 1;

export class FilmeDatasource {
    constructor(
        private atorDatasource: AtorDatasource,
        private generoDatasource: GeneroDatasource
    ) {}

    async create(data: Omit<Filme, 'id'>): Promise<Filme> {
        const novoFilme: Filme = {
            id: idCounter++,
            ...data,
        };
        filmes.push(novoFilme);
        return Promise.resolve(novoFilme);
    }

    async findAll(): Promise<Filme[]> {
        return Promise.resolve(filmes);
    }

    async findById(id: number): Promise<Filme | null> {
        const filme = filmes.find(f => f.id === id);
        return Promise.resolve(filme || null);
    }

    async update(id: number, data: Partial<Omit<Filme, 'id'>>): Promise<Filme | null> {
        const index = filmes.findIndex(f => f.id === id);
        if (index === -1) return null;

        const filmeExistente = filmes[index];
        const filmeAtualizado = { ...filmeExistente, ...data };
        filmes[index] = filmeAtualizado;
        return Promise.resolve(filmeAtualizado);
    }

    async remove(id: number): Promise<boolean> {
        const index = filmes.findIndex(f => f.id === id);
        if (index === -1) return false;
        
        filmes.splice(index, 1);
        return Promise.resolve(true);
    }
    
    async buildCompleto(filme: Filme): Promise<FilmeCompleto> {
        const atores = await Promise.all(
            filme.atoresIds.map(id => this.atorDatasource.findById(id))
        );
        const generos = await Promise.all(
            filme.generosIds.map(id => this.generoDatasource.findById(id))
        );

        return {
            id: filme.id,
            nome: filme.nome,
            ano_lancamento: filme.ano_lancamento,
            sinopse: filme.sinopse,
            atores: atores.filter(a => a !== null) as Ator[],
            generos: generos.filter(g => g !== null) as Genero[],
        };
    }
}