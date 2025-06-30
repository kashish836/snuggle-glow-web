
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Baby, Heart, Star } from 'lucide-react';

const Resources = () => {
  const resources = [
    {
      title: "Newborn Care Checklist",
      description: "Everything you need for baby's first month, from feeding essentials to comfort items.",
      type: "Checklist",
      icon: "✓",
      downloadCount: "2,847",
    },
    {
      title: "Feeding Schedule Tracker",
      description: "Simple, beautiful charts to track nursing sessions, bottle feeds, and growth patterns.",
      type: "Tracker",
      icon: "🍼",
      downloadCount: "1,923",
    },
    {
      title: "Sleep Schedule Guide",
      description: "Age-appropriate sleep schedules and gentle techniques for better rest.",
      type: "Guide",
      icon: "😴",
      downloadCount: "3,156",
    },
    {
      title: "Milestone Tracker",
      description: "Celebrate every precious first - from smiles to steps with our beautiful tracker.",
      type: "Tracker",
      icon: "📈",
      downloadCount: "2,431",
    },
    {
      title: "Postpartum Recovery Plan",
      description: "Self-care essentials and recovery timeline for the first 6 weeks postpartum.",
      type: "Plan",
      icon: "💆‍♀️",
      downloadCount: "1,764",
    },
    {
      title: "Baby's First Year Calendar",
      description: "Important appointments, milestones, and memories to capture throughout year one.",
      type: "Calendar",
      icon: "📅",
      downloadCount: "2,089",
    },
  ];

  const categories = [
    {
      name: "Feeding & Nutrition",
      description: "Guides for breastfeeding, bottle feeding, and starting solids",
      count: 12,
      color: "bg-pink-100 text-pink-700",
    },
    {
      name: "Sleep & Routines",
      description: "Sleep schedules, bedtime routines, and gentle sleep training",
      count: 8,
      color: "bg-lavender text-purple-700",
    },
    {
      name: "Development & Milestones",
      description: "Growth charts, milestone trackers, and developmental activities",
      count: 15,
      color: "bg-mint text-green-700",
    },
    {
      name: "Health & Safety",
      description: "Baby proofing, first aid, and wellness checklists",
      count: 10,
      color: "bg-baby-blue text-blue-700",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-lavender">
      <Navigation />

      {/* Header */}
      <section className="section-padding py-16">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <Star className="h-12 w-12 text-pink-400 animate-pulse-gentle" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-pacifico text-pink-600 mb-4">
            Mama's Resource Center
          </h1>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Beautiful, practical tools designed with love to support you through every stage of your motherhood journey. 
            All resources are free and created by fellow mamas.
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="section-padding mb-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <div key={index} className="baby-card text-center hover:scale-105 transition-transform duration-300 cursor-pointer">
              <div className={`w-12 h-12 rounded-full ${category.color} flex items-center justify-center mx-auto mb-4`}>
                <Heart className="h-6 w-6" />
              </div>
              
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {category.name}
              </h3>
              
              <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                {category.description}
              </p>
              
              <span className="text-xs text-pink-600 font-medium bg-pink-100 px-3 py-1 rounded-full">
                {category.count} resources
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Resources */}
      <section className="section-padding mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-pacifico text-pink-600 mb-4">
            Most Loved Resources
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            These beautifully designed tools have helped thousands of mamas feel more confident and organized.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {resources.map((resource, index) => (
            <div key={index} className="baby-card group hover:scale-105 transition-transform duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="text-3xl">{resource.icon}</div>
                <span className="text-xs font-semibold text-pink-600 bg-pink-100 px-3 py-1 rounded-full">
                  {resource.type}
                </span>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3 group-hover:text-pink-600 transition-colors">
                {resource.title}
              </h3>
              
              <p className="text-gray-600 mb-4 leading-relaxed">
                {resource.description}
              </p>
              
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500">
                  Downloaded {resource.downloadCount} times
                </span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-pink-400 fill-current" />
                  ))}
                </div>
              </div>
              
              <button className="w-full gentle-button">
                <Heart className="h-4 w-4 inline mr-2" />
                Download Free
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gradient-to-r from-lavender to-baby-blue py-16">
        <div className="section-padding">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-pacifico text-pink-600 mb-4">
              How Our Resources Help
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Every resource is crafted with love, tested by real mamas, and designed to make your journey easier.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/70 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                <Baby className="h-8 w-8 text-pink-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Expert-Reviewed</h3>
              <p className="text-gray-700">
                Created with input from pediatricians, lactation consultants, and experienced mamas.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white/70 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-pink-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Made with Love</h3>
              <p className="text-gray-700">
                Beautiful designs that feel warm and welcoming, because functionality should be pretty too.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white/70 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-pink-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Mama-Tested</h3>
              <p className="text-gray-700">
                Used and loved by thousands of mamas who've walked this beautiful path before you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding py-16">
        <div className="bg-gradient-to-r from-pink-100 to-mint rounded-3xl p-8 md:p-12 text-center max-w-4xl mx-auto">
          <Baby className="h-12 w-12 text-pink-500 mx-auto mb-6 animate-float" />
          
          <h2 className="text-3xl md:text-4xl font-pacifico text-pink-600 mb-4">
            Start Your Collection Today
          </h2>
          
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
            Join thousands of mamas who've organized their journey with our beautiful, practical resources. 
            Everything is free because every mama deserves support.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="gentle-button">
              <Heart className="h-5 w-5 inline mr-2" />
              Browse All Resources
            </button>
            <button className="bg-white hover:bg-gray-50 text-pink-600 px-6 py-3 rounded-full font-medium transition-all duration-300 shadow-sm hover:shadow-md border border-pink-200">
              <Star className="h-5 w-5 inline mr-2" />
              Subscribe for Updates
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Resources;
