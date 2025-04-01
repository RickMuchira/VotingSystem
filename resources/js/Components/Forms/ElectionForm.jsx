import { useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateTimePicker } from "@/components/ui/date-time-picker";

export default function ElectionForm({ election = null, courses }) {
    const { data, setData, errors, processing, put, post } = useForm({
        title: election?.title || '',
        course_id: election?.course_id || '',
        section: election?.section || '',
        start_date: election?.start_date || '',
        end_date: election?.end_date || '',
    });

    function handleSubmit(e) {
        e.preventDefault();
        election
            ? put(route('admin.elections.update', election.id))
            : post(route('admin.elections.store'));
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <Label htmlFor="title">Election Title</Label>
                <Input
                    id="title"
                    value={data.title}
                    onChange={(e) => setData('title', e.target.value)}
                    placeholder="Student Council Election 2024"
                />
                {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
            </div>

            <div>
                <Label htmlFor="course_id">Course</Label>
                <Select
                    value={data.course_id}
                    onValueChange={(value) => setData('course_id', value)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select a course" />
                    </SelectTrigger>
                    <SelectContent>
                        {courses.map((course) => (
                            <SelectItem key={course.id} value={course.id}>
                                {course.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.course_id && <p className="text-sm text-red-500">{errors.course_id}</p>}
            </div>

            <div>
                <Label htmlFor="section">Section</Label>
                <Input
                    id="section"
                    value={data.section}
                    onChange={(e) => setData('section', e.target.value)}
                    placeholder="e.g. Section A"
                />
                {errors.section && <p className="text-sm text-red-500">{errors.section}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label>Start Date & Time</Label>
                    <DateTimePicker
                        date={data.start_date ? new Date(data.start_date) : null}
                        setDate={(date) => setData('start_date', date.toISOString())}
                    />
                    {errors.start_date && <p className="text-sm text-red-500">{errors.start_date}</p>}
                </div>

                <div>
                    <Label>End Date & Time</Label>
                    <DateTimePicker
                        date={data.end_date ? new Date(data.end_date) : null}
                        setDate={(date) => setData('end_date', date.toISOString())}
                        minDate={data.start_date ? new Date(data.start_date) : new Date()}
                    />
                    {errors.end_date && <p className="text-sm text-red-500">{errors.end_date}</p>}
                </div>
            </div>

            <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" asChild>
                    <Link href={route('admin.elections.index')}>Cancel</Link>
                </Button>
                <Button type="submit" disabled={processing}>
                    {processing ? 'Saving...' : 'Save Election'}
                </Button>
            </div>
        </form>
    );
}