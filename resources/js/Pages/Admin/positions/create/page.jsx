"use client"
import { useForm } from "@inertiajs/inertia-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import AdminLayout from "../../layout"

export default function CreatePosition({ elections }) {
  const { data, setData, post, processing, errors } = useForm({
    positionName: "",
    electionId: "",
    description: "",
  })

  function handleSubmit(e) {
    e.preventDefault()
    // Directly posting to the endpoint as defined in your routes
    post("/admin/positions")
  }

  return (
    <AdminLayout>
      <div className="w-full max-w-3xl mx-auto">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Create Position</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="positionName">Position Name</Label>
                <Input
                  id="positionName"
                  type="text"
                  value={data.positionName}
                  onChange={(e) => setData("positionName", e.target.value)}
                  className="mt-1 block w-full"
                />
                {errors.positionName && <div className="text-red-600 text-sm">{errors.positionName}</div>}
              </div>

              <div>
                <Label htmlFor="electionId">Election</Label>
                <select
                  id="electionId"
                  value={data.electionId}
                  onChange={(e) => setData("electionId", e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                >
                  <option value="">Select an election</option>
                  {elections.map((election) => (
                    <option key={election.id} value={election.id}>
                      {election.title}
                    </option>
                  ))}
                </select>
                {errors.electionId && <div className="text-red-600 text-sm">{errors.electionId}</div>}
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={data.description}
                  onChange={(e) => setData("description", e.target.value)}
                  className="mt-1 block w-full"
                  rows={4}
                />
                {errors.description && <div className="text-red-600 text-sm">{errors.description}</div>}
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={processing}>
                  Create Position
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

