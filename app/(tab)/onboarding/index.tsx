import { useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function DashboardUser() {
  const router = useRouter(); // ← Correctement initialisé

  useEffect(() => {
    router.replace("/onboarding/(tabs)/Client");
  }, []);

  return null;
}