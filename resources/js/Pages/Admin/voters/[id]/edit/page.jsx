"use client"

import React from "react"
import { useForm, Head } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function EditVoter({ voter, courses }) {
  const { data, setData, put, processing, errors } = useForm({
    admission_number: voter.admission_number || "",
    name: voter.name || "",
    email: voter.email || "",
    password: "", // leave blank to keep current password
    course_id: voter.course_id || "",
    year_of_study: voter.year_of_study || "",
    section: voter.section || "",
    is_candidate: voter.is_candidate || false, // optional flag to mark voter as candidate
  })

  function handleSubmit(e) {
    e.preventDefault()
    put(`/admin/voters/${voter.id}`, { forceFormData: true })
  }

  return (
    <>
      <Head title="Edit Voter" />
      <div className="max-w-2xl mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Edit Voter</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Admission Number */}
              <div>
                <label htmlFor="admission_number" className="block font-medium">
                  Admission Number
                </label>
                <Input
                  id="admission_number"
                  type="text"
                  value={data.admission_number}
                  onChange={(e) => setData("admission_number", e.target.value)}
                  className="mt-1 block w-full"
                />
                {errors.admission_number && (
                  <div className="text-destructive text-sm mt-1">
                    {errors.admission_number}
                  </div>
                )}
              </div>

              {/* Name */}
              <div>
                <label htmlFor="name" className="block font-medium">
                  Name
                </label>
                <Input
                  id="name"
                  type="text"
                  value={data.name}
                  onChange={(e) => setData("name", e.target.value)}
                  className="mt-1 block w-full"
                />
                {errors.name && (
                  <div className="text-destructive text-sm mt-1">
                    {errors.name}
                  </div>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={data.email}
                  onChange={(e) => setData("email", e.target.value)}
                  className="mt-1 block w-full"
                />
                {errors.email && (
                  <div className="text-destructive text-sm mt-1">
                    {errors.email}
                  </div>
                )}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block font-medium">
                  Password (Leave blank to keep current)
                </label>
                <Input
                  id="password"
                  type="password"
                  value={data.password}
                  onChange={(e) => setData("password", e.target.value)}
                  className="mt-1 block w-full"
                />
                {errors.password && (
                  <div className="text-destructive text-sm mt-1">
                    {errors.password}
                  </div>
                )}
              </div>

              {/* Course Dropdown */}
              <div>
                <label htmlFor="course_id" className="block font-medium">
                  Course
                </label>
                <select
                  id="course_id"
                  value={data.course_id}
                  onChange={(e) => setData("course_id", e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded p-2"
                >
                  <option value="">Select a Course</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.name}
                    </option>
                  ))}
                </select>
                {errors.course_id && (
                  <div className="text-destructive text-sm mt-1">
                    {errors.course_id}
                  </div>
                )}
              </div>

              {/* Year of Study */}
              <div>
                <label htmlFor="year_of_study" className="block font-medium">
                  Year of Study
                </label>
                <Input
                  id="year_of_study"
                  type="number"
                  value={data.year_of_study}
                  onChange={(e) => setData("year_of_study", e.target.value)}
                  className="mt-1 block w-full"
                />
                {errors.year_of_study && (
                  <div className="text-destructive text-sm mt-1">
                    {errors.year_of_study}
                  </div>
                )}
              </div>

              {/* Section Dropdown */}
              <div>
                <label htmlFor="section" className="block font-medium">
                  Section
                </label>
                <select
                  id="section"
                  value={data.section}
                  onChange={(e) => setData("section", e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded p-2"
                >
                  <option value="">Select a Section</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                </select>
                {errors.section && (
                  <div className="text-destructive text-sm mt-1">
                    {errors.section}
                  </div>
                )}
              </div>

              {/* Mark as Candidate */}
              <div className="flex items-center gap-2">
                <input
                  id="is_candidate"
                  type="checkbox"
                  checked={data.is_candidate}
                  onChange={(e) => setData("is_candidate", e.target.checked)}
                  className="mt-1"
                />
                <label htmlFor="is_candidate" className="font-medium">
                  Mark as Candidate
                </label>
                {errors.is_candidate && (
                  <div className="text-destructive text-sm mt-1">
                    {errors.is_candidate}
                  </div>
                )}
              </div>

              {/* Form Actions */}
              <div className="flex justify-end">
                <Button type="submit" disabled={processing}>
                  Update Voter
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
