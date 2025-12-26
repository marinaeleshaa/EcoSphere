import React from "react";
import { FileText, TrendingUp, Eye } from "lucide-react";

export default function NewsDashHero() {
  // Sample data - replace with your actual data
  const totalPosts = 1247;
  const publishedPosts = 1089;
  const draftPosts = 158;
  //   const totalViews = 45320;

  return (
    <div className="w-full bg-linear-to-br from-primary via-primary/60 to-primary backdrop-blur-2xl text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2">News Management Dashboard</h1>
          <p className="text-muted text-lg">
            Manage and monitor your news content
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Posts Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-lg">
                <FileText className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium text-muted">Total</span>
            </div>
            <div>
              <p className="text-3xl font-bold mb-1">
                {totalPosts.toLocaleString()}
              </p>
              <p className="text-muted text-sm">Total Posts</p>
            </div>
          </div>

          {/* Published Posts Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/30 rounded-lg">
                <TrendingUp className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium text-muted">Live</span>
            </div>
            <div>
              <p className="text-3xl font-bold mb-1">
                {publishedPosts.toLocaleString()}
              </p>
              <p className="text-muted text-sm">Published</p>
            </div>
          </div>

          {/* Draft Posts Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-500/30 rounded-lg">
                <FileText className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium text-muted">Pending</span>
            </div>
            <div>
              <p className="text-3xl font-bold mb-1">
                {draftPosts.toLocaleString()}
              </p>
              <p className="text-muted text-sm">Drafts</p>
            </div>
          </div>

          {/* Total Views Card */}
          {/* <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-500/30 rounded-lg">
                <Eye className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium text-muted">Engagement</span>
            </div>
            <div>
              <p className="text-3xl font-bold mb-1">{totalViews.toLocaleString()}</p>
              <p className="text-muted text-sm">Total Views</p>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}
