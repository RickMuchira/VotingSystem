import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function CandidateCard({ candidate, selected, onSelect }) {
  return (
    <Card 
      className={`overflow-hidden transition-all hover:shadow-md cursor-pointer ${
        selected ? "ring-2 ring-blue-500 ring-offset-2" : ""
      }`}
      onClick={onSelect}
    >
      <div className="relative">
        {/* Candidate Image */}
        <div className="h-48 bg-gray-100 flex items-center justify-center relative">
          {candidate.image_url ? (
            <img 
              src={candidate.image_url} 
              alt={candidate.name} 
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-gray-200">
              <svg 
                className="h-24 w-24 text-gray-400" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1} 
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                />
              </svg>
            </div>
          )}
          
          {/* Selected Badge */}
          {selected && (
            <div className="absolute top-2 right-2 p-1 bg-blue-500 rounded-full">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
          )}
        </div>
        
        <CardContent className="p-4">
          <h3 className="font-bold text-lg truncate">{candidate.name}</h3>
          
          {candidate.student_id && (
            <p className="text-gray-500 text-sm mb-2">ID: {candidate.student_id}</p>
          )}
          
          {/* Biography/Manifesto excerpt */}
          {candidate.bio && (
            <p className="text-sm text-gray-600 line-clamp-3 mb-4">
              {candidate.bio}
            </p>
          )}
          
          {/* Vote Button */}
          <Button 
            className={`w-full ${selected ? "bg-blue-500" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            variant={selected ? "default" : "outline"}
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
          >
            {selected ? "Selected" : "Select Candidate"}
          </Button>
        </CardContent>
      </div>
    </Card>
  );
}