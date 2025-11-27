import { Form, Head } from '@inertiajs/react';
import SaAuthLayout from '@/layouts/superAdmin/sa-auth-layout';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import InputError from '@/components/input-error';
import { doLogin } from '@/routes/bankai';

interface LoginProps {
    pageTitle: string;
    pageDescription: string;
    status?: string;
}

export default function SubDomainVisitorRegisterForm({
                                  pageTitle,
                                  pageDescription,
                                  status,
                              }: LoginProps) {
    return (
        <SaAuthLayout
            title={pageTitle}
            description={pageDescription}
        >
            <Head title={pageTitle} />

            <Form
                {...doLogin.form()}
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
        </SaAuthLayout>
    );
}
