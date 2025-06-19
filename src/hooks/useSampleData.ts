
import { useEffect, useState } from 'react';

export const useSampleData = () => {
  const [dataInitialized, setDataInitialized] = useState(true);

  useEffect(() => {
    // Clear any existing localStorage data on first load to migrate to Supabase
    localStorage.removeItem('festival_events');
    console.log('Migrated to Supabase - localStorage events cleared');
  }, []);

  return { dataInitialized };
};
