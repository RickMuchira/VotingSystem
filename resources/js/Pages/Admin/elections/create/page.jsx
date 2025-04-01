"use client"

import React, { useState } from "react"
import { router } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { CalendarIcon, Plus, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { Link } from "@inertiajs/react"

export default function CreateElectionPage({ courses, sections }) {
  const [startDate, setStartDate] = useState(undefined)
  const [endDate, setEndDate] = useState(undefined)
  const [isActive, setIsActive] = useState(false)
  const [course, setCourse] = useState(null)
  const [section, setSection] = useState(null)
  const [positions, setPositions] = useState([])
  const [newPosition, setNewPosition] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    const form = e.currentTarget
    const title = form.querySelector("#title")?.value

    if (!startDate || !endDate) {
      alert("Please select both start and end dates for the election.")
      return
    }

    if (!section) {
      alert("Please select a section for the election.")
      return
    }

    if (positions.length === 0) {
      alert("Please add at least one position for the election.")
      return
    }

    const payload = {
      title,
      course_id: course,
      section,
      start_date: startDate,
      end_date: endDate,
      is_active: isActive,
      positions: positions
    }

    router.post("/admin/elections", payload, {
      onSuccess: () => {
        router.visit("/admin/elections")
      },
      onError: (errors) => {
        console.error(errors)
        alert("There was an error creating the election. Please check the form.")
      },
    })
  }

  const addPosition = () => {
    if (newPosition.trim() === "") return
    setPositions([...positions, { name: newPosition.trim() }])
    setNewPosition("")
  }

  const removePosition = (index) => {
    setPositions(positions.filter((_, i) => i !== index))
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addPosition()
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Create Election</h2>
        <p className="text-muted-foreground">Create a new election with all required details.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Election Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-3">
                <Label htmlFor="title">Election Title</Label>
                <Input id="title" placeholder="Enter election title" required />
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="grid gap-3">
                  <Label htmlFor="course">Course/Department (Optional)</Label>
                  <Select value={course} onValueChange={setCourse}>
                    <SelectTrigger id="course">
                      <SelectValue placeholder="Select course or department (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={null}>None</SelectItem>
                      {courses && courses.map((course) => (
                        <SelectItem key={course.id} value={course.id.toString()}>
                          {course.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="section">Section</Label>
                  <Select value={section} onValueChange={setSection} required>
                    <SelectTrigger id="section">
                      <SelectValue placeholder="Select section" />
                    </SelectTrigger>
                    <SelectContent>
                      {sections && sections.map((section, index) => (
                        <SelectItem key={index} value={section}>
                          {section}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="grid gap-3">
                  <Label>Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn("w-full justify-start text-left font-normal", !startDate && "text-muted-foreground")}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="grid gap-3">
                  <Label>End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="active" checked={isActive} onCheckedChange={setIsActive} />
                <Label htmlFor="active">Active</Label>
              </div>
            </CardContent>
          </Card>

          {/* Election Positions Card */}
          <Card>
            <CardHeader>
              <CardTitle>Election Positions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Define positions that candidates can run for in this election (e.g., President, Secretary, Treasurer).
              </p>

              {/* Show added positions */}
              {positions.length > 0 && (
                <div className="space-y-2 mt-4">
                  {positions.map((position, index) => (
                    <div 
                      key={index} 
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-md border"
                    >
                      <span className="font-medium">{position.name}</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removePosition(index)}
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add position input and button */}
              <div className="flex gap-2 mt-4">
                <Input 
                  value={newPosition}
                  onChange={(e) => setNewPosition(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter a position name (e.g., President)"
                  className="flex-1"
                />
                <Button 
                  type="button" 
                  onClick={addPosition}
                  disabled={!newPosition.trim()}
                  variant="secondary"
                >
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </div>
            </CardContent>
          </Card>

          <CardFooter className="flex justify-between px-0">
            <Button variant="outline" asChild>
              <Link href="/admin/elections">Cancel</Link>
            </Button>
            <Button type="submit">Create Election</Button>
          </CardFooter>
        </div>
      </form>
    </div>
  )
}