import { type PropsWithChildren } from 'react';
interface AuthLayoutProps {
    title?: string;
    description?: string;
}
export default function SdAuthSplitLayout({
                                            children,
                                        }: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="relative grid h-dvh flex-col items-center justify-center px-8 sm:px-0 lg:max-w-none lg:grid-cols-2 lg:px-0">
            <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
                <div className="absolute inset-0 bg-zinc-900" />
            </div>
            <div className="w-full lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    {children}
                </div>
            </div>
        </div>
    );
}
