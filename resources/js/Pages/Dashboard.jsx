"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Link } from "@inertiajs/react"
import { Badge } from "@/components/ui/badge"
import StudentLayout from "@/Layouts/StudentLayout"

export default function Dashboard({ elections = [], student, allElections = [] }) {
  const [filteredElections, setFilteredElections] = useState([]);
  
  // Filter elections based on student's course and section
  useEffect(() => {
    if (elections.length > 0 && student) {
      // For debugging - log all elections
      console.log("All elections received:", elections);
      
      // Updated filtering logic with better handling of various data formats
      const filtered = elections.filter(election => {
        // Don't filter by active status during debugging
        // if (!election.is_active) return false;
        
        // Course matching - handle various possible formats
        const isCourseMatch = 
          !election.course_id || 
          election.course_id === null ||
          election.course_id === "" ||
          (student.course && Number(election.course_id) === Number(student.course.id));
        
        // Section matching - handle various possible formats
        const isSectionMatch = 
          !election.section || 
          election.section === "" || 
          election.section === "All Sections" ||
          election.section === student.section ||
          election.section === `Section ${student.section}`;
        
        console.log(`Election "${election.title}" filtering:`, {
          id: election.id,
          is_active: election.is_active,
          status: election.status,
          course_id: election.course_id,
          student_course_id: student.course?.id,
          courseMatch: isCourseMatch,
          section: election.section,
          student_section: student.section,
          sectionMatch: isSectionMatch,
          willDisplay: isCourseMatch && isSectionMatch
        });
        
        // For debugging purposes, return all elections
        return true;
        
        // In production, uncomment this:
        // return isCourseMatch && isSectionMatch;
      });
      
      setFilteredElections(filtered);
    } else {
      setFilteredElections(elections);
    }
  }, [elections, student]);

  // Function to determine if an election is active now or upcoming
  const getElectionStatus = (election) => {
    // If the election has a status field, use it directly
    if (election.status) {
      if (election.status === "Active") {
        return { status: "Active", className: "bg-green-100 text-green-800 hover:bg-green-100" }
      } else if (election.status === "Inactive") {
        return { status: "Inactive", className: "bg-gray-100 text-gray-800 hover:bg-gray-100" }
      } else if (election.status === "Upcoming") {
        return { status: "Upcoming", className: "bg-blue-100 text-blue-800 hover:bg-blue-100" }
      } else if (election.status === "Passed") {
        return { status: "Passed", className: "bg-amber-100 text-amber-800 hover:bg-amber-100" }
      }
    }
    
    // Otherwise calculate it based on dates
    const now = new Date()
    const startDate = new Date(election.start_date)
    const endDate = new Date(election.end_date)

    if (now < startDate) {
      return { status: "Upcoming", className: "bg-blue-100 text-blue-800 hover:bg-blue-100" }
    } else if (now >= startDate && now <= endDate) {
      return { status: "Active", className: "bg-green-100 text-green-800 hover:bg-green-100" }
    } else {
      return { status: "Passed", className: "bg-amber-100 text-amber-800 hover:bg-amber-100" }
    }
  }

  // Format date to be more readable
  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    
    try {
      const date = new Date(dateString)
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return dateString; // Return original string if date is invalid
      }
      
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch (error) {
      console.error("Error formatting date:", error, dateString);
      return dateString; // Return original string if there's an error
    }
  }

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
              <p>
                Section {student.section}, Year {student.year_of_study}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* DEBUGGING SECTION - REMOVE IN PRODUCTION */}
      <Card className="bg-yellow-50 border-yellow-200">
        <CardHeader>
          <CardTitle>Debug Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p>Total Elections: {elections.length}</p>
            <p>Filtered Elections: {filteredElections.length}</p>
            <p>Student ID: {student?.id}</p>
            <p>Student Course ID: {student?.course?.id}</p>
            <p>Student Section: {student?.section}</p>
          </div>
        </CardContent>
      </Card>

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
                  const { status, className } = getElectionStatus(election)
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
                        {election.is_active === false && (
                          <Badge className="ml-2 bg-red-100 text-red-800" variant="outline">
                            Inactive
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {status === "Active" ? (
                          <Button size="sm" asChild>
                            {/* FIXED: Using the correct route path that matches web.php */}
                            <Link href={`/student/elections/${election.id}`}>Vote Now</Link>
                          </Button>
                        ) : (
                          <Button size="sm" variant="outline" disabled={status === "Passed" || election.is_active === false}>
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
                      <p className="text-muted-foreground">No elections found.</p>
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
  )
}

Dashboard.layout = (page) => <StudentLayout children={page} />