"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, User, ImageIcon } from "lucide-react"

export default function PositionCard({ position, selectedCandidate, onVote }) {
  const [imageError, setImageError] = useState({})

  // Handler for image load errors
  const handleImageError = (candidateId) => {
    setImageError((prev) => ({
      ...prev,
      [candidateId]: true,
    }))
  }

  // Get image URL with proper fallbacks
  const getImageUrl = (candidate) => {
    // First check if we already know this image has an error
    if (imageError[candidate.id]) {
      return null; // Will trigger the fallback UI
    }
    
    // Then try the image_url field (preferred)
    if (candidate.image_url) {
      return candidate.image_url;
    }
    
    // Fall back to photo field if image_url isn't available
    if (candidate.photo) {
      return candidate.photo;
    }
    
    // If neither field has a value, return null to trigger fallback UI
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{position.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {position.candidates.map((candidate) => {
            const imageUrl = getImageUrl(candidate);
            
            return (
              <div
                key={candidate.id}
                className={`border rounded-lg overflow-hidden ${
                  selectedCandidate === candidate.id
                    ? "border-2 border-primary bg-primary-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="aspect-[4/3] bg-gray-100 relative">
                  {selectedCandidate === candidate.id && (
                    <div className="absolute top-2 right-2 bg-primary text-white p-1 rounded-full">
                      <Check className="h-5 w-5" />
                    </div>
                  )}
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={`${candidate.name}`}
                      className="w-full h-full object-cover"
                      onError={() => handleImageError(candidate.id)}
                    />
                  ) : (
                    // Fallback when image is missing or fails to load
                    <div className="w-full h-full flex items-center justify-center bg-gray-50">
                      <div className="text-center text-gray-400">
                        <ImageIcon className="h-12 w-12 mx-auto mb-2" />
                        <p className="text-sm">No photo</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-lg">{candidate.name}</h3>
                  {candidate.motto && <p className="text-sm italic mt-1">"{candidate.motto}"</p>}
                  {candidate.course && (
                    <div className="mt-3 text-sm">
                      <div className="flex items-center text-muted-foreground">
                        <User className="h-3.5 w-3.5 mr-1" />
                        <span>
                          {candidate.course}
                          {candidate.year && `, Year ${candidate.year}`}
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="mt-4">
                    <Button
                      variant={selectedCandidate === candidate.id ? "default" : "outline"}
                      className="w-full"
                      onClick={() => onVote(candidate.id)}
                    >
                      {selectedCandidate === candidate.id ? "Selected" : "Vote"}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  )
}