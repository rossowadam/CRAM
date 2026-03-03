import { useParams } from "react-router-dom";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Separator } from "@/components/ui/separator"
import { CirclePlus } from "lucide-react";
import '@/components/tiptap-node/paragraph-node/paragraph-node.scss'
import Rte from "@/components/editor/Rte";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import SectionCard from "@/components/sections/SectionCard";
import DefinitionTable from "@/components/definitions/DefinitionTable";


export default function Course() {
  const { courseId } = useParams();

  // When multiple sections are present, will need to check section id to toggle isOpen for different actions 
  const [openCreate,setOpenCreate] = useState(false);
  
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

            <Dialog open={openCreate} onOpenChange={setOpenCreate}>
              <DialogTrigger>
                <HoverCardTrigger>             
                    <CirclePlus 
                      className="w-4/5 hover:text-secondary hover:cursor-pointer"
                      aria-label="Add new section"
                    />
                </HoverCardTrigger>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create a new section</DialogTitle>
                  <DialogDescription className="capitalize">When done, this section will be added to {courseId}!</DialogDescription>
                </DialogHeader>
                <Rte onSuccess={() => setOpenCreate(false)}/>
              </DialogContent>
            </Dialog>

            <HoverCardContent side="top" className="bg-background">
              <div className="font-instrument text-xs text-center text-foreground ">
                Add a new section to your course page to organize your content and discussions.
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>

        <Separator orientation="horizontal" className="bg-foreground"/>

        {/* Display sections */}
        <SectionCard/>
        
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
                />
            </HoverCardTrigger>

            <HoverCardContent side="top" className="bg-background">
              <div className="font-instrument text-xs text-center text-foreground ">
                Add a new definition to this course page
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>

        <Separator orientation="horizontal" />
        
        <DefinitionTable/>
      </div>
    </div>
  );
}