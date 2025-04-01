"use client"

import { useState } from "react"
import { useForm, Head } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import AdminLayout from "../../layout"

export default function ImportVotersPage() {
  const { data, setData, post, processing, errors } = useForm({
    csv: null,
  })

  const [preview, setPreview] = useState(null)

  function handleFileChange(e) {
    const file = e.target.files[0]
    setData("csv", file)
    if (file) {
      setPreview({ name: file.name, size: file.size })
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    post("/admin/voters/import", { forceFormData: true })
  }

  return (
    <AdminLayout>
      <Head title="Import Voters" />
      <div className="max-w-xl mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Import Voters CSV</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
              <div>
                <label htmlFor="csv" className="block font-medium">
                  CSV File
                </label>
                <Input id="csv" type="file" accept=".csv" onChange={handleFileChange} className="mt-1 block w-full" />
                {errors.csv && <div className="text-destructive text-sm mt-1">{errors.csv}</div>}
              </div>
              {preview && (
                <div className="mt-4">
                  <p>File Preview:</p>
                  <p>Name: {preview.name}</p>
                  <p>Size: {preview.size} bytes</p>
                </div>
              )}
              <div className="flex justify-end">
                <Button type="submit" disabled={processing}>
                  Import CSV
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

