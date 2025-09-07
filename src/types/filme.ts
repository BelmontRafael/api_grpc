import { Ator } from "./ator";
import { Genero } from "./genero";

export interface Filme {
    id: number;
    nome: string;
    ano_lancamento: number;
    sinopse: string;
    atoresIds: number[];
    generosIds: number[];
}

export interface FilmeCompleto extends Omit<Filme, 'atoresIds' | 'generosIds'> {
    atores: Ator[];
    generos: Genero[];
}