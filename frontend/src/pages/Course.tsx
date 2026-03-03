import { useParams } from "react-router-dom";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button";
import { ChevronDownIcon, CirclePlus, PencilLine, Trash2 } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import '@/components/tiptap-node/paragraph-node/paragraph-node.scss'
import Rte from "@/components/ui/rte";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";


export default function Course() {
  const { courseId } = useParams();
  
  // When multiple sections are present, will need to check section id to toggle isOpen for different actions 
  const [openCreate,setOpenCreate] = useState(false);
  const [openEdit,setOpenEdit] = useState(false);
  

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


        <Card  className="bg-primary w-full">
          <CardHeader>

            <CardTitle className="text-left font-funnel font-base text-xl text-foreground sm:text-2xl">
              Section Title
            </CardTitle>

            <CardDescription className="text-left font-instrument font-thin text-xs text-foreground italic sm:text-sm">
              Short section description preparing you for what to expect.
            </CardDescription>
            
            <CardAction >
              <HoverCard>
                {/* Needs to pass sections data to rte */}
                <Dialog open={openEdit} onOpenChange={setOpenEdit}>
                  <DialogTrigger>
                    <HoverCardTrigger>             
                        <Button 
                          className="hover:text-secondary hover:cursor-pointer" 
                          aria-label="Edit section"
                        >
                          <PencilLine />
                        </Button>
                    </HoverCardTrigger>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Section</DialogTitle>
                      <DialogDescription className="capitalize">Update the section title, subtitle, or content!</DialogDescription>
                    </DialogHeader>
                    <Rte onSuccess={() => setOpenEdit(false)}/>
                  </DialogContent>
                </Dialog>
                

                <HoverCardContent side="top" className="bg-background">
                  <div className="font-instrument text-xs text-center text-foreground ">
                    Edit the section title, description, and body to better reflect the content and discussions within this section.
                  </div>
                </HoverCardContent>
              </HoverCard>
            
              <HoverCard>
                <Dialog>
                  <DialogTrigger>
                    <HoverCardTrigger>             
                      <Button 
                        className="hover:text-destructive hover:cursor-pointer hover:underline" 
                        aria-label="Delete section"
                      >
                        <Trash2 />
                      </Button>
                    </HoverCardTrigger>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Delete Section</DialogTitle>
                      <DialogDescription className="capitalize">Are you sure? this action will permanently delete the section from {courseId}!</DialogDescription>
                    </DialogHeader>
                    <Button className="bg-secondary text-primary hover:cursor-pointer hover:text-primary hover:bg-destructive">I'm sure, delete this section</Button>
                  </DialogContent>
                </Dialog>

                <HoverCardContent side="top" className="bg-background">
                  <div className="font-instrument text-xs text-center text-foreground ">
                    Delete this section and all of its content. This action cannot be undone, so please proceed with caution.
                  </div>
                </HoverCardContent>
              </HoverCard>
            </CardAction>
          </CardHeader>

          <CardContent className="text-foreground">

            <Collapsible className="data-[state=open]:bg-primary rounded-md">

              <CollapsibleTrigger asChild className="mb-2">
                <Button 
                  variant="ghost" 
                  className="group w-full bg-primary hover:bg-secondary hover:cursor-pointer" 
                  aria-label="Expand Section"
                >
                  View Section
                  <ChevronDownIcon className="ml-auto group-data-[state=open]:rotate-180" />
                </Button>
              </CollapsibleTrigger>

              <Separator orientation="horizontal" className="bg-secondary mb-2"/>

              <CollapsibleContent className="flex flex-col items-start gap-2 p-2.5 pt-0 text-xs font-instrument font-thin sm:text-sm">
                <div>
                  Here is the body of the section, where you can add content, discussions, and resources related to this section. You can edit this content to keep it up-to-date and relevant for your course.
                </div>
              </CollapsibleContent>
            </Collapsible>     
          </CardContent>

          <CardFooter className="text-foreground text-xs flex flex-row align-center justify-between gap-2">
            <div className="flex flex-row gap-3 items-center">
              <p>Contributors:</p>
              <AvatarGroup className="grayscale">
                <Avatar size="sm">
                  <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <Avatar size="sm">
                  <AvatarImage src="https://github.com/maxleiter.png" alt="@maxleiter" />
                  <AvatarFallback>LR</AvatarFallback>
                </Avatar>
                <Avatar size="sm">
                  <AvatarImage
                    src="https://github.com/evilrabbit.png"
                    alt="@evilrabbit"
                  />
                  <AvatarFallback>ER</AvatarFallback>
                </Avatar>
                <AvatarGroupCount>+3</AvatarGroupCount>
              </AvatarGroup>
            </div>
            
            <p className="text-xs">Last Edited: 2024-05-15</p>
          </CardFooter>
        </Card>

        {/* Definition Table */}
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
        
        <div className="w-full overflow-x-auto">
          <Table className="w-full min-w-[700px]">
            <TableCaption className="capitalize font-funnel font-bold">{courseId} Definitions Table</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/12 sm:w-1/5">Term</TableHead>
                <TableHead>Definition</TableHead>
                <TableHead>Example</TableHead>
                <TableHead>Added By</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">The Machine</TableCell>
                <TableCell>A being whom we must obey at all costs</TableCell>
                <TableCell>The Machine Hath Spoken</TableCell>
                <TableCell>A Witness</TableCell>
                <TableCell>2026-02-28</TableCell>
                <TableCell className="text-right">
                  <Button 
                    className="hover:text-secondary hover:cursor-pointer mr-1" 
                    aria-label="Edit section"
                  >
                    <PencilLine />
                  </Button>
                  <Button 
                    className="hover:text-destructive hover:cursor-pointer hover:underline" 
                    aria-label="Delete section"
                  >
                    <Trash2 />
                  </Button>
                </TableCell> 
              </TableRow>
              
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}