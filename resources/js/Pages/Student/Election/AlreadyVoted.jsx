"use client"
import { router } from "@inertiajs/react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import StudentLayout from "@/Layouts/StudentLayout"

export default function AlreadyVoted({ election }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{election.title}</h2>
        <p className="text-muted-foreground">You have already cast your vote for this election.</p>
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-8">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <CheckCircle className="h-16 w-16 text-blue-500" />
            <h2 className="text-2xl font-bold text-blue-700">Vote Already Submitted</h2>
            <p className="text-blue-600">
              You have already participated in the {election.title} election. Each student can only vote once per
              election.
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

AlreadyVoted.layout = (page) => <StudentLayout children={page} />

