"use client"

import { useState, useEffect } from "react"
import { ScaleCard } from "./cards"
import { ScaleButton } from "./buttons"
import { ScaleInput, ScaleTextarea } from "./inputs"
import { H3, Body } from "./typography"
import { CodeSnippetCard } from "./CodeSnippetCard"
import { BackgroundBeams } from "@/components/ui/background-beams"
import { api } from "@/lib/api"
import { toast } from "sonner"
import { Plus } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

interface EditorStatusProps {
  projectId: number
}

interface StatusItem {
  id: number
  title: string
  description: string
  completed: boolean
  created_at: string
}

export function EditorStatus({ projectId }: EditorStatusProps) {
  const [items, setItems] = useState<StatusItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newItemTitle, setNewItemTitle] = useState("")
  const [newItemDescription, setNewItemDescription] = useState("")
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    loadItems()
  }, [projectId])

  const loadItems = async () => {
    try {
      setLoading(true)
      const data = await api.getStatusItems(projectId) as StatusItem[]
      setItems(data || [])
    } catch (error: any) {
      console.error("Failed to load status items:", error)
      if (!error.message?.includes("404")) {
        toast.error("Failed to load status items")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleToggleComplete = async (itemId: number, completed: boolean) => {
    try {
      await api.updateStatusItem(projectId, itemId, !completed)
      setItems((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, completed: !completed } : item
        )
      )
    } catch (error: any) {
      toast.error("Failed to update item")
    }
  }

  const handleAddItem = async () => {
    if (!newItemTitle.trim()) return

    setAdding(true)
    try {
      const newItem = await api.createStatusItem(projectId, {
        title: newItemTitle,
        description: newItemDescription,
      }) as StatusItem
      
      setItems((prev) => [newItem, ...prev])
      setNewItemTitle("")
      setNewItemDescription("")
      setShowAddForm(false)
      toast.success("Item added successfully")
    } catch (error: any) {
      toast.error(error.message || "Failed to add item")
    } finally {
      setAdding(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        <div className="flex-1 overflow-y-auto scrollbar-thin p-6 flex items-center justify-center">
          <div className="text-muted-foreground">Loading status items...</div>
        </div>
      </div>
    )
  }

  const completedCount = items.filter((item) => item.completed).length
  const totalCount = items.length

  return (
    <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
      <div className="flex-1 overflow-y-auto scrollbar-thin p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <H3 className="text-2xl font-semibold mb-1">Status</H3>
              <Body className="text-muted-foreground">
                {totalCount > 0
                  ? `${completedCount} of ${totalCount} completed`
                  : "No items yet"}
              </Body>
            </div>
            <ScaleButton
              variant="primary"
              size="sm"
              onClick={() => setShowAddForm(!showAddForm)}
            >
              <Plus className="w-4 h-4" />
              Add Item
            </ScaleButton>
          </div>

          {showAddForm && (
            <ScaleCard className="p-6 space-y-4">
              <ScaleInput
                placeholder="Item title"
                value={newItemTitle}
                onChange={(e) => setNewItemTitle(e.target.value)}
                autoFocus
              />
              <ScaleTextarea
                placeholder="Description (optional)"
                value={newItemDescription}
                onChange={(e) => setNewItemDescription(e.target.value)}
              />
              <div className="flex gap-2">
                <ScaleButton
                  variant="primary"
                  size="sm"
                  onClick={handleAddItem}
                  disabled={!newItemTitle.trim() || adding}
                >
                  {adding ? "Adding..." : "Add"}
                </ScaleButton>
                <ScaleButton
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowAddForm(false)
                    setNewItemTitle("")
                    setNewItemDescription("")
                  }}
                >
                  Cancel
                </ScaleButton>
              </div>
            </ScaleCard>
          )}

          {items.length === 0 ? (
            <div className="relative flex items-center justify-center min-h-[400px]">
              <BackgroundBeams />
              <CodeSnippetCard className="max-w-md w-full relative z-10" showActions={false}>
                <div className="space-y-4 text-center">
                  <div className="space-y-2">
                    <p className="text-foreground font-mono text-lg">No Status Items</p>
                    <p className="text-muted-foreground font-mono text-sm">
                      Add items to track your project progress
                    </p>
                  </div>
                  <ScaleButton
                    variant="primary"
                    size="sm"
                    onClick={() => setShowAddForm(true)}
                    className="mx-auto"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Item
                  </ScaleButton>
                </div>
              </CodeSnippetCard>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <ScaleCard
                  key={item.id}
                  className="p-4 flex items-start gap-3 hover:border-muted-foreground/30 transition-colors"
                >
                  <Checkbox
                    checked={item.completed}
                    onCheckedChange={() => handleToggleComplete(item.id, item.completed)}
                    className="mt-1"
                  />
                  <div className="flex-1 min-w-0">
                    <h4
                      className={`font-semibold ${
                        item.completed ? "line-through text-muted-foreground" : "text-foreground"
                      }`}
                    >
                      {item.title}
                    </h4>
                    {item.description && (
                      <Body
                        className={`text-sm mt-1 ${
                          item.completed ? "text-muted-foreground" : "text-muted-foreground"
                        }`}
                      >
                        {item.description}
                      </Body>
                    )}
                    <Body className="text-xs text-muted-foreground mt-2">
                      {new Date(item.created_at).toLocaleDateString()}
                    </Body>
                  </div>
                </ScaleCard>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
