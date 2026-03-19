import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface ProfilePicDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    onSelect: (src: string) => void;
}

const PROFILE_PICS = [
    "/avatars/avatar1.png",
    "/avatars/avatar2.png",
    "/avatars/avatar3.png",
    // add more as needed
];

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

                <div className="grid grid-cols-3 gap-3">
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