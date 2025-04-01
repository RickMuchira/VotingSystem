"use client"

import { useState, useEffect } from "react"
import { router } from "@inertiajs/react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarIcon, Clock, User, MapPin, CheckCircle, AlertTriangle, Info } from "lucide-react"
import PositionCard from "./Components/PositionCard"
import { Progress } from "@/components/ui/progress"
import StudentLayout from "@/Layouts/StudentLayout"

export default function ShowElection({ election, student, hasVoted }) {
  const [selectedVotes, setSelectedVotes] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  // Filter positions with no candidates
  const positionsWithCandidates = election.positions.filter(
    (position) => position.candidates && position.candidates.length > 0,
  )

  // Log props on component mount
  useEffect(() => {
    console.log("Election data:", election)
    console.log("Student data:", student)
    console.log("Has voted:", hasVoted)
    console.log("Filtered positions:", positionsWithCandidates)
  }, [])

  const handleVote = (positionId, candidateId) => {
    console.log(`Vote selected: Position ${positionId}, Candidate ${candidateId}`)
    setSelectedVotes({
      ...selectedVotes,
      [positionId]: candidateId,
    })
  }

  const redirectToLogin = () => {
    // Store the current URL to redirect back after login
    const currentPath = window.location.pathname
    router.visit("/student/login", {
      data: {
        redirect: currentPath,
      },
    })
  }

  const submitVotes = () => {
    // Check if all positions have a selection
    const positionIds = positionsWithCandidates.map((position) => position.id)
    const hasAllSelections = positionIds.every((id) => selectedVotes[id])

    if (!hasAllSelections) {
      setError("Please vote for all positions before submitting.")
      return
    }

    setSubmitting(true)
    setError(null)

    // Format votes for submission - with null check for student
    const votes = Object.keys(selectedVotes).map((positionId) => {
      const voteData = {
        position_id: positionId,
        candidate_id: selectedVotes[positionId],
        election_id: election.id,
      }

      // Only add voter_id if student is available
      if (student) {
        voteData.voter_id = student.id
      }

      return voteData
    })

    // Debug information
    console.log("Submitting votes:", votes)
    console.log("Student ID:", student?.id)
    console.log("Election ID:", election.id)
    console.log("Endpoint:", `/student/elections/${election.id}/vote`)

    router.post(
      `/student/elections/${election.id}/vote`,
      { votes },
      {
        onSuccess: (page) => {
          console.log("Vote submission successful:", page)
          setSuccess(true)
          setSubmitting(false)
        },
        onError: (errors) => {
          console.error("Vote submission error:", errors)

          // Check if it's an authentication error
          if (errors.message === "Authentication required to vote") {
            setError("You need to be logged in to vote. Please login and try again.")
            setTimeout(() => {
              redirectToLogin()
            }, 2000)
          } else {
            setError(errors.message || "An error occurred while submitting your vote.")
          }

          setSubmitting(false)
        },
      },
    )
  }

  // Calculate progress percentage
  const totalPositions = positionsWithCandidates.length
  const votedPositions = Object.keys(selectedVotes).length
  const progressPercentage = totalPositions > 0 ? Math.round((votedPositions / totalPositions) * 100) : 0

  // Helper to format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // If vote was successful, show success message
  if (success) {
    return (
      <div className="space-y-6">
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-8">
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
              <h2 className="text-2xl font-bold text-green-700">Vote Submitted Successfully!</h2>
              <p className="text-green-600">
                Thank you for participating in the {election.title} election. Your vote has been recorded.
              </p>
              <Button onClick={() => router.visit("/student/dashboard")} className="mt-4">
                Return to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // If user has already voted, show that message
  if (hasVoted) {
    return (
      <div className="space-y-6">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-8">
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <CheckCircle className="h-16 w-16 text-blue-500" />
              <h2 className="text-2xl font-bold text-blue-700">You've Already Voted</h2>
              <p className="text-blue-600">
                You have already cast your vote for the {election.title} election. Thank you for participating.
              </p>
              <Button onClick={() => router.visit("/student/dashboard")} className="mt-4">
                Return to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // If not authenticated, show login prompt
  if (!student) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{election.title}</h2>
          <p className="text-muted-foreground">Authentication required to vote.</p>
        </div>

        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-8">
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <AlertTriangle className="h-16 w-16 text-amber-500" />
              <h2 className="text-2xl font-bold text-amber-700">Authentication Required</h2>
              <p className="text-amber-600">
                You need to be logged in to vote in this election. Please login with your student credentials to
                continue.
              </p>
              <Button onClick={redirectToLogin} className="mt-4">
                Login to Vote
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{election.title}</h2>
        <p className="text-muted-foreground">Cast your vote for the positions below.</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Election Details</CardTitle>
              <CardDescription>Information about this election</CardDescription>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-1 text-sm">
              <CalendarIcon className="h-4 w-4 opacity-70" />
              <span>
                Voting period: {formatDate(election.start_date)} - {formatDate(election.end_date)}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 opacity-70" />
              <span>For: {election.course ? election.course.name : "All Courses"}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 opacity-70" />
              <span>Section: {election.section || "All Sections"}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 opacity-70" />
              <span>Status: Active</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Info className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <h3 className="font-medium">Voting Instructions</h3>
              <p className="text-sm text-muted-foreground">
                Select one candidate for each position. You must vote for all positions to submit. Your vote is final
                and cannot be changed after submission.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Voting Progress */}
      <div className="bg-white rounded-lg p-4 shadow">
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium">Voting Progress</span>
          <span className="text-sm">
            {votedPositions} of {totalPositions} positions
          </span>
        </div>
        <Progress value={progressPercentage} className="h-2 bg-gray-200" />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 flex items-start space-x-2">
          <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <div>{error}</div>
        </div>
      )}

      {/* Positions and Candidates */}
      <div className="space-y-6">
        {totalPositions === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Positions Available</h3>
              <p className="text-muted-foreground">
                There are no positions with candidates defined for this election yet. Please check back later.didates
                defined for this election yet. Please check back later.
              </p>
            </CardContent>
          </Card>
        ) : (
          positionsWithCandidates.map((position) => (
            <PositionCard
              key={position.id}
              position={position}
              selectedCandidate={selectedVotes[position.id]}
              onVote={(candidateId) => handleVote(position.id, candidateId)}
            />
          ))
        )}
      </div>

      {/* Submit Button */}
      <div className="sticky bottom-4 bg-white bg-opacity-90 p-4 rounded-lg shadow-lg border border-gray-200 backdrop-blur">
        <div className="flex justify-between items-center">
          <div>
            <span className="font-medium">
              Selected: {votedPositions}/{totalPositions} positions
            </span>
            {votedPositions < totalPositions && (
              <p className="text-sm text-muted-foreground">Please vote for all positions before submitting.</p>
            )}
          </div>
          <Button onClick={submitVotes} disabled={votedPositions < totalPositions || submitting} className="px-8">
            {submitting ? "Submitting..." : "Submit Vote"}
          </Button>
        </div>
      </div>
    </div>
  )
}

ShowElection.layout = (page) => <StudentLayout children={page} />

