// Component Imports
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

// Icon Imports
import { SearchIcon } from "lucide-react";


function Home() {

  const onSearch = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Search Submitted");
  }

  return (
    // Wrapper
    <div className="flex flex-col w-full max-w-2xl  items-center gap-3 font-funnel sm:max-w-xl lg:max-w-2xl xl:max-w-4xl 2xl:max-w-5xl mx-auto px-6 py-6 ">

      {/* Title */}
      <h1 className="scroll-m-20 pb-2 font-semibold tracking-tight first:mt-0 text-2xl sm:text-3xl md:text-4xl lg:text-5xl  2xl:text-6xl ">
        Find Your Course
      </h1>

      {/* Search Bar */}
      <form 
        onSubmit={onSearch} 
        className="w-4/5 md:w-3/4 lg:w-3/4 2xl:w-2/3"
      >
        <InputGroup className="h-10 md:h-12 lg:h-16 2xl:h-20">

          <InputGroupInput 
            type="search"
            placeholder="Search..." 
            aria-label="Search courses"
            className=" text-base md:text-lg lg:text-xl 2xl:text-2xl px-3 md:px-4 lg:px-5" 
          />

          <InputGroupAddon>
            <InputGroupButton 
              type="submit"
              size="icon-sm" 
              aria-label="Search" 
              className="cursor-pointer hover:bg-secondary h-6  w-10 md:w-12 lg:w-16 2xl:w-20" 
            >
              <SearchIcon className="h-5 w-5 md:h-6 md:w-6 lg:h-8 lg:w-8 2xl:h-10 2xl:w-10"/>
            </InputGroupButton> 
          </InputGroupAddon>
        </InputGroup>
      </form>

      {/* Section Break */}
      <div className="h-px w-full bg-secondary my-1"></div>

      {/* Subtitle */}
      <div className="flex flex-col items-start w-full ">
        <h2 className="font-instrument text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl  font-extralight">
          All Courses
        </h2>
      </div>

      {/* Card */}
      <Card className="w-full bg-primary text-foreground border-0 shadow-xl p-1 sm:p-2 md:p-3 lg:p-4 xl:p-5 2xl:p-6 ">

        <CardHeader>
            <CardTitle className="text-base border-b border-secondary break-all hover:text-secondary cursor-pointer sm:text-lg md:text-xl lg:text-2xl xl:text-3xl">
              Course Name
            </CardTitle>
          
            <CardDescription className="text-foreground text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl break-all">
              Prereqs: Comp 3010
            </CardDescription>
        </CardHeader>
          
        <CardContent className="font-thin text-sm font-instrument">
          <Collapsible className=" rounded-md bg-primary data-[state=open]:bg-primary">
            <CollapsibleTrigger className=" flex flex-row pb-1 mb-1 bg-primary hover:text-secondary font-instrument text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-bold">
              Expand to view more 
            </CollapsibleTrigger>

            <CollapsibleContent className="flex flex-col items-start gap-2  pt-0 text-sm ">
              <div>
                <div className="h-px w-full bg-secondary my-1"/>
                <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl break-all">
                  Course description here
                </p>
              </div>
            </CollapsibleContent>
          </Collapsible>
          
        </CardContent>

      </Card>
    </div>
  )
}

export default Home
