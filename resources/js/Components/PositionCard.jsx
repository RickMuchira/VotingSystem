import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import CandidateCard from "./CandidateCard";

export default function PositionCard({ position, selectedCandidate, onVote }) {
  return (
    <Card id={`position-${position.id}`} className="position-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl">{position.name}</CardTitle>
        <CardDescription>
          {position.description || "Vote for one candidate for this position"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Separator className="mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {position.candidates && position.candidates.length > 0 ? (
            position.candidates.map((candidate) => (
              <CandidateCard
                key={candidate.id}
                candidate={candidate}
                selected={selectedCandidate === candidate.id}
                onSelect={() => onVote(candidate.id)}
              />
            ))
          ) : (
            <div className="col-span-full py-8 text-center text-gray-500">
              No candidates available for this position.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}