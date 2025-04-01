"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useForm } from "@inertiajs/react";

export default function Vote({ election, candidates }) {
  const { post, data, setData, processing, errors } = useForm({
    candidate_id: "",
  });

  const handleVote = (e) => {
    e.preventDefault();
    post(`/student/elections/${election.id}/vote`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{election.title}</h2>
        <p className="text-muted-foreground">Vote for your preferred candidate.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Candidates</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVote}>
            {candidates.length > 0 ? (
              candidates.map((candidate) => (
                <div key={candidate.id} className="flex items-center space-x-4 p-3 border rounded-lg mb-3">
                  <input
                    type="radio"
                    id={`candidate-${candidate.id}`}
                    name="candidate"
                    value={candidate.id}
                    onChange={(e) => setData("candidate_id", e.target.value)}
                    className="cursor-pointer"
                  />
                  <label htmlFor={`candidate-${candidate.id}`} className="cursor-pointer text-lg">
                    {candidate.name}
                  </label>
                </div>
              ))
            ) : (
              <p className="text-center">No candidates available for this election.</p>
            )}

            {errors.candidate_id && <p className="text-red-500">{errors.candidate_id}</p>}

            <Button type="submit" disabled={processing} className="mt-4 w-full">
              {processing ? "Submitting..." : "Cast Vote"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
