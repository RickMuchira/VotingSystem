"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Link } from "@inertiajs/react";
import { Badge } from "@/components/ui/badge";

export default function Dashboard({ elections = [], student }) {
  // Function to determine if an election is active now or upcoming
  const getElectionStatus = (election) => {
    const now = new Date();
    const startDate = new Date(election.start_date);
    const endDate = new Date(election.end_date);

    if (now < startDate) {
      return { status: "Upcoming", className: "bg-blue-100 text-blue-800 hover:bg-blue-100" };
    } else if (now >= startDate && now <= endDate) {
      return { status: "Active", className: "bg-green-100 text-green-800 hover:bg-green-100" };
    } else {
      return { status: "Passed", className: "bg-amber-100 text-amber-800 hover:bg-amber-100" };
    }
  };

  // Format date to be more readable
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Active & Upcoming Elections</h2>
        <p className="text-muted-foreground">Select an election to cast your vote.</p>
      </div>
      
      {student && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-700">Your Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
            <div>
              <span className="text-gray-500 text-sm">Student ID:</span>
              <p>{student.admission_number}</p>
            </div>
            <div>
              <span className="text-gray-500 text-sm">Course:</span>
              <p>{student.course?.name || "N/A"}</p>
            </div>
            <div>
              <span className="text-gray-500 text-sm">Section:</span>
              <p>Section {student.section}, Year {student.year_of_study}</p>
            </div>
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Available Elections</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Section</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {elections.length > 0 ? (
                elections.map((election) => {
                  const { status, className } = getElectionStatus(election);
                  return (
                    <TableRow key={election.id}>
                      <TableCell className="font-medium">{election.title}</TableCell>
                      <TableCell>{election.course ? election.course.name : "All Courses"}</TableCell>
                      <TableCell>{election.section || "All Sections"}</TableCell>
                      <TableCell>{formatDate(election.start_date)}</TableCell>
                      <TableCell>{formatDate(election.end_date)}</TableCell>
                      <TableCell>
                        <Badge className={className} variant="outline">
                          {status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {status === "Active" ? (
                          <Button size="sm" asChild>
                            <Link href={`/student/elections/${election.id}`}>
                              Vote Now
                            </Link>
                          </Button>
                        ) : (
                          <Button size="sm" variant="outline" disabled={status === "Passed"}>
                            {status === "Upcoming" ? "Coming Soon" : "Ended"}
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2">
                      <p className="text-muted-foreground">No active or upcoming elections found for you.</p>
                      <p className="text-sm text-gray-500">Check back later for new elections.</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}