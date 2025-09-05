import dynamic from 'next/dynamic';

const LoginHolder = dynamic(() => import('@/components/Login'));
const Login = () => {
    return <LoginHolder />;
};
export default Login;
