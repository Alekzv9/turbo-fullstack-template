import { createFileRoute, redirect } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { trpc } from '../utils/trpc';
import { useAuthStore } from '../store/auth-store';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  const { saveToken } = useAuthStore();
  const login = trpc.user.login.useMutation({
    onSuccess: (data) => {
      saveToken(data.token, data.user);
      redirect({ to: '/home' });
    },
    onError: (error) => {
      console.log('error', error);
    },
  });
  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  function submitHandler(data: { email: string; password: string }) {
    login.mutate(data);
  }

  return (
    <div className='p-2'>
      <h1>Login</h1>
      <form onSubmit={form.handleSubmit(submitHandler)}>
        <input type='email' placeholder='Email' {...form.register('email')} />
        <input
          type='password'
          placeholder='Password'
          {...form.register('password')}
        />
        <button
          className='bg-blue-500 text-white p-2 rounded-md'
          type='submit'
          disabled={login.isPending}
        >
          {login.isPending ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
