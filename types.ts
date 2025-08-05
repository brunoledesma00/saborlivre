
export interface Recipe {
  nome: string;
  descricao:string;
  ingredientes: string[];
  instrucoes: string[];
  tempoDePreparo: string;
  nivelDeDificuldade: 'Fácil' | 'Médio' | 'Difícil';
}

export interface RecipeWithImage extends Recipe {
  imageUrl: string;
}

export interface WeeklyPlan {
  [day: string]: {
    [meal: string]: RecipeWithImage | null;
  };
}
