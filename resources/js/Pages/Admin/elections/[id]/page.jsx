"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Link, router } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { UserCircle, AlertTriangle } from "lucide-react"
import AdminLayout from "../../layout"

export default function ElectionDetailsPage({ election, positions, candidates }) {
  // Handle delete election
  const handleDelete = () => {
    if (
      confirm(
        "Are you sure you want to delete this election? This will also delete all associated positions and candidates.",
      )
    ) {
      router.delete(`/admin/elections/${election.id}`)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{election.title}</h2>
            <p className="text-muted-foreground mt-1">
              {election.course ? election.course.name : "No Course"} • {election.section} • {election.start_date} to{" "}
              {election.end_date}
            </p>
            <div className="mt-2">
              <Badge variant={election.is_active ? "success" : "secondary"}>
                {election.is_active ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href={`/admin/elections/${election.id}/edit`}>
              <Button variant="outline">Edit Election</Button>
            </Link>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Delete</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the election and all associated positions
                    and candidates.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <Tabs defaultValue="positions" className="space-y-4">
          <TabsList>
            <TabsTrigger value="positions">Positions ({positions.length})</TabsTrigger>
            <TabsTrigger value="candidates">Candidates ({candidates.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="positions">
            <div className="mb-4 flex justify-between items-center">
              <h3 className="text-lg font-medium">Election Positions</h3>
              <Link href="/admin/positions/create">
                <Button variant="outline" size="sm">
                  Add Position
                </Button>
              </Link>
            </div>

            {/* Render positions table */}
            <Card>
              <CardContent className="p-0">
                {positions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-6 text-center">
                    <AlertTriangle className="h-8 w-8 text-amber-500 mb-2" />
                    <h3 className="text-lg font-medium">No Positions Found</h3>
                    <p className="text-muted-foreground mt-1">This election doesn't have any positions defined yet.</p>
                    <Link href="/admin/positions/create" className="mt-4">
                      <Button variant="default" size="sm">
                        Add Position
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Position Name</TableHead>
                        <TableHead>Candidates</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {positions.map((position) => {
                        // Find candidates for this position
                        const positionCandidates = candidates.filter(
                          (candidate) => candidate.position_id === position.id,
                        )

                        return (
                          <TableRow key={position.id}>
                            <TableCell className="font-medium">{position.name}</TableCell>
                            <TableCell>{positionCandidates.length} candidates</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Link href={`/admin/positions/${position.id}/edit`}>
                                  <Button variant="ghost" size="sm">
                                    Edit
                                  </Button>
                                </Link>
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="candidates">
            <div className="mb-4 flex justify-between items-center">
              <h3 className="text-lg font-medium">Election Candidates</h3>
              <Link href="/admin/candidates/create">
                <Button variant="outline" size="sm">
                  Add Candidate
                </Button>
              </Link>
            </div>

            {/* Render candidates table */}
            <Card>
              <CardContent className="p-0">
                {candidates.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-6 text-center">
                    <UserCircle className="h-8 w-8 text-gray-400 mb-2" />
                    <h3 className="text-lg font-medium">No Candidates Found</h3>
                    <p className="text-muted-foreground mt-1">This election doesn't have any candidates yet.</p>
                    <Link href="/admin/candidates/create" className="mt-4">
                      <Button variant="default" size="sm">
                        Add Candidate
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Candidate</TableHead>
                        <TableHead>Position</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {candidates.map((candidate) => {
                        // Find position for this candidate
                        const position = positions.find((p) => p.id === candidate.position_id)

                        return (
                          <TableRow key={candidate.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                {candidate.photo ? (
                                  <img
                                    src={candidate.photo || "/placeholder.svg"}
                                    alt={candidate.name}
                                    className="h-8 w-8 rounded-full object-cover"
                                  />
                                ) : (
                                  <UserCircle className="h-8 w-8 text-gray-400" />
                                )}
                                <span className="font-medium">{candidate.name}</span>
                              </div>
                            </TableCell>
                            <TableCell>{position ? position.name : "Unknown Position"}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Link href={`/admin/candidates/${candidate.id}/edit`}>
                                  <Button variant="ghost" size="sm">
                                    Edit
                                  </Button>
                                </Link>
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}

