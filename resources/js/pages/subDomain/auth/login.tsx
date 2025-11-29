import { Form, Link, usePage } from '@inertiajs/react';
import SdAuthLayout from '@/layouts/subDomain/sd-auth-layout';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import InputError from '@/components/input-error';
import { type SharedData } from '@/types';
import subDomain from '@/routes/subDomain';
import { Separator } from '@radix-ui/react-select';

interface LoginProps {
    pageTitle: string;
    pageDescription: string;
    status?: string;
}

export default function SubDomainVisitorLoginForm({
                                  pageTitle,
                                  pageDescription,
                                  status
                              }: LoginProps) {
    const { exhibition, exGlobalSettings } = usePage<SharedData>().props;
    return (
        <SdAuthLayout
            title={exhibition.name + ' | ' +pageTitle}
            description={pageDescription}
        >
            {(exGlobalSettings.is_login_active === 'yes') ? (
                <>
                    <Link
                        href={subDomain.frontend({
                            exhibitionSlug : exhibition.subdomain,
                        })}
                        className="relative z-20 flex items-center justify-center lg:hidden"
                    >
                        LOGO HERE
                    </Link>
                    <div className="flex flex-col items-center gap-2 text-left sm:items-center sm:text-center">
                        <h1 className="text-4xl font-medium">{exhibition.name}</h1>
                        <h1 className="text-xl font-medium">{pageTitle}</h1>
                        <p className="text-sm text-balance text-muted-foreground">
                            {pageDescription}
                        </p>
                    </div>
                    <Form
                        {...subDomain.doLogin.form({
                            exhibitionSlug : exhibition.subdomain
                        })}
                        resetOnSuccess={['password']}
                        className="flex flex-col gap-6"
                    >
                        {({ processing, errors }) => (
                            <>
                                <div className="grid gap-6">
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email address</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            name="email"
                                            required
                                            autoFocus
                                            tabIndex={1}
                                            autoComplete="email"
                                            placeholder="email@example.com"
                                        />
                                        <InputError message={errors.email} />
                                    </div>
                                    <Button
                                        type="submit"
                                        className="mt-4 w-full"
                                        tabIndex={4}
                                        disabled={processing}
                                        data-test="login-button"
                                    >
                                        {processing && <Spinner />}
                                        Log in
                                    </Button>
                                </div>
                            </>
                        )}
                    </Form>

                    {status && (
                        <div className="mb-4 text-center text-sm font-medium text-green-600">
                            {status}
                        </div>
                    )}
                </>
            ) : (
                <>
                    <Link
                        href={subDomain.frontend({
                            exhibitionSlug : exhibition.subdomain,
                        })}
                        className="relative z-20 flex items-center justify-center lg:hidden"
                    >
                        LOGO HERE
                    </Link>
                    <div className="flex flex-col items-center gap-2 text-left sm:items-center sm:text-center">
                        <h1 className="text-4xl font-medium">{exhibition.name}</h1>
                        <h1 className="text-xl font-medium">{exGlobalSettings.inactive_login_text}</h1>
                    </div>
                </>
            )}
            <div className={'flex flex-col items-center justify-center gap-4'}>
                <Button variant="outline" className={'cursor-pointer w-full'}>Register as visitor</Button>
                <Separator className="my-2" />
                <Button variant="outline" className={'cursor-pointer w-full'}>Login as exhibitor</Button>
            </div>
        </SdAuthLayout>
    );
}
