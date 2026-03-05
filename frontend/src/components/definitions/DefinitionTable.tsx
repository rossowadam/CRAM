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
import type { Definition } from "@/api/sectionsApi";

type DefinitionTableProps = {
  definitions: Definition[];       
  onEdit: (def: Definition) => void;
  onDelete: (id: string) => void
};

export default function DefinitionTable({definitions, onEdit, onDelete}: DefinitionTableProps) {
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
                        <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {definitions.map((def) =>(
                        <TableRow key={def._id}  className="break-all">
                            <TableCell className="font-medium">{def.term}</TableCell>
                            <TableCell>{def.definition}</TableCell>
                            <TableCell>{def.example}</TableCell>
                            <TableCell></TableCell> 
                            <TableCell></TableCell> 
                            <TableCell className="text-right">
                                <Button 
                                    className="hover:text-secondary hover:cursor-pointer mr-1" 
                                    aria-label="Edit definition"
                                    onClick={() => onEdit(def)}
                                >
                                    <PencilLine />
                                </Button>
                                <Button 
                                    className="hover:text-destructive hover:cursor-pointer hover:underline" 
                                    aria-label="Delete definition"
                                    onClick={() => onDelete(def._id)}
                                >
                                    <Trash2 />
                                </Button>
                            </TableCell> 
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}