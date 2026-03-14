import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

const VisitorCounter: React.FC = () => {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const increment = async () => {
      if (sessionStorage.getItem('visited')) return;

      const { data } = await supabase.rpc('increment_visitors');
      setCount(data);
      sessionStorage.setItem('visited', 'true');
    };

    const fetchCount = async () => {
      if (sessionStorage.getItem('visited')) {
        const { data } = await supabase
          .from('visitors')
          .select('count')
          .eq('id', 1)
          .single();
        setCount(data?.count ?? null);
      } else {
        increment();
      }
    };

    fetchCount();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -1, scale: 1.02 }}
      className="fixed bottom-6 left-6 z-50 flex items-center gap-2 rounded-full border border-white/15 bg-[#0a0a0f]/75 px-4 py-2 text-zinc-200 shadow-[0_14px_40px_-20px_rgba(0,0,0,0.95)] backdrop-blur-md"
    >
      <Users size={18} className="text-[#00a4ef]" />
      <span className="font-medium text-zinc-300">
        {count !== null ? `${count.toLocaleString()} visitors` : '...'}
      </span>
    </motion.div>
  );
};

export default VisitorCounter;
