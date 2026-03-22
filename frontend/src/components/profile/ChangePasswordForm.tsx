import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

interface ChangePasswordFormProps {
    userId?: string;
    changePassword: boolean;
}

export default function ChangePasswordForm({ userId, changePassword }: ChangePasswordFormProps) {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    console.log(userId);

    // reset fields when button is clicked
    useEffect(() => {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
    }, [changePassword]);

    return (
        <div className="flex flex-col sm:p-2 gap-4 w-full">
            <input 
                type="password"
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="font-funnel font-thin text-xs sm:text-sm bg-background text-foreground border border-foreground rounded-md p-2 w-full"
            />
            <div>
                <input 
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="font-funnel font-thin text-xs sm:text-sm bg-background text-foreground border border-foreground rounded-md p-2 w-full"
                />
                <p className={`text-xs font-funnel italic gap-0 ${newPassword.length > 0 && newPassword.length < 8 ? "text-destructive" : "text-secondary"}`}>
                    Password must be at least 8 characters
                </p>
            </div>

            <div>
                <input 
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="font-funnel font-thin text-xs sm:text-sm bg-background text-foreground border border-foreground rounded-md p-2 w-full"
                />
                <p className={`text-xs font-funnel italic gap-0 ${confirmPassword.length > 0 && confirmPassword !== newPassword ? "text-destructive" : "text-secondary"}`}>
                    Passwords must match
                </p>
            </div>

            <Button className="hover:cursor-pointer hover:text-secondary w-full">
                Confirm
            </Button>
        </div>
    )
}