import { AuthPage } from '@components/auth-page';
import { authProviderServer } from '@providers/auth-provider';
import { redirect } from 'next/navigation';

export default async function Login() {
	const data = await getData();

	if (data.authenticated) {
		redirect(data?.redirectTo || '/');
	}

	return (
		<div className='m-auto relative flex items-center justify-center overflow-hidden'>
			<AuthPage type='login' />
		</div>
	);
}

async function getData() {
	const { authenticated, redirectTo, error } = await authProviderServer.check();

	return {
		authenticated,
		redirectTo,
		error,
	};
}
