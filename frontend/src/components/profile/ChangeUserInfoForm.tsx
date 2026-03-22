import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { resetPassword } from "@/api/userApi";

interface ChangeUserInfoFormProps {
    userId?: string;
    changeInfo: boolean;
    infoType: 'username' | 'email';
}

export default function ChangeUserInfoForm({ userId, changeInfo, infoType }: ChangeUserInfoFormProps) {
    const [newInfo, setNewInfo] = useState("");
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // reset states when button is clicked
    useEffect(() => {
        setServerError(null);
        setSuccessMessage(null);
        setLoading(false);
        setNewInfo("");
    }, [changeInfo]);
    
    if (!userId) return;

    const onChangeInfo = async (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSuccessMessage(null);
        setServerError(null); // remove old errors

        // return if field is empty
        if (!newInfo.trim()) return;

        // return if email change fails validation
        if (infoType === "email") {
            if (!newInfo.endsWith("@myumanitoba.ca") && !newInfo.endsWith("@umanitoba.ca")) {
                return; // helper text turns red validation fails
            }
        }

        // send the request to change the info
        try {
            setLoading(true);

            //await resetPassword(userId, {currentPassword: newInfo, newPassword, confirmPassword });

            setSuccessMessage(`Your ${infoType} was changed successfully!`);
            setNewInfo("");
        } catch (err) {
            setServerError(
                err instanceof Error ? err.message : "Something went wrong."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="flex flex-col" onSubmit={onChangeInfo}>
            <div className="flex flex-col sm:p-2 gap-4 w-full">
                <div>
                    <input 
                        type="text"
                        placeholder={`Enter new ${infoType}`}
                        value={newInfo}
                        onChange={(e) => setNewInfo(e.target.value)}
                        className="font-funnel font-thin text-xs sm:text-sm bg-background text-foreground border border-foreground rounded-md p-2 w-full"
                        required
                    />
                    {/* Display proper help based on the info type */}
                    <p className={`text-xs font-funnel italic gap-0 ${
                        infoType === 'username' 
                            ? newInfo.length > 0 && newInfo.length === 0 ? "text-destructive" : "text-secondary"
                            // email requires domain check
                            : (newInfo.length > 0 && !newInfo.endsWith("@myumanitoba.ca") && !newInfo.endsWith("@umanitoba.ca")) ? "text-destructive" : "text-secondary"
                    }`}>
                        {infoType === "username" ? "Name cannot be empty" : "Email must end in \"@myumanitoba.ca\" or \"@umanitoba.ca\""}
                    </p>
                </div>

                <Button 
                    type="submit"
                    variant="outline"
                    disabled={loading}
                    className="font-bold text-foreground hover:text-secondary hover:bg-accent hover:cursor-pointer disabled:opacity-50"
                >
                    {loading ? "Confirming..." : "Confirm"}
                </Button>

                {serverError && (
                    <p className="text-destructive text-sm text-center mt-2">
                        {serverError}
                    </p>
                )}

                {successMessage && (
                    <p className="text-green-600 text-sm text-center mt-2">
                        {successMessage}
                    </p>
                )}
            </div>
        </form>
    )
}