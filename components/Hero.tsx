"use client";
import React from "react";
import { motion } from "framer-motion";
import { Heart, Crown, ArrowRight, Users, BookOpen } from "lucide-react";
import Link from "next/link";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-100/20 to-purple-100/20 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center justify-center lg:justify-start space-x-3 mb-8"
            >
              <div className="relative">
                <Heart className="h-12 w-12 text-blue-600 fill-current" />
                <Crown className="h-6 w-6 text-blue-400 absolute -top-2 -right-2" />
              </div>
              <span className="text-3xl font-bold text-blue-600">Emiho</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-6"
            >
              Preserve Your
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Legacy Forever
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-md sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
            >
              Create beautiful digital memorials, share precious memories, and
              build lasting connections with family and friends. Your stories
              deserve to be remembered.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12"
            >
              <Link href="/signup">
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm px-6 py-3  sm:px-8 sm:py-4 rounded-xl font-semibold sm:text-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg flex items-center space-x-2 group"
                >
                  <span>Start Your Legacy</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>

              <Link href="/communities">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-blue-600 text-sm px-6 py-3  sm:px-8 sm:py-4 rounded-xl  font-semibold sm:text-lg hover:bg-blue-50 transition-all duration-300 border-2 border-blue-600 shadow-lg flex items-center space-x-2 group"
                >
                  <span>Explore Communities</span>
                  <Users className="h-5 w-5 group-hover:scale-110 transition-transform" />
                </motion.button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="grid grid-cols-3 gap-8 text-center lg:text-left"
            >
              <div>
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  10K+
                </div>
                <div className="text-gray-600">Families Connected</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  50K+
                </div>
                <div className="text-gray-600">Stories Preserved</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600 mb-1">1M+</div>
                <div className="text-gray-600">Memories Shared</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Main Image Container */}
            <div className="relative">
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="bg-white rounded-3xl shadow-2xl p-8 border border-blue-100"
              >
                <div className="space-y-6">
                  {/* Header */}
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <Heart className="h-6 w-6 text-white fill-current" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Margaret Legacy
                      </h3>
                      <p className="text-gray-500 text-sm">
                        Family Memories • 1924-2023
                      </p>
                    </div>
                  </div>

                  {/* Content Preview */}
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <BookOpen className="h-4 w-4 text-blue-600" />
                        </div>
                        <span className="font-medium text-gray-900">
                          Wedding Day Story
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="bg-blue-200 rounded-lg h-16" />
                        <div className="bg-purple-200 rounded-lg h-16" />
                        <div className="bg-pink-200 rounded-lg h-16" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>24 photos • 3 videos • 12 stories</span>
                      <span className="flex items-center space-x-1">
                        <Heart className="h-4 w-4 fill-current text-red-500" />
                        <span>127</span>
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Floating Elements */}
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-6 -right-6 w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center shadow-lg"
              >
                <Crown className="h-6 w-6 text-white" />
              </motion.div>

              <motion.div
                animate={{ y: [-5, 5, -5] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-4 border border-blue-100"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Users className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-900">
                      Family Circle
                    </div>
                    <div className="text-xs text-gray-500">23 members</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-blue-300 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-blue-600 rounded-full mt-2" />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
