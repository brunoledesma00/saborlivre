import { useState } from 'react';
import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { SearchBar } from '@/components/SearchBar';
import { CategorySelector } from '@/components/CategorySelector';
import { RecipeCard } from '@/components/RecipeCard';
import { RecipeCardSkeleton } from '@/components/RecipeCardSkeleton';
import { WeeklyPlanner } from '@/components/WeeklyPlanner';
import { ShoppingList } from '@/components/ShoppingList';
import { Tabs } from '@/components/Tabs';
import { getRecipesByQuery, getRecipesByCategory } from '@/services/geminiService';
import { Recipe, WeeklyPlan } from '@/types';
import { mockPlan } from '@/data/mockPlan';

/**
 * Componente principal da aplicação de receitas.
 * Gerencia o estado de receitas, busca, lista de compras e planejador semanal.
 */
export default function App() {
  // Gerenciamento de estado da aplicação
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shoppingList, setShoppingList] = useState<string[]>([]);
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlan>(mockPlan);

  // Função para lidar com a busca de receitas por texto
  const handleSearch = async (query: string) => {
    if (!query) return;
    setIsLoading(true);
    setError(null);
    try {
      const fetchedRecipes = await getRecipesByQuery(query);
      setRecipes(fetchedRecipes);
    } catch (err) {
      setError('Desculpe, falha ao buscar receitas. Verifique sua chave de API e tente novamente.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Função para lidar com a seleção de categoria
  const handleSelectCategory = async (category: string) => {
    if (!category || category === 'all') {
      setRecipes([]);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const fetchedRecipes = await getRecipesByCategory(category);
      setRecipes(fetchedRecipes);
    } catch (err) {
      setError('Desculpe, falha ao buscar receitas da categoria. Tente novamente.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Adiciona todos os ingredientes de uma receita à lista de compras
  const handleAddToShoppingList = (recipe: Recipe) => {
    const newIngredients = recipe.ingredients.filter(
      (ingredient) => !shoppingList.includes(ingredient)
    );
    setShoppingList((prevList) => [...prevList, ...newIngredients]);
  };

  // Adiciona uma receita ao planejador semanal
  const handleAddToPlan = (recipe: Recipe, day: keyof WeeklyPlan, meal: 'breakfast' | 'lunch' | 'dinner') => {
    setWeeklyPlan(prevPlan => ({
      ...prevPlan,
      [day]: {
        ...prevPlan[day],
        [meal]: recipe
      }
    }));
  };

  // Definição das abas para a área de planejamento e compras
  const tabs = [
    {
      label: 'Planejador Semanal',
      content: <WeeklyPlanner plan={weeklyPlan} />,
    },
    {
      label: 'Lista de Compras',
      content: <ShoppingList items={shoppingList} setItems={setShoppingList} />,
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <HeroSection />
        <div className="mt-8">
          <SearchBar onSearch={handleSearch} />
          <CategorySelector onSelectCategory={handleSelectCategory} />
        </div>

        {error && <p className="text-center text-red-500 mt-8 font-semibold">{error}</p>}

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading
            ? Array.from({ length: 6 }).map((_, index) => <RecipeCardSkeleton key={index} />)
            : recipes.map((recipe) => (
                <RecipeCard
                  key={recipe.title}
                  recipe={recipe}
                  onAddToShoppingList={() => handleAddToShoppingList(recipe)}
                  onAddToPlan={(day, meal) => handleAddToPlan(recipe, day, meal)}
                />
              ))}
        </div>

        {recipes.length === 0 && !isLoading && !error && (
           <div className="text-center py-16 text-gray-500">
             <h2 className="text-2xl font-semibold">Busque por uma receita ou selecione uma categoria para começar!</h2>
             <p>Ex: "Bolo de chocolate sem glúten"</p>
           </div>
        )}

        <div className="mt-16">
          <Tabs tabs={tabs} />
        </div>
      </main>
    </div>
  );
}
