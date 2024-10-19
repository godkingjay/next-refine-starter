import { CustomAuthPageProps } from '.';

type AuthForgotPasswordProps = CustomAuthPageProps & {
	type: 'forgotPassword';
};

const AuthForgotPassword = ({}: AuthForgotPasswordProps) => {
	return <div>AuthForgotPassword</div>;
};

export default AuthForgotPassword;
