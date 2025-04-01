import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { UserCircle } from "lucide-react";

export default function PositionCard({ position, selectedCandidate, onVote }) {
  // Get candidates for this specific position
  const positionCandidates = position.candidates || [];
  
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle>{position.name}</CardTitle>
        <CardDescription>
          {position.description || "Select one candidate for this position"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {positionCandidates.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            No candidates available for this position.
          </div>
        ) : (
          <RadioGroup 
            value={selectedCandidate} 
            onValueChange={onVote}
            className="space-y-2"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {positionCandidates.map((candidate) => (
                <div key={candidate.id} className="relative">
                  <RadioGroupItem
                    value={candidate.id}
                    id={`candidate-${candidate.id}`}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={`candidate-${candidate.id}`}
                    className="flex flex-col items-center justify-between p-4 border rounded-lg cursor-pointer 
                              peer-checked:border-primary peer-checked:bg-primary/5 
                              hover:bg-gray-50 transition-all"
                  >
                    <div className="mb-3">
                      {candidate.photo ? (
                        <img 
                          src={candidate.photo} 
                          alt={candidate.name}
                          className="w-32 h-32 rounded-full object-cover object-center border-2 border-gray-200"
                        />
                      ) : (
                        <UserCircle className="w-32 h-32 text-gray-300" />
                      )}
                    </div>
                    <div className="text-center">
                      <h3 className="font-medium text-lg">{candidate.name}</h3>
                      {candidate.motto && (
                        <p className="text-sm text-muted-foreground italic mt-1">"{candidate.motto}"</p>
                      )}
                    </div>
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        )}
      </CardContent>
    </Card>
  );
}