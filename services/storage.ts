
import { DailyStats, Workout, Meal, MoodLog, ProgressMetric, Achievement, User, ChallengeDay, MealSuggestion } from '../types';

// Initial Data
const INITIAL_WORKOUTS: Workout[] = [
  { 
    id: '1', 
    title: 'Respiração Diafragmática', 
    category: 'Respiração', 
    duration: 5, 
    completed: false,
    tip: 'Deite-se de barriga para cima. Coloque uma mão no peito e outra na barriga. Ao inspirar, tente levantar apenas a mão da barriga. Solte o ar lentamente pela boca.'
  },
  { 
    id: '2', 
    title: 'Alongamento Matinal', 
    category: 'Alongamento', 
    duration: 10, 
    completed: false,
    tip: 'Faça movimentos suaves. Estique os braços acima da cabeça, gire os ombros e alongue o pescoço lateralmente. Não force se sentir dor.'
  },
  { 
    id: '3', 
    title: 'Caminhada Leve', 
    category: 'Caminhada', 
    duration: 20, 
    completed: false,
    tip: 'Mantenha a coluna ereta e contraia levemente o abdômen para proteger a lombar. Use tênis confortáveis e mantenha um ritmo constante.'
  },
  { 
    id: '4', 
    title: 'Mobilidade de Quadril', 
    category: 'Mobilidade', 
    duration: 8, 
    completed: false,
    tip: 'Deitada, dobre os joelhos e deixe-os cair suavemente para um lado e depois para o outro. Mantenha os ombros no chão.'
  },
];

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: '1', title: 'Primeiro Passo', description: 'Completou o primeiro dia', icon: '🌱', unlockedAt: null },
  { id: '2', title: 'Hidratada', description: 'Bebeu 2L de água', icon: '💧', unlockedAt: null },
  { id: '3', title: 'Mãe Zen', description: 'Registrou humor por 3 dias', icon: '🧘‍♀️', unlockedAt: null },
  { id: '4', title: 'Semana de Ouro', description: 'Completou 7 dias do desafio', icon: '⭐', unlockedAt: null },
  { id: '5', title: 'Meio Caminho', description: 'Completou 15 dias do desafio', icon: '🚀', unlockedAt: null },
  { id: '6', title: 'Rainha da Evolução', description: 'Completou todos os 30 dias', icon: '👑', unlockedAt: null },
];

const INITIAL_CHALLENGE: ChallengeDay[] = [
  { day: 1, title: 'Início Hidratado', description: 'Sua meta hoje é beber 2.5L de água. O básico que funciona.', completed: false, category: 'nutrition' },
  { day: 2, title: 'Alongamento Matinal', description: '5 minutos de alongamento assim que acordar.', completed: false, category: 'body' },
  { day: 3, title: 'Afirmação Positiva', description: 'Olhe no espelho e diga 3 qualidades suas.', completed: false, category: 'mind' },
  { day: 4, title: 'Prato Colorido', description: 'Seu almoço precisa ter pelo menos 3 cores diferentes.', completed: false, category: 'nutrition' },
  { day: 5, title: 'Caminhada Rápida', description: '15 minutos de caminhada, pode ser com o carrinho!', completed: false, category: 'body' },
  { day: 6, title: 'Desconexão', description: 'Fique 1 hora sem redes sociais hoje.', completed: false, category: 'mind' },
  { day: 7, title: 'Zero Açúcar', description: 'Tente não consumir doces ou açúcar hoje.', completed: false, category: 'nutrition' },
  { day: 8, title: 'Respiração', description: 'Faça 10 respirações profundas antes de dormir.', completed: false, category: 'mind' },
  { day: 9, title: 'Vegetais', description: 'Inclua uma porção extra de vegetais no jantar.', completed: false, category: 'nutrition' },
  { day: 10, title: 'Mobilidade', description: 'Faça um exercício de mobilidade de quadril.', completed: false, category: 'body' },
  { day: 11, title: 'Gratidão', description: 'Escreva 3 coisas pelas quais é grata.', completed: false, category: 'mind' },
  { day: 12, title: 'Fruta no Lanche', description: 'Troque um lanche processado por uma fruta.', completed: false, category: 'nutrition' },
  { day: 13, title: 'Agachamentos', description: '3 séries de 10 agachamentos (se liberado).', completed: false, category: 'body' },
  { day: 14, title: 'Autocuidado', description: 'Use um creme hidratante com calma no corpo todo.', completed: false, category: 'mind' },
  { day: 15, title: 'Metade do Caminho!', description: 'Tire uma foto e compare com o dia 1.', completed: false, category: 'body' },
  { day: 16, title: 'Chá Calmante', description: 'Tome um chá de camomila ou melissa à noite.', completed: false, category: 'nutrition' },
  { day: 17, title: 'Sem Fritura', description: 'Evite alimentos fritos hoje.', completed: false, category: 'nutrition' },
  { day: 18, title: 'Playlist Favorita', description: 'Ouça músicas que te deixam feliz por 20 min.', completed: false, category: 'mind' },
  { day: 19, title: 'Fortalecimento', description: 'Exercício de ponte: 3x de 30 segundos.', completed: false, category: 'body' },
  { day: 20, title: 'Jantar Leve', description: 'Faça um jantar leve até às 20h.', completed: false, category: 'nutrition' },
  { day: 21, title: 'Meditação Flash', description: '3 minutos de silêncio absoluto.', completed: false, category: 'mind' },
  { day: 22, title: 'Proteína', description: 'Garanta uma boa fonte de proteína em todas as refeições.', completed: false, category: 'nutrition' },
  { day: 23, title: 'Dança', description: 'Dance com seu bebê ou sozinha por 10 min.', completed: false, category: 'body' },
  { day: 24, title: 'Leitura', description: 'Leia 5 páginas de um livro.', completed: false, category: 'mind' },
  { day: 25, title: 'Sem Telas', description: 'Desligue o celular 30 min antes de dormir.', completed: false, category: 'mind' },
  { day: 26, title: 'Suco Verde', description: 'Tome um suco verde ou detox pela manhã.', completed: false, category: 'nutrition' },
  { day: 27, title: 'Organização', description: 'Arrume uma gaveta ou canto bagunçado.', completed: false, category: 'mind' },
  { day: 28, title: 'Treino Completo', description: 'Faça 20 min de exercícios variados.', completed: false, category: 'body' },
  { day: 29, title: 'Sorriso', description: 'Sorria para você sempre que passar num espelho.', completed: false, category: 'mind' },
  { day: 30, title: 'Celebração!', description: 'Você conseguiu! Faça algo especial para você.', completed: false, category: 'body' },
];

