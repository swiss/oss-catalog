"use client"

import * as React from "react"
import { CheckIcon, ChevronDownIcon, XIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

interface Organisation {
    value: string
    label: string
}

interface Departement {
    label: string
    organisations: Organisation[]
}

interface ComboboxProps {
    groups: Departement[]
    onChange?: (values: string[]) => void
}

export function Combobox({ groups, onChange }: ComboboxProps) {
    const [open, setOpen] = React.useState(false)
    const [values, setValues] = React.useState<string[]>([])

    const allOptions = React.useMemo(
      () => groups.flatMap((g) => g.organisations),
      [groups],
    )

    const toggleValue = (val: string) => {
      setValues((prev) => {
        const exists = prev.includes(val)
        const next = exists ? prev.filter((v) => v !== val) : [...prev, val]
        onChange?.(next)
        return next
      })
    }

    const buttonLabel = React.useMemo(() => {
      if (values.length === 0) return ""
      const labels = values
        .map((v) => allOptions.find((o) => o.value === v)?.label)
        .filter(Boolean) as string[]
      if (labels.length <= 2) return labels.join(", ")
      return `${labels.slice(0, 2).join(", ")} +${labels.length - 2}`
    }, [values, allOptions])

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {buttonLabel}
            <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput/>
            {values.length > 0 && (
              <div className="flex flex-wrap gap-2 px-3 py-2">
                {values.map((v) => {
                  const label = allOptions.find((o) => o.value === v)?.label || v
                  return (
                    <span
                      key={v}
                      className="inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs"
                    >
                      {label}
                      <button
                        type="button"
                        className="opacity-60 hover:opacity-100"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleValue(v)
                        }}
                        aria-label={`Remove ${label}`}
                      >
                        <XIcon className="h-3 w-3" />
                      </button>
                    </span>
                  )
                })}
              </div>
            )}
            <CommandList>
              <CommandEmpty>No organisation found.</CommandEmpty>
              <CommandGroup heading="Actions">
                <CommandItem
                  value="Select all"
                  onSelect={() => {
                    const all = allOptions.map((o) => o.value)
                    setValues(all)
                    onChange?.(all)
                  }}
                >
                  Select all
                </CommandItem>
                <CommandItem
                  value="Clear all"
                  onSelect={() => {
                    setValues([])
                    onChange?.([])
                  }}
                >
                  Clear all
                </CommandItem>
              </CommandGroup>
              {groups.map((group) => (
                <CommandGroup key={group.label} heading={group.label}>
                  {group.organisations.map((organisation) => (
                    <CommandItem
                      key={organisation.value}
                      value={organisation.label}
                      onSelect={() => {
                        toggleValue(organisation.value)
                      }}
                    >
                      <CheckIcon
                        className={cn(
                          "mr-2 h-4 w-4",
                          values.includes(organisation.value)
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                      {organisation.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
}