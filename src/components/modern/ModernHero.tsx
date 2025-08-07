import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Play, GraduationCap, TrendingUp, Users, CheckCircle, Star, Sparkles } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';

export const ModernHero: React.FC = () => {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.3]);

  return (
    <section className="relative pt-24 pb-20 px-6 overflow-hidden min-h-screen">
      {/* Modern Gradient Background */}
      <motion.div 
        className="absolute inset-0 -z-10"
        style={{ y, opacity }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 via-orange-400/10 to-teal-400/10" />
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/5 via-transparent to-blue-500/5" />
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-gradient-to-r from-teal-400/20 to-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }} />
      </motion.div>

      <div className="container mx-auto relative z-10">
        {/* Hero Content */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-yellow-400/20 to-orange-400/20 border border-orange-400/30 text-orange-700 dark:text-orange-300 text-sm font-medium mb-8 backdrop-blur-sm"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Successfully upgrade your enrollment safely
            <Star className="w-4 h-4 ml-2 text-yellow-500 fill-current" />
          </motion.div>

          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
          >
            <span className="bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Student Success
            </span>
            <motion.span
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="block bg-gradient-to-r from-yellow-500 via-orange-500 to-teal-500 bg-clip-text text-transparent"
            >
              Amplified
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-4xl mx-auto leading-relaxed"
          >
            Boost qualified applications by 40% and improve student retention by 89% 
            with intelligent enrollment tools designed for educational excellence.
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <Button
              size="lg"
              onClick={() => navigate('/sign-up')}
              className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white border-0 shadow-lg group"
            >
              Get Started Today
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="px-8 py-4 text-lg border-2 border-teal-500/30 text-teal-600 dark:text-teal-400 hover:bg-teal-500/10 group"
            >
              <Play className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
              See How It Works
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="flex items-center justify-center text-muted-foreground text-sm gap-2"
          >
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            No credit card required • Setup in under 5 minutes
          </motion.div>
        </div>
      </div>
    </section>
  );
};