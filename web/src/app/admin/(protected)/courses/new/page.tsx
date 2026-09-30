import CourseForm from "@/components/admin/CourseForm";
import { createCourseAction } from "@/lib/actions/admin/courses";

export default function NewCoursePage() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-extrabold text-[var(--color-ink)]">Новый курс</h1>
      <div className="mt-6 rounded-2xl border-2 border-[var(--color-ink)] bg-white p-6">
        <CourseForm action={createCourseAction} />
      </div>
    </div>
  );
}
