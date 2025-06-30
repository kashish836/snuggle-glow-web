
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Baby, Heart, Star } from 'lucide-react';

const Contact = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-lavender">
      <Navigation />

      {/* Header */}
      <section className="section-padding py-16">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Baby className="h-12 w-12 text-pink-400 animate-float" />
              <Heart className="h-4 w-4 text-pink-300 absolute -top-1 -right-1 animate-pulse-gentle" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-pacifico text-pink-600 mb-4">
            Let's Connect
          </h1>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Have a question, story to share, or just want to say hello? We'd love to hear from you. 
            Every message is read with love and care.
          </p>
        </div>
      </section>

      <div className="section-padding pb-16">
        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <div className="baby-card">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Send Us a Message</h2>
            
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 transition-colors"
                    placeholder="Your first name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 transition-colors"
                    placeholder="Your last name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 transition-colors"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How can we help? *
                </label>
                <select className="w-full px-4 py-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 transition-colors">
                  <option>General Question</option>
                  <option>Resource Request</option>
                  <option>Community Support</option>
                  <option>Partnership Inquiry</option>
                  <option>Technical Issue</option>
                  <option>Share My Story</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Message *
                </label>
                <textarea
                  rows={6}
                  className="w-full px-4 py-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 transition-colors resize-none"
                  placeholder="Share your thoughts, questions, or story with us..."
                ></textarea>
              </div>

              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="newsletter"
                  className="mt-1 h-4 w-4 text-pink-600 focus:ring-pink-500 border-pink-300 rounded"
                />
                <label htmlFor="newsletter" className="text-sm text-gray-600">
                  I'd love to receive gentle tips and updates via the SnuggleNest newsletter
                </label>
              </div>

              <button type="submit" className="w-full gentle-button text-center">
                <Heart className="h-4 w-4 inline mr-2" />
                Send Message with Love
              </button>
            </form>
          </div>

          {/* Contact Info & FAQ */}
          <div className="space-y-8">
            {/* Contact Methods */}
            <div className="baby-card">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Other Ways to Reach Us</h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Heart className="h-5 w-5 text-pink-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-800">Email Support</p>
                    <p className="text-gray-600 text-sm">hello@snugglenest.com</p>
                    <p className="text-gray-500 text-xs">We reply within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Star className="h-5 w-5 text-pink-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-800">Community Forum</p>
                    <p className="text-gray-600 text-sm">Connect with other mamas 24/7</p>
                    <p className="text-gray-500 text-xs">Join ongoing discussions</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Baby className="h-5 w-5 text-pink-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-800">Resource Library</p>
                    <p className="text-gray-600 text-sm">Browse helpful guides and tools</p>
                    <p className="text-gray-500 text-xs">All resources are free</p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ */}
            <div className="baby-card">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Answers</h3>
              
              <div className="space-y-4">
                <div>
                  <p className="font-medium text-gray-800 mb-1">How quickly do you respond?</p>
                  <p className="text-gray-600 text-sm">We aim to respond to all messages within 24 hours, usually much sooner!</p>
                </div>

                <div>
                  <p className="font-medium text-gray-800 mb-1">Are all resources really free?</p>
                  <p className="text-gray-600 text-sm">Yes! Every resource in our library is completely free because every mama deserves support.</p>
                </div>

                <div>
                  <p className="font-medium text-gray-800 mb-1">Can I share my story?</p>
                  <p className="text-gray-600 text-sm">Absolutely! We love featuring real mama stories to inspire and connect our community.</p>
                </div>

                <div>
                  <p className="font-medium text-gray-800 mb-1">How do I join the community?</p>
                  <p className="text-gray-600 text-sm">Simply visit our Community page and start participating in discussions. No special signup needed!</p>
                </div>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="bg-gradient-to-r from-mint to-baby-blue rounded-2xl p-6">
              <div className="text-center">
                <Star className="h-8 w-8 text-pink-500 mx-auto mb-3 animate-pulse-gentle" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Weekly Love Notes</h3>
                <p className="text-gray-700 text-sm mb-4">
                  Get gentle tips, heartwarming stories, and community highlights delivered to your inbox.
                </p>
                
                <div className="flex space-x-2">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="flex-1 px-4 py-2 border border-pink-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                  />
                  <button className="bg-pink-400 hover:bg-pink-500 text-white px-4 py-2 rounded-full transition-colors">
                    <Heart className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;
