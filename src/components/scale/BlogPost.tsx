import { Clock, User, Tag } from "lucide-react"
import { H1, H2, H3, Body, BodySmall } from "./typography"
import { cn } from "@/lib/utils"

// Content block types
export type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; level: 2 | 3; text: string }
  | { type: "quote"; text: string }

interface BlogPostProps {
  category?: string
  title?: string
  author?: string
  timeAgo?: string
  createdAt?: string
  updatedAt?: string
  tags?: string[]
  description?: string
  outputType?: string
  content?: ContentBlock[]
  className?: string
}

/*
Example usage with mock content:

const mockContent: ContentBlock[] = [
  {
    type: "paragraph",
    text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
  },
  {
    type: "heading",
    level: 3,
    text: "#1. What is Lorem Ipsum?"
  },
  {
    type: "paragraph",
    text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
  },
  {
    type: "quote",
    text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s"
  },
  {
    type: "paragraph",
    text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
  }
]

<BlogPost
  category="Election"
  title="Portrait Photography In Early Days"
  author="AliSher Azimi"
  timeAgo="6 mins ago"
  tags={["Election", "people", "Election2020", "trump", "Joe"]}
  content={mockContent}
/>
*/

// Helper function to calculate time ago from date string
function getTimeAgo(dateString?: string): string {
  if (!dateString) return "Recently"
  
  try {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) return "Just now"
    if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60)
      return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`
    }
    if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600)
      return `${hours} ${hours === 1 ? "hour" : "hours"} ago`
    }
    if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400)
      return `${days} ${days === 1 ? "day" : "days"} ago`
    }
    return date.toLocaleDateString()
  } catch {
    return "Recently"
  }
}

export function BlogPost({
  category,
  title,
  author,
  timeAgo,
  createdAt,
  updatedAt,
  tags,
  description,
  outputType,
  content = [],
  className,
}: BlogPostProps) {
  // Calculate timeAgo from dates if not provided
  const displayTimeAgo = timeAgo || getTimeAgo(updatedAt || createdAt)
  
  // Use outputType as category fallback
  const displayCategory = category || outputType || "Project"
  
  // Use title or fallback
  const displayTitle = title || "Untitled Project"
  
  // Generate tags from available data if not provided
  const displayTags = tags || []
  
  // Show description if no content blocks
  const showDescription = !content || content.length === 0
  const renderContentBlock = (block: ContentBlock, index: number) => {
    switch (block.type) {
      case "paragraph":
        return (
          <Body key={index} className="my-5">
            {block.text}
          </Body>
        )
      case "heading":
        if (block.level === 2) {
          return (
            <H2 key={index} className="my-5">
              {block.text}
            </H2>
          )
        }
        return (
          <H3 key={index} className="my-5">
            {block.text}
          </H3>
        )
      case "quote":
        return (
          <blockquote
            key={index}
            className="text-base italic leading-8 my-5 p-5 text-primary font-semibold border-l-4 border-primary bg-muted/30 rounded-r-lg"
          >
            {block.text}
          </blockquote>
        )
      default:
        return null
    }
  }

  return (
    <div className={cn("relative p-4", className)}>
      <div className="max-w-3xl mx-auto">
        <article className="mt-3 bg-card rounded-lg flex flex-col justify-between leading-normal">
          <div className="p-6">
            {/* Category */}
            {displayCategory && (
              <div className="text-primary text-sm font-medium mb-2">
                {displayCategory}
              </div>
            )}

            {/* Title */}
            <H1 className="mt-2">{displayTitle}</H1>

            {/* Description (shown if available and no content blocks) */}
            {showDescription && description && (
              <Body className="my-4 text-muted-foreground">
                {description}
              </Body>
            )}

            {/* Meta Info */}
            <div className="py-5 text-sm font-normal text-foreground flex flex-wrap gap-4">
              {displayTimeAgo && (
                <span className="flex flex-row items-center">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="ml-1 text-muted-foreground">{displayTimeAgo}</span>
                </span>
              )}

              {author && (
                <span className="flex flex-row items-center">
                  <User className="w-4 h-4 text-primary" />
                  <span className="ml-1 text-muted-foreground">{author}</span>
                </span>
              )}

              {outputType && !category && (
                <span className="flex flex-row items-center">
                  <Tag className="w-4 h-4 text-primary" />
                  <span className="ml-1 text-muted-foreground">{outputType}</span>
                </span>
              )}
            </div>

            <hr className="border-border" />

            {/* Dynamic Content */}
            {content.length > 0 ? (
              content.map((block, index) => renderContentBlock(block, index))
            ) : (
              <Body className="my-5 text-muted-foreground">
                {description 
                  ? "Content will appear here once generated." 
                  : "No content available. Content will appear here once generated."}
              </Body>
            )}

            {/* Tags */}
            {displayTags && displayTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-6">
                {displayTags.map((tag, index) => (
                  <span
                    key={index}
                    className="text-xs text-primary font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </article>
      </div>
    </div>
  )
}
