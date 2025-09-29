'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Users, Shield,  Star, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Hero from '../Hero';
import Features from '../Features';


const Home = () => {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Family Historian',
      content: 'Emiho helped me preserve my grandmother\'s stories in a beautiful way. The whole family can now access and contribute to her legacy.',
      avatar: 'bg-blue-100 text-blue-600',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'Community Leader',
      content: 'The community features are amazing. We\'ve connected with distant relatives and shared memories we never knew existed.',
      avatar: 'bg-green-100 text-green-600',
      rating: 5
    },
    {
      name: 'Emma Rodriguez',
      role: 'Memorial Organizer',
      content: 'Creating a memorial page for my father was healing. The platform made it easy to collect memories from everyone who knew him.',
      avatar: 'bg-purple-100 text-purple-600',
      rating: 5
    }
  ];

  const steps = [
    {
      number: '01',
      title: 'Create Your Account',
      description: 'Sign up for free and start building your digital legacy space.',
      icon: Users
    },
    {
      number: '02',
      title: 'Share Your Stories',
      description: 'Upload photos, videos, and write stories about your loved ones.',
      icon: Heart
    },
    {
      number: '03',
      title: 'Connect & Preserve',
      description: 'Invite family and friends to contribute and preserve memories together.',
      icon: Shield
    }
  ];

  return (
    <div className="min-h-screen">
      <Hero />
      <Features />
      
      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-md md:text-xl text-gray-600 max-w-3xl mx-auto">
              Getting started with Emiho is simple. Follow these three steps to begin preserving your family legacy.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="relative text-center"
                >
                  <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100">
                    <div className="relative mb-6">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <IconComponent className="h-8 w-8 text-white" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {step.number}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {step.title}
                    </h3>
                    <p className="text-gray-600">
                      {step.description}
                    </p>
                  </div>
                  
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                      <ArrowRight className="h-6 w-6 text-blue-300" />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl  sm:text-4xl font-bold text-gray-900 mb-4">
              Loved by Families Worldwide
            </h2>
            <p className="text-md md:text-xl text-gray-600 max-w-3xl mx-auto">
              See how Emiho has helped thousands of families preserve and share their most precious memories.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <p className="text-gray-600 mb-6 italic">
                  {testimonial.content}
                </p>
                
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-full ${testimonial.avatar} flex items-center justify-center font-bold text-lg`}>
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-gray-500 text-sm">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Start Preserving Your Legacy Today
            </h2>
            <p className="text-md md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of families who trust Emiho to keep their most precious memories safe and accessible for generations to come.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-blue-600  px-6 py-3 text-sm sm:px-8 sm:py-4 rounded-xl font-semibold sm:text-lg hover:bg-blue-50 transition-all duration-300 shadow-lg"
                >
                  Get Started Free
                </motion.button>
              </Link>
              
              <Link href="/pricing">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-transparent text-white px-6 py-3 text-sm sm:px-8 sm:py-4 rounded-xl font-semibold sm:text-lg hover:bg-white/10 transition-all duration-300 border-2 border-white"
                >
                  View Pricing
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;