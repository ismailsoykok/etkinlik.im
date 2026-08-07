import { createContext, useContext, useState, useEffect } from 'react';
import { taskService, parseTask } from '../api/taskService';
import { authService } from '../api/authService';
import { toast } from 'react-toastify';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = authService.getCurrentUser();

  const fetchFavorites = async () => {
    if (!user) {
      setFavoriteIds(new Set());
      setFavorites([]);
      return;
    }
    setLoading(true);
    try {
      const data = await taskService.getFavorites();
      const content = data.content || data || [];
      const idSet = new Set(content.map(task => task.id));
      setFavoriteIds(idSet);
      setFavorites(content.map(parseTask));
    } catch (err) {
      console.error("Favoriler yuklenirken hata:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [user]);

  const toggleFavorite = async (event) => {
    if (!user) {
      toast.info('Favorilere eklemek için giriş yapmalısınız.');
      return;
    }
    const taskId = event.id;
    const isFav = favoriteIds.has(taskId);
    
    try {
      if (isFav) {
        // Optimistic update
        setFavoriteIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(taskId);
          return newSet;
        });
        setFavorites(prev => prev.filter(t => t.id !== taskId));
        
        await taskService.removeFavorite(taskId);
      } else {
        // Optimistic update
        setFavoriteIds(prev => {
          const newSet = new Set(prev);
          newSet.add(taskId);
          return newSet;
        });
        setFavorites(prev => [...prev, event]);
        
        await taskService.addFavorite(taskId);
      }
    } catch (err) {
      console.error('Favori isleminde hata:', err);
      toast.error('İşlem başarısız.');
      // Rollback on failure
      fetchFavorites(); 
    }
  };

  return (
    <FavoritesContext.Provider value={{ favoriteIds, favorites, loadingFavorites: loading, toggleFavorite, fetchFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
