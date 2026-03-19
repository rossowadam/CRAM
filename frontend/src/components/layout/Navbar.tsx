import { useState } from "react";
import AuthDialog from "../auth/AuthDialog";
import { Link } from "react-router-dom"
import { Button } from "../ui/button";
import { useAuth } from "@/hooks/useAuth";
import { logoutUser } from "@/api/userApi";
import {
  Menubar,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { LogOut, User } from "lucide-react";
import avatar1 from "../../assets/avatars/avatar1.webp";
import avatar2 from "../../assets/avatars/avatar2.webp";
import avatar3 from "../../assets/avatars/avatar3.webp";
import avatar4 from "../../assets/avatars/avatar4.webp";
import avatar5 from "../../assets/avatars/avatar5.webp";
import avatar6 from "../../assets/avatars/avatar6.webp";
import avatar7 from "../../assets/avatars/avatar7.webp";
import avatar8 from "../../assets/avatars/avatar8.webp";
import avatar9 from "../../assets/avatars/avatar9.webp";

// TODO: should make a constants file to put these
const AVATAR_MAP: Record<string, string> = {
    avatar1,
    avatar2,
    avatar3,
    avatar4,
    avatar5,
    avatar6,
    avatar7,
    avatar8,
    avatar9,
};

function Navbar() {
    const [authOpen, setAuthOpen] = useState(false);
    const [authMode, setAuthMode] = useState<"login" | "signup">("login");
    const { user, isAuthenticated, setUser } = useAuth();

    return (
        <>
            <nav 
                aria-label="Navigation Bar"
                className="w-full border-b bg-background shadow-2xl "
            >
            <div className="w-full sm:w-full md:w-4/5 lg:w-3/4 xl:w-2/3 2xl:w-1/2 mx-auto flex flex-row items-center justify-between px-4 py-3 ">
                <Link 
                    to="/" 
                    className="font-semibold font-funnel text-lg sm:text-xl md:text-2xl lg:text-3xl 2xl:text-4xl text-secondary"
                >
                C.R.A.M.
                </Link>

                <div className="flex gap-6 font-instrument text-foreground text-base sm:text-lg md:text-xl lg:text-2xl 2xl:text-3xl">
                {isAuthenticated ? (
                    <Menubar className="border-none">
                        <MenubarMenu >
                            <MenubarTrigger className="hover:cursor-pointer">
                                <Avatar>
                                    <AvatarImage src={AVATAR_MAP[user?.profilePic ?? ""] ?? "https://github.com/shadcn.png"} />
                                    <AvatarFallback>{user?.username}</AvatarFallback>
                                </Avatar>
                            </MenubarTrigger>
                            <MenubarContent className="bg-primary text-foreground hover:cursor-pointer hover:text-foreground">
                                <MenubarGroup>
                                    <MenubarItem className="hover:bg-background hover:cursor-pointer">
                                        <User className="text-secondary" />
                                        <Link to={`/profile/${user?.id}`}>
                                            Profile Page
                                        </Link>
                                    </MenubarItem>
                                </MenubarGroup>
                                <MenubarSeparator />
                                <MenubarGroup>
                                    <MenubarItem 
                                        className="hover:bg-background hover:cursor-pointer hover:text-foreground"
                                        onClick={async () => {
                                            await logoutUser();
                                            setUser(null);
                                        }}    
                                    >
                                    <LogOut className="text-secondary" />
                                        Logout
                                    </MenubarItem>
                                </MenubarGroup>
                            </MenubarContent>
                        </MenubarMenu>
                        </Menubar>
                    // logout button displayed with username when logged in
                    // <Button
                    //     className="hover:text-secondary hover:cursor-pointer"
                    //     onClick={async () => {
                    //         await logoutUser();
                    //         setUser(null);
                    //     }}
                    // >
                    //     Logout{" "}
                    //     <span className="max-w-40 truncate text-sm text-muted-foreground">
                    //         {user?.username}
                    //     </span>
                    // </Button>
                ): (
                    // login button displayed when not logged in
                    <Button 
                        className="hover:text-secondary hover:cursor-pointer"
                        onClick={() => {
                            setAuthMode('login');
                            setAuthOpen(true);
                        }}
                    >
                        Login
                    </Button>
                )} 
                </div>
            </div>
            </nav>

            <AuthDialog
                open={authOpen}
                mode={authMode}
                setOpen={setAuthOpen}
                setMode={setAuthMode}
            />
        </>
    )
}

export default Navbar;