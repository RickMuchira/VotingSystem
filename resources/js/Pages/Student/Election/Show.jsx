"use client";

import React, { useState } from "react";
import { router } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Clock, User, MapPin, CheckCircle, AlertTriangle } from "lucide-react";
import PositionCard from "./Components/PositionCard";

export default function ShowElection({ election, student }) {
  const [selectedVotes, setSelectedVotes] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const handleVote = (positionId, candidateId) => {
    setSelectedVotes({
      ...selectedVotes,
      [positionId]: candidateId
    });
  };
  
  const submitVotes = () => {
    // Check if all positions have a selection
    const positionIds = election.positions.map(position => position.id);
    const hasAllSelections = positionIds.every(id => selectedVotes[id]);
    
    if (!hasAllSelections) {
      setError("Please vote for all positions before submitting.");
      return;
    }
    
    setSubmitting(true);
    setError(null);
    
    // Format votes for submission
    const votes = Object.keys(selectedVotes).map(positionId => ({
      position_id: positionId,
      candidate_id: selectedVotes[positionId],
      voter_id: student.id,
      election_id: election.id
    }));
    
    router.post(`/student/elections/${election.id}/vote`, { votes }, {
      onSuccess: () => {
        setSuccess(true);
        setSubmitting(false);
      },
      onError: (errors) => {
        setError(errors.message || "An error occurred while submitting your vote.");
        setSubmitting(false);
      }
    });
  };
  
  // Calculate progress percentage
  const totalPositions = election.positions.length;
  const votedPositions = Object.keys(selectedVotes).length;
  const progressPercentage = totalPositions > 0 
    ? Math.round((votedPositions / totalPositions) * 100) 
    : 0;
  
  // Helper to format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };
  
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
                Thank you for participating in the {election.title} election.
                Your vote has been recorded.
              </p>
              <Button 
                onClick={() => router.visit('/student/dashboard')}
                className="mt-4"
              >
                Return to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{election.title}</h2>
        <p className="text-muted-foreground">
          Cast your vote for the positions below.
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Election Details</CardTitle>
              <CardDescription>
                Information about this election
              </CardDescription>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-1 text-sm">
              <CalendarIcon className="h-4 w-4 opacity-70" />
              <span>Voting period: {formatDate(election.start_date)} - {formatDate(election.end_date)}</span>
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
      
      {/* Voting Progress */}
      <div className="bg-white rounded-lg p-4 shadow">
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium">Voting Progress</span>
          <span className="text-sm">{votedPositions} of {totalPositions} positions</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 flex items-start space-x-2">
          <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <div>{error}</div>
        </div>
      )}
      
      {/* Positions and Candidates */}
      <div className="space-y-6">
        {election.positions.map((position) => (
          <PositionCard
            key={position.id}
            position={position}
            selectedCandidate={selectedVotes[position.id]}
            onVote={(candidateId) => handleVote(position.id, candidateId)}
          />
        ))}
      </div>
      
      {/* Submit Button */}
      <div className="sticky bottom-4 bg-white bg-opacity-90 p-4 rounded-lg shadow-lg border border-gray-200 backdrop-blur">
        <div className="flex justify-between items-center">
          <div>
            <span className="font-medium">Selected: {votedPositions}/{totalPositions} positions</span>
            {votedPositions < totalPositions && (
              <p className="text-sm text-muted-foreground">
                Please vote for all positions before submitting.
              </p>
            )}
          </div>
          <Button 
            onClick={submitVotes} 
            disabled={votedPositions < totalPositions || submitting}
            className="px-8"
          >
            {submitting ? "Submitting..." : "Submit Vote"}
          </Button>
        </div>
      </div>
    </div>
  );
}