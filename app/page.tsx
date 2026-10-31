'use client';


import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { calculateDailyTargets, generateMealSuggestions } from './actions';
import AuthScreen from '../components/AuthScreen';
import WelcomeScreen from '../components/WelcomeScreen';
import OnboardingFlow from '../components/onboarding/OnboardingFlow';
import Dashboard from '../components/Dashboard';
import AddFoodChoice from '../components/AddFoodChoice';
import AnalysisPage from '../components/AnalysisPage';
import ManualEntry from '../components/ManualEntry';
import MealSuggestions from '../components/MealSuggestions';

import Notifications from '../components/Notifications';
import Profile from '../components/Profile';
import SideMenu from '../components/SideMenu';

import MealDetails from '../components/MealDetails';
import { createClient } from '../lib/supabase/client';
import type { MealLog, MealLogInsert, OnboardingData, ProfileUpsert, UserProfile, UserProfileForm } from '../lib/database.types';

// Basic Meal Type for storage
interface LoggedMeal {
  id: string;
  name: string;
  portion: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  timestamp: number;
}

type View = 'loading' | 'welcome' | 'auth' | 'onboarding' | 'dashboard' | 'add-food' | 'analysis-page' | 'manual-entry' | 'suggestions' | 'meal-details' | 'notifications' | 'profile';

const formatLocalDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const mapProfile = (profile: UserProfile): UserProfileForm & { id: string } => ({
  id: profile.id,
  name: profile.name,
  age: String(profile.age),
  gender: profile.gender,
  height: String(profile.height_cm),
  weight: String(profile.weight_kg),
  goal: profile.goal,
  diet: profile.diet,
  activityLevel: profile.activity_level,
  location: profile.location,
  allergies: profile.allergies,
  calories: profile.calories,
  protein: profile.protein,
  carbs: profile.carbs,
  fats: profile.fats,
  targetExplanation: profile.target_explanation,
});

const isCompleteProfile = (profile: Partial<UserProfileForm>): profile is UserProfileForm =>
  typeof profile.name === 'string'
  && typeof profile.age === 'string'
  && typeof profile.gender === 'string'
  && typeof profile.height === 'string'
  && typeof profile.weight === 'string'
  && typeof profile.goal === 'string'
  && typeof profile.diet === 'string'
  && typeof profile.activityLevel === 'string'
  && typeof profile.location === 'string'
  && typeof profile.allergies === 'string'
  && typeof profile.calories === 'number'
  && typeof profile.protein === 'number'
  && typeof profile.carbs === 'number'
  && typeof profile.fats === 'number'
  && typeof profile.targetExplanation === 'string';

const mapMealLog = (meal: MealLog): LoggedMeal => ({
  id: meal.id,
  name: meal.name,
  portion: meal.portion,
  calories: Number(meal.calories),
  protein: Number(meal.protein),
  carbs: Number(meal.carbs),
  fats: Number(meal.fats),
  timestamp: new Date(meal.created_at).getTime(),
});

