import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GoogleButton } from "@/components/google-button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";


export const metadata: Metadata = {
    title: "Sign Up",
    description: "Create your Piowsee account.",
};

export default function SignUp() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4">
            <div className="absolute inset-0 -z-10 h-full w-full">
                <div className="absolute inset-0 bg-emerald-100 bg-[radial-gradient(ellipse_at_center,transparent_40%,theme(colors.neutral.100))] dark:bg-neutral-900 dark:bg-[radial-gradient(ellipse_at_center,transparent_40%,theme(colors.neutral.900))]"></div>
                <div className="absolute inset-0 bg-[radial-gradient(theme(colors.neutral.300)_1px,transparent_1px)] bg-size-[20px_20px] dark:bg-[radial-gradient(theme(colors.neutral.700)_1px,transparent_1px)]"></div>
            </div>
            <div className="flex w-full max-w-sm flex-col gap-4">
                <div className="flex justify-start -mt-11">
                    <Button asChild variant="ghost" className="text-sm text-muted-foreground hover:bg-transparent hover:text-foreground">
                        <Link href="/">
                            <ArrowLeft className="mr-1 h-2 w-2" />
                            Back to home
                        </Link>
                    </Button>
                </div>

                <Card className="w-full max-w-sm bg-emerald-50 -mt-2">
                    <CardHeader>
                        <CardTitle className="text-2xl">Create an account.</CardTitle>
                        <CardDescription>
                            We only support Google Account right now. More on the future.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="grid grid-cols-1 gap-6">
                            <GoogleButton />
                        </div>
                        {/* <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                                Or continue with
                            </span>
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="m@example.com" required />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" required />
                    </div>
                    <Button type="submit" className="w-full">
                        Create account
                    </Button> */}

                    </CardContent>
                    <CardFooter>
                        <p className="w-full text-center text-sm text-muted-foreground">
                            Already have an account?{" "}
                            <Link href="/login" className="font-semibold underline-offset-4 hover:underline">
                                Log in
                            </Link>
                        </p>
                    </CardFooter>
                </Card>

                <p className="max-w-md px-4 text-center text-xs text-muted-foreground">
                    By signing up, you agree to our{" "}
                    <Link
                        href="/terms"
                        className="underline underline-offset-3 hover:text-primary"
                    >
                        Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                        href="/privacy"
                        className="underline underline-offset-3 hover:text-primary"
                    >
                        Privacy Policy
                    </Link>
                    .
                </p>
            </div>
        </main>
    );
}