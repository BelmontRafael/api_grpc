import { Ator } from "src/types/ator";


const atores: Ator[] = [];
let idCounter = 1;

export class AtorDatasource {
    
    async create(data: { nome: string, data_nascimento: string }): Promise<Ator> {
        const novoAtor: Ator = {
            id: idCounter++,
            ...data,
        };
        atores.push(novoAtor);
        return Promise.resolve(novoAtor);
    }

    async findAll(): Promise<Ator[]> {
        return Promise.resolve(atores);
    }

    async findById(id: number): Promise<Ator | null> {
        const ator = atores.find(a => a.id === id);
        return Promise.resolve(ator || null);
    }

    async update(id: number, data: { nome?: string, data_nascimento?: string }): Promise<Ator | null> {
        const index = atores.findIndex(a => a.id === id);
        if (index === -1) {
            return Promise.resolve(null);
        }
        
        const atorExistente = atores[index];
        const atorAtualizado = {
            ...atorExistente,
            ...data,
        };
        
        atores[index] = atorAtualizado;
        return Promise.resolve(atorAtualizado);
    }

    async remove(id: number): Promise<boolean> {
        const index = atores.findIndex(a => a.id === id);
        if (index === -1) {
            return Promise.resolve(false);
        }
        
        atores.splice(index, 1);
        return Promise.resolve(true);
    }
}