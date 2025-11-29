import { type PropsWithChildren } from 'react';
import { usePage } from '@inertiajs/react';
import { SharedData } from '@/types';
interface AuthLayoutProps {
    title?: string;
    description?: string;
}
export default function SdAuthSplitLayout({
                                            children,
                                        }: PropsWithChildren<AuthLayoutProps>) {
    const { exGlobalSettings } = usePage<SharedData>().props;
    const banner = exGlobalSettings?.login_side_banner;
    return (
        <div className="relative grid h-dvh flex-col items-center justify-center px-8 sm:px-0 lg:max-w-none lg:grid-cols-2 lg:px-0">
            <div className="relative hidden h-full flex-col p-10 text-white lg:flex">
                {banner ? (
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(/storage/${banner})` }}
                    />
                ) : (
                    <div className="absolute inset-0" />
                )}
            </div>
            <div className="w-full lg:p-4">
                <div className="mx-auto flex flex-col justify-center space-y-3 w-full xl:w-7/10">
                    {children}
                </div>
            </div>
        </div>
    );
}
