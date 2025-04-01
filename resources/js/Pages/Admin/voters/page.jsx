"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Link } from "@inertiajs/react"

export default function VotersPage({ voters }) {
  const [searchTerm, setSearchTerm] = useState("")

  // Filter voters by admission number, name, or email.
  const filteredVoters = voters.filter((voter) => {
    return (
      voter.admission_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      voter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      voter.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  return (
    <div className="space-y-6">
      {/* Header with search and CSV import link */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Voters</h2>
          <p className="text-muted-foreground">Manage registered voters.</p>
        </div>
        <div className="flex items-center gap-2">
          <Input
            type="text"
            placeholder="Search voters..."
            className="w-48"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button asChild>
            <Link href="/admin/voters/import/page">Import CSV</Link>
          </Button>
        </div>
      </div>

      {/* Voters Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Voters</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell>Admission Number</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Course</TableCell>
                <TableCell>Year</TableCell>
                <TableCell>Section</TableCell>
                <TableCell className="text-right">Actions</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVoters.map((voter) => (
                <TableRow key={voter.id}>
                  <TableCell>{voter.admission_number}</TableCell>
                  <TableCell>{voter.name}</TableCell>
                  <TableCell>{voter.email}</TableCell>
                  <TableCell>{voter.course?.name}</TableCell>
                  <TableCell>{voter.year_of_study}</TableCell>
                  <TableCell>{voter.section}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/admin/voters/${voter.id}/edit/page`}>Edit</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredVoters.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    No voters found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
