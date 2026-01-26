import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { MessageSquare, ThumbsUp, Send, User, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/components/AppLayout';
import { useToast } from '@/hooks/use-toast';

interface Post {
  id: string;
  author: string;
  location: string;
  content: string;
  crop?: string;
  scheme?: string;
  outcome?: 'success' | 'partial' | 'loss';
  likes: number;
  timeAgo: string;
}

const Community: React.FC = () => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [newPost, setNewPost] = useState('');
  const [showNewPost, setShowNewPost] = useState(false);

  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      author: 'Ramesh Kumar',
      location: 'Lucknow, UP',
      content: language === 'hi' 
        ? 'PM-KISAN योजना से ₹6000 मिला। आवेदन प्रक्रिया बहुत आसान थी। सभी किसान भाइयों को जरूर आवेदन करना चाहिए।'
        : 'Received ₹6000 from PM-KISAN scheme. Application process was very easy. All farmers should definitely apply.',
      scheme: 'PM-KISAN',
      outcome: 'success',
      likes: 24,
      timeAgo: '2 hours ago',
    },
    {
      id: '2',
      author: 'Suresh Yadav',
      location: 'Jaipur, Rajasthan',
      content: language === 'hi'
        ? 'इस साल गेहूं की फसल बहुत अच्छी हुई। ड्रिप सिंचाई लगाने से पानी की बचत हुई और उत्पादन भी बढ़ा।'
        : 'Wheat crop was excellent this year. Drip irrigation saved water and increased production.',
      crop: 'Wheat',
      outcome: 'success',
      likes: 18,
      timeAgo: '5 hours ago',
    },
    {
      id: '3',
      author: 'Mohan Singh',
      location: 'Amritsar, Punjab',
      content: language === 'hi'
        ? 'PMFBY बीमा से फसल नुकसान की भरपाई मिली। बारिश से फसल खराब हुई थी लेकिन बीमा ने बचा लिया।'
        : 'Got crop loss compensation from PMFBY insurance. Crop was damaged by rain but insurance saved us.',
      scheme: 'PMFBY',
      outcome: 'partial',
      likes: 32,
      timeAgo: '1 day ago',
    },
    {
      id: '4',
      author: 'Lakshmi Devi',
      location: 'Nashik, Maharashtra',
      content: language === 'hi'
        ? 'कपास की खेती में इस बार नुकसान हुआ। मौसम खराब था और कीट भी लगे। अगली बार सोयाबीन लगाऊंगी।'
        : 'Suffered loss in cotton farming this time. Weather was bad and pest attack happened. Will grow soybean next time.',
      crop: 'Cotton',
      outcome: 'loss',
      likes: 8,
      timeAgo: '2 days ago',
    },
  ]);

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId ? { ...post, likes: post.likes + 1 } : post
    ));
  };

  const handleSubmitPost = () => {
    if (!newPost.trim()) return;
    
    const post: Post = {
      id: Date.now().toString(),
      author: 'You',
      location: 'Your District',
      content: newPost,
      likes: 0,
      timeAgo: 'Just now',
    };
    
    setPosts([post, ...posts]);
    setNewPost('');
    setShowNewPost(false);
    toast({
      title: "Posted!",
      description: "Your experience has been shared with the community.",
    });
  };

  const getOutcomeStyle = (outcome?: 'success' | 'partial' | 'loss') => {
    switch (outcome) {
      case 'success': return 'bg-success/10 text-success border-success/30';
      case 'partial': return 'bg-warning/10 text-warning border-warning/30';
      case 'loss': return 'bg-destructive/10 text-destructive border-destructive/30';
      default: return '';
    }
  };

  const getOutcomeLabel = (outcome?: 'success' | 'partial' | 'loss') => {
    switch (outcome) {
      case 'success': return '✅ Success';
      case 'partial': return '🟡 Partial';
      case 'loss': return '❌ Loss';
      default: return '';
    }
  };

  return (
    <AppLayout 
      title={t('community')}
      subtitle="Farmer experiences & feedback"
    >
      <div className="px-4 py-6 max-w-2xl mx-auto">
        {/* Header */}
        <div className="farm-card-elevated mb-6 bg-gradient-to-br from-accent/10 to-primary/10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center">
              <MessageSquare className="w-7 h-7 text-accent-foreground" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-foreground">
                {language === 'hi' ? 'किसान समुदाय' : 'Farmer Community'}
              </h2>
              <p className="text-muted-foreground text-sm">
                {language === 'hi' 
                  ? 'अपने अनुभव साझा करें और दूसरों से सीखें'
                  : 'Share your experiences and learn from others'}
              </p>
            </div>
          </div>
        </div>

        {/* New Post Button */}
        {!showNewPost && (
          <Button 
            className="w-full mb-4" 
            onClick={() => setShowNewPost(true)}
          >
            <Plus className="w-5 h-5 mr-2" />
            {language === 'hi' ? 'अपना अनुभव साझा करें' : 'Share Your Experience'}
          </Button>
        )}

        {/* New Post Form */}
        {showNewPost && (
          <div className="farm-card mb-4">
            <Textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder={language === 'hi' 
                ? 'अपना अनुभव यहाँ लिखें...'
                : 'Write your experience here...'}
              className="min-h-[100px] mb-3"
            />
            <div className="flex gap-2">
              <Button onClick={handleSubmitPost} className="flex-1">
                <Send className="w-4 h-4 mr-2" />
                {language === 'hi' ? 'पोस्ट करें' : 'Post'}
              </Button>
              <Button variant="outline" onClick={() => setShowNewPost(false)}>
                {language === 'hi' ? 'रद्द करें' : 'Cancel'}
              </Button>
            </div>
          </div>
        )}

        {/* Posts Feed */}
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="farm-card">
              {/* Author Header */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{post.author}</p>
                  <p className="text-xs text-muted-foreground">{post.location} • {post.timeAgo}</p>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-3">
                {post.crop && (
                  <span className="px-2 py-1 rounded-full text-xs bg-primary/10 text-primary border border-primary/20">
                    🌾 {post.crop}
                  </span>
                )}
                {post.scheme && (
                  <span className="px-2 py-1 rounded-full text-xs bg-secondary/10 text-secondary border border-secondary/20">
                    📋 {post.scheme}
                  </span>
                )}
                {post.outcome && (
                  <span className={`px-2 py-1 rounded-full text-xs border ${getOutcomeStyle(post.outcome)}`}>
                    {getOutcomeLabel(post.outcome)}
                  </span>
                )}
              </div>

              {/* Content */}
              <p className="text-foreground leading-relaxed mb-4">{post.content}</p>

              {/* Actions */}
              <div className="flex items-center gap-4 pt-3 border-t border-border">
                <button 
                  onClick={() => handleLike(post.id)}
                  className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                >
                  <ThumbsUp className="w-5 h-5" />
                  <span className="text-sm font-medium">{post.likes}</span>
                </button>
                <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                  <MessageSquare className="w-5 h-5" />
                  <span className="text-sm font-medium">Reply</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default Community;
