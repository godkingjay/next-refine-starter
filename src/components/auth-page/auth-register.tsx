import { CustomAuthPageProps } from '.';

type AuthRegisterProps = CustomAuthPageProps & {
	type: 'register';
};

const AuthRegister = ({}: AuthRegisterProps) => {
	return <div>AuthRegister</div>;
};

export default AuthRegister;
