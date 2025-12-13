import { cn } from "@/lib/utils"
import { ChevronDown, ChevronRight } from "lucide-react"
import { useState, createContext, useContext, type ReactNode } from "react"

interface TreeViewContextValue {
  selectedItem: string | null
  setSelectedItem: (item: string | null) => void
}

const TreeViewContext = createContext<TreeViewContextValue>({
  selectedItem: null,
  setSelectedItem: () => {},
})

interface TreeViewProps {
  children: ReactNode
  className?: string
  defaultSelected?: string
}

interface TreeViewItemProps {
  label: string
  icon?: ReactNode
  selected?: boolean
  className?: string
  onClick?: () => void
}

interface TreeViewFolderProps {
  label: string
  children: ReactNode
  className?: string
  defaultOpen?: boolean
}

function TreeViewRoot({ children, className, defaultSelected }: TreeViewProps) {
  const [selectedItem, setSelectedItem] = useState<string | null>(defaultSelected || null)

  return (
    <TreeViewContext.Provider value={{ selectedItem, setSelectedItem }}>
      <div className={cn("flex flex-col gap-0.5 w-full", className)}>
        {children}
      </div>
    </TreeViewContext.Provider>
  )
}

function TreeViewItem({ label, icon, selected, className, onClick }: TreeViewItemProps) {
  const { selectedItem, setSelectedItem } = useContext(TreeViewContext)
  const isSelected = selected ?? selectedItem === label

  const handleClick = () => {
    setSelectedItem(label)
    onClick?.()
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        "flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm transition-colors text-left",
        isSelected
          ? "bg-secondary text-foreground font-medium"
          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
        className
      )}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span className="truncate">{label}</span>
    </button>
  )
}

function TreeViewFolder({ label, children, className, defaultOpen = true }: TreeViewFolderProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className={cn("flex flex-col", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors"
      >
        {isOpen ? (
          <ChevronDown className="w-4 h-4 flex-shrink-0" />
        ) : (
          <ChevronRight className="w-4 h-4 flex-shrink-0" />
        )}
        <span className="font-medium text-foreground">{label}</span>
      </button>
      {isOpen && (
        <div className="flex flex-col gap-0.5 pl-4 mt-0.5">
          {children}
        </div>
      )}
    </div>
  )
}

export const TreeView = Object.assign(TreeViewRoot, {
  Item: TreeViewItem,
  Folder: TreeViewFolder,
})