export const MEAL_SUGGESTIONS: MealSuggestion[] = [
  { id: '1', title: 'Iogurte + Frutas', description: 'Iogurte natural, morangos e granola caseira.', benefit: 'Cálcio e Fibras', icon: '🍓' },
  { id: '2', title: 'Omelete Rápido', description: '2 ovos batidos com espinafre e tomate.', benefit: 'Proteína e Ferro', icon: '🍳' },
  { id: '3', title: 'Mix de Castanhas', description: 'Nozes, castanhas e amêndoas (punhado).', benefit: 'Gorduras Boas', icon: '🥜' },
  { id: '4', title: 'Torrada de Abacate', description: 'Pão integral com meio abacate amassado.', benefit: 'Energia', icon: '🥑' },
  { id: '5', title: 'Suco Verde', description: 'Couve, limão, maçã e gengibre.', benefit: 'Detox', icon: '🥬' },
  { id: '6', title: 'Banana com Aveia', description: 'Banana amassada com aveia e um fio de mel.', benefit: 'Pré-treino', icon: '🍌' }
];

export const CHALLENGE_MOTIVATION = [
  "Você é o mundo do seu bebê, e está se cuidando para ele.",
  "Maternidade real é feita de pequenos passos. Você está brilhando!",
  "Sua força é silenciosa, mas move montanhas. Parabéns!",
  "Não existe mãe perfeita, existe você, que é a melhor.",
  "Esse momento é seu, e você merece cada segundo.",
  "Cuidar de você é o melhor presente para sua família.",
  "Um dia de cada vez, você está evoluindo lindamente.",
  "Sinta orgulho de quem você é hoje."
];

const KEYS = {
  USER: 'mae_user',
  STATS: 'mae_stats',
  WORKOUTS: 'mae_workouts',
  MEALS: 'mae_meals',
  MOODS: 'mae_moods',
  PROGRESS: 'mae_progress',
  ACHIEVEMENTS: 'mae_achievements',
  CHALLENGE: 'mae_challenge'
};

// Helper to get today's date key
const getTodayKey = () => new Date().toISOString().split('T')[0];

const calculateLevel = (xp: number) => {
  // Simple formula: Level = sqrt(xp / 100)
  // Level 1: 0-99 XP
  // Level 2: 100-399 XP
  // Level 3: 400-899 XP...
  if (xp < 100) return 1;
  return Math.floor(Math.sqrt(xp / 100)) + 1;
};

