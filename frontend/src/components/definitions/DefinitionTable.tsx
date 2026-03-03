import { 
    Table, 
    TableBody, 
    TableCaption, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from "../ui/table";
import { PencilLine, Trash2 } from "lucide-react";
import { Button } from "../ui/button";

export default function DefinitionTable() {
    return(
        <div className="w-full overflow-x-auto">
            <Table className="w-full min-w-[700px]">
                <TableCaption className="capitalize font-funnel font-bold">Definitions Table</TableCaption>
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
    )
}