import React, { useEffect, useState } from 'react';
import { Users } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

/* Sits in the footer as plain text. Renders nothing until a real count exists,
   so a missing Supabase config never shows a broken "..." pill. */
const VisitorCounter: React.FC = () => {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    if (!supabase) {
      return;
    }

    const client = supabase;

    const increment = async () => {
      if (sessionStorage.getItem('visited')) return;

      try {
        const { data } = await client.rpc('increment_visitors');
        setCount(data ?? null);
        sessionStorage.setItem('visited', 'true');
      } catch (error) {
        console.error('Failed to increment visitor count:', error);
      }
    };

    const fetchCount = async () => {
      try {
        if (sessionStorage.getItem('visited')) {
          const { data } = await client
            .from('visitors')
            .select('count')
            .eq('id', 1)
            .single();
          setCount(data?.count ?? null);
        } else {
          increment();
        }
      } catch (error) {
        console.error('Failed to fetch visitor count:', error);
      }
    };

    fetchCount();
  }, []);

  if (count === null) return null;

  return (
    <span className="inline-flex items-center gap-2 text-sm text-[var(--muted)]">
      <Users size={14} className="text-[var(--accent)]" aria-hidden="true" />
      {count.toLocaleString()} visitors
    </span>
  );
};

export default VisitorCounter;
