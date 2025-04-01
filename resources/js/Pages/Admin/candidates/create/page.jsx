"use client"

import React, { useState, useEffect } from "react"
import { useForm, Head } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function CreateCandidate({ elections, positions }) {
  const { data, setData, post, processing, errors } = useForm({
    name: "",
    bio: "",
    motto: "",
    election_id: "",
    position_id: "",
    photo: null,
  })

  // State to store filtered positions based on selected election
  const [filteredPositions, setFilteredPositions] = useState([])

  // Update filtered positions whenever election_id changes
  useEffect(() => {
    if (data.election_id) {
      const electionId = parseInt(data.election_id)
      const filtered = positions.filter(position => position.election_id === electionId)
      setFilteredPositions(filtered)
      
      // Reset position_id if current selection is not valid for the new election
      if (data.position_id) {
        const isValidPosition = filtered.some(position => position.id === parseInt(data.position_id))
        if (!isValidPosition) {
          setData("position_id", "")
        }
      }
    } else {
      setFilteredPositions([])
      setData("position_id", "")
    }
  }, [data.election_id, positions])

  function handleSubmit(e) {
    e.preventDefault()
    post("/admin/candidates", { forceFormData: true })
  }

  function handleFileChange(e) {
    setData("photo", e.target.files[0])
  }

  return (
    <>
      <Head title="Create Candidate" />
      <div className="max-w-2xl mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Create Candidate</CardTitle>
            <CardDescription>Add a new candidate to an election position</CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSubmit}
              encType="multipart/form-data"
              className="space-y-4"
            >
              {/* Candidate Name */}
              <div>
                <label htmlFor="name" className="block font-medium">
                  Name
                </label>
                <Input
                  id="name"
                  type="text"
                  value={data.name}
                  onChange={(e) => setData("name", e.target.value)}
                  className="mt-1 block w-full"
                  required
                />
                {errors.name && (
                  <div className="text-destructive text-sm mt-1">{errors.name}</div>
                )}
              </div>

              {/* Candidate Bio */}
              <div>
                <label htmlFor="bio" className="block font-medium">
                  Bio
                </label>
                <textarea
                  id="bio"
                  value={data.bio}
                  onChange={(e) => setData("bio", e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded p-2"
                  rows="4"
                ></textarea>
                {errors.bio && (
                  <div className="text-destructive text-sm mt-1">{errors.bio}</div>
                )}
              </div>

              {/* Candidate Motto */}
              <div>
                <label htmlFor="motto" className="block font-medium">
                  Motto
                </label>
                <Input
                  id="motto"
                  type="text"
                  value={data.motto}
                  onChange={(e) => setData("motto", e.target.value)}
                  className="mt-1 block w-full"
                />
                {errors.motto && (
                  <div className="text-destructive text-sm mt-1">{errors.motto}</div>
                )}
              </div>

              {/* Photo Upload */}
              <div>
                <label htmlFor="photo" className="block font-medium">
                  Candidate Photo
                </label>
                <input
                  id="photo"
                  type="file"
                  onChange={handleFileChange}
                  className="mt-1 block w-full border border-gray-300 rounded p-2"
                />
                {errors.photo && (
                  <div className="text-destructive text-sm mt-1">{errors.photo}</div>
                )}
              </div>

              {/* Election Dropdown */}
              <div>
                <label htmlFor="election_id" className="block font-medium">
                  Election
                </label>
                <select
                  id="election_id"
                  value={data.election_id}
                  onChange={(e) => setData("election_id", e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded p-2"
                  required
                >
                  <option value="">Select an Election</option>
                  {elections.map((election) => (
                    <option key={election.id} value={election.id}>
                      {election.title}
                    </option>
                  ))}
                </select>
                {errors.election_id && (
                  <div className="text-destructive text-sm mt-1">{errors.election_id}</div>
                )}
              </div>

              {/* Position Dropdown - Filtered by election */}
              <div>
                <label htmlFor="position_id" className="block font-medium">
                  Position
                </label>
                <select
                  id="position_id"
                  value={data.position_id}
                  onChange={(e) => setData("position_id", e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded p-2"
                  disabled={!data.election_id}
                  required
                >
                  <option value="">Select a Position</option>
                  {filteredPositions.map((position) => (
                    <option key={position.id} value={position.id}>
                      {position.name}
                    </option>
                  ))}
                </select>
                {errors.position_id && (
                  <div className="text-destructive text-sm mt-1">{errors.position_id}</div>
                )}
                
                {/* Show warning if no positions available */}
                {data.election_id && filteredPositions.length === 0 && (
                  <Alert className="mt-2 border-amber-500 bg-amber-50">
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                    <AlertDescription className="text-amber-600">
                      No positions available for this election. Please create positions first.
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              {/* Form Actions */}
              <div className="flex justify-end mt-6">
                <Button type="submit" disabled={processing}>
                  Create Candidate
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  )
}