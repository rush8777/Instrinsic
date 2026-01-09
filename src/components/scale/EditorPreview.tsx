import { cn } from "@/lib/utils"
import { File, Folder, ChevronRight, Search, MoreVertical } from "lucide-react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { useRef } from "react"

interface EditorPreviewProps {
  className?: string
}

export function EditorPreview({ className }: EditorPreviewProps) {
  const ref = useRef<HTMLDivElement>(null)
  
  const x = useMotionValue(0.5)
  const y = useMotionValue(0.5)
  
  const springConfig = { damping: 20, stiffness: 150 }
  const xSpring = useSpring(x, springConfig)
  const ySpring = useSpring(y, springConfig)
  
  const rotateX = useTransform(ySpring, [0, 1], [8, -8])
  const rotateY = useTransform(xSpring, [0, 1], [-12, 12])
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const xPos = (e.clientX - rect.left) / rect.width
    const yPos = (e.clientY - rect.top) / rect.height
    x.set(xPos)
    y.set(yPos)
  }
  
  const handleMouseLeave = () => {
    x.set(0.5)
    y.set(0.5)
  }

  return (
    <div 
      ref={ref}
      className={cn(
        "relative w-full max-w-4xl mx-auto",
        className
      )}
      style={{ perspective: "1000px" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Tilted container */}
      <motion.div 
        className="relative rounded-2xl border border-border/50 bg-card/80 backdrop-blur-xl shadow-2xl overflow-hidden"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d"
        }}
      >
        {/* Window header with traffic lights */}
        <div className="flex items-center gap-2 px-4 py-3 bg-secondary/50 border-b border-border/50">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <div className="flex-1 flex justify-center">
            <span className="text-xs text-muted-foreground">scale-ai-platform</span>
          </div>
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-muted-foreground" />
            <MoreVertical className="w-3.5 h-3.5 text-muted-foreground" />
          </div>
        </div>

        {/* Editor content */}
        <div className="flex h-[350px] md:h-[400px]">
          {/* Sidebar */}
          <div className="w-48 md:w-56 border-r border-border/50 bg-secondary/30 p-3 hidden sm:block">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Explorer</span>
            </div>
            <div className="space-y-0.5 text-xs">
              <TreeItem label="src" isFolder isOpen>
                <TreeItem label="components" isFolder isOpen>
                  <TreeItem label="Header.tsx" />
                  <TreeItem label="Button.tsx" isActive />
                  <TreeItem label="Card.tsx" />
                </TreeItem>
                <TreeItem label="pages" isFolder>
                  <TreeItem label="Index.tsx" />
                  <TreeItem label="Dashboard.tsx" />
                </TreeItem>
                <TreeItem label="lib" isFolder />
              </TreeItem>
              <TreeItem label="public" isFolder />
              <TreeItem label="package.json" />
            </div>
          </div>

          {/* Code panes */}
          <div className="flex-1 flex flex-col">
            {/* Tabs */}
            <div className="flex items-center border-b border-border/50 bg-secondary/20">
              <Tab label="Button.tsx" isActive />
              <Tab label="types.ts" />
              <Tab label="utils.ts" />
            </div>

            {/* Code content */}
            <div className="flex-1 p-4 font-mono text-xs leading-relaxed overflow-hidden">
              <CodeLine lineNumber={1}>
                <span className="text-violet-400">import</span>
                <span className="text-foreground"> {'{'} cn {'}'} </span>
                <span className="text-violet-400">from</span>
                <span className="text-green-400"> "@/lib/utils"</span>
              </CodeLine>
              <CodeLine lineNumber={2}>
                <span className="text-violet-400">import</span>
                <span className="text-foreground"> {'{'} ButtonHTMLAttributes {'}'} </span>
                <span className="text-violet-400">from</span>
                <span className="text-green-400"> "react"</span>
              </CodeLine>
              <CodeLine lineNumber={3} />
              <CodeLine lineNumber={4}>
                <span className="text-violet-400">interface</span>
                <span className="text-blue-400"> ButtonProps </span>
                <span className="text-violet-400">extends</span>
                <span className="text-blue-400"> ButtonHTMLAttributes</span>
                <span className="text-foreground">{'<'}</span>
                <span className="text-blue-400">HTMLButtonElement</span>
                <span className="text-foreground">{'>'} {'{'}</span>
              </CodeLine>
              <CodeLine lineNumber={5}>
                <span className="text-foreground">  variant</span>
                <span className="text-violet-400">?:</span>
                <span className="text-green-400"> "primary"</span>
                <span className="text-foreground"> | </span>
                <span className="text-green-400">"secondary"</span>
                <span className="text-foreground"> | </span>
                <span className="text-green-400">"ghost"</span>
              </CodeLine>
              <CodeLine lineNumber={6}>
                <span className="text-foreground">  size</span>
                <span className="text-violet-400">?:</span>
                <span className="text-green-400"> "sm"</span>
                <span className="text-foreground"> | </span>
                <span className="text-green-400">"md"</span>
                <span className="text-foreground"> | </span>
                <span className="text-green-400">"lg"</span>
              </CodeLine>
              <CodeLine lineNumber={7}>
                <span className="text-foreground">{'}'}</span>
              </CodeLine>
              <CodeLine lineNumber={8} />
              <CodeLine lineNumber={9}>
                <span className="text-violet-400">export function</span>
                <span className="text-yellow-400"> Button</span>
                <span className="text-foreground">({'{'} </span>
                <span className="text-orange-400">variant</span>
                <span className="text-foreground"> = </span>
                <span className="text-green-400">"primary"</span>
                <span className="text-foreground">, </span>
                <span className="text-orange-400">size</span>
                <span className="text-foreground"> = </span>
                <span className="text-green-400">"md"</span>
                <span className="text-foreground"> {'}'})</span>
              </CodeLine>
              <CodeLine lineNumber={10}>
                <span className="text-foreground">  </span>
                <span className="text-violet-400">return</span>
                <span className="text-foreground"> (</span>
              </CodeLine>
              <CodeLine lineNumber={11}>
                <span className="text-foreground">    {'<'}</span>
                <span className="text-blue-400">button</span>
                <span className="text-foreground"> </span>
                <span className="text-orange-400">className</span>
                <span className="text-foreground">={'{'}</span>
                <span className="text-yellow-400">cn</span>
                <span className="text-foreground">(...){'}'}&gt;</span>
              </CodeLine>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Decorative glow */}
      <motion.div 
        className="absolute -inset-4 bg-gradient-to-br from-violet-500/20 via-transparent to-blue-500/20 blur-3xl -z-10"
        style={{
          rotateX,
          rotateY,
        }}
      />
    </div>
  )
}

