
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Baby, Heart, Star } from 'lucide-react';

const Community = () => {
  const discussions = [
    {
      title: "Sleep regression at 4 months - need encouragement! 💤",
      author: "Sarah M.",
      replies: 23,
      lastActivity: "2 hours ago",
      category: "Sleep",
      preview: "My little one was sleeping through the night and now we're back to waking every 2 hours. Is this normal? Any gentle tips?",
    },
    {
      title: "Breastfeeding journey - celebrating 6 months! 🎉",
      author: "Jessica L.",
      replies: 45,
      lastActivity: "4 hours ago",
      category: "Feeding",
      preview: "Just wanted to share this milestone with mamas who understand the journey. It wasn't easy but we made it!",
    },
    {
      title: "First day back to work - mixed emotions",
      author: "Maria R.",
      replies: 18,
      lastActivity: "6 hours ago",
      category: "Life Changes",
      preview: "Starting back to work tomorrow after 12 weeks with my baby. Feeling grateful but also heartbroken. How did you cope?",
    },
    {
      title: "Baby's first smile caught on camera! 📸",
      author: "Emma K.",
      replies: 31,
      lastActivity: "8 hours ago",
      category: "Milestones",
      preview: "At 7 weeks old, our little sunshine gave us the most beautiful smile. Sharing the joy with my SnuggleNest family!",
    },
    {
      title: "Postpartum anxiety - you're not alone 💗",
      author: "Lisa T.",
      replies: 67,
      lastActivity: "12 hours ago",
      category: "Mental Health",
      preview: "Opening up about my experience with PPA and the support that helped me heal. Resources and virtual hugs inside.",
    },
  ];

  const categories = [
    { name: "All Discussions", count: 1247, active: true },
    { name: "Newborn Care", count: 324 },
    { name: "Sleep", count: 189 },
    { name: "Feeding", count: 267 },
    { name: "Mental Health", count: 156 },
    { name: "Milestones", count: 143 },
    { name: "Life Changes", count: 168 },
  ];

  const onlineMembers = [
    { name: "Sarah M.", status: "Just shared a sleep tip", time: "now" },
    { name: "Jessica L.", status: "Celebrating 6 months nursing", time: "5m" },
    { name: "Maria R.", status: "Looking for work-life balance tips", time: "12m" },
    { name: "Emma K.", status: "Shared baby's first smile photo", time: "25m" },
    { name: "Lisa T.", status: "Supporting other mamas", time: "1h" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-lavender">
      <Navigation />

      {/* Header */}
      <section className="section-padding py-16">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Heart className="h-12 w-12 text-pink-400 animate-pulse-gentle" />
              <Star className="h-4 w-4 text-pink-300 absolute -top-1 -right-1 animate-pulse-gentle" style={{ animationDelay: '1s' }} />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-pacifico text-pink-600 mb-4">
            Mama Community
          </h1>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            A safe, supportive space where mamas connect, share experiences, and lift each other up. 
            You're never alone in this beautiful journey.
          </p>
        </div>
      </section>

      {/* Community Stats */}
      <section className="section-padding mb-12">
        <div className="grid md:grid-cols-4 gap-6">
          <div className="baby-card text-center">
            <div className="text-3xl font-bold text-pink-600 mb-2">2,847</div>
            <div className="text-gray-600">Loving Mamas</div>
          </div>
          <div className="baby-card text-center">
            <div className="text-3xl font-bold text-pink-600 mb-2">1,247</div>
            <div className="text-gray-600">Discussions</div>
          </div>
          <div className="baby-card text-center">
            <div className="text-3xl font-bold text-pink-600 mb-2">156</div>
            <div className="text-gray-600">Online Now</div>
          </div>
          <div className="baby-card text-center">
            <div className="text-3xl font-bold text-pink-600 mb-2">24/7</div>
            <div className="text-gray-600">Support Available</div>
          </div>
        </div>
      </section>

      <div className="section-padding">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Categories */}
            <div className="baby-card mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Discussion Categories</h3>
              <div className="space-y-2">
                {categories.map((category, index) => (
                  <button
                    key={index}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      category.active 
                        ? 'bg-pink-100 text-pink-700 font-medium' 
                        : 'text-gray-600 hover:bg-pink-50 hover:text-pink-600'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span>{category.name}</span>
                      <span className="text-xs text-gray-400">{category.count}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Online Members */}
            <div className="baby-card">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Mamas Online</h3>
              <div className="space-y-3">
                {onlineMembers.map((member, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-pink-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <Heart className="h-4 w-4 text-pink-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-800">{member.name}</span>
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      </div>
                      <p className="text-xs text-gray-500 truncate">{member.status}</p>
                      <span className="text-xs text-gray-400">{member.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* New Discussion Button */}
            <div className="mb-6">
              <button className="gentle-button">
                <Heart className="h-4 w-4 inline mr-2" />
                Start New Discussion
              </button>
            </div>

            {/* Discussions */}
            <div className="space-y-4">
              {discussions.map((discussion, index) => (
                <div key={index} className="baby-card hover:scale-[1.01] transition-transform duration-300 cursor-pointer">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-xs font-semibold text-pink-600 bg-pink-100 px-3 py-1 rounded-full">
                      {discussion.category}
                    </span>
                    <span className="text-xs text-gray-500">{discussion.lastActivity}</span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 hover:text-pink-600 transition-colors">
                    {discussion.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {discussion.preview}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-pink-200 rounded-full flex items-center justify-center">
                          <Heart className="h-3 w-3 text-pink-500" />
                        </div>
                        <span className="text-sm text-gray-600">{discussion.author}</span>
                      </div>
                      
                      <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <Star className="h-4 w-4 text-pink-400" />
                        <span>{discussion.replies} replies</span>
                      </div>
                    </div>
                    
                    <button className="text-pink-500 hover:text-pink-600 text-sm font-medium">
                      Join Discussion
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-8">
              <button className="bg-white hover:bg-gray-50 text-pink-600 px-6 py-3 rounded-full font-medium transition-all duration-300 shadow-sm hover:shadow-md border border-pink-200">
                Load More Discussions
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Community Guidelines */}
      <section className="section-padding py-16">
        <div className="bg-gradient-to-r from-lavender to-baby-blue rounded-3xl p-8 md:p-12 max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <Baby className="h-10 w-10 text-pink-500 mx-auto mb-4 animate-float" />
            <h2 className="text-3xl md:text-4xl font-pacifico text-pink-600 mb-4">
              Our Community Promise
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <Heart className="h-8 w-8 text-pink-500 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Kindness First</h3>
              <p className="text-gray-700 text-sm">
                Every mama deserves respect, understanding, and gentle support on her unique journey.
              </p>
            </div>

            <div>
              <Star className="h-8 w-8 text-pink-500 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Safe Space</h3>
              <p className="text-gray-700 text-sm">
                Share freely, ask questions, and be vulnerable - this is your judgment-free zone.
              </p>
            </div>

            <div>
              <Baby className="h-8 w-8 text-pink-500 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Lift Each Other</h3>
              <p className="text-gray-700 text-sm">
                Celebrate wins together, offer comfort during challenges, and remember we're all learning.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Community;
