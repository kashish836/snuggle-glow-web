/**
 * Contact Page with Secure Form Handling
 * 
 * SECURITY:
 * - Rate limiting on form submissions
 * - Strict input validation with Zod schemas
 * - XSS prevention through sanitization
 * - No sensitive data logging
 */

import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { rateLimiter, RATE_LIMIT_CONFIGS } from '@/lib/rate-limiter';
import { contactFormSchema, emailSchema, type ContactFormData } from '@/lib/validation';
import { submitContactMessage, subscribeNewsletter } from '@/lib/api/contact';
import {
  Baby,
  Heart,
  Star,
  Mail,
  MessageCircle,
  Send,
  Sparkles,
  Gift,
  BookOpen,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';

const Contact = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [rateLimitMessage, setRateLimitMessage] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    topic: 'General Question',
    message: '',
    newsletter: false,
  });

  // Newsletter form state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterLoading, setNewsletterLoading] = useState(false);

  /**
   * Handles contact form submission
   * SECURITY: Validates all inputs and rate limits submissions
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setRateLimitMessage(null);

    // Rate limiting check
    const rateLimit = rateLimiter.check('contact', RATE_LIMIT_CONFIGS.contact);
    if (!rateLimit.allowed) {
      setRateLimitMessage(rateLimit.message || 'Too many submissions. Please wait.');
      toast({
        variant: 'destructive',
        title: 'Too Many Submissions',
        description: rateLimit.message,
      });
      return;
    }

    // Validate form data using Zod schema
    const validationResult = contactFormSchema.safeParse(formData);

    if (!validationResult.success) {
      const fieldErrors: Record<string, string> = {};
      validationResult.error.errors.forEach((err) => {
        const field = err.path[0] as string;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);

    try {
      const result = await submitContactMessage({
        first_name: formData.firstName,
        last_name: formData.lastName || undefined,
        email: formData.email,
        topic: formData.topic,
        message: formData.message,
        newsletter: formData.newsletter,
      });

      if (result.success) {
        setSubmitted(true);
        toast({
          title: 'Message Sent! 💕',
          description: 'Thank you for reaching out. We\'ll get back to you soon.',
        });

        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          topic: 'General Question',
          message: '',
          newsletter: false,
        });
      } else {
        throw new Error(result.error?.detail || 'Submission failed');
      }
    } catch (error) {
      console.error('Contact form submission error:', error);
      toast({
        variant: 'destructive',
        title: 'Submission Failed',
        description: error instanceof Error ? error.message : 'Unable to send your message. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles newsletter signup
   * SECURITY: Rate limited and validated
   */
  const handleNewsletterSignup = async () => {
    // Rate limiting check
    const rateLimit = rateLimiter.check('newsletter', RATE_LIMIT_CONFIGS.newsletter);
    if (!rateLimit.allowed) {
      toast({
        variant: 'destructive',
        title: 'Too Many Attempts',
        description: rateLimit.message,
      });
      return;
    }

    // Validate email
    const emailResult = emailSchema.safeParse(newsletterEmail);
    if (!emailResult.success) {
      toast({
        variant: 'destructive',
        title: 'Invalid Email',
        description: emailResult.error.errors[0].message,
      });
      return;
    }

    setNewsletterLoading(true);

    try {
      const result = await subscribeNewsletter({ email: newsletterEmail });

      if (result.success) {
        toast({
          title: 'Subscribed! 🎉',
          description: 'Welcome to our newsletter family.',
        });
        setNewsletterEmail('');
      } else {
        throw new Error(result.error?.detail || 'Subscription failed');
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      toast({
        variant: 'destructive',
        title: 'Signup Failed',
        description: error instanceof Error ? error.message : 'Unable to subscribe. Please try again.',
      });
    } finally {
      setNewsletterLoading(false);
    }
  };

  const topics = [
    'General Question',
    'Resource Request',
    'Community Support',
    'Partnership Inquiry',
    'Technical Issue',
    'Share My Story',
  ] as const;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-lavender">
      <Navigation />

      {/* Header */}
      <section className="section-padding py-16">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute -inset-3 bg-gradient-to-r from-pink-200 to-mint rounded-full blur-lg opacity-60 animate-pulse-gentle"></div>
              <Mail className="relative h-14 w-14 text-pink-400 animate-float" />
              <Heart className="h-5 w-5 text-pink-500 absolute -top-1 -right-2 animate-pulse-gentle" />
              <Sparkles className="h-4 w-4 text-yellow-400 absolute -bottom-1 -left-2 animate-sparkle" />
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

            {/* Rate Limit Warning */}
            {rateLimitMessage && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <p className="text-sm">{rateLimitMessage}</p>
              </div>
            )}

            {/* Success Message */}
            {submitted && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2 text-green-700">
                <CheckCircle className="h-5 w-5 flex-shrink-0" />
                <p className="text-sm">Your message has been sent successfully!</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-gray-700">
                    First Name *
                  </Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="Your first name"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    maxLength={100}
                    className={`border-pink-200 focus:border-pink-400 focus:ring-pink-400 rounded-xl ${
                      errors.firstName ? 'border-red-400' : ''
                    }`}
                  />
                  {errors.firstName && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.firstName}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-gray-700">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Your last name"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    maxLength={100}
                    className="border-pink-200 focus:border-pink-400 focus:ring-pink-400 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">
                  Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  maxLength={255}
                  className={`border-pink-200 focus:border-pink-400 focus:ring-pink-400 rounded-xl ${
                    errors.email ? 'border-red-400' : ''
                  }`}
                />
                {errors.email && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="topic" className="text-gray-700">
                  How can we help? *
                </Label>
                <Select
                  value={formData.topic}
                  onValueChange={(value) => setFormData({ ...formData, topic: value })}
                >
                  <SelectTrigger className="border-pink-200 focus:border-pink-400 focus:ring-pink-400 rounded-xl">
                    <SelectValue placeholder="Select a topic" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-pink-200 rounded-xl">
                    {topics.map((topic) => (
                      <SelectItem key={topic} value={topic} className="focus:bg-pink-50">
                        {topic}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.topic && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.topic}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-gray-700">
                  Your Message *
                </Label>
                <Textarea
                  id="message"
                  rows={6}
                  placeholder="Share your thoughts, questions, or story with us..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  maxLength={5000}
                  className={`border-pink-200 focus:border-pink-400 focus:ring-pink-400 rounded-xl resize-none ${
                    errors.message ? 'border-red-400' : ''
                  }`}
                />
                {errors.message && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.message}
                  </p>
                )}
                <p className="text-xs text-gray-500">{formData.message.length}/5000 characters</p>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="newsletter"
                  checked={formData.newsletter}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, newsletter: checked === true })
                  }
                  className="mt-1 border-pink-300 data-[state=checked]:bg-pink-500 data-[state=checked]:border-pink-500"
                />
                <Label htmlFor="newsletter" className="text-sm text-gray-600 cursor-pointer">
                  I'd love to receive gentle tips and updates via the SnuggleNest newsletter
                </Label>
              </div>

              <Button
                type="submit"
                disabled={loading || !!rateLimitMessage}
                className="w-full gentle-button text-center group"
              >
                {loading ? (
                  <span className="flex items-center gap-2 justify-center">
                    <Heart className="h-4 w-4 animate-pulse" />
                    Sending...
                  </span>
                ) : (
                  <span className="flex items-center gap-2 justify-center">
                    <Send className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    Send Message with Love
                  </span>
                )}
              </Button>
            </form>
          </div>

          {/* Contact Info & FAQ */}
          <div className="space-y-8">
            {/* Contact Methods */}
            <div className="baby-card">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Other Ways to Reach Us</h3>

              <div className="space-y-4">
                <div className="flex items-start space-x-3 group">
                  <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center group-hover:animate-wiggle">
                    <Mail className="h-5 w-5 text-pink-500" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Email Support</p>
                    <p className="text-gray-600 text-sm">hello@snugglenest.com</p>
                    <p className="text-gray-500 text-xs">We reply within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 group">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center group-hover:animate-wiggle">
                    <MessageCircle className="h-5 w-5 text-purple-500" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Community Forum</p>
                    <p className="text-gray-600 text-sm">Connect with other mamas 24/7</p>
                    <p className="text-gray-500 text-xs">Join ongoing discussions</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 group">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center group-hover:animate-wiggle">
                    <BookOpen className="h-5 w-5 text-green-500" />
                  </div>
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
                  <p className="text-gray-600 text-sm">
                    We aim to respond to all messages within 24 hours, usually much sooner!
                  </p>
                </div>

                <div>
                  <p className="font-medium text-gray-800 mb-1">Are all resources really free?</p>
                  <p className="text-gray-600 text-sm">
                    Yes! Every resource in our library is completely free because every mama deserves
                    support.
                  </p>
                </div>

                <div>
                  <p className="font-medium text-gray-800 mb-1">Can I share my story?</p>
                  <p className="text-gray-600 text-sm">
                    Absolutely! We love featuring real mama stories to inspire and connect our
                    community.
                  </p>
                </div>

                <div>
                  <p className="font-medium text-gray-800 mb-1">How do I join the community?</p>
                  <p className="text-gray-600 text-sm">
                    Simply visit our Community page and start participating in discussions. No
                    special signup needed!
                  </p>
                </div>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="bg-gradient-to-r from-mint to-baby-blue rounded-2xl p-6">
              <div className="text-center">
                <Star className="h-8 w-8 text-pink-500 mx-auto mb-3 animate-pulse-gentle" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Weekly Love Notes</h3>
                <p className="text-gray-700 text-sm mb-4">
                  Get gentle tips, heartwarming stories, and community highlights delivered to your
                  inbox.
                </p>

                <div className="flex space-x-2">
                  <Input
                    type="email"
                    placeholder="Your email address"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    maxLength={255}
                    className="flex-1 border-pink-200 rounded-full text-sm focus:border-pink-400 focus:ring-pink-400"
                  />
                  <Button
                    type="button"
                    onClick={handleNewsletterSignup}
                    disabled={newsletterLoading}
                    className="bg-pink-400 hover:bg-pink-500 text-white px-4 py-2 rounded-full transition-colors"
                  >
                    {newsletterLoading ? (
                      <Heart className="h-4 w-4 animate-pulse" />
                    ) : (
                      <Heart className="h-4 w-4" />
                    )}
                  </Button>
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
