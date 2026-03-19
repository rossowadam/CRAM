import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import avatar1 from "../../assets/avatars/avatar1.webp";
import avatar2 from "../../assets/avatars/avatar2.webp";
import avatar3 from "../../assets/avatars/avatar3.webp";
import avatar4 from "../../assets/avatars/avatar4.webp";
import avatar5 from "../../assets/avatars/avatar5.webp";
import avatar6 from "../../assets/avatars/avatar6.webp";
import avatar7 from "../../assets/avatars/avatar7.webp";
import avatar8 from "../../assets/avatars/avatar8.webp";
import avatar9 from "../../assets/avatars/avatar9.webp";

interface ProfilePicDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    onSelect: (src: string) => void;
}

const PROFILE_PICS = [avatar1, avatar2, avatar3, avatar4, avatar5, avatar6, avatar7, avatar8, avatar9];

export default function ProfilePicDialog({ open, setOpen, onSelect }: ProfilePicDialogProps) {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="bg-primary">
                <DialogHeader>
                    <DialogTitle className="text-secondary text-2xl">
                        Choose a Profile Picture
                        <DialogDescription className="font-thin font-instrument text-foreground text-xs mt-2">
                            Select one of the options below.
                        </DialogDescription>
                    </DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-3 gap-3 overflow-y-auto max-h-[60vh]">
                    {PROFILE_PICS.map((src) => (
                        <img
                            key={src}
                            src={src}
                            className="rounded-full cursor-pointer hover:ring-2 hover:ring-secondary"
                            onClick={() => {
                                onSelect(src);
                                setOpen(false);
                            }}
                        />
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
}