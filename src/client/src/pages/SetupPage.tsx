import { Controller, useForm } from 'react-hook-form';
import { appendBasePath } from '../utils/basePath';
import { TopSection } from '../views/homepage/Top';
import { useCreateInitialUserMutation } from '../graphql/mutations/__generated__/createInitialUser.generated';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { hashPassword } from '@/utils/crypto';

type SetupFormValues = {
  email: string;
  password: string;
  confirmPassword: string;
};

const SetupPage = () => {
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SetupFormValues>();

  const [createInitialUser, { loading, error: mutationError }] =
    useCreateInitialUserMutation({
      onCompleted: () => {
        window.location.href = appendBasePath('/login');
      },
    });

  const onSubmit = async (data: SetupFormValues) => {
    if (data.password !== data.confirmPassword) {
      setError('confirmPassword', { message: 'Passwords do not match' });
      return;
    }

    const hashedPassword = await hashPassword(data.password);
    createInitialUser({
      variables: { email: data.email, password: hashedPassword },
    });
  };

  return (
    <div className="relative min-h-screen">
      <img
        alt=""
        src={appendBasePath('/static/thunderstorm.webp')}
        className="absolute inset-0 z-[-1] h-72 w-full object-cover bg-background"
      />
      <div className="flex flex-col gap-6 pb-12 pt-8">
        <TopSection />
        <div className="mx-auto w-full max-w-md px-4">
          <Card>
            <CardHeader>
              <CardTitle>Initial Setup</CardTitle>
              <CardDescription>
                Create the first owner account to get started with ThunderHub.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
              >
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="email"
                    className="text-xs font-medium text-muted-foreground"
                  >
                    Email
                  </label>
                  <Controller
                    name="email"
                    control={control}
                    rules={{
                      required: 'Email is required',
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Please enter a valid email address',
                      },
                    }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="email"
                        type="email"
                        placeholder="admin@example.com"
                        autoComplete="email"
                      />
                    )}
                  />
                  {errors.email && (
                    <p className="text-xs text-destructive">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="password"
                    className="text-xs font-medium text-muted-foreground"
                  >
                    Password
                  </label>
                  <Controller
                    name="password"
                    control={control}
                    rules={{
                      required: 'Password is required',
                      minLength: {
                        value: 8,
                        message: 'Password must be at least 8 characters',
                      },
                    }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="password"
                        type="password"
                        placeholder="Minimum 8 characters"
                        autoComplete="new-password"
                      />
                    )}
                  />
                  {errors.password && (
                    <p className="text-xs text-destructive">
                      {errors.password.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="confirmPassword"
                    className="text-xs font-medium text-muted-foreground"
                  >
                    Confirm Password
                  </label>
                  <Controller
                    name="confirmPassword"
                    control={control}
                    rules={{
                      required: 'Please confirm your password',
                    }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="confirmPassword"
                        type="password"
                        placeholder="Repeat your password"
                        autoComplete="new-password"
                      />
                    )}
                  />
                  {errors.confirmPassword && (
                    <p className="text-xs text-destructive">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
                {mutationError && (
                  <p className="text-xs text-destructive">
                    {mutationError.message}
                  </p>
                )}
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? 'Creating account...' : 'Create Owner Account'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SetupPage;
