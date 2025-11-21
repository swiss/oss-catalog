"use client"

import * as React from "react"
import { CheckIcon, ChevronDownIcon } from "lucide-react"

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
    onChange?: (value: string) => void
}

export function Combobox({ groups, onChange }: ComboboxProps) {
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState("")

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {value
              ? groups.flatMap((g) => g.organisations).find((organisation) => organisation.value === value)?.label
              : ""}
            {/*TODO select all*/}
            <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput/>
            <CommandList>
              <CommandEmpty>No organisation found.</CommandEmpty>
              {groups.map((group) => (
                <CommandGroup key={group.label} heading={group.label}>
                  {group.organisations.map((organisation) => (
                    <CommandItem
                      key={organisation.value}
                      value={organisation.label}
                      onSelect={() => {
                        const newValue =
                          value === organisation.value ? "" : organisation.value;
                        setValue(newValue);
                        onChange?.(newValue);
                        setOpen(false);
                      }}
                    >
                      <CheckIcon
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === organisation.value
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