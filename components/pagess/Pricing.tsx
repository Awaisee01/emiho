'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '../../utils/motion';
import { Check, Crown, Zap } from 'lucide-react';
import PricingCard from '@/components/PricingCard';

const Pricing = () => {
  const plans = [
    {
      name: 'Free',
      price: 0,
      description: 'Perfect for getting started with basic legacy preservation',
      features: [
        'Create up to 3 legacy stories',
        'Upload up to 10 photos per story',
        'Join public communities',
        'Basic story templates',
        'Standard support',
        'Mobile app access'
      ],
      note: 'No credit card required'
    },
    {
      name: 'Premium',
      price: 4.99,
      description: 'Enhanced features for dedicated memory keepers',
      features: [
        'Unlimited legacy stories',
        'Unlimited photo & video uploads',
        'Create private communities',
        'Premium story templates',
        'Priority customer support',
        'Advanced privacy controls',
        'Export stories as PDF books',
        'Remove Emiho branding'
      ],
      note: 'Most popular choice'
    },
    {
      name: 'Legacy Pro',
      price: 9.99,
      description: 'Complete solution with AI-powered features',
      features: [
        'Everything in Premium',
        'AI-generated story summaries',
        'Smart photo organization',
        'Voice-to-text transcription',
        'Advanced analytics',
        'API access for integrations',
        'White-label options',
        'Dedicated account manager',
        'Custom domain support'
      ],
      note: 'Perfect for families & organizations'
    }
  ];

  const faqs = [
    {
      question: 'Can I upgrade or downgrade my plan anytime?',
      answer: 'Yes, you can change your plan at any time. Upgrades take effect immediately, while downgrades take effect at the end of your current billing cycle.'
    },
    {
      question: 'What happens to my data if I cancel?',
      answer: 'Your stories and data remain accessible for 30 days after cancellation. You can export all your content during this period or reactivate your subscription.'
    },
    {
      question: 'Is there a family discount available?',
      answer: 'Yes! Families with 5+ members get 20% off Premium plans. Contact our support team to set up your family account.'
    },
    {
      question: 'Do you offer refunds?',
      answer: 'We offer a 30-day money-back guarantee for all paid plans. If you\'re not satisfied, contact us for a full refund.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-20 pb-16">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <motion.div variants={fadeInUp} className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Choose Your
            <span className="text-[#0052CC] block">Legacy Plan</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Start preserving your precious memories today. Choose the plan that fits 
            your needs and begin creating lasting tributes for generations to come.
          </p>
          
          <div className="inline-flex items-center bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
            <Check className="h-4 w-4 mr-2" />
            <span>30-day money-back guarantee on all plans</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {plans.map((plan, index) => (
            <PricingCard
              key={plan.name}
              plan={plan}
              isPopular={plan.name === 'Premium'}
              delay={index}
            />
          ))}
        </div>

        <motion.div
          variants={fadeInUp}
          className="bg-gradient-to-r from-[#0052CC] to-[#A5D8FF] rounded-2xl p-8 md:p-12 text-white text-center mb-20"
        >
          <Crown className="h-16 w-16 mx-auto mb-6 fill-current" />
          <h2 className="text-3xl font-bold mb-4">
            Enterprise Solutions Available
          </h2>
          <p className="text-xl opacity-90 mb-6 max-w-2xl mx-auto">
            Need a custom solution for your organization, funeral home, or large family? 
            We offer tailored packages with advanced features and dedicated support.
          </p>
          <button className="bg-white text-[#0052CC] px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-all">
            Contact Sales Team
          </button>
        </motion.div>

        <motion.div variants={fadeInUp} className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                custom={index}
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          className="text-center mt-16 p-8 bg-blue-50 rounded-2xl"
        >
          <Zap className="h-12 w-12 text-[#0052CC] mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Still have questions?
          </h3>
          <p className="text-gray-600 mb-6">
            Our support team is here to help you choose the perfect plan for your needs.
          </p>
          <button className="bg-[#0052CC] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#0052CC]/90 transition-all">
            Contact Support
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Pricing;