
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Baby, Heart, Star, Moon, Sun, BookOpen, Sparkles, Clock, ArrowRight, Coffee } from 'lucide-react';

const Blog = () => {
  const blogPosts = [
    {
      title: "Your Baby's First Week: A Gentle Guide",
      excerpt: "Navigate those precious first days with confidence. From feeding schedules to sleep patterns, we've got you covered with loving support.",
      category: "Newborn Care",
      readTime: "7 min read",
      date: "2 days ago",
      featured: true,
    },
    {
      title: "Breastfeeding: Finding Your Rhythm",
      excerpt: "Every mama's breastfeeding journey is unique. Learn gentle techniques and find the support you need to succeed.",
      category: "Feeding",
      readTime: "6 min read",
      date: "5 days ago",
    },
    {
      title: "Sleep Training with Love and Patience",
      excerpt: "Gentle sleep solutions that honor your baby's needs while helping the whole family get better rest.",
      category: "Sleep",
      readTime: "8 min read",
      date: "1 week ago",
    },
    {
      title: "Postpartum Emotions: You're Not Alone",
      excerpt: "Understanding and navigating the emotional rollercoaster of new motherhood with compassion and support.",
      category: "Mental Health",
      readTime: "5 min read",
      date: "1 week ago",
    },
    {
      title: "Baby's Growth Milestones: Celebrating Progress",
      excerpt: "From first smiles to tiny giggles, learn what to expect and how to celebrate every precious milestone.",
      category: "Development",
      readTime: "6 min read",
      date: "2 weeks ago",
    },
    {
      title: "Self-Care for New Mamas",
      excerpt: "Taking care of yourself isn't selfish—it's essential. Simple ways to nurture your wellbeing during this special time.",
      category: "Self-Care",
      readTime: "4 min read",
      date: "2 weeks ago",
    },
  ];

  const categories = ["All", "Newborn Care", "Feeding", "Sleep", "Mental Health", "Development", "Self-Care"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-lavender">
      <Navigation />

      {/* Header */}
      <section className="section-padding py-16">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute -inset-3 bg-gradient-to-r from-pink-200 to-lavender rounded-full blur-lg opacity-60 animate-pulse-gentle"></div>
              <BookOpen className="relative h-14 w-14 text-pink-400 animate-float" />
              <Heart className="h-5 w-5 text-pink-500 absolute -top-1 -right-2 animate-pulse-gentle" />
              <Sparkles className="h-4 w-4 text-yellow-400 absolute -bottom-1 -left-2 animate-sparkle" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-pacifico text-pink-600 mb-4">
            Mama's Blog
          </h1>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Gentle guidance, heartfelt stories, and expert tips for your beautiful motherhood journey. 
            Written with love, from one mama to another.
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="section-padding mb-8">
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((category, index) => (
            <button
              key={index}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                index === 0 
                  ? 'bg-pink-400 text-white shadow-md' 
                  : 'bg-white text-pink-600 hover:bg-pink-100 border border-pink-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* Featured Post */}
      <section className="section-padding mb-12">
        <div className="baby-card max-w-4xl mx-auto overflow-hidden hover:scale-[1.02] transition-transform duration-300">
          <div className="md:flex">
            <div className="md:w-1/3 bg-gradient-to-br from-pink-200 to-lavender p-8 flex items-center justify-center">
              <div className="text-center">
                <Baby className="h-16 w-16 text-pink-500 mx-auto mb-4 animate-float" />
                <span className="text-sm font-semibold text-pink-700 bg-pink-100 px-3 py-1 rounded-full">
                  Featured
                </span>
              </div>
            </div>
            
            <div className="md:w-2/3 p-8">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-pink-600 bg-pink-100 px-3 py-1 rounded-full">
                  {blogPosts[0].category}
                </span>
                <div className="flex items-center text-xs text-gray-500 space-x-4">
                  <span>{blogPosts[0].readTime}</span>
                  <span>{blogPosts[0].date}</span>
                </div>
              </div>
              
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4 hover:text-pink-600 transition-colors cursor-pointer">
                {blogPosts[0].title}
              </h2>
              
              <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                {blogPosts[0].excerpt}
              </p>
              
              <button className="gentle-button">
                <Heart className="h-4 w-4 inline mr-2" />
                Read Full Article
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="section-padding pb-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.slice(1).map((post, index) => (
            <div key={index} className="baby-card group hover:scale-105 transition-transform duration-300 cursor-pointer">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-pink-600 bg-pink-100 px-3 py-1 rounded-full">
                  {post.category}
                </span>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-gray-400" />
                  <span className="text-xs text-gray-500">{post.readTime}</span>
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3 group-hover:text-pink-600 transition-colors">
                {post.title}
              </h3>
              
              <p className="text-gray-600 mb-4 leading-relaxed">
                {post.excerpt}
              </p>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Coffee className="h-3 w-3" />
                  {post.date}
                </span>
                <Star className="h-4 w-4 text-pink-300 group-hover:text-pink-500 group-hover:animate-sparkle transition-colors" />
              </div>
              
              <div className="mt-4 pt-4 border-t border-pink-100">
                <span className="text-pink-500 hover:text-pink-600 font-medium inline-flex items-center text-sm group-hover:gap-2 transition-all">
                  Read More 
                  <ArrowRight className="h-4 w-4 ml-1" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="section-padding pb-16">
        <div className="bg-gradient-to-r from-mint to-baby-blue rounded-3xl p-8 text-center max-w-4xl mx-auto">
          <Baby className="h-10 w-10 text-pink-500 mx-auto mb-4 animate-float" />
          
          <h3 className="text-2xl md:text-3xl font-pacifico text-pink-600 mb-4">
            Never Miss a Mama Moment
          </h3>
          
          <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
            Get our weekly newsletter filled with gentle tips, heartwarming stories, and the support you need for your motherhood journey.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3 rounded-full border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
            <button className="gentle-button whitespace-nowrap">
              <Heart className="h-4 w-4 inline mr-2" />
              Subscribe
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;
