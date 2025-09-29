import React from "react";
import { motion } from "framer-motion";
import {
  Heart,
  Users,
  BookOpen,
  Crown,
  Shield,
  Zap,
  Camera,
  Calendar,
} from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Heart,
      title: "Preserve Memories",
      description:
        "Create beautiful digital legacy books with photos, videos, and stories that last forever.",
      color: "bg-red-50 text-red-600",
      premium: false,
    },
    {
      icon: Users,
      title: "Build Communities",
      description:
        "Connect with family and friends to share memories and build lasting relationships.",
      color: "bg-blue-50 text-blue-600",
      premium: false,
    },
    {
      icon: BookOpen,
      title: "Story Sharing",
      description:
        "Share your life stories with rich media uploads and interactive timelines.",
      color: "bg-green-50 text-green-600",
      premium: false,
    },
    {
      icon: Crown,
      title: "Premium Templates",
      description:
        "Access exclusive design templates and advanced customization options.",
      color: "bg-purple-50 text-purple-600",
      premium: true,
    },
    {
      icon: Shield,
      title: "Secure Storage",
      description:
        "Your precious memories are protected with enterprise-grade security.",
      color: "bg-indigo-50 text-indigo-600",
      premium: false,
    },
    {
      icon: Zap,
      title: "AI-Powered Features",
      description:
        "Smart organization, auto-tagging, and AI-generated story summaries.",
      color: "bg-yellow-50 text-yellow-600",
      premium: true,
    },
    {
      icon: Camera,
      title: "Unlimited Media",
      description:
        "Upload unlimited photos, videos, and audio recordings to preserve every moment.",
      color: "bg-pink-50 text-pink-600",
      premium: true,
    },
    {
      icon: Calendar,
      title: "Virtual Events",
      description:
        "Organize memorial services and family gatherings with integrated video calls.",
      color: "bg-teal-50 text-teal-600",
      premium: false,
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to Preserve Your Legacy
          </h2>
          <p className="text-md sm:text-xl text-gray-600 max-w-3xl mx-auto">
            From simple memory sharing to advanced AI-powered features, Emiho
            provides all the tools you need to create lasting digital legacies.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                {feature.premium && (
                  <div className="absolute -top-3 -right-3">
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                      Premium
                    </div>
                  </div>
                )}

                <div
                  className={`w-16 h-16 rounded-2xl ${feature.color} flex items-center justify-center mb-4`}
                >
                  <IconComponent className="h-8 w-8" />
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>

                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Start Free, Upgrade When Ready
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Begin your legacy journey with our free plan, then unlock premium
              features like unlimited storage, AI-powered tools, and exclusive
              templates when you're ready to do more.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg"
              >
                Start Free Today
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors border-2 border-blue-600"
              >
                View Premium Plans
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
