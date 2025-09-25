import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  User, 
  Share2, 
  BookOpen,
  ChevronRight
} from "lucide-react";
import { programNewsAndEvents } from "@/data/programNewsAndEvents";

const BlogDetailPage: React.FC = () => {
  const { blogId } = useParams<{ blogId: string }>();
  const navigate = useNavigate();

  // Find the blog post across all programs
  const findBlogPost = () => {
    for (const program of Object.values(programNewsAndEvents)) {
      const blog = program.news.find(item => item.id === blogId);
      if (blog) return blog;
    }
    return null;
  };

  const blog = findBlogPost();

  if (!blog) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Blog post not found</h1>
          <Button onClick={() => navigate(-1)} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "blog": return "Blog";
      case "alumni_story": return "Alumni Story";
      case "instructor_profile": return "Instructor Profile";
      default: return "News";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "blog": return "bg-gradient-to-r from-blue-500 to-blue-600 text-white";
      case "alumni_story": return "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white";
      case "instructor_profile": return "bg-gradient-to-r from-purple-500 to-purple-600 text-white";
      default: return "bg-gradient-to-r from-slate-500 to-slate-600 text-white";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "blog": return "📝";
      case "alumni_story": return "🎓";
      case "instructor_profile": return "👨‍🏫";
      default: return "📰";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate(-1)}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
          <ChevronRight className="w-4 h-4" />
          <span>News & Events</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground">{blog.title}</span>
        </nav>
      </div>

      {/* Hero Section */}
      <div className="relative h-[400px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10" />
        <img 
          src={blog.image} 
          alt={blog.title}
          className="w-full h-full object-cover"
        />
        
        <div className="absolute bottom-0 left-0 right-0 z-20 p-8">
          <div className="container mx-auto">
            <div className="max-w-4xl">
              <Badge className={`${getTypeColor(blog.type)} text-sm font-semibold px-4 py-2 rounded-full mb-4 inline-flex items-center gap-2`}>
                <span>{getTypeIcon(blog.type)}</span>
                {getTypeLabel(blog.type)}
              </Badge>
              
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                {blog.title}
              </h1>
              
              <p className="text-xl text-white/90 mb-6 leading-relaxed">
                {blog.description}
              </p>
              
              <div className="flex items-center gap-6 text-white/80">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{blog.author || "Editorial Team"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(blog.date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{blog.readTime}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <Card className="p-8 bg-card border-0 shadow-sm">
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  {blog.content ? (
                    <div 
                      className="text-foreground leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: blog.content }}
                    />
                  ) : (
                    <div className="space-y-6 text-foreground leading-relaxed">
                      <p>
                        Welcome to an in-depth exploration of this topic. Our comprehensive coverage 
                        provides valuable insights and practical information that will enhance your 
                        understanding and help you succeed in your academic journey.
                      </p>
                      
                      <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">
                        Key Insights
                      </h2>
                      
                      <p>
                        This article covers essential concepts and real-world applications that are 
                        directly relevant to your field of study. We've compiled expert knowledge 
                        and practical examples to give you a comprehensive understanding of the subject matter.
                      </p>
                      
                      <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">
                        Practical Applications
                      </h2>
                      
                      <p>
                        Understanding theory is important, but applying knowledge in real-world scenarios 
                        is what truly matters. This section provides practical examples and case studies 
                        that demonstrate how these concepts work in professional settings.
                      </p>
                      
                      <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">
                        Looking Forward
                      </h2>
                      
                      <p>
                        As you continue your educational journey, remember that learning is an ongoing 
                        process. Stay curious, ask questions, and don't hesitate to reach out to your 
                        instructors and peers for guidance and support.
                      </p>
                    </div>
                  )}
                </div>
                
                {/* Tags */}
                {blog.tags && blog.tags.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-border">
                    <h3 className="text-sm font-semibold text-muted-foreground mb-3">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {blog.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                {/* Share Section */}
                <Card className="p-6 bg-card border-0 shadow-sm">
                  <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Share2 className="w-4 h-4" />
                    Share this article
                  </h3>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: blog.title,
                          text: blog.description,
                          url: window.location.href,
                        });
                      } else {
                        navigator.clipboard.writeText(window.location.href);
                      }
                    }}
                  >
                    Copy link
                  </Button>
                </Card>

                {/* Author Section */}
                <Card className="p-6 bg-card border-0 shadow-sm">
                  <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    About the author
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{blog.author || "Editorial Team"}</p>
                        <p className="text-xs text-muted-foreground">Content Writer</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Passionate about education and helping students succeed in their academic journey.
                    </p>
                  </div>
                </Card>

                {/* Reading Progress */}
                <Card className="p-6 bg-card border-0 shadow-sm">
                  <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    Reading info
                  </h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Reading time:</span>
                      <span className="font-medium">{blog.readTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Published:</span>
                      <span className="font-medium">
                        {new Date(blog.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetailPage;