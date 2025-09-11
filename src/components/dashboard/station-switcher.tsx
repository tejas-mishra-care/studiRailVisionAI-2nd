
"use client"

import * as React from "react"

import { useStation } from "@/context/station-context"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { stationList } from "@/lib/stations"


export function StationSwitcher() {
  const [open, setOpen] = React.useState(false)
  const { station, setStation } = useStation()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[250px] justify-between"
        >
          {station
            ? stationList.find((s) => s.code === station.code)?.name
            : "Select station..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Active Station</DialogTitle>
          <DialogDescription>
            Select a new station to monitor and manage. This will update the entire dashboard.
          </DialogDescription>
        </DialogHeader>
        <Command>
          <CommandInput placeholder="Search station..." />
          <CommandList>
            <CommandEmpty>No station found.</CommandEmpty>
            <CommandGroup>
              {stationList.map((s) => (
                <CommandItem
                  key={s.code}
                  value={s.code}
                  onSelect={(currentValue) => {
                    const newStation = stationList.find(st => st.code.toLowerCase() === currentValue.toLowerCase())
                    if(newStation) {
                        setStation(newStation)
                    }
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      station.code === s.code ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {s.name} ({s.code})
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  )
}
