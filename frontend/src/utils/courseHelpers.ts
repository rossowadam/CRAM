// given slug-form of courseId, return the course code as backend requires
// abiz-0440 --> ABIZ 0440
export function getCourseCode(courseId: string): string {
    const [subject, number] = courseId.split("-");
    return `${subject.toUpperCase()} ${number}`;
}