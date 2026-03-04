import { useParams } from "react-router-dom";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Separator } from "@/components/ui/separator"
import { CirclePlus } from "lucide-react";
import { useState } from "react";
import SectionCard from "@/components/sections/SectionCard";
import DefinitionTable from "@/components/definitions/DefinitionTable";
import DefinitionDialog from "@/components/definitions/DefinitionDialog";
import SectionDialog from "@/components/sections/SectionDialog";

// given slug-form of courseId, return the course code as backend requires
// abiz-0440 --> ABIZ 0440
function getCourseCode(courseId: string): string {
  const [subject, number] = courseId.split("-");
  return `${subject.toUpperCase()} ${number}`;
}

export default function Course() {

  type Definition = {
  id: string;
  term: string;
  definition: string;
  example: string;
  user: string;
  updated: string;
};
type Section = {
  id: string;
  title: string;
  description?: string;
  content?: string;
  updated?: string;
  contributors?: { name: string; avatar?: string }[];
};

  const [definitions] = useState<Definition[]>([
    {
      id: "1",
      term: "The Machine",
      definition: "A being whom we must obey at all costs",
      example: "The Machine Hath Spoken",
      user: "A Witness",
      updated: "2026-02-28",
    },
    {
    id: "2",
    term: "Machine",
    definition: "Something nice",
    example: "The machine is nice",
    user: "John Pork",
    updated: "2026-02-28",
  },
  ]);

const [sections, setSections] = useState<Section[]>([
    {
      id: "1",
      title: "Introduction",
      description: "Short section description preparing you for what to expect.",
      content: "Here is the body of the section, where you can add content, discussions, and resources.",
      updated: "2026-03-01",
      contributors: [
        { name: "CN", avatar: "https://github.com/shadcn.png" },
        { name: "LR", avatar: "https://github.com/maxleiter.png" },
      ],
    },
    {
      id: "2",
      title: "Unit 3",
      description: "Short section description preparing you for what to expect.",
      content: "Unit 3 covers unit3 content lol",
      updated: "2026-03-01",
      contributors: [
        { name: "CN", avatar: "https://github.com/shadcn.png" },
        { name: "LR", avatar: "https://github.com/maxleiter.png" },
      ],
    },
  ]);

  const { courseId } = useParams();

  if (!courseId) throw new Error("Missing course id");

  const courseCode = getCourseCode(courseId);

  // Section dialog state
  const [openCreate,setOpenCreate] = useState(false);
  const [editSection, setEditSection] = useState<Section | null>(null);

  // Definition dialog state
  const [definitionOpen, setDefinitionOpen] = useState(false);
  const [editDefinition, setEditDefinition] = useState<Definition | null>(null)


  
  return (
    <div className="h-full w-full min-h-0 overflow-y-auto">
      <div className="flex flex-col items-center w-full min-w-0 gap-3 sm:max-w-xl lg:max-w-2xl xl:max-w-4xl 2xl:max-w-5xl mx-auto px-6 py-6">

        {/* Course page header, this stays static, do not modify with dynamic content */}
        <div className="w-full flex flex-col sm:gap-3 sm:flex-row items-center ">
          <h1 className="text-xl font-bold w-4/5 pb-2 capitalize text-center sm:text-4xl">
            Welcome to the {courseId} course page!
          </h1>
          <>
            {/* Horizontal on small screens */}
            <Separator
              orientation="horizontal"
              className="bg-secondary sm:hidden my-2"
            />

            {/* Vertical on small screens and up */}
            <Separator
              orientation="vertical"
              className="bg-secondary hidden sm:block"
            />
          </>

          <div className="flex flex-col items-center gap-2 w-full text-center sm:text-left">
            <p className=" text-base font-thin font-instrument w-full capitalize">
              Here you can collaborate with your classmates, find resources, and review definitions about all things {courseId}. 
            </p>
            
            <p className=" text-base font-thin font-instrument w-full capitalize italic">
              Please remember to be respectful and follow the code of conduct while using this platform. Happy learning!
            </p>
          </div>
        </div>

        <Separator orientation="horizontal" className="bg-secondary "/>

        {/* Course sections heading */}        
        <div className="flex flex-row gap-2 w-full justify-between items-center p-2">
          <h2 className="text-xl font-lg text-left w-full mt-4 sm:text-2xl">
            Sections
          </h2>
          <HoverCard>
              <HoverCardTrigger>             
                  <CirclePlus 
                    className="w-4/5 hover:text-secondary hover:cursor-pointer"
                    aria-label="Add new section"
                    onClick={() => {
                      setEditSection(null);
                      setOpenCreate(true)}}
                  />
              </HoverCardTrigger>
              <HoverCardContent side="top" className="bg-background">
                <div className="font-instrument text-xs text-center text-foreground ">
                  Add a new section to your course page to organize your content and discussions.
                </div>
              </HoverCardContent>
          </HoverCard>
        </div>

        {/* Display section dialog */}
        <SectionDialog
          open={openCreate}
          onOpenChange={(open) => { if(!open) setEditSection(null); setOpenCreate(open); }}
          mode={editSection ? "edit" : "create"}
          courseCode={courseCode}
          initialValues={editSection ?? undefined}
        />

        <Separator orientation="horizontal" className="bg-foreground"/>

        {/* Display sections */}
        
        {sections.map((section) => (
          <SectionCard
            key={section.id}
            section={section}
            onEdit={(s) => { setEditSection(s); setOpenCreate(true); }}
            onDelete={(s) => setSections((prev) => prev.filter(sec => sec.id !== s.id))}
          />
        ))}

        {/* Definition table heading */}
        <div className="flex flex-row gap-2 w-full justify-between items-center p-2">
          <h2 className="text-xl font-lg text-left w-full mt-4 sm:text-2xl">
            Definitions
          </h2>
          <HoverCard>

            <HoverCardTrigger>             
                <CirclePlus 
                  className="w-4/5 hover:text-secondary hover:cursor-pointer"
                  aria-label="Add new definition"
                  onClick = {() => {
                  setEditDefinition(null);
                  setDefinitionOpen(true);
                }}
                />
            </HoverCardTrigger>

            <HoverCardContent side="top" className="bg-background">
              <div className="font-instrument text-xs text-center text-foreground ">
                Add a new definition to this course page
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>

        <DefinitionDialog
          open={definitionOpen}
          onOpenChange={(open) => {
            if (!open) setEditDefinition(null);
            setDefinitionOpen(open);
          }}
          mode={editDefinition ? "edit" : "create"}
          initialValues={editDefinition ?? undefined}
        />

        <Separator orientation="horizontal" />
        
        <DefinitionTable
          definitions={definitions}
          onEdit={(definition) => {
            setEditDefinition(definition);
            setDefinitionOpen(true);
          }}
        />
      </div>
    </div>
  );
}