export default function Home() {
  const [view, setView] = useState<View>('loading');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [appError, setAppError] = useState('');

  // Data State
  const [dailyLogs, setDailyLogs] = useState<Record<string, LoggedMeal[]>>({});
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [userProfile, setUserProfile] = useState<Partial<UserProfileForm>>({});

  // Analysis State
  const [analysisResult, setAnalysisResult] = useState<Record<string, unknown> | null>(null);
  const [analysisImage, setAnalysisImage] = useState<string>('');
  const [selectedMeal, setSelectedMeal] = useState<string | null>(null);

  // Suggestions Cache State
  const [mealSuggestions, setMealSuggestions] = useState<Array<{
    name: string;
    description: string;
    calories: number;
    tags: string[];
    diet_type: 'Veg' | 'Non-Veg' | 'Egg';
  }>>([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [suggestionsFilter, setSuggestionsFilter] = useState('Balanced');
  const [suggestionsError, setSuggestionsError] = useState('');

  // Targets based on Profile
  const getTargets = () => {
    const cals = userProfile.calories ?? 2100;

    // Use stored smart macros if available, otherwise fallback to rough split
    const p = userProfile.protein ?? Math.round(cals * 0.25 / 4);
    const c = userProfile.carbs ?? Math.round(cals * 0.45 / 4);
    const f = userProfile.fats ?? Math.round(cals * 0.30 / 9);

    return {
      calories: cals,
      protein: p,
      carbs: c,
      fats: f
    };
  };

  const TARGETS = getTargets();

  useEffect(() => {
    let active = true;
    const supabase = createClient();

    const loadUserData = async (id: string) => {
      setView('loading');
      setAppError('');
      try {
        const [profileResult, logsResult] = await Promise.all([
          supabase.from('profiles').select('*').eq('id', id).maybeSingle(),
          supabase.from('meal_logs')
            .select('*')
            .eq('user_id', id)
            .order('meal_date', { ascending: false })
            .order('created_at', { ascending: true }),
        ]);
        if (profileResult.error) throw profileResult.error;
        if (logsResult.error) throw logsResult.error;
        if (!active) return;

        const profile = profileResult.data as unknown as UserProfile | null;
        setUserProfile(profile ? mapProfile(profile) : {});
        setDailyLogs((logsResult.data as unknown as MealLog[]).reduce<Record<string, LoggedMeal[]>>((logs, row) => {
          logs[row.meal_date] ??= [];
          logs[row.meal_date].push(mapMealLog(row));
          return logs;
        }, {}));
        setView(profile?.onboarding_complete ? 'dashboard' : 'onboarding');
      } catch (error) {
        console.error('Failed to load account data from Supabase.', error);
        if (active) {
          setAppError('Could not load your account data. Check your connection and try again.');
          setView('loading');
        }
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        setUserId(null);
        setUserProfile({});
        setDailyLogs({});
        setView('welcome');
        return;
      }
      setUserId(session.user.id);
      setTimeout(() => {
        if (active) void loadUserData(session.user.id);
      }, 0);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [reloadKey]);

  const getLogDateKey = formatLocalDate;

  const getCurrentDayLogs = () => {
    const key = getLogDateKey(currentDate);
    return dailyLogs[key] || [];
  };

  const calculateMacros = () => {
    const logs = getCurrentDayLogs();
    const current = logs.reduce((acc, meal) => ({
      calories: acc.calories + meal.calories,
      protein: acc.protein + meal.protein,
      carbs: acc.carbs + meal.carbs,
      fats: acc.fats + meal.fats
    }), { calories: 0, protein: 0, carbs: 0, fats: 0 });

    return {
      calories: { current: current.calories, target: TARGETS.calories },
      protein: { current: current.protein, target: TARGETS.protein },
      carbs: { current: current.carbs, target: TARGETS.carbs },
      fats: { current: current.fats, target: TARGETS.fats }
    };
  };

  // Nav Handlers
  const handlePrevDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 1);
    setCurrentDate(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 1);
    setCurrentDate(newDate);
  };

  // Add Meal Logic
  const addMealToLog = async (
    name: string,
    portion: string,
    calories: number,
    protein: number = 0,
    carbs: number = 0,
    fats: number = 0,
  ) => {
    if (!userId) throw new Error('You must be signed in to save a meal.');
    const key = getLogDateKey(currentDate);
    const entry: MealLogInsert = {
      user_id: userId,
      meal_date: key,
      name,
      portion,
      calories,
      protein,
      carbs,
      fats
    };

    const { data, error } = await createClient().from('meal_logs').insert(entry).select('*').single();
    if (error) throw error;
    const newMeal = mapMealLog(data as unknown as MealLog);
    setDailyLogs((logs) => ({ ...logs, [key]: [...(logs[key] || []), newMeal] }));
  };

  const handleOpenAuth = () => {
    setView('auth');
  };

  const handleOnboardingComplete = async (data: OnboardingData) => {
    if (!userId) throw new Error('Your session expired. Please sign in again.');
    const result = await calculateDailyTargets(data);
    if (!result.success) {
      throw new Error(result.error);
    }

    const profile: ProfileUpsert = {
      id: userId,
      name: data.name.trim(),
      age: Number(data.age),
      gender: data.gender as UserProfileForm['gender'],
      height_cm: Number(data.height),
      weight_kg: Number(data.weight),
      goal: data.goal as UserProfileForm['goal'],
      diet: data.diet as UserProfileForm['diet'],
      activity_level: data.activityLevel as UserProfileForm['activityLevel'],
      location: data.location.trim(),
      allergies: data.allergies.trim(),
      calories: result.data.calories,
      protein: result.data.protein,
      carbs: result.data.carbs,
      fats: result.data.fats,
      target_explanation: result.data.explanation,
      onboarding_complete: true,
    };
    const { error } = await createClient().from('profiles').upsert(profile);
    if (error) throw new Error('Could not save your profile. Please retry.');
    setUserProfile(mapProfile({
      ...profile,
      height_cm: profile.height_cm,
      weight_kg: profile.weight_kg,
      activity_level: profile.activity_level,
      target_explanation: profile.target_explanation,
    }));
    setView('dashboard');
  };

  const handleAddFood = () => {
    setView('add-food');
  };

  const handleAddFoodBack = () => {
    setView('dashboard');
  };

  const handleFetchSuggestions = async (filter: string) => {
    setSuggestionsLoading(true);
    setSuggestionsFilter(filter);
    setSuggestionsError('');
    try {
      const result = await generateMealSuggestions(userProfile, filter);
      if (result.success && result.data.suggestions) {
        setMealSuggestions(result.data.suggestions);
      } else if (!result.success) {
        setMealSuggestions([]);
        setSuggestionsError(result.error);
      }
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
      setMealSuggestions([]);
      setSuggestionsError('Could not load suggestions. Please try again.');
    } finally {
      setSuggestionsLoading(false);
    }
  };

  const handleSuggestMeal = () => {
    setView('suggestions');
    // Initial fetch if empty
    if (mealSuggestions.length === 0) {
      handleFetchSuggestions('Balanced');
    }
  };

  const handleSuggestionsBack = () => {
    setView('dashboard');
  };

  const handleAddSuggestion = async (mealName: string, calories: number) => {
    try {
      await addMealToLog(
        mealName,
        '1 serving',
        calories,
        Math.round(calories * 0.25 / 4),
        Math.round(calories * 0.45 / 4),
        Math.round(calories * 0.3 / 9),
      );
      setAppError('');
      setView('dashboard');
    } catch (error) {
      console.error('Failed to save suggested meal.', error);
      setAppError('Could not save this meal. Please try again.');
    }
  };

  const handleSelectMeal = (mealName: string) => {
    setSelectedMeal(mealName);
    setView('meal-details');
  };

  const handleMealDetailsBack = () => {
    setView('suggestions');
  };

  const handleMealDetailsAddLog = async (meal: {
    name: string;
    macros: { calories: number; protein: string; carbs: string; fats: string };
  }) => {
    const cals = meal.macros.calories;
    const p = parseInt(String(meal.macros.protein).replace(/[^0-9]/g, ''));
    const c = parseInt(String(meal.macros.carbs).replace(/[^0-9]/g, ''));
    const f = parseInt(String(meal.macros.fats).replace(/[^0-9]/g, ''));

    try {
      await addMealToLog(meal.name, '1 serving', cals, p, c, f);
      setAppError('');
      setView('dashboard');
    } catch (error) {
      console.error('Failed to save meal details to the log.', error);
      setAppError('Could not save this meal. Please try again.');
    }
  };

  // Called when AddFoodChoice finishes analyzing
  const handleAnalysisComplete = (result: Record<string, unknown>, imageSrc: string) => {
    setAnalysisResult(result);
    setAnalysisImage(imageSrc);
    setView('analysis-page');
  };

  const handleManualEntry = () => {
    setView('manual-entry');
  };

  const handleManualEntryBack = () => {
    setView('add-food');
  };

  const handleManualEntryAdd = async (data: Record<string, unknown>) => {
    const parseVal = (val: unknown) => {
      if (typeof val === 'number') return val;
      return parseInt(String(val || '0').replace(/[^0-9]/g, '') || '0');
    };

    const cals = parseVal(data.calories);
    const p = parseVal(data.protein);
    const c = parseVal(data.carbs);
    const f = parseVal(data.fats);

    try {
      await addMealToLog(
        String(data.food_name || 'Manual Entry'),
        String(data.portion_estimate || ''),
        cals,
        p,
        c,
        f,
      );
      setAppError('');
      setView('dashboard');
    } catch (error) {
      console.error('Failed to save manual meal analysis.', error);
      setAppError('Could not save this meal. Please try again.');
    }
  };

  // Called from AnalysisPage when back button is clicked
  const handleAnalysisBack = () => {
    setView('add-food');
  };

  // Called when user confirms the meal in AnalysisPage
  const handleSaveMeal = async () => {
    if (analysisResult) {
      const parseVal = (val: unknown) => {
        if (typeof val === 'number') return val;
        return parseInt(String(val || '0').replace(/[^0-9]/g, '') || '0');
      };

      const cals = parseVal(analysisResult.calories);
      const p = parseVal(analysisResult.protein);
      const c = parseVal(analysisResult.carbs);
      const f = parseVal(analysisResult.fats);

      try {
        await addMealToLog(
          String(analysisResult.food_name || 'Analyzed Meal'),
          String(analysisResult.portion_estimate || ''),
          cals,
          p,
          c,
          f,
        );
        setAppError('');
      } catch (error) {
        console.error('Failed to save analyzed meal.', error);
        setAppError('Could not save this meal. Please try again.');
        return;
      }
    }
    setView('dashboard');
    setAnalysisResult(null);
    setAnalysisImage('');
  };

  const handleNotifications = () => {
    setView('notifications');
  };

  const handleNotificationsBack = () => {
    setView('dashboard');
  };

  const handleProfile = () => {
    setView('profile');
  };

  const handleProfileBack = () => {
    setView('dashboard');
  };

  const handleUpdateProfile = async (newProfile: UserProfileForm) => {
    if (!userId) throw new Error('Your session expired. Please sign in again.');
    const profile: ProfileUpsert = {
      id: userId,
      name: newProfile.name.trim(),
      age: Number(newProfile.age),
      gender: newProfile.gender,
      height_cm: Number(newProfile.height),
      weight_kg: Number(newProfile.weight),
      goal: newProfile.goal,
      diet: newProfile.diet,
      activity_level: newProfile.activityLevel,
      location: newProfile.location.trim(),
      allergies: newProfile.allergies.trim(),
      calories: Number(newProfile.calories),
      protein: Number(newProfile.protein),
      carbs: Number(newProfile.carbs),
      fats: Number(newProfile.fats),
      target_explanation: newProfile.targetExplanation,
      onboarding_complete: true,
    };
    const { error } = await createClient().from('profiles').upsert(profile);
    if (error) throw new Error('Could not save profile changes. Please try again.');
    setUserProfile(newProfile);
    setAppError('');
  };

  const handleMenuToggle = () => {
    setIsMenuOpen(prev => !prev);
  };

  const handleMenuClose = () => {
    setIsMenuOpen(false);
  };

  const handleMenuNavigate = (newView: View) => {
    setView(newView);
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    setIsMenuOpen(false);
    const { error } = await createClient().auth.signOut();
    if (error) {
      console.error('Supabase sign out failed.', error);
      setAppError('Could not sign out. Please try again.');
    }
  };

  const withNotice = (screen: ReactNode) => (
    <>
      {screen}
      {appError && (
        <div className="fixed bottom-4 left-4 right-4 z-[100] mx-auto flex max-w-md items-center justify-between gap-4 rounded-xl border border-red-200 bg-white p-4 text-sm font-medium text-red-700 shadow-xl" role="alert">
          <span>{appError}</span>
          <button type="button" onClick={() => setAppError('')} aria-label="Dismiss error" className="font-bold">×</button>
        </div>
      )}
    </>
  );

  if (view === 'loading') {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 text-primary">
        <p>{appError || 'Loading your account...'}</p>
        {appError && (
          <button type="button" onClick={() => setReloadKey((key) => key + 1)} className="rounded-full bg-primary px-6 py-3 font-bold text-white">
            Retry
          </button>
        )}
      </div>
    );
  }

  if (view === 'welcome') {
    return <WelcomeScreen onStart={handleOpenAuth} onSignIn={handleOpenAuth} />;
  }

  if (view === 'auth') {
    return <AuthScreen onBack={() => setView('welcome')} />;
  }

  if (view === 'onboarding') {
    return withNotice(<OnboardingFlow onComplete={handleOnboardingComplete} />);
  }

  if (view === 'add-food') {
    return withNotice(<AddFoodChoice onBack={handleAddFoodBack} onAnalysisComplete={handleAnalysisComplete} onManualEntry={handleManualEntry} />);
  }

  if (view === 'manual-entry') {
    return withNotice(<ManualEntry onBack={handleManualEntryBack} onAdd={handleManualEntryAdd} />);
  }

  if (view === 'suggestions') {
    return withNotice(
      <MealSuggestions
        userProfile={userProfile}
        onBack={handleSuggestionsBack}
        onAdd={handleAddSuggestion}
        onSelectMeal={handleSelectMeal}
        suggestions={mealSuggestions}
        loading={suggestionsLoading}
        error={suggestionsError}
        filter={suggestionsFilter}
        onFetch={handleFetchSuggestions}
      />
    );
  }

  if (view === 'meal-details') {
    return withNotice(<MealDetails mealName={selectedMeal || ''} userProfile={userProfile} onBack={handleMealDetailsBack} onAddLog={handleMealDetailsAddLog} />);
  }

  if (view === 'analysis-page') {
    return withNotice(
      <AnalysisPage
        imageSrc={analysisImage}
        analysisResult={analysisResult}
        onBack={handleAnalysisBack}
        onSave={handleSaveMeal}
      />
    );
  }

  if (view === 'notifications') {
    return withNotice(<Notifications onBack={handleNotificationsBack} />);
  }

  if (view === 'profile') {
    if (!isCompleteProfile(userProfile)) {
      return withNotice(<div className="min-h-screen p-8 text-center">Complete your profile before editing it.</div>);
    }
    return withNotice(
      <Profile
        userProfile={userProfile}
        onUpdateProfile={handleUpdateProfile}
        onBack={handleProfileBack}
      />
    );
  }

  return withNotice(
    <>
      {isMenuOpen && (
        <SideMenu
          onClose={handleMenuClose}
          onNavigate={handleMenuNavigate}
          onLogout={handleLogout}
          userProfile={userProfile}
        />
      )}
      <Dashboard
        onAddFood={handleAddFood}
        onSuggestMeal={handleSuggestMeal}
        currentDate={currentDate}
        macros={calculateMacros()}
        onPrevDay={handlePrevDay}
        onNextDay={handleNextDay}
        onNotifications={handleNotifications}
        onProfile={handleProfile}
        onMenu={handleMenuToggle}
        isMenuOpen={isMenuOpen}
        userProfile={userProfile}
      />
    </>
  );
}
