
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Home, Activity, Utensils, Droplets, Smile, 
  TrendingUp, User as UserIcon, Plus, CheckCircle2, 
  ChevronRight, Camera, X, Play, Heart, Award, Sparkles,
  BarChart2, Calendar, Lock, Check, Brain, Apple, Info, Flame, Trophy, Flower2, Star
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import MagicImageEditor from './components/MagicImageEditor';
import { db, MEAL_SUGGESTIONS, CHALLENGE_MOTIVATION } from './services/storage';
import { AppScreen, DailyStats, Meal, Workout, MoodLog, User, ChallengeDay, Achievement } from './types';

// --- Helper Components ---

const NavButton = ({ icon: Icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center w-full py-2 transition-colors ${active ? 'text-rose-600' : 'text-gray-400'}`}
  >
    <Icon className={`w-6 h-6 mb-1 ${active ? 'fill-current' : ''}`} />
    <span className="text-[10px] font-medium">{label}</span>
  </button>
);

const SectionHeader = ({ title, subtitle }: { title: string, subtitle?: string }) => (
  <div className="mb-6">
    <h1 className="text-2xl font-bold text-rose-900">{title}</h1>
    {subtitle && <p className="text-gray-500 text-sm mt-1">{subtitle}</p>}
  </div>
);

const Card: React.FC<{ children?: React.ReactNode; className?: string, onClick?: () => void }> = ({ children, className = '', onClick }) => (
  <div onClick={onClick} className={`bg-white rounded-2xl shadow-sm p-4 ${className}`}>
    {children}
  </div>
);

const Logo = () => (
  <div className="flex flex-row items-center justify-center gap-3 py-4">
    {/* SVG Recreation of the Pregnant Silhouette Logo */}
    <svg width="45" height="65" viewBox="0 0 45 65" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-sm">
      <path 
        d="M20 8 C 20 4, 26 4, 26 8 C 26 12, 20 12, 20 8 Z" 
        stroke="#fb7185" strokeWidth="2.5" fill="none"
      />
      <path 
        d="M20 8 C 16 8, 14 12, 12 18 C 11 22, 12 26, 12 26" 
        stroke="#fb7185" strokeWidth="2.5" strokeLinecap="round" fill="none"
      />
      <path 
        d="M26 9 C 28 12, 30 18, 30 22 C 30 25, 27 25, 25 25 C 25 25, 34 28, 36 38 C 38 48, 28 56, 22 58 L 22 62" 
        stroke="#fb7185" strokeWidth="2.5" strokeLinecap="round" fill="none"
      />
      <path 
        d="M12 26 C 10 35, 14 42, 14 42" 
        stroke="#fb7185" strokeWidth="2.5" strokeLinecap="round" fill="none"
      />
       <path 
        d="M18 28 C 16 35, 16 45, 18 55" 
        stroke="#fb7185" strokeWidth="2.5" strokeLinecap="round" fill="none"
      />
    </svg>
    
    <div className="flex flex-col justify-center leading-none items-start">
      <span className="text-rose-400 text-[10px] font-bold tracking-widest uppercase mb-0.5">Emagrecimento</span>
      <span className="text-rose-500 text-2xl font-black tracking-wide uppercase -ml-0.5">Feminino</span>
      <span className="text-rose-400 text-sm font-medium tracking-[0.2em] uppercase">Pós-Parto</span>
    </div>
  </div>
);

// --- Main App ---

const App = () => {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(AppScreen.HOME);
  const [stats, setStats] = useState<DailyStats>(db.getDailyStats());
  const [user, setUser] = useState<User | null>(db.getUser());
  const [challenge, setChallenge] = useState<ChallengeDay[]>(db.getChallenge());
  const [showMagicEditor, setShowMagicEditor] = useState(false);
  const [showRitual, setShowRitual] = useState(false);
  const [selectedChallengeDay, setSelectedChallengeDay] = useState<ChallengeDay | null>(null);
  
  // Custom Workout Feature State
  const [workouts, setWorkouts] = useState<Workout[]>(db.getWorkouts());
  const [showAddWorkout, setShowAddWorkout] = useState(false);
  const [customWorkoutForm, setCustomWorkoutForm] = useState({ title: '', category: '', duration: 15 });
  const [selectedTip, setSelectedTip] = useState<string | null>(null);

  // Nutrition State
  const [meals, setMeals] = useState<Meal[]>(db.getMeals());
  const [mealText, setMealText] = useState('');

  // Gamification State
  const [levelUpData, setLevelUpData] = useState<{show: boolean, oldLevel: number, newLevel: number} | null>(null);
  const [xpNotification, setXpNotification] = useState<{show: boolean, amount: number, label: string} | null>(null);
  const [achievementNotification, setAchievementNotification] = useState<Achievement | null>(null);
  const [dailyVictory, setDailyVictory] = useState<{show: boolean, message: string} | null>(null);

  // Load initial data
  useEffect(() => {
    if (!user) {
      // Create default user if none exists
      const newUser: User = { 
        name: 'Mamãe', 
        birthDate: '2024-01-01', 
        goal: 'Recuperar energia',
        xp: 0,
        level: 1,
        streak: 1,
        lastActiveDate: new Date().toISOString().split('T')[0]
      };
      db.saveUser(newUser);
      setUser(newUser);
    }
  }, [user]);

  // Refresh stats helper
  const refreshStats = useCallback(() => {
    setStats(db.getDailyStats());
    setWorkouts(db.getWorkouts());
  }, []);

  // --- Actions ---

  const triggerXpGain = (amount: number, label: string) => {
      const { user: updatedUser, leveledUp } = db.addXP(amount);
      setUser(updatedUser);
      setXpNotification({ show: true, amount, label });
      setTimeout(() => setXpNotification(null), 2500);

      if (leveledUp) {
          setLevelUpData({ show: true, oldLevel: updatedUser.level - 1, newLevel: updatedUser.level });
      }
  };

  const handleWaterAdd = (amount: number) => {
    const newTotal = stats.water + amount;
    const newStats = { ...stats, water: newTotal };
    db.saveDailyStats(newStats);
    setStats(newStats);
    
    triggerXpGain(10, "Hidratação");
    
    if (newTotal >= 2000 && db.unlockAchievement('2')) {
         const ach = db.getAchievements().find(a => a.id === '2');
         if(ach) setAchievementNotification(ach);
    }
  };

  const handleWorkoutToggle = (id: string) => {
    const currentWorkouts = db.getWorkouts();
    const workoutIndex = currentWorkouts.findIndex(w => w.id === id);
    if (workoutIndex === -1) return;

    const isCompleting = !currentWorkouts[workoutIndex].completed;
    
    const updated = currentWorkouts.map(w => w.id === id ? { ...w, completed: !w.completed } : w);
    db.saveWorkouts(updated);
    setWorkouts(updated); // Update local state for immediate re-render
    
    // Update stats
    const completedCount = updated.filter(w => w.completed).length;
    const newStats = { ...stats, workoutsCompleted: completedCount };
    db.saveDailyStats(newStats);
    setStats(newStats);
    
    if (isCompleting) {
        triggerXpGain(50, "Treino Concluído");
    }

    if (completedCount === updated.length && db.unlockAchievement('1')) {
         const ach = db.getAchievements().find(a => a.id === '1');
         if(ach) setAchievementNotification(ach);
    }
  };

  const handleChallengeToggle = (day: number) => {
    const dayObj = challenge.find(d => d.day === day);
    const isCompleting = dayObj && !dayObj.completed;

    const updated = db.toggleChallengeDay(day);
    setChallenge(updated);
    if (selectedChallengeDay && selectedChallengeDay.day === day) {
        setSelectedChallengeDay(updated.find(d => d.day === day) || null);
    }

    if (isCompleting) {
        // Trigger celebratory visual modal specific for challenge
        const randomMsg = CHALLENGE_MOTIVATION[Math.floor(Math.random() * CHALLENGE_MOTIVATION.length)];
        setDailyVictory({ show: true, message: randomMsg });
        setTimeout(() => setDailyVictory(null), 4000);

        triggerXpGain(100, "Desafio do Dia");
        
        // Check for Challenge Achievements
        const completedCount = updated.filter(c => c.completed).length;
        
        const checkUnlock = (days: number, id: string) => {
            if (completedCount === days) {
                if (db.unlockAchievement(id)) {
                    const ach = db.getAchievements().find(a => a.id === id);
                    if (ach) setAchievementNotification(ach);
                }
            }
        };

        checkUnlock(7, '4');  // Semana de Ouro
        checkUnlock(15, '5'); // Meio Caminho
        checkUnlock(30, '6'); // Rainha da Evolução
    }
  };

  const handleSaveMagicImage = (img: string) => {
    // Save to progress
    const metric = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      weight: 0,
      photo: img
    };
    db.addProgress(metric);
    setShowMagicEditor(false);
    triggerXpGain(30, "Foto Registrada");
  };

  const handleAddCustomWorkout = () => {
    if (!customWorkoutForm.title) return;
    const newWorkout: Workout = {
        id: Date.now().toString(),
        title: customWorkoutForm.title,
        category: customWorkoutForm.category || 'Outro',
        duration: customWorkoutForm.duration,
        completed: false,
        tip: 'Mantenha a postura e respeite seus limites.'
    };
    db.addWorkout(newWorkout);
    setWorkouts(prev => [...prev, newWorkout]);
    setShowAddWorkout(false);
    setCustomWorkoutForm({ title: '', category: '', duration: 15 });
  };

  const handleAddMeal = () => {
    if(!mealText) return;
    const newMeal: Meal = {
      id: Date.now().toString(),
      type: 'Lanche',
      description: mealText,
      timestamp: new Date().toISOString()
    };
    db.addMeal(newMeal);
    setMeals(prev => [...prev, newMeal]);
    setMealText('');
    refreshStats(); // update stats if needed
    triggerXpGain(15, "Refeição Registrada");
  };

  // --- Screens ---

  const renderHome = () => {
    const completedChallengeDays = challenge.filter(c => c.completed).length;
    
    return (
    <div className="space-y-6 pb-24 pt-2">
      
      {/* Logo Section */}
      <Logo />

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-rose-900">Olá, {user?.name} ✨</h1>
          <div className="flex items-center gap-2">
             <span className="text-xs text-rose-600 bg-rose-100 px-2 py-0.5 rounded-full font-medium">Nível {user?.level}</span>
             <div className="flex items-center gap-1 text-xs text-orange-500 font-medium">
                 <Flame className="w-3 h-3 fill-orange-500" />
                 {user?.streak || 0} dias seguidos
             </div>
          </div>
        </div>
        <div 
          className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center cursor-pointer relative overflow-hidden"
          onClick={() => setCurrentScreen(AppScreen.PROFILE)}
        >
          <UserIcon className="w-5 h-5 text-rose-500" />
        </div>
      </div>

      <button 
        onClick={() => { setShowRitual(true); triggerXpGain(20, "Minuto da Mãe"); }}
        className="w-full bg-gradient-to-r from-rose-400 to-rose-500 text-white rounded-3xl p-6 shadow-lg shadow-rose-200 transform transition active:scale-95 relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div className="text-left">
            <h2 className="text-2xl font-bold mb-1">Minuto da Mãe</h2>
            <p className="text-rose-100 text-sm">Seu momento de reconexão.</p>
          </div>
          <div className="bg-white/20 p-3 rounded-full animate-pulse">
            <Play className="w-6 h-6 fill-white" />
          </div>
        </div>
      </button>

      {/* Campaign Card */}
      <Card onClick={() => setCurrentScreen(AppScreen.CHALLENGE)} className="border border-rose-100 bg-rose-50/50 cursor-pointer active:scale-98 transition-transform">
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-rose-500 shadow-sm">
                    <Calendar className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="font-bold text-gray-800 text-sm">Desafio 30 Dias</h3>
                    <p className="text-xs text-gray-500">{completedChallengeDays} de 30 dias completados</p>
                </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>
        <div className="mt-3 w-full bg-white h-2 rounded-full overflow-hidden">
             <div className="bg-gradient-to-r from-rose-300 to-rose-500 h-full" style={{ width: `${(completedChallengeDays / 30) * 100}%` }}></div>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card className="flex flex-col justify-between h-32 border-l-4 border-blue-400">
          <div className="flex justify-between items-start">
            <span className="text-gray-500 text-xs font-semibold uppercase">Água</span>
            <Droplets className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <span className="text-2xl font-bold text-gray-800">{stats.water}</span>
            <span className="text-xs text-gray-400 ml-1">/ 2000ml</span>
          </div>
          <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-blue-400 h-full" style={{ width: `${Math.min((stats.water / 2000) * 100, 100)}%` }}></div>
          </div>
        </Card>

        <Card className="flex flex-col justify-between h-32 border-l-4 border-yellow-400">
           <div className="flex justify-between items-start">
            <span className="text-gray-500 text-xs font-semibold uppercase">Humor</span>
            <Smile className="w-5 h-5 text-yellow-400" />
          </div>
          <div className="text-lg font-medium text-gray-800 truncate">
            {stats.mood || "Como está?"}
          </div>
          <button 
            onClick={() => setCurrentScreen(AppScreen.MOOD)}
            className="text-xs text-rose-500 font-medium hover:underline text-left"
          >
            Registrar agora
          </button>
        </Card>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-800">Treinos de Hoje</h3>
          <span className="text-xs bg-rose-100 text-rose-600 px-2 py-1 rounded-full">{stats.workoutsCompleted} feitos</span>
        </div>
        {workouts.slice(0, 2).map((w) => (
          <div key={w.id} className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
             <button 
                onClick={() => handleWorkoutToggle(w.id)}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${w.completed ? 'bg-green-400 border-green-400' : 'border-gray-300'}`}
              >
                {w.completed && <CheckCircle2 className="w-4 h-4 text-white" />}
              </button>
             <div className="flex-1">
               <p className={`font-medium text-sm ${w.completed ? 'text-gray-400 line-through' : 'text-gray-700'}`}>{w.title}</p>
               <p className="text-xs text-gray-400">{w.duration} min • {w.category}</p>
             </div>
          </div>
        ))}
        <button onClick={() => setCurrentScreen(AppScreen.WORKOUTS)} className="w-full mt-2 text-center text-sm text-rose-500 py-2">Ver todos</button>
      </div>
    </div>
  )};

  const renderChallenge = () => {
    const completedCount = challenge.filter(c => c.completed).length;
    const allAchievements = db.getAchievements();
    const challengeRewards = [
        allAchievements.find(a => a.id === '4'),
        allAchievements.find(a => a.id === '5'),
        allAchievements.find(a => a.id === '6'),
    ].filter(Boolean) as Achievement[];

    return (
        <div className="pb-24">
            <SectionHeader title="Desafio 30 Dias" subtitle="Pequenos passos para uma grande transformação." />
            
            <div className="bg-gradient-to-r from-rose-400 to-rose-600 p-5 rounded-2xl shadow-lg mb-6 text-white relative overflow-hidden">
                <div className="relative z-10 flex flex-col">
                   <div className="flex items-center gap-2 mb-2">
                       <Star className="w-5 h-5 fill-yellow-300 text-yellow-300" />
                       <span className="font-bold text-sm">Ganhe 100 XP por dia</span>
                   </div>
                   <div className="flex items-baseline gap-2">
                       <span className="text-4xl font-bold">{completedCount}</span>
                       <span className="opacity-80">/ 30 dias completados</span>
                   </div>
                   <div className="mt-4 bg-black/20 h-2 rounded-full overflow-hidden w-full">
                       <div className="bg-yellow-400 h-full transition-all duration-1000" style={{ width: `${(completedCount/30)*100}%` }}></div>
                   </div>
                </div>
                <div className="absolute right-[-10px] bottom-[-20px] opacity-20 transform rotate-12">
                     <Calendar className="w-32 h-32 text-white" />
                </div>
            </div>

            <div className="grid grid-cols-5 gap-3 mb-8">
                {challenge.map((day) => (
                    <button
                        key={day.day}
                        onClick={() => setSelectedChallengeDay(day)}
                        className={`aspect-square rounded-xl flex items-center justify-center text-sm font-medium transition-all relative shadow-sm ${
                            day.completed 
                                ? 'bg-rose-500 text-white shadow-md shadow-rose-200' 
                                : 'bg-white text-gray-600 border border-gray-100 hover:border-rose-300'
                        }`}
                    >
                        {day.day}
                        {day.completed && (
                           <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 border border-rose-100">
                               <Check className="w-2.5 h-2.5 text-rose-500" strokeWidth={3} />
                           </div>
                        )}
                    </button>
                ))}
            </div>
            
            <div className="bg-white rounded-2xl p-5 border border-rose-50 shadow-sm">
                <h3 className="font-bold text-gray-800 text-sm mb-4 flex items-center gap-2">
                    <Award className="w-4 h-4 text-yellow-500" />
                    Recompensas do Desafio
                </h3>
                <div className="flex justify-between items-center">
                    {challengeRewards.map((ach, index) => {
                        const daysRequired = index === 0 ? 7 : index === 1 ? 15 : 30;
                        const isUnlocked = !!ach.unlockedAt;
                        
                        return (
                           <div key={ach.id} className="flex flex-col items-center gap-2 w-1/3">
                               <div className={`w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all ${isUnlocked ? 'bg-yellow-50 border-yellow-300 text-3xl shadow-sm scale-110' : 'bg-gray-50 border-gray-100 grayscale opacity-40'}`}>
                                   {ach.icon}
                               </div>
                               <div className="text-center">
                                   <p className={`text-[10px] font-bold ${isUnlocked ? 'text-gray-800' : 'text-gray-400'}`}>{daysRequired} Dias</p>
                                   {isUnlocked && <p className="text-[9px] text-yellow-600 font-medium">Desbloqueado!</p>}
                               </div>
                           </div>
                        )
                    })}
                </div>
            </div>

            <div className="mt-8 text-center px-8">
                <p className="text-rose-800 text-sm italic opacity-70">"A constância é a chave para o sucesso."</p>
            </div>
        </div>
    );
  };

  const renderWorkouts = () => (
    <div className="pb-24 space-y-6 relative">
      <SectionHeader title="Movimente-se" subtitle="Pequenos movimentos, grandes mudanças." />
      <div className="space-y-3">
        {workouts.map((w) => (
           <Card key={w.id} className={`flex items-center gap-4 transition-all ${w.completed ? 'bg-gray-50 opacity-75' : 'hover:shadow-md'}`}>
              <button 
                onClick={() => handleWorkoutToggle(w.id)}
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${w.completed ? 'bg-green-400 border-green-400' : 'border-gray-200'}`}
              >
                {w.completed && <CheckCircle2 className="w-5 h-5 text-white" />}
              </button>
              <div className="flex-1">
                <h3 className={`font-semibold ${w.completed ? 'text-gray-500 line-through' : 'text-gray-800'}`}>{w.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs bg-rose-50 text-rose-600 px-2 py-0.5 rounded-md">{w.category}</span>
                  <span className="text-xs text-gray-400">{w.duration} min</span>
                </div>
              </div>
              <button 
                onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTip(w.tip || "Siga as orientações do seu profissional de saúde.");
                }}
                className="p-2 text-rose-400 hover:bg-rose-50 rounded-full transition-colors"
              >
                <Info className="w-5 h-5" />
              </button>
           </Card>
        ))}
      </div>
      
      {/* Floating Action Button */}
      <div className="fixed bottom-24 right-6">
        <button 
            onClick={() => setShowAddWorkout(true)}
            className="bg-rose-500 text-white p-4 rounded-full shadow-lg shadow-rose-300 hover:bg-rose-600 transition-transform active:scale-95 flex items-center justify-center"
        >
            <Plus className="w-6 h-6" />
        </button>
      </div>
    </div>
  );

  const renderNutrition = () => {
    return (
      <div className="pb-24 space-y-6">
        <SectionHeader title="Nutrição" subtitle="Alimente seu corpo com amor." />
        
        <Card className="bg-rose-50 border border-rose-100">
           <div className="flex gap-2">
             <input 
               type="text" 
               value={mealText}
               onChange={(e) => setMealText(e.target.value)}
               placeholder="O que você comeu?" 
               className="flex-1 bg-white border-0 rounded-xl px-4 text-sm focus:ring-2 focus:ring-rose-200 outline-none"
             />
             <button onClick={handleAddMeal} className="bg-rose-500 text-white p-3 rounded-xl">
               <Plus className="w-5 h-5" />
             </button>
           </div>
           <div className="mt-3 flex gap-2">
             <button 
                onClick={() => setShowMagicEditor(true)}
                className="flex items-center gap-2 text-xs text-rose-600 bg-white px-3 py-2 rounded-lg shadow-sm"
              >
               <Camera className="w-3 h-3" />
               Registrar foto
             </button>
             <button 
                onClick={() => setShowMagicEditor(true)}
                className="flex items-center gap-2 text-xs text-purple-600 bg-purple-50 px-3 py-2 rounded-lg shadow-sm border border-purple-100"
              >
               <Sparkles className="w-3 h-3" />
               Melhorar foto (IA)
             </button>
           </div>
        </Card>

        {/* Quick Suggestions */}
        <div className="mb-2">
            <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2 text-sm">
                <Sparkles className="w-4 h-4 text-yellow-500" />
                Sugestões Rápidas
            </h3>
            <div className="flex overflow-x-auto gap-3 pb-4 -mx-4 px-4 no-scrollbar">
                {MEAL_SUGGESTIONS.map(suggestion => (
                    <button 
                        key={suggestion.id}
                        onClick={() => setMealText(suggestion.title)}
                        className="flex-shrink-0 w-36 bg-white p-3 rounded-xl shadow-sm border border-gray-100 text-left hover:border-rose-300 transition-all active:scale-95"
                    >
                        <div className="text-xl mb-2">{suggestion.icon}</div>
                        <p className="font-bold text-gray-800 text-xs mb-1">{suggestion.title}</p>
                        <span className="inline-block mt-1 text-[9px] bg-green-50 text-green-700 px-1.5 py-0.5 rounded-full font-medium whitespace-nowrap">
                            {suggestion.benefit}
                        </span>
                    </button>
                ))}
            </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-gray-700">Refeições de Hoje</h3>
          {meals.length === 0 && <p className="text-center text-gray-400 py-8">Nenhuma refeição registrada ainda.</p>}
          {meals.map(meal => (
            <div key={meal.id} className="bg-white p-4 rounded-xl flex items-center justify-between shadow-sm">
              <div>
                <p className="font-medium text-gray-800">{meal.description}</p>
                <p className="text-xs text-gray-400">{new Date(meal.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <Utensils className="w-4 h-4 text-green-600" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderWater = () => (
    <div className="pb-24 flex flex-col items-center justify-center h-[80vh]">
      <SectionHeader title="Hidratação" />
      
      <div className="relative w-64 h-64 mb-8">
        <div className="absolute inset-0 rounded-full border-8 border-gray-100"></div>
        <div className="absolute inset-0 rounded-full border-8 border-blue-400 transition-all duration-1000 ease-out"
             style={{ clipPath: `inset(${100 - Math.min((stats.water / 2000) * 100, 100)}% 0 0 0)` }}></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
           <span className="text-4xl font-bold text-blue-500">{stats.water}</span>
           <span className="text-sm text-gray-400">ml</span>
        </div>
      </div>

      <div className="flex gap-4 w-full px-8">
        <button 
          onClick={() => handleWaterAdd(200)}
          className="flex-1 py-4 bg-blue-50 text-blue-600 rounded-2xl font-medium hover:bg-blue-100 transition flex flex-col items-center gap-2"
        >
          <Droplets className="w-6 h-6" />
          +200ml
        </button>
        <button 
          onClick={() => handleWaterAdd(500)}
          className="flex-1 py-4 bg-blue-500 text-white rounded-2xl font-medium hover:bg-blue-600 transition flex flex-col items-center gap-2 shadow-lg shadow-blue-200"
        >
          <Droplets className="w-6 h-6 fill-current" />
          +500ml
        </button>
      </div>
    </div>
  );

  const renderMood = () => {
    const moods = [
      { emoji: '😄', label: 'Feliz' },
      { emoji: '😴', label: 'Cansada' },
      { emoji: '😨', label: 'Ansiosa' },
      { emoji: '😫', label: 'Exausta' },
      { emoji: '😌', label: 'Calma' },
    ];

    const logMood = (m: any) => {
      const log: MoodLog = {
        id: Date.now().toString(),
        emoji: m.emoji,
        label: m.label,
        note: '',
        timestamp: new Date().toISOString()
      };
      db.addMood(log);
      const newStats = { ...stats, mood: m.label };
      db.saveDailyStats(newStats);
      setStats(newStats);
      triggerXpGain(10, "Humor Registrado");
      
      if (db.unlockAchievement('3')) {
           const ach = db.getAchievements().find(a => a.id === '3');
           if(ach) setAchievementNotification(ach);
      }
    };

    return (
      <div className="pb-24 flex flex-col justify-center h-[80vh]">
        <SectionHeader title="Como você está?" subtitle="Seus sentimentos importam." />
        
        <div className="grid grid-cols-2 gap-4 mb-8">
          {moods.map(m => (
            <button
              key={m.label}
              onClick={() => logMood(m)}
              className={`p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition flex flex-col items-center gap-2 ${stats.mood === m.label ? 'ring-2 ring-rose-300 bg-rose-50' : ''}`}
            >
              <span className="text-4xl">{m.emoji}</span>
              <span className="text-sm font-medium text-gray-700">{m.label}</span>
            </button>
          ))}
        </div>
        
        {stats.mood && (
           <div className="bg-rose-100 p-4 rounded-xl text-center">
             <p className="text-rose-800 font-medium">Hoje você está {stats.mood}.</p>
             <p className="text-xs text-rose-600 mt-1">Lembre-se: é apenas um momento.</p>
           </div>
        )}
      </div>
    );
  };

  const renderProgress = () => {
    const progress = db.getProgress();
    const data = progress.map(p => ({
       date: new Date(p.date).toLocaleDateString('pt-BR', {day: '2-digit', month: '2-digit'}),
       peso: p.weight
    })).slice(-7);

    return (
      <div className="pb-24 space-y-6">
         <SectionHeader title="Sua Evolução" subtitle="Cada passo conta." />
         
         <Card className="h-64">
           <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
             <TrendingUp className="w-5 h-5 text-rose-500" />
             Peso
           </h3>
           <ResponsiveContainer width="100%" height="80%">
             <BarChart data={data}>
               <CartesianGrid strokeDasharray="3 3" vertical={false} />
               <XAxis dataKey="date" tick={{fontSize: 10}} />
               <YAxis hide domain={['dataMin - 2', 'dataMax + 2']} />
               <Tooltip cursor={{fill: 'transparent'}} />
               <Bar dataKey="peso" fill="#fda4af" radius={[4, 4, 0, 0]} barSize={20} />
             </BarChart>
           </ResponsiveContainer>
         </Card>

         <div className="grid grid-cols-2 gap-4">
             <Card className="flex flex-col items-center justify-center p-6 bg-rose-500 text-white">
                 <Camera className="w-8 h-8 mb-2" />
                 <span className="text-sm font-medium">Galeria</span>
             </Card>
             <Card 
                onClick={() => setShowMagicEditor(true)}
                className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-rose-200 text-rose-400 cursor-pointer"
             >
                 <Plus className="w-8 h-8 mb-2" />
                 <span className="text-sm font-medium">Adicionar Foto</span>
             </Card>
         </div>
      </div>
    );
  };

  const renderProfile = () => {
      // Garden logic
      const userLevel = user?.level || 1;
      let plantStage = 'Semente';
      let plantIcon = <div className="w-4 h-4 bg-amber-700 rounded-full" />; // Seed

      if (userLevel >= 2 && userLevel < 5) {
          plantStage = 'Broto';
          plantIcon = <div className="text-2xl">🌱</div>;
      } else if (userLevel >= 5 && userLevel < 10) {
          plantStage = 'Muda';
          plantIcon = <div className="text-4xl">🌿</div>;
      } else if (userLevel >= 10) {
          plantStage = 'Flor';
          plantIcon = <div className="text-6xl">🌺</div>;
      }

      return (
        <div className="pb-24 space-y-6">
            <SectionHeader title="Meu Perfil" />
            
            <div className="flex items-center gap-4 bg-white p-6 rounded-2xl shadow-sm">
                <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center text-rose-500 text-2xl font-bold">
                    {user?.name.charAt(0)}
                </div>
                <div>
                    <h2 className="text-lg font-bold text-gray-800">{user?.name}</h2>
                    <p className="text-sm text-gray-500">{user?.goal}</p>
                </div>
            </div>

            {/* Garden of Evolution */}
            <Card className="bg-gradient-to-b from-blue-50 to-amber-50 border border-blue-100 overflow-hidden relative min-h-[160px] flex items-end justify-center">
                 <div className="absolute top-4 left-4">
                     <h3 className="font-bold text-rose-800 flex items-center gap-2">
                         <Flower2 className="w-5 h-5" />
                         Jardim da Evolução
                     </h3>
                     <p className="text-xs text-gray-500">Nível {userLevel} - {plantStage}</p>
                 </div>
                 
                 <div className="mb-4 animate-bounce duration-[2000ms]">
                     {plantIcon}
                 </div>
                 
                 <div className="absolute bottom-0 w-full h-3 bg-amber-200"></div>
            </Card>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-yellow-500" />
                    Conquistas
                </h3>
                <div className="grid grid-cols-4 gap-4">
                    {db.getAchievements().map(ach => (
                        <div key={ach.id} className="flex flex-col items-center text-center gap-1 opacity-100">
                             <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all ${ach.unlockedAt ? 'bg-yellow-100 shadow-sm' : 'bg-gray-100 grayscale opacity-40'}`}>
                                 {ach.icon}
                             </div>
                             <span className="text-[10px] text-gray-500 leading-tight">{ach.title}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      );
  };

  // --- Modals ---
  
  const renderAddWorkoutModal = () => {
    if (!showAddWorkout) return null;
    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
            <div className="bg-white w-full max-w-sm rounded-3xl p-6 space-y-4 animate-in slide-in-from-bottom duration-300">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-800">Novo Treino</h3>
                    <button onClick={() => setShowAddWorkout(false)}><X className="w-6 h-6 text-gray-400" /></button>
                </div>
                
                <div className="space-y-3">
                    <div>
                        <label className="text-sm font-medium text-gray-600 block mb-1">Nome do exercício</label>
                        <input 
                            type="text" 
                            className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-rose-200"
                            placeholder="Ex: Yoga leve"
                            value={customWorkoutForm.title}
                            onChange={(e) => setCustomWorkoutForm({...customWorkoutForm, title: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-600 block mb-1">Categoria</label>
                        <select 
                             className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-rose-200"
                             value={customWorkoutForm.category}
                             onChange={(e) => setCustomWorkoutForm({...customWorkoutForm, category: e.target.value})}
                        >
                            <option value="">Selecione...</option>
                            <option value="Alongamento">Alongamento</option>
                            <option value="Caminhada">Caminhada</option>
                            <option value="Fortalecimento">Fortalecimento</option>
                            <option value="Outro">Outro</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-600 block mb-1">Duração (min)</label>
                        <input 
                            type="number" 
                            className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-rose-200"
                            value={customWorkoutForm.duration}
                            onChange={(e) => setCustomWorkoutForm({...customWorkoutForm, duration: Number(e.target.value)})}
                        />
                    </div>
                </div>

                <button 
                    onClick={handleAddCustomWorkout}
                    disabled={!customWorkoutForm.title}
                    className="w-full bg-rose-500 text-white py-3 rounded-xl font-bold disabled:opacity-50"
                >
                    Adicionar
                </button>
            </div>
        </div>
    )
  };

  const renderTipModal = () => {
      if (!selectedTip) return null;
      return (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-6">
              <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl relative">
                  <button onClick={() => setSelectedTip(null)} className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100"><X className="w-5 h-5 text-gray-500" /></button>
                  <div className="flex flex-col items-center text-center space-y-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 mb-2">
                          <Info className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-800">Como fazer</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{selectedTip}</p>
                      <button 
                        onClick={() => setSelectedTip(null)}
                        className="w-full bg-blue-500 text-white py-2 rounded-xl font-medium mt-4"
                      >
                        Entendi
                      </button>
                  </div>
              </div>
          </div>
      )
  };

  const renderLevelUpModal = () => {
      if (!levelUpData?.show) return null;
      return (
          <div className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-yellow-50 to-white -z-10"></div>
                  <Sparkles className="w-16 h-16 text-yellow-400 mx-auto mb-4 animate-spin-slow" />
                  <h2 className="text-2xl font-bold text-rose-900 mb-2">Parabéns!</h2>
                  <p className="text-gray-600 mb-6">Você subiu para o nível <span className="text-rose-600 font-bold text-xl">{levelUpData.newLevel}</span>!</p>
                  
                  <div className="text-6xl mb-6 animate-bounce">
                      {levelUpData.newLevel >= 10 ? '🌺' : levelUpData.newLevel >= 5 ? '🌿' : levelUpData.newLevel >= 2 ? '🌱' : '🌰'}
                  </div>

                  <p className="text-sm text-gray-500 mb-6">Seu jardim está evoluindo junto com você.</p>

                  <button 
                      onClick={() => setLevelUpData(null)}
                      className="w-full bg-rose-500 text-white py-3 rounded-xl font-bold shadow-lg shadow-rose-200"
                  >
                      Continuar Evoluindo
                  </button>
              </div>
          </div>
      )
  };

  const renderAchievementPopup = () => {
    if (!achievementNotification) return null;
    return (
      <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[70] bg-white rounded-full shadow-2xl p-2 pr-6 flex items-center gap-3 animate-in slide-in-from-top duration-500 border-2 border-yellow-200">
         <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-xl">
            {achievementNotification.icon}
         </div>
         <div className="text-left">
             <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Nova Conquista!</p>
             <p className="text-sm font-bold text-gray-800">{achievementNotification.title}</p>
         </div>
         <button onClick={() => setAchievementNotification(null)} className="ml-2"><X className="w-4 h-4 text-gray-300" /></button>
      </div>
    )
  };
  
  const renderDailyVictoryModal = () => {
      if (!dailyVictory?.show) return null;
      return (
          <div className="fixed inset-0 z-[80] flex items-center justify-center pointer-events-none p-6">
              <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-2xl border-2 border-rose-200 animate-in zoom-in duration-300 flex flex-col items-center text-center max-w-xs">
                  <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mb-4 relative">
                      <Heart className="w-8 h-8 text-rose-500 fill-rose-500 animate-ping absolute opacity-30" />
                      <Heart className="w-8 h-8 text-rose-500 fill-rose-500 relative z-10" />
                  </div>
                  <h3 className="text-xl font-bold text-rose-800 mb-2">Dia Concluído!</h3>
                  <p className="text-gray-600 font-medium mb-4 text-sm leading-relaxed">"{dailyVictory.message}"</p>
                  <div className="bg-yellow-100 text-yellow-700 px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm">
                      <Star className="w-3 h-3 fill-yellow-600" />
                      +100 XP
                  </div>
              </div>
          </div>
      )
  }

  return (
    <div className="min-h-screen bg-[#f5f0eb] text-gray-800 font-sans max-w-md mx-auto relative shadow-2xl overflow-hidden">
      
      {/* XP Notification Toast */}
      {xpNotification?.show && (
          <div className="fixed top-24 right-4 z-50 bg-white/90 backdrop-blur-sm shadow-lg rounded-xl px-4 py-2 flex items-center gap-2 animate-in slide-in-from-right fade-in duration-300 border border-rose-100">
              <span className="text-rose-500 font-bold">+{xpNotification.amount} XP</span>
              <span className="text-xs text-gray-500">{xpNotification.label}</span>
          </div>
      )}

      {/* Main Content Area */}
      <main className="p-6 h-screen overflow-y-auto no-scrollbar scroll-smooth">
        {currentScreen === AppScreen.HOME && renderHome()}
        {currentScreen === AppScreen.CHALLENGE && renderChallenge()}
        {currentScreen === AppScreen.WORKOUTS && renderWorkouts()}
        {currentScreen === AppScreen.NUTRITION && renderNutrition()}
        {currentScreen === AppScreen.WATER && renderWater()}
        {currentScreen === AppScreen.MOOD && renderMood()}
        {currentScreen === AppScreen.PROGRESS && renderProgress()}
        {currentScreen === AppScreen.PROFILE && renderProfile()}
      </main>

      {/* Floating Overlays */}
      {showMagicEditor && (
        <MagicImageEditor 
          onClose={() => setShowMagicEditor(false)} 
          onSave={handleSaveMagicImage} 
        />
      )}

      {showRitual && (
        <div className="fixed inset-0 z-50 bg-rose-50 flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
           <Heart className="w-16 h-16 text-rose-400 mb-6 animate-pulse" />
           <h2 className="text-2xl font-bold text-rose-800 mb-4">Respire fundo...</h2>
           <p className="text-rose-600 mb-8 max-w-xs">"Você é a melhor mãe que seu bebê poderia ter. Cuide de você para cuidar dele."</p>
           <button 
             onClick={() => setShowRitual(false)}
             className="px-8 py-3 bg-white text-rose-500 rounded-full font-medium shadow-md"
           >
             Estou pronta
           </button>
        </div>
      )}
      
      {/* Detail Modal for Challenge */}
      {selectedChallengeDay && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl p-6 w-full max-w-sm relative">
                  <button onClick={() => setSelectedChallengeDay(null)} className="absolute top-4 right-4"><X className="w-5 h-5 text-gray-400" /></button>
                  <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                          {selectedChallengeDay.category === 'body' ? '💪' : selectedChallengeDay.category === 'mind' ? '🧠' : '🥗'}
                      </div>
                      <h2 className="text-xl font-bold text-gray-800">Dia {selectedChallengeDay.day}</h2>
                      <p className="text-rose-500 font-medium">{selectedChallengeDay.title}</p>
                  </div>
                  <p className="text-gray-600 text-center mb-8">{selectedChallengeDay.description}</p>
                  
                  <button 
                      onClick={() => {
                          handleChallengeToggle(selectedChallengeDay.day);
                          // Close modal after slight delay if completing
                          if (!selectedChallengeDay.completed) setTimeout(() => setSelectedChallengeDay(null), 500);
                      }}
                      className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${selectedChallengeDay.completed ? 'bg-green-100 text-green-700' : 'bg-rose-500 text-white shadow-lg shadow-rose-200'}`}
                  >
                      {selectedChallengeDay.completed ? (
                          <>
                            <Check className="w-5 h-5" />
                            Completado!
                          </>
                      ) : 'Marcar como Feito'}
                  </button>
              </div>
          </div>
      )}

      {renderAddWorkoutModal()}
      {renderTipModal()}
      {renderLevelUpModal()}
      {renderAchievementPopup()}
      {renderDailyVictoryModal()}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 pb-6 pt-2 flex justify-between items-center z-40 max-w-md mx-auto">
        <NavButton 
          icon={Home} 
          label="Início" 
          active={currentScreen === AppScreen.HOME} 
          onClick={() => setCurrentScreen(AppScreen.HOME)} 
        />
        <NavButton 
          icon={Activity} 
          label="Treinos" 
          active={currentScreen === AppScreen.WORKOUTS} 
          onClick={() => setCurrentScreen(AppScreen.WORKOUTS)} 
        />
        <div className="relative -top-5">
          <button 
            onClick={() => setCurrentScreen(AppScreen.NUTRITION)}
            className="w-14 h-14 bg-rose-500 rounded-full flex items-center justify-center shadow-lg shadow-rose-200 hover:scale-105 transition-transform"
          >
            <Utensils className="w-6 h-6 text-white" />
          </button>
        </div>
        <NavButton 
          icon={Droplets} 
          label="Água" 
          active={currentScreen === AppScreen.WATER} 
          onClick={() => setCurrentScreen(AppScreen.WATER)} 
        />
        <NavButton 
          icon={UserIcon} 
          label="Perfil" 
          active={currentScreen === AppScreen.PROFILE} 
          onClick={() => setCurrentScreen(AppScreen.PROFILE)} 
        />
      </nav>
    </div>
  );
};

export default App;
