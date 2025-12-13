"// Project Editor Page"

import React, { useState } from "react"
import { IconButton } from "@/components/scale/buttons"
import { BlogPost } from "@/components/scale/BlogPost"
import { TreeView } from "@/components/scale/TreeView"
import { SearchInput } from "@/components/scale/inputs"
import { H4 } from "@/components/scale/typography"

import {
  Library,
  Globe,
  Star,
  Pin,
  ListMusic,
  Plus,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react"

export default function ProjectEditor() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* Header - Fixed */}
      

      {/* Main Content - Fixed height, no scroll */}
      <div className="flex flex-1 overflow-hidden">

        <div className="flex flex-1 overflow-hidden">
          {/* Channel Navigation Sidebar - Fixed */}
          <div 
            className={`hidden md:flex flex-col bg-muted/30 border-r border-border transition-all duration-300 overflow-y-auto ${
              sidebarCollapsed ? "w-14" : "w-64"
            }`}
          >
            {/* Sidebar Header */}
            <div className="flex items-center gap-2 p-3">
              {!sidebarCollapsed && (
                <>
                  <Library className="w-5 h-5 text-foreground" />
                  <H4 className="flex-1 truncate">Your library</H4>
                </>
              )}
              <IconButton 
                variant="ghost" 
                size="sm"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="ml-auto"
              >
                {sidebarCollapsed ? (
                  <PanelLeft className="w-4 h-4" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
              </IconButton>
            </div>

            {/* Search */}
            {!sidebarCollapsed && (
              <div className="px-2 pb-2">
                <SearchInput placeholder="Search" className="h-9 text-sm" />
              </div>
            )}

            {/* Tree View */}
            <div className="flex-1 overflow-y-auto px-2 pb-2 scrollbar-thin">
              {sidebarCollapsed ? (
                // Collapsed state - show only icons
                <div className="flex flex-col items-center gap-1">
                  <IconButton variant="ghost" size="sm" className="w-full justify-center">
                    <Globe className="w-4 h-4" />
                  </IconButton>
                  <IconButton variant="ghost" size="sm" className="w-full justify-center">
                    <Star className="w-4 h-4" />
                  </IconButton>
                  <IconButton variant="ghost" size="sm" className="w-full justify-center">
                    <Pin className="w-4 h-4" />
                  </IconButton>
                  <div className="w-full h-px bg-border my-2" />
                  <IconButton variant="ghost" size="sm" className="w-full justify-center">
                    <ListMusic className="w-4 h-4" />
                  </IconButton>
                </div>
              ) : (
                <TreeView defaultSelected="Chill Vibes Only">
                  <TreeView.Item label="Daily Discover" icon={<Globe className="w-4 h-4" />} />
                  <TreeView.Item label="New Releases" icon={<Star className="w-4 h-4" />} />
                  <TreeView.Item label="Liked Songs" icon={<Pin className="w-4 h-4" />} />
                  <TreeView.Folder label="My Playlists">
                    <TreeView.Item 
                      label="Chill Vibes Only" 
                      icon={<ListMusic className="w-4 h-4" />} 
                    />
                    <TreeView.Item label="Morning Boost" icon={<ListMusic className="w-4 h-4" />} />
                    <TreeView.Item label="Late Night Grooves" icon={<ListMusic className="w-4 h-4" />} />
                  </TreeView.Folder>
                  <TreeView.Folder label="Shared">
                    <TreeView.Item label="Sunday Brunch Tunes" icon={<ListMusic className="w-4 h-4" />} />
                    <TreeView.Item label="Road Trip Jams" icon={<ListMusic className="w-4 h-4" />} />
                    <TreeView.Item label="Serotonin Sunrise" icon={<ListMusic className="w-4 h-4" />} />
                  </TreeView.Folder>
                </TreeView>
              )}
            </div>
          </div>

        {/* Main Blog Area */}
        <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
          {/* Blog Content - Scrollable */}
          <div className="flex-1 overflow-y-auto scrollbar-thin">
            <BlogPost />
          </div>
        </div>
        </div>
        {/* Footer - Spans full width at bottom */}
      </div>
      
    </div>
  )
}
