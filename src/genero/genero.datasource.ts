import { Genero } from "src/types/genero";

const generos: Genero[] = [];
let idCounter = 1;

export class GeneroDatasource {
    
    async create(data: { nome: string }): Promise<Genero> {
        const novoGenero: Genero = {
            id: idCounter++,
            nome: data.nome,
        };
        generos.push(novoGenero);
        return Promise.resolve(novoGenero);
    }

    async findAll(): Promise<Genero[]> {
        return Promise.resolve(generos);
    }

    async findById(id: number): Promise<Genero | null> {
        const genero = generos.find(g => g.id === id);
        return Promise.resolve(genero || null);
    }

    async update(id: number, data: { nome?: string }): Promise<Genero | null> {
        const index = generos.findIndex(g => g.id === id);
        if (index === -1) {
            return Promise.resolve(null);
        }
        
        const generoExistente = generos[index];
        const generoAtualizado = {
            ...generoExistente,
            ...data,
        };
        
        generos[index] = generoAtualizado;
        return Promise.resolve(generoAtualizado);
    }

    async remove(id: number): Promise<boolean> {
        const index = generos.findIndex(g => g.id === id);
        if (index === -1) {
            return Promise.resolve(false);
        }
        
        generos.splice(index, 1);
        return Promise.resolve(true);
    }
}