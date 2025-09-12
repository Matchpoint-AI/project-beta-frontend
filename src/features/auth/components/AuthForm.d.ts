import React from 'react';
interface AuthFormProps {
    login?: boolean;
    setAuthError: (error: string | React.ReactElement) => void;
}
declare function AuthForm({ login, setAuthError }: AuthFormProps): any;
declare namespace AuthForm {
    var propTypes: {
        login: any;
        setAuthError: any;
    };
}
export default AuthForm;
