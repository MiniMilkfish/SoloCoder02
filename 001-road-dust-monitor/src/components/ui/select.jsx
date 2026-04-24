import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const Select = ({ value, defaultValue, onValueChange, children, ...props }) => {
  const [internalValue, setInternalValue] = React.useState(defaultValue || "")
  const currentValue = value !== undefined ? value : internalValue

  const handleChange = React.useCallback((newValue) => {
    if (value === undefined) {
      setInternalValue(newValue)
    }
    onValueChange?.(newValue)
  }, [value, onValueChange])

  return (
    <SelectContext.Provider value={{ value: currentValue, onValueChange: handleChange }}>
      <div className="relative" {...props}>
        {children}
      </div>
    </SelectContext.Provider>
  )
}

const SelectContext = React.createContext(null)

const useSelectContext = () => {
  const context = React.useContext(SelectContext)
  if (!context) {
    throw new Error("Select components must be used within a Select component")
  }
  return context
}

const SelectTrigger = React.forwardRef(({ className, children, ...props }, ref) => {
  const { value } = useSelectContext()
  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <span className="line-clamp-1">{children || <span className="text-muted-foreground">请选择</span>}</span>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </button>
  )
})
SelectTrigger.displayName = "SelectTrigger"

const SelectValue = ({ placeholder, children }) => {
  const { value } = useSelectContext()
  if (children) return children
  return value || placeholder || null
}

const SelectContent = React.forwardRef(({ className, children, ...props }, ref) => {
  const { value, onValueChange } = useSelectContext()
  const [isOpen, setIsOpen] = React.useState(false)
  const containerRef = React.useRef(null)

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const items = React.Children.toArray(children).filter(child => 
    child.type === SelectItem
  )

  const selectedItem = items.find(item => item.props.value === value)

  return (
    <div ref={containerRef} className="relative">
      <SelectTrigger onClick={() => setIsOpen(!isOpen)}>
        <SelectValue placeholder={selectedItem?.props.children || "请选择"}>
          {selectedItem?.props.children}
        </SelectValue>
      </SelectTrigger>
      {isOpen && (
        <div
          ref={ref}
          className={cn(
            "absolute z-50 min-w-[8rem] mt-1 max-h-60 overflow-auto rounded-md border border-border bg-popover text-popover-foreground shadow-md",
            className
          )}
          {...props}
        >
          {React.Children.map(children, (child) => {
            if (child.type === SelectItem) {
              return React.cloneElement(child, {
                onClick: () => {
                  onValueChange(child.props.value)
                  setIsOpen(false)
                },
                isSelected: child.props.value === value,
              })
            }
            return child
          })}
        </div>
      )}
    </div>
  )
})
SelectContent.displayName = "SelectContent"

const SelectItem = React.forwardRef(({ className, children, value, onClick, isSelected, ...props }, ref) => (
  <div
    ref={ref}
    role="option"
    aria-selected={isSelected}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
      isSelected && "bg-accent text-accent-foreground",
      className
    )}
    onClick={onClick}
    {...props}
  >
    {children}
  </div>
))
SelectItem.displayName = "SelectItem"

const SelectGroup = ({ children, ...props }) => (
  <div role="group" {...props}>
    {children}
  </div>
)

const SelectLabel = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)}
    {...props}
  />
))
SelectLabel.displayName = "SelectLabel"

const SelectSeparator = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
))
SelectSeparator.displayName = "SelectSeparator"

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
}