export const db = {
  getUser: (): User | null => {
    const data = localStorage.getItem(KEYS.USER);
    return data ? JSON.parse(data) : null;
  },
  
  saveUser: (user: User) => localStorage.setItem(KEYS.USER, JSON.stringify(user)),

  // Gamification: Add XP and Check Level Up
  addXP: (amount: number): { user: User, leveledUp: boolean } => {
    const currentUser = db.getUser();
    if (!currentUser) throw new Error("User not found");

    const oldLevel = currentUser.level;
    const newXP = (currentUser.xp || 0) + amount;
    const newLevel = calculateLevel(newXP);
    
    // Check Streak
    const today = getTodayKey();
    let newStreak = currentUser.streak || 0;
    
    // If last active date was yesterday, increment streak
    // If last active date was today, keep streak
    // If last active date was before yesterday, reset to 1
    const lastDate = new Date(currentUser.lastActiveDate || '2000-01-01');
    const todayDate = new Date();
    const diffTime = Math.abs(todayDate.getTime() - lastDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

    if (currentUser.lastActiveDate !== today) {
         // Different day
         if (diffDays <= 2) { // 2 because if I did it yesterday (diff 1 day), streak continues
             newStreak += 1;
         } else {
             newStreak = 1;
         }
    }

    const updatedUser: User = {
      ...currentUser,
      xp: newXP,
      level: newLevel,
      streak: newStreak,
      lastActiveDate: today
    };

    db.saveUser(updatedUser);
    return { user: updatedUser, leveledUp: newLevel > oldLevel };
  },

  getDailyStats: (): DailyStats => {
    const today = getTodayKey();
    const stored = localStorage.getItem(`${KEYS.STATS}_${today}`);
    if (stored) return JSON.parse(stored);
    
    return {
      water: 0,
      mood: '',
      workoutsCompleted: 0,
      mealsLogged: 0,
      lastRitual: null,
    };
  },
  saveDailyStats: (stats: DailyStats) => {
    const today = getTodayKey();
    localStorage.setItem(`${KEYS.STATS}_${today}`, JSON.stringify(stats));
  },

  getWorkouts: (): Workout[] => {
    const today = getTodayKey();
    const stored = localStorage.getItem(`${KEYS.WORKOUTS}_${today}`);
    return stored ? JSON.parse(stored) : INITIAL_WORKOUTS;
  },
  saveWorkouts: (workouts: Workout[]) => {
    const today = getTodayKey();
    localStorage.setItem(`${KEYS.WORKOUTS}_${today}`, JSON.stringify(workouts));
  },
  addWorkout: (workout: Workout) => {
      const current = db.getWorkouts();
      db.saveWorkouts([...current, workout]);
  },

  getMeals: (): Meal[] => {
    const data = localStorage.getItem(KEYS.MEALS);
    return data ? JSON.parse(data) : [];
  },
  addMeal: (meal: Meal) => {
    const meals = db.getMeals();
    localStorage.setItem(KEYS.MEALS, JSON.stringify([...meals, meal]));
  },

  getMoods: (): MoodLog[] => {
    const data = localStorage.getItem(KEYS.MOODS);
    return data ? JSON.parse(data) : [];
  },
  addMood: (mood: MoodLog) => {
    const moods = db.getMoods();
    localStorage.setItem(KEYS.MOODS, JSON.stringify([...moods, mood]));
  },

  getProgress: (): ProgressMetric[] => {
    const data = localStorage.getItem(KEYS.PROGRESS);
    return data ? JSON.parse(data) : [];
  },
  addProgress: (metric: ProgressMetric) => {
    const progress = db.getProgress();
    localStorage.setItem(KEYS.PROGRESS, JSON.stringify([...progress, metric]));
  },

  getAchievements: (): Achievement[] => {
    const data = localStorage.getItem(KEYS.ACHIEVEMENTS);
    return data ? JSON.parse(data) : INITIAL_ACHIEVEMENTS;
  },
  
  // Updated: Returns boolean if just unlocked
  unlockAchievement: (id: string): boolean => {
    const achievements = db.getAchievements();
    const achievement = achievements.find(a => a.id === id);
    if (!achievement || achievement.unlockedAt) return false; // Already unlocked or not found

    const updated = achievements.map(a => a.id === id ? { ...a, unlockedAt: new Date().toISOString() } : a);
    localStorage.setItem(KEYS.ACHIEVEMENTS, JSON.stringify(updated));
    return true; // Successfully unlocked just now
  },

  getChallenge: (): ChallengeDay[] => {
    const data = localStorage.getItem(KEYS.CHALLENGE);
    return data ? JSON.parse(data) : INITIAL_CHALLENGE;
  },
  saveChallenge: (challenge: ChallengeDay[]) => {
    localStorage.setItem(KEYS.CHALLENGE, JSON.stringify(challenge));
  },
  toggleChallengeDay: (day: number) => {
    const challenge = db.getChallenge();
    const updated = challenge.map(d => d.day === day ? { ...d, completed: !d.completed } : d);
    db.saveChallenge(updated);
    return updated;
  }
};
