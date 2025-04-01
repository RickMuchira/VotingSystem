"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";

export default function PositionCard({ position, selectedCandidate, onVote }) {
  // Helper function to get the proper image URL
  const getCandidateImageUrl = (photoPath) => {
    if (!photoPath) {
      return null;
    }
    
    // If it's already a full URL, return it as is
    if (photoPath.startsWith('http')) {
      return photoPath;
    }
    
    // If it's a path like "candidates/filename.jpg", make it use /storage prefix
    if (photoPath.startsWith('candidates/')) {
      return `/storage/${photoPath}`;
    }
    
    // Fallback - just use the path as is with storage prefix
    return `/storage/${photoPath}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{position.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selectedCandidate ? String(selectedCandidate) : ""}
          onValueChange={(value) => onVote(value)}
          className="space-y-4"
        >
          {position.candidates && position.candidates.length > 0 ? (
            position.candidates.map((candidate) => (
              <div
                key={candidate.id}
                className={`flex items-start space-x-3 p-3 rounded-lg transition-colors ${
                  selectedCandidate === candidate.id.toString()
                    ? "bg-blue-50"
                    : "hover:bg-gray-50"
                }`}
              >
                <RadioGroupItem
                  value={candidate.id.toString()}
                  id={`candidate-${candidate.id}`}
                  className="mt-1"
                />
                <div className="flex-1 flex">
                  <div className="mr-4">
                    {candidate.photo ? (
                      <img
                        src={getCandidateImageUrl(candidate.photo)}
                        alt={candidate.name}
                        className="w-20 h-20 rounded-full object-cover border border-gray-200"
                        onError={(e) => {
                          console.error(`Failed to load image: ${e.target.src}`);
                          e.target.src = "/placeholder-avatar.png"; // Fallback to default avatar
                          e.target.onerror = null; // Prevent infinite loop
                        }}
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="h-10 w-10 text-gray-500" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <Label
                      htmlFor={`candidate-${candidate.id}`}
                      className="font-medium text-lg cursor-pointer"
                    >
                      {candidate.name}
                    </Label>
                    {candidate.motto && (
                      <p className="text-sm text-muted-foreground italic">
                        "{candidate.motto}"
                      </p>
                    )}
                    {candidate.bio && (
                      <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                        {candidate.bio}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground">No candidates available for this position.</p>
          )}
        </RadioGroup>
      </CardContent>
    </Card>
  );
}