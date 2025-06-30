
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Baby, Heart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  const featuredTips = [
    {
      title: "First Week Sleep Schedule",
      excerpt: "Gentle tips to help your newborn (and you!) get better rest during those precious first days.",
      category: "Sleep",
      readTime: "5 min read",
    },
    {
      title: "Breastfeeding Basics",
      excerpt: "Everything you need to know about nursing your little one with confidence and comfort.",
      category: "Feeding",
      readTime: "8 min read",
    },
    {
      title: "Postpartum Self-Care",
      excerpt: "Nurturing yourself while caring for your baby - because mama needs love too.",
      category: "Wellness",
      readTime: "6 min read",
    },
  ];

  const testimonials = [
    {
      name: "Sarah M.",
      quote: "SnuggleNest became my safe haven during those overwhelming first weeks. The community here truly understands.",
      baby: "Emma, 3 months",
    },
    {
      name: "Jessica L.",
      quote: "The resources and tips helped me feel confident as a new mom. I'm so grateful for this supportive space.",
      baby: "Oliver, 6 weeks",
    },
    {
      name: "Maria R.",
      quote: "Finding other moms who were going through the same journey made all the difference. Thank you, SnuggleNest!",
      baby: "Sofia, 2 months",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-lavender">
      <Navigation />

      {/* Hero Section */}
      <section className="section-padding py-20">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Baby className="h-16 w-16 text-pink-400 animate-float" />
              <Heart className="h-6 w-6 text-pink-500 absolute -top-2 -right-2 animate-pulse-gentle" />
              <Star className="h-4 w-4 text-pink-300 absolute -bottom-1 -left-2 animate-pulse-gentle" style={{ animationDelay: '1s' }} />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-pacifico text-pink-600 mb-4">
            Welcome to SnuggleNest
          </h1>
          
          <p className="text-xl md:text-2xl text-pink-500 mb-6 font-light">
            Where Little Hearts Grow & Mamas Glow ✨
          </p>
          
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            A warm, supportive community for new mothers navigating the beautiful journey of motherhood. 
            Find expert tips, connect with other mamas, and celebrate every precious milestone together.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/blog" className="gentle-button">
              <Heart className="h-5 w-5 inline mr-2" />
              Explore Baby Tips
            </Link>
            <Link to="/community" className="bg-mint hover:bg-green-200 text-green-800 px-6 py-3 rounded-full font-medium transition-all duration-300 shadow-sm hover:shadow-md">
              <Baby className="h-5 w-5 inline mr-2" />
              Join Our Community
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Tips */}
      <section className="section-padding py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-pacifico text-pink-600 mb-4">
            Featured Baby Tips
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Gentle guidance for your newborn journey, curated with love by fellow mamas and expert advisors.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {featuredTips.map((tip, index) => (
            <div key={index} className="baby-card group hover:scale-105 transition-transform duration-300">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-pink-600 bg-pink-100 px-3 py-1 rounded-full">
                  {tip.category}
                </span>
                <span className="text-xs text-gray-500">{tip.readTime}</span>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3 group-hover:text-pink-600 transition-colors">
                {tip.title}
              </h3>
              
              <p className="text-gray-600 mb-4 leading-relaxed">
                {tip.excerpt}
              </p>
              
              <Link to="/blog" className="text-pink-500 hover:text-pink-600 font-medium inline-flex items-center">
                Read More 
                <Heart className="h-4 w-4 ml-1" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gradient-to-r from-lavender to-baby-blue py-16">
        <div className="section-padding">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-pacifico text-pink-600 mb-4">
              Mama Love Stories
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Hear from incredible mothers in our community who've found support, friendship, and confidence here.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/50">
                <div className="flex items-center mb-4">
                  <Star className="h-5 w-5 text-pink-400 fill-current" />
                  <Star className="h-5 w-5 text-pink-400 fill-current" />
                  <Star className="h-5 w-5 text-pink-400 fill-current" />
                  <Star className="h-5 w-5 text-pink-400 fill-current" />
                  <Star className="h-5 w-5 text-pink-400 fill-current" />
                </div>
                
                <p className="text-gray-700 mb-4 italic leading-relaxed">
                  "{testimonial.quote}"
                </p>
                
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-pink-200 rounded-full flex items-center justify-center mr-3">
                    <Heart className="h-5 w-5 text-pink-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">Mama to {testimonial.baby}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding py-16">
        <div className="bg-gradient-to-r from-pink-100 to-mint rounded-3xl p-8 md:p-12 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="flex justify-center mb-6">
              <Baby className="h-12 w-12 text-pink-500 animate-float" />
            </div>
            
            <h2 className="text-3xl md:text-4xl font-pacifico text-pink-600 mb-4">
              Ready to Start Your Journey?
            </h2>
            
            <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
              Join thousands of loving mamas who've found their village at SnuggleNest. 
              Get support, share your story, and celebrate every beautiful moment together.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/resources" className="gentle-button">
                <Star className="h-5 w-5 inline mr-2" />
                Get Free Resources
              </Link>
              <Link to="/contact" className="bg-white hover:bg-gray-50 text-pink-600 px-6 py-3 rounded-full font-medium transition-all duration-300 shadow-sm hover:shadow-md border border-pink-200">
                <Heart className="h-5 w-5 inline mr-2" />
                Say Hello
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
