"use client"

import React, { useState } from "react"
import { Inertia } from '@inertiajs/inertia'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlusCircle, Trash2 } from "lucide-react"
import { Link } from "@inertiajs/react"

export default function PositionsPage({ positions }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedElection, setSelectedElection] = useState("")

  // Delete handler using Inertia
  function handleDelete(id) {
    if (window.confirm("Are you sure you want to delete this position?")) {
      Inertia.delete(`/admin/positions/${id}`)
    }
  }

  // Filter positions based on search term and election selection
  const filteredPositions = positions.filter((position) => {
    const matchesSearch = position.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesElection = selectedElection
      ? position.election.id.toString() === selectedElection
      : true
    return matchesSearch && matchesElection
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Positions</h2>
          <p className="text-muted-foreground">Manage positions across elections.</p>
        </div>
        <div className="flex items-center gap-2">
          <Input
            type="text"
            placeholder="Search positions..."
            className="w-48"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button asChild>
            <Link href="/admin/positions/create">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Position
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center">
          <CardTitle>All Positions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Election</TableCell>
                <TableCell className="text-right">Actions</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPositions.map((position) => (
                <TableRow key={position.id}>
                  <TableCell className="font-medium">{position.name}</TableCell>
                  <TableCell>{position.election.title}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/admin/positions/${position.id}/edit`}>Edit</Link>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-destructive" 
                      onClick={() => handleDelete(position.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredPositions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">
                    No positions found.
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
