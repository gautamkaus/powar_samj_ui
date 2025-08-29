import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Plus, Eye, Heart, MessageCircle, Calendar, User, Crown } from 'lucide-react';
import { blogAPI, BlogPost } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { AuthModal } from '@/components/AuthModal';
import { ProfileCompletionForm } from '@/components/ProfileCompletionForm';
import { useTranslation } from '@/hooks/useTranslation';
import { CreateBlogPost } from '@/components/CreateBlogPost';
import { authAPI } from '@/services/api';

export const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [previewTimer, setPreviewTimer] = useState(10);
  const [isPreviewExpired, setIsPreviewExpired] = useState(false);
  const [isScreenFrozen, setIsScreenFrozen] = useState(false);
  const [isCompletingProfile, setIsCompletingProfile] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const t = useTranslation();

  useEffect(() => {
    fetchPosts();
    
    // Start preview timer for unauthenticated users
    if (!isAuthenticated) {
      const timer = setInterval(() => {
        setPreviewTimer((prev) => {
          if (prev <= 1) {
            setIsPreviewExpired(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (searchQuery) {
      const filtered = posts.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (post.tags && post.tags.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredPosts(filtered);
    } else {
      setFilteredPosts(posts);
    }
  }, [searchQuery, posts]);

  // Handle screen freeze after 10 seconds for unauthenticated users
  useEffect(() => {
    if (!isAuthenticated && previewTimer === 0) {
      const freezeTimer = setTimeout(() => {
        setIsScreenFrozen(true);
      }, 10000); // 10 seconds after preview expires

      return () => clearTimeout(freezeTimer);
    }
  }, [isAuthenticated, previewTimer]);

  // Check if user needs to complete profile (for users with phone numbers but no profile)
  useEffect(() => {
    if (isAuthenticated && user && !user.profile) {
      // User is authenticated but doesn't have a profile, show profile completion
      setIsScreenFrozen(true);
    }
  }, [isAuthenticated, user]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await blogAPI.getAllPosts();
      setPosts(response.data);
      setFilteredPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTags = (tags: string) => {
    if (!tags) return [];
    return tags.split(',').map(tag => tag.trim());
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  const handleProfileCompletion = async (profileData: any) => {
    try {
      setIsCompletingProfile(true);
      
      // Get the user ID from the stored phone number
      const userId = localStorage.getItem('guestUserId') || user?.id || 1;
      
      const response = await authAPI.completeProfile({
        ...profileData,
        user_id: parseInt(userId.toString())
      });
      
      // Profile completed successfully
      setShowProfileForm(false);
      setIsScreenFrozen(false);
      
      // You could show a success message here
      console.log('Profile completed:', response.message);
      
      // Optionally redirect to a success page or refresh the page
      window.location.reload();
      
    } catch (error) {
      console.error('Error completing profile:', error);
      // You could show an error message here
    } finally {
      setIsCompletingProfile(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`min-h-screen bg-background ${isScreenFrozen ? 'pointer-events-none' : ''}`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border-b">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-foreground mb-4">
                Powar Community Blog
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                Discover stories, insights, and experiences from our community members
              </p>
              
              {/* Search Bar */}
              <div className="max-w-md mx-auto mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search posts..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Preview Timer */}
              {!isAuthenticated && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-center space-x-2">
                    <Eye className="h-5 w-5 text-yellow-600" />
                    <span className="text-yellow-800 font-medium">
                      Preview Mode: {previewTimer} seconds remaining
                    </span>
                  </div>
                  <p className="text-yellow-700 text-sm mt-2 text-center">
                    Sign in to continue reading and create your own posts
                  </p>
                </div>
              )}

              {/* Create Post Button */}
              {isAuthenticated && (
                <Button onClick={() => setShowCreatePost(true)} className="btn-royal">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Post
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="container mx-auto px-4 py-8">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-muted-foreground text-lg mb-4">
                {searchQuery ? 'No posts found matching your search.' : 'No blog posts available yet.'}
              </div>
              {!searchQuery && isAuthenticated && (
                <Button onClick={() => setShowCreatePost(true)} className="btn-royal">
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Post
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <Card key={post.id} className="group hover:shadow-lg transition-all duration-300">
                  {post.image_url && (
                    <div className="aspect-video overflow-hidden rounded-t-lg">
                      <img
                        src={post.image_url}
                        alt={post.title}
                        className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
                          isPreviewExpired && !isAuthenticated ? 'blur-sm' : ''
                        }`}
                      />
                    </div>
                  )}
                  
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between mb-2">
                      <CardTitle className={`text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors ${
                        isPreviewExpired && !isAuthenticated ? 'blur-sm' : ''
                      }`}>
                        {post.title}
                      </CardTitle>
                    </div>
                    
                    {/* Author Info */}
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={post.author_profile_url} />
                        <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                          {getInitials(post.first_name || '', post.last_name || '')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium text-foreground truncate ${
                          isPreviewExpired && !isAuthenticated ? 'blur-sm' : ''
                        }`}>
                          {post.first_name} {post.last_name}
                        </p>
                        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(post.created_at)}</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    {/* Content Preview */}
                    <div className={`mb-4 ${isPreviewExpired && !isAuthenticated ? 'blur-sm' : ''}`}>
                      <p className="text-muted-foreground line-clamp-3 text-sm">
                        {post.content}
                      </p>
                    </div>

                    {/* Tags */}
                    {post.tags && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {formatTags(post.tags).map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Eye className="h-4 w-4" />
                          <span>{post.view_count}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Heart className="h-4 w-4" />
                          <span>{post.like_count}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageCircle className="h-4 w-4" />
                          <span>{post.comment_count}</span>
                        </div>
                      </div>
                      
                      <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                        Read More
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Screen Freeze Overlay */}
        {isScreenFrozen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center">
            <div className="bg-background rounded-lg p-8 max-w-2xl mx-4 text-center">
              <div className="mb-6">
                <Crown className="h-16 w-16 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-semibold mb-4">Complete Your Profile to Continue</h3>
                <p className="text-muted-foreground mb-6">
                  To continue reading and fully participate in our community, please complete your profile with all required information.
                </p>
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6">
                  <p className="text-sm text-primary font-medium">
                    This helps us maintain a strong, connected community and ensures you get the most out of your membership.
                  </p>
                </div>
              </div>
              
              <div className="space-y-3">
                <Button 
                  onClick={() => setShowProfileForm(true)} 
                  className="w-full btn-royal text-lg py-3"
                >
                  <Crown className="h-5 w-5 mr-2" />
                  Complete Profile & Join Community
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => window.history.back()}
                  className="w-full text-lg py-3"
                >
                  Go Back
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Blur Overlay and Login Prompt */}
        {isPreviewExpired && !isAuthenticated && !isScreenFrozen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-background rounded-lg p-8 max-w-md mx-4 text-center">
              <div className="mb-6">
                <User className="h-16 w-16 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Preview Time Expired</h3>
                <p className="text-muted-foreground">
                  To continue reading and create your own posts, please sign in to your account.
                </p>
              </div>
              
              <div className="space-y-3">
                <Button 
                  onClick={() => setShowAuthModal(true)} 
                  className="w-full btn-royal"
                >
                  Sign In
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => window.history.back()}
                  className="w-full"
                >
                  Go Back
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultMode="login"
      />

      {/* Create Blog Post Modal */}
      <CreateBlogPost
        isOpen={showCreatePost}
        onClose={() => setShowCreatePost(false)}
        onSuccess={fetchPosts}
      />

      {/* Profile Completion Form */}
      <ProfileCompletionForm
        isOpen={showProfileForm}
        onClose={() => setShowProfileForm(false)}
        onSubmit={handleProfileCompletion}
        isLoading={isCompletingProfile}
      />
    </>
  );
};
