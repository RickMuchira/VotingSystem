"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table"
import { PlusCircle, Trash2 } from "lucide-react"
import { Link } from "@inertiajs/react"
import { Badge } from "@/components/ui/badge"
import AdminLayout from "../layout"

export default function ElectionsPage({ elections }) {
  const getStatusBadge = (status) => {
    const statusStyles = {
      Active: "bg-green-100 text-green-800 hover:bg-green-100",
      Inactive: "bg-gray-100 text-gray-800 hover:bg-gray-100",
      Upcoming: "bg-blue-100 text-blue-800 hover:bg-blue-100",
      Passed: "bg-amber-100 text-amber-800 hover:bg-amber-100",
    }

    return (
      <Badge className={statusStyles[status] || "bg-gray-100"} variant="outline">
        {status}
      </Badge>
    )
  }

  return (
    <AdminLayout>
      <div className="w-full space-y-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Elections</h2>
            <p className="text-muted-foreground">Manage your elections here.</p>
          </div>
          <Button asChild>
            <Link href="/admin/elections/create">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Election
            </Link>
          </Button>
        </div>

        <Card className="w-full">
          <CardHeader className="flex flex-row items-center py-3">
            <CardTitle>All Elections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Course</TableCell>
                    <TableCell>Section</TableCell>
                    <TableCell>Start Date</TableCell>
                    <TableCell>End Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell className="text-right">Actions</TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {elections.length > 0 ? (
                    elections.map((election) => (
                      <TableRow key={election.id}>
                        <TableCell className="font-medium">{election.title}</TableCell>
                        <TableCell>{election.course ? election.course.name : "N/A"}</TableCell>
                        <TableCell>{election.section || "N/A"}</TableCell>
                        <TableCell>{election.start_date}</TableCell>
                        <TableCell>{election.end_date}</TableCell>
                        <TableCell>{getStatusBadge(election.status)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/admin/elections/${election.id}`}>View</Link>
                          </Button>
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/admin/elections/${election.id}/edit`}>Edit</Link>
                          </Button>
                          <Button variant="ghost" size="sm" className="text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                        No elections found. Create a new election to get started.
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

