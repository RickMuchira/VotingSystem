"use client"

import { useState } from "react"
import { Inertia } from "@inertiajs/inertia"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table"
import { PlusCircle, Trash2 } from "lucide-react"
import { Link } from "@inertiajs/react"
import AdminLayout from "../layout"

export default function CandidatesPage({ candidates }) {
  const [searchTerm, setSearchTerm] = useState("")

  // Filter candidates based on search term (by candidate name)
  const filteredCandidates = candidates.filter((candidate) =>
    candidate.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Delete handler using Inertia
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this candidate?")) {
      Inertia.delete(`/admin/candidates/${id}`)
    }
  }

  return (
    <AdminLayout>
      <div className="w-full space-y-4">
        {/* Header Section */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Candidates</h2>
            <p className="text-muted-foreground">
              Manage candidates and their associations with elections and positions.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="Search candidates..."
              className="w-48"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button asChild>
              <Link href="/admin/candidates/create">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Candidate
              </Link>
            </Button>
          </div>
        </div>

        {/* Candidates Table */}
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center py-3">
            <CardTitle>All Candidates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Election</TableCell>
                    <TableCell>Position</TableCell>
                    <TableCell className="hidden md:table-cell">Bio</TableCell>
                    <TableCell className="text-right">Actions</TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCandidates.map((candidate) => (
                    <TableRow key={candidate.id}>
                      <TableCell className="font-medium">{candidate.name}</TableCell>
                      <TableCell>{candidate.election.title}</TableCell>
                      <TableCell>{candidate.position.name}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {candidate.bio ? candidate.bio.substring(0, 50) + "..." : "N/A"}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/admin/candidates/${candidate.id}/edit`}>Edit</Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive"
                          onClick={() => handleDelete(candidate.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredCandidates.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">
                        No candidates found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

