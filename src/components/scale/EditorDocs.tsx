"use client"

import { useState, useEffect } from "react"
import { ScaleButton } from "./buttons"
import { ScaleCard } from "./cards"
import { H3, Body } from "./typography"
import { CodeSnippetCard } from "./CodeSnippetCard"
import { api } from "@/lib/api"
import { toast } from "sonner"
import { FileCode, File, Folder, FolderOpen, ChevronRight, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface EditorDocsProps {
  projectId: number
}

interface FileTreeNode {
  name: string
  type: "file" | "directory"
  description?: string
  children?: FileTreeNode[]
}

interface Documentation {
  file_tree: FileTreeNode[]
  generated_at: string
}

export function EditorDocs({ projectId }: EditorDocsProps) {
  const [docs, setDocs] = useState<Documentation | null>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set())

  useEffect(() => {
    loadDocs()
  }, [projectId])

  const loadDocs = async () => {
    try {
      setLoading(true)
      const data = await api.getDocs(projectId) as Documentation
      setDocs(data)
    } catch (error: any) {
      console.error("Failed to load docs:", error)
      // Don't show error for empty state
      if (!error.message?.includes("404")) {
        toast.error("Failed to load documentation")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleInitialize = async () => {
    setGenerating(true)
    try {
      await api.initializeDocs(projectId)
      toast.success("Documentation generation started!")
      // Reload after a short delay
      setTimeout(() => {
        loadDocs()
      }, 2000)
    } catch (error: any) {
      toast.error(error.message || "Failed to initialize documentation")
    } finally {
      setGenerating(false)
    }
  }

  const togglePath = (path: string) => {
    setExpandedPaths((prev) => {
      const next = new Set(prev)
      if (next.has(path)) {
        next.delete(path)
      } else {
        next.add(path)
      }
      return next
    })
  }

  const renderTreeNode = (node: FileTreeNode, path: string = "", depth: number = 0) => {
    const fullPath = path ? `${path}/${node.name}` : node.name
    const isExpanded = expandedPaths.has(fullPath)
    const isDirectory = node.type === "directory"

    return (
      <div key={fullPath} className="select-none">
        <div
          className={cn(
            "flex items-start gap-2 py-2 px-3 rounded-lg hover:bg-secondary/50 cursor-pointer transition-colors",
            depth > 0 && "ml-4"
          )}
          style={{ paddingLeft: `${depth * 16 + 12}px` }}
          onClick={() => isDirectory && togglePath(fullPath)}
        >
          {isDirectory ? (
            <>
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
              ) : (
                <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
              )}
              {isExpanded ? (
                <FolderOpen className="w-4 h-4 text-foreground flex-shrink-0 mt-0.5" />
              ) : (
                <Folder className="w-4 h-4 text-foreground flex-shrink-0 mt-0.5" />
              )}
            </>
          ) : (
            <>
              <div className="w-4 h-4 flex-shrink-0" />
              <File className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
            </>
          )}
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm text-foreground">{node.name}</div>
            {node.description && (
              <div className="text-xs text-muted-foreground mt-1">{node.description}</div>
            )}
          </div>
        </div>
        {isDirectory && isExpanded && node.children && (
          <div>
            {node.children.map((child) => renderTreeNode(child, fullPath, depth + 1))}
          </div>
        )}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        <div className="flex-1 overflow-y-auto scrollbar-thin p-6 flex items-center justify-center">
          <div className="text-muted-foreground">Loading documentation...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
      <div className="flex-1 overflow-y-auto scrollbar-thin p-6">
        {!docs || !docs.file_tree || docs.file_tree.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <CodeSnippetCard className="max-w-md w-full" showActions={false}>
              <div className="space-y-4 text-center">
                <div className="space-y-2">
                  <p className="text-foreground font-mono text-lg">No Documentation</p>
                  <p className="text-muted-foreground font-mono text-sm">
                    Initialize documentation to generate a file-by-file overview of your project
                  </p>
                </div>
                <ScaleButton
                  variant="primary"
                  size="md"
                  onClick={handleInitialize}
                  disabled={generating}
                  className="mx-auto"
                >
                  <FileCode className="w-4 h-4 mr-2" />
                  {generating ? "Generating..." : "Initialize Documentation"}
                </ScaleButton>
              </div>
            </CodeSnippetCard>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-6">
            <div>
              <H3 className="text-2xl font-semibold mb-2">Documentation</H3>
              <Body className="text-muted-foreground">
                Generated on {new Date(docs.generated_at).toLocaleDateString()}
              </Body>
            </div>
            <ScaleCard className="p-4">
              <div className="space-y-1">
                {docs.file_tree.map((node) => renderTreeNode(node))}
              </div>
            </ScaleCard>
          </div>
        )}
      </div>
    </div>
  )
}
