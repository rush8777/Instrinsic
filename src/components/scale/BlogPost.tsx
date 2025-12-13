import { Clock, User, Tag } from "lucide-react"
import { H1, H3, Body, BodySmall } from "./typography"
import { cn } from "@/lib/utils"

interface BlogPostProps {
  category?: string
  title?: string
  author?: string
  timeAgo?: string
  tags?: string[]
  className?: string
}

export function BlogPost({
  category = "Election",
  title = "Portrait Photography In Early Days",
  author = "AliSher Azimi",
  timeAgo = "6 mins ago",
  tags = ["Election", "people", "Election2020", "trump", "Joe"],
  className,
}: BlogPostProps) {
  return (
    <div className={cn("relative p-4", className)}>
      <div className="max-w-3xl mx-auto">
        <article className="mt-3 bg-card rounded-lg flex flex-col justify-between leading-normal">
          <div className="p-6">
            {/* Category */}
            <a
              href="#"
              className="text-primary hover:text-muted-foreground transition duration-500 ease-in-out text-sm"
            >
              {category}
            </a>

            {/* Title */}
            <H1 className="mt-2">{title}</H1>

            {/* Meta Info */}
            <div className="py-5 text-sm font-normal text-foreground flex flex-wrap gap-4">
              <span className="flex flex-row items-center">
                <Clock className="w-4 h-4 text-primary" />
                <span className="ml-1 text-muted-foreground">{timeAgo}</span>
              </span>

              <a
                href="#"
                className="flex flex-row items-center hover:text-primary transition-colors"
              >
                <User className="w-4 h-4 text-primary" />
                <span className="ml-1 text-muted-foreground">{author}</span>
              </a>

              <a
                href="#"
                className="flex flex-row items-center hover:text-primary transition-colors"
              >
                <Tag className="w-4 h-4 text-primary" />
                <span className="ml-1 text-muted-foreground">activewear</span>
              </a>
            </div>

            <hr className="border-border" />

            {/* Content */}
            <Body className="my-5">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
              industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type
              and scrambled it to make a type specimen book. It has survived not only five centuries, but also the
              leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s
              with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop
              publishing software like Aldus PageMaker including versions of Lorem Ipsum.
            </Body>

            <H3 className="my-5">#1. What is Lorem Ipsum?</H3>

            <Body className="my-5">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
              industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type
              and scrambled it to make a type specimen book. It has survived not only five centuries, but also the
              leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s
              with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop
              publishing software like Aldus PageMaker including versions of Lorem Ipsum.
            </Body>

            <blockquote className="text-base italic leading-8 my-5 p-5 text-primary font-semibold border-l-4 border-primary bg-muted/30 rounded-r-lg">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
              industry's standard dummy text ever since the 1500s
            </blockquote>

            <Body className="my-5">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
              industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type
              and scrambled it to make a type specimen book. It has survived not only five centuries, but also the
              leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s
              with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop
              publishing software like Aldus PageMaker including versions of Lorem Ipsum.
            </Body>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-6">
              {tags.map((tag, index) => (
                <a
                  key={index}
                  href="#"
                  className="text-xs text-primary font-medium hover:text-foreground transition duration-500 ease-in-out"
                >
                  #{tag}
                </a>
              ))}
            </div>
          </div>
        </article>
      </div>
    </div>
  )
}
