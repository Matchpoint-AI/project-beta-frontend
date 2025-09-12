import React from 'react';
import PropTypes from 'prop-types';
interface AuthFormProps {
    login?: boolean;
    setAuthError: (error: string | React.ReactElement) => void;
}
declare function AuthForm({ login, setAuthError }: AuthFormProps): import("react/jsx-runtime").JSX.Element;
declare namespace AuthForm {
    var propTypes: {
        login: PropTypes.Requireable<boolean>;
        setAuthError: PropTypes.Validator<(...args: any[]) => any>;
    };
}
export default AuthForm;
