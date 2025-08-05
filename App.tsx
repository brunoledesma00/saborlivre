import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import RecipeCard from './components/RecipeCard';
import RecipeCardSkeleton from './components/RecipeCardSkeleton';
import CategorySelector from './components/CategorySelector';
import HeroSection from './components/HeroSection';
import { fetchRecipes } from './services/geminiService';
import type { RecipeWithImage } from './types';
import Tabs from './components/Tabs';
import VideoTutorials from './components/VideoTutorials';

const App: React.FC = () => {
  const [recipes, setRecipes] = useState<RecipeWithImage[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState('receitas');

  const handleSearch = useCallback(async (query: string) => {
    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    setRecipes(null);
    try {
      const results = await fetchRecipes(query);
      setRecipes(results);
    } catch (e: any) {
      setError(e.message || "Ocorreu um erro desconhecido.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const renderRecipeResults = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-8">
            <RecipeCardSkeleton />
            <RecipeCardSkeleton />
            <RecipeCardSkeleton />
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-10 px-4">
          <p className="text-red-600 bg-red-100 border border-red-200 p-4 rounded-md shadow-sm">
            <strong>Oops!</strong> {error}
          </p>
        </div>
      );
    }

    if (hasSearched && recipes?.length === 0) {
      return (
        <div className="text-center py-10 px-4">
          <p className="text-stone-600 text-lg">
            Nenhuma receita encontrada. Que tal tentar uma busca diferente?
          </p>
        </div>
      );
    }

    if (recipes) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-8">
          {recipes.map((recipe, index) => (
            <RecipeCard key={`${recipe.nome}-${index}`} recipe={recipe} />
          ))}
        </div>
      );
    }

    return null;
  };
  
  const renderContent = () => {
    switch(activeTab) {
      case 'receitas':
        return (
          <>
            <section className="mb-4">
              <SearchBar onSearch={handleSearch} isLoading={isLoading} />
            </section>
            <section>
              <CategorySelector onSelectCategory={handleSearch} isLoading={isLoading} />
            </section>
            <section className="mt-4">
              {renderRecipeResults()}
              {!hasSearched && !recipes && <HeroSection />}
            </section>
          </>
        );
      case 'videos':
        return <VideoTutorials />;
      default:
        return null;
    }
  };


  return (
    <div className="min-h-screen flex flex-col bg-stone-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="mt-8">
            {renderContent()}
        </div>
      </main>
      <footer className="w-full bg-white mt-12 py-6 border-t border-stone-200">
          <div className="text-center text-sm text-stone-500">
              <p>Desenvolvido com IA para uma vida mais saborosa.</p>
              <p className="mt-1">Receitas Sem Restrições &copy; {new Date().getFullYear()}</p>
          </div>
      </footer>
    </div>
  );
};

export default App;