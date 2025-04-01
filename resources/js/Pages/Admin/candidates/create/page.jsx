"use client"

import { useState, useEffect } from "react"
import { useForm, Head } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Upload, ImageIcon, X } from "lucide-react"
import AdminLayout from "../../layout"

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

  // State to store image preview
  const [photoPreview, setPhotoPreview] = useState(null)

  // Update filtered positions whenever election_id changes
  useEffect(() => {
    if (data.election_id) {
      const electionId = Number.parseInt(data.election_id)
      const filtered = positions.filter((position) => position.election_id === electionId)
      setFilteredPositions(filtered)

      // Reset position_id if current selection is not valid for the new election
      if (data.position_id) {
        const isValidPosition = filtered.some((position) => position.id === Number.parseInt(data.position_id))
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
    const file = e.target.files[0]
    setData("photo", file)

    // Create and set image preview
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPhotoPreview(e.target.result)
      }
      reader.readAsDataURL(file)
    } else {
      setPhotoPreview(null)
    }
  }

  function removePhoto() {
    setData("photo", null)
    setPhotoPreview(null)
    // Reset the file input
    document.getElementById("photo").value = ""
  }

  return (
    <AdminLayout>
      <Head title="Create Candidate" />
      <div className="max-w-2xl mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Create Candidate</CardTitle>
            <CardDescription>Add a new candidate to an election position</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
              {/* Candidate Name */}
              <div>
                <label htmlFor="name" className="block font-medium mb-1">
                  Name
                </label>
                <Input
                  id="name"
                  type="text"
                  value={data.name}
                  onChange={(e) => setData("name", e.target.value)}
                  className="mt-1 block w-full"
                  placeholder="Enter candidate name"
                  required
                />
                {errors.name && <div className="text-destructive text-sm mt-1">{errors.name}</div>}
              </div>

              {/* Candidate Bio */}
              <div>
                <label htmlFor="bio" className="block font-medium mb-1">
                  Bio
                </label>
                <textarea
                  id="bio"
                  value={data.bio}
                  onChange={(e) => setData("bio", e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded p-2 min-h-[120px]"
                  rows="4"
                  placeholder="Enter candidate biography"
                ></textarea>
                {errors.bio && <div className="text-destructive text-sm mt-1">{errors.bio}</div>}
              </div>

              {/* Candidate Motto */}
              <div>
                <label htmlFor="motto" className="block font-medium mb-1">
                  Motto
                </label>
                <Input
                  id="motto"
                  type="text"
                  value={data.motto}
                  onChange={(e) => setData("motto", e.target.value)}
                  className="mt-1 block w-full"
                  placeholder="Enter candidate motto or slogan"
                />
                {errors.motto && <div className="text-destructive text-sm mt-1">{errors.motto}</div>}
              </div>

              {/* Improved Photo Upload */}
              <div>
                <label htmlFor="photo" className="block font-medium mb-2">
                  Candidate Photo
                </label>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                  {/* Upload Area */}
                  <div
                    className={`border-2 border-dashed rounded-lg p-4 text-center hover:bg-gray-50 transition-colors ${
                      errors.photo ? "border-red-300" : "border-gray-300"
                    }`}
                  >
                    <input id="photo" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />

                    <label htmlFor="photo" className="cursor-pointer block">
                      <div className="flex flex-col items-center justify-center py-3">
                        <Upload className="h-10 w-10 text-gray-400 mb-2" />
                        <p className="text-sm font-medium text-gray-700">Click to upload</p>
                        <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 5MB</p>
                      </div>
                    </label>
                  </div>

                  {/* Preview Area */}
                  <div className="border rounded-lg p-2 bg-gray-50 aspect-square flex items-center justify-center overflow-hidden">
                    {photoPreview ? (
                      <div className="relative w-full h-full">
                        <img
                          src={photoPreview || "/placeholder.svg"}
                          alt="Candidate preview"
                          className="w-full h-full object-cover rounded"
                        />
                        <button
                          type="button"
                          onClick={removePhoto}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                          title="Remove photo"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="text-center text-gray-400">
                        <ImageIcon className="h-12 w-12 mx-auto mb-2" />
                        <p className="text-sm">Photo preview</p>
                      </div>
                    )}
                  </div>
                </div>

                {errors.photo && <div className="text-destructive text-sm mt-1">{errors.photo}</div>}
              </div>

              {/* Election and Position Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Election Dropdown */}
                <div>
                  <label htmlFor="election_id" className="block font-medium mb-1">
                    Election
                  </label>
                  <select
                    id="election_id"
                    value={data.election_id}
                    onChange={(e) => setData("election_id", e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded p-2 h-10"
                    required
                  >
                    <option value="">Select an Election</option>
                    {elections.map((election) => (
                      <option key={election.id} value={election.id}>
                        {election.title}
                      </option>
                    ))}
                  </select>
                  {errors.election_id && <div className="text-destructive text-sm mt-1">{errors.election_id}</div>}
                </div>

                {/* Position Dropdown - Filtered by election */}
                <div>
                  <label htmlFor="position_id" className="block font-medium mb-1">
                    Position
                  </label>
                  <select
                    id="position_id"
                    value={data.position_id}
                    onChange={(e) => setData("position_id", e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded p-2 h-10"
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
                  {errors.position_id && <div className="text-destructive text-sm mt-1">{errors.position_id}</div>}
                </div>
              </div>

              {/* Show warning if no positions available */}
              {data.election_id && filteredPositions.length === 0 && (
                <Alert className="border-amber-500 bg-amber-50">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <AlertDescription className="text-amber-600">
                    No positions available for this election. Please create positions first.
                  </AlertDescription>
                </Alert>
              )}

              {/* Form Actions */}
              <div className="flex justify-end pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => window.history.back()} className="mr-2">
                  Cancel
                </Button>
                <Button type="submit" disabled={processing}>
                  {processing ? "Creating..." : "Create Candidate"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

