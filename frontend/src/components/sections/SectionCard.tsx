import { 
    ChevronDownIcon, 
    PencilLine, 
    Trash2 
} from "lucide-react";
import { 
    Button 
} from "../ui/button";
import { 
    Card, 
    CardAction, 
    CardContent, 
    CardDescription, 
    CardFooter, 
    CardHeader, 
    CardTitle 
} from "../ui/card";
import { 
    Dialog, 
    DialogContent, 
    DialogDescription, 
    DialogHeader, 
    DialogTitle, 
    DialogTrigger 
} from "../ui/dialog";
import { HoverCard, 
    HoverCardContent, 
    HoverCardTrigger 
} from "../ui/hover-card";
import { 
    Collapsible, 
    CollapsibleContent, 
    CollapsibleTrigger 
} from "../ui/collapsible";
import { 
    Separator 
} from "../ui/separator";
import { 
    Avatar, 
    AvatarFallback, 
    AvatarGroup, 
    AvatarGroupCount, 
    AvatarImage 
} from "../ui/avatar";
import { useState } from "react";
import SectionDialog from "./SectionDialog";

export default function SectionCard() {
    const [openEdit,setOpenEdit] = useState(false);
    return(

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
                        <HoverCardTrigger>             
                            <Button 
                            className="hover:text-secondary hover:cursor-pointer" 
                            aria-label="Edit section"
                            onClick={() => setOpenEdit(true)}
                            >
                                <PencilLine />
                            </Button>
                        </HoverCardTrigger>
                        <HoverCardContent side="top" className="bg-background">
                            <div className="font-instrument text-xs text-center text-foreground ">
                                Edit the section title, description, and body to better reflect the content and discussions within this section.
                            </div>
                        </HoverCardContent>
                    </HoverCard>

                    {/* Display section dialog */}
                    <SectionDialog
                        open = {openEdit}
                        onOpenChange={setOpenEdit}
                        mode="edit"
                    />

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
                                    <DialogDescription className="capitalize">Are you sure? this action will permanently delete the section from this course page!</DialogDescription>
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
    );
}