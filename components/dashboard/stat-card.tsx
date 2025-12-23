'use client';

import { motion, useAnimationControls } from 'framer-motion';
import { useEffect, useState } from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: string;
  iconComponent?: LucideIcon;
  color: string;
  delay?: number;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  iconComponent: IconComponent,
  color,
  delay = 0,
  trend,
  trendValue,
}: StatCardProps) {
  const [displayValue, setDisplayValue] = useState('0');
  const controls = useAnimationControls();

  useEffect(() => {
    const numericValue = parseFloat(value);
    if (!isNaN(numericValue)) {
      let start = 0;
      const duration = 1000;
      const increment = numericValue / (duration / 16);
      const timer = setInterval(() => {
        start += increment;
        if (start >= numericValue) {
          setDisplayValue(value);
          clearInterval(timer);
        } else {
          setDisplayValue(start.toFixed(1));
        }
      }, 16);
      return () => clearInterval(timer);
    } else {
      setDisplayValue(value);
    }
  }, [value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: 'easeOut' }}
      whileHover={{
        y: -4,
        transition: { duration: 0.2 }
      }}
      onHoverStart={() => controls.start({ scale: 1.05, rotate: [0, -5, 5, 0] })}
      onHoverEnd={() => controls.start({ scale: 1, rotate: 0 })}
      className="group relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white/80 p-6 shadow-lg shadow-slate-200/50 backdrop-blur-sm transition-shadow duration-300 hover:shadow-xl hover:shadow-slate-300/50 dark:border-slate-800/60 dark:bg-slate-900/70 dark:shadow-slate-900/50 dark:hover:shadow-slate-800/50"
    >
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: 'radial-gradient(circle at top right, rgba(59, 130, 246, 0.1), transparent 70%)',
        }}
      />

      {/* Shine effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        initial={{ x: '-200%' }}
        whileHover={{ x: '200%' }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      />

      <div className="relative flex items-start justify-between">
        <div className="flex-1">
          <p className="mb-2 text-sm font-medium text-slate-600 dark:text-slate-400">
            {title}
          </p>
          <motion.p
            className="mb-1 text-4xl font-bold text-slate-900 dark:text-white"
            key={displayValue}
          >
            {displayValue}
          </motion.p>
          {subtitle && (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {subtitle}
            </p>
          )}
          {trend && trendValue && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: delay + 0.3 }}
              className={`mt-2 inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
                trend === 'up'
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                  : trend === 'down'
                  ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
              }`}
            >
              {trend === 'up' && '↗'}
              {trend === 'down' && '↘'}
              {trend === 'neutral' && '→'}
              <span>{trendValue}</span>
            </motion.div>
          )}
        </div>

        {/* Icon */}
        <motion.div
          animate={controls}
          className={`flex h-16 w-16 items-center justify-center rounded-2xl text-white shadow-lg ${color} relative overflow-hidden`}
        >
          <motion.div
            className="absolute inset-0 bg-white"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: [0, 0.2, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          {IconComponent ? (
            <IconComponent className="relative z-10 h-8 w-8" />
          ) : (
            <span className="relative z-10 text-3xl">{icon}</span>
          )}
        </motion.div>
      </div>

      {/* Bottom glow effect */}
      <motion.div
        className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}