function TreeItem({ 
  label, 
  isFolder = false, 
  isOpen = false, 
  isActive = false,
  children 
}: { 
  label: string
  isFolder?: boolean
  isOpen?: boolean
  isActive?: boolean
  children?: React.ReactNode
}) {
  return (
    <div>
      <div className={cn(
        "flex items-center gap-1.5 px-1.5 py-1 rounded cursor-pointer hover:bg-muted/50 transition-colors",
        isActive && "bg-muted text-foreground"
      )}>
        {isFolder && (
          <ChevronRight className={cn(
            "w-3 h-3 text-muted-foreground transition-transform",
            isOpen && "rotate-90"
          )} />
        )}
        {isFolder ? (
          <Folder className="w-3.5 h-3.5 text-violet-400" />
        ) : (
          <File className="w-3.5 h-3.5 text-muted-foreground" />
        )}
        <span className={cn(
          "text-muted-foreground",
          isActive && "text-foreground"
        )}>{label}</span>
      </div>
      {children && isOpen && (
        <div className="ml-3 pl-2 border-l border-border/30">
          {children}
        </div>
      )}
    </div>
  )
}

function Tab({ label, isActive = false }: { label: string; isActive?: boolean }) {
  return (
    <div className={cn(
      "px-3 py-2 text-xs border-r border-border/30 cursor-pointer transition-colors",
      isActive 
        ? "bg-card text-foreground border-b-2 border-b-violet-400" 
        : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
    )}>
      {label}
    </div>
  )
}

function CodeLine({ lineNumber, children }: { lineNumber: number; children?: React.ReactNode }) {
  return (
    <div className="flex">
      <span className="w-8 text-muted-foreground/50 select-none text-right pr-4">{lineNumber}</span>
      <span className="flex-1">{children}</span>
    </div>
  )
}
