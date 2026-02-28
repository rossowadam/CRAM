import { useParams } from "react-router-dom";

export default function Course() {
  const { courseId } = useParams();

  return (
    <div className="flex flex-col w-full max-w-2xl  items-center gap-3 font-funnel sm:max-w-xl lg:max-w-2xl xl:max-w-4xl 2xl:max-w-5xl mx-auto px-6 py-6 ">
      <h1>Course Title {courseId}</h1>
    </div>
  );
}