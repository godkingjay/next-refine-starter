import { CustomAuthPageProps } from '.';

type AuthUpdatePasswordProps = CustomAuthPageProps & {
	type: 'updatePassword';
};

const AuthUpdatePassword = ({}: AuthUpdatePasswordProps) => {
	return <div>AuthUpdatePassword</div>;
};

export default AuthUpdatePassword;
