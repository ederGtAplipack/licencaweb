import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa o hook para navegação
import { authService } from '../services/api';
import './login.css'; // Caminho de importação corrigido

const Login = () => {
    const [credentials, setCredentials] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate(); // Inicializa o hook de navegação

    /* Manipula mudanças nos campos de entrada */
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCredentials(prev => ({
            ...prev,
            [name]: value
        }));
    };

    /* Manipula o envio do formulário */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await authService.login(credentials);

            if (response.token) {
                localStorage.setItem('token', response.token);
                localStorage.setItem('user', JSON.stringify(response.user));

                // Redireciona o usuário para o Dashboard após o login
                navigate('/dashboard');
            }
        } catch (error) {
            setError(error.message || 'Erro ao fazer login. Verifique suas credenciais.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2 className="login-title">Sistema de Licenca!</h2>
                <p className="login-subtitle">Você pode fazer login para acessar com sua conta existente.</p>

                <form onSubmit={handleSubmit} className="login-form">
                    {error && (
                        <div className="login-error">
                            {error}
                        </div>
                    )}

                    <div className="login-input-group">
                        <label className="login-label">Usuario ou e-mail</label>
                        <input
                            type="text"
                            name="username"
                            value={credentials.username}
                            onChange={handleInputChange}
                            className="login-input"
                            required
                        />
                    </div>

                    <div className="login-input-group">
                        <label className="login-label">Senha</label>
                        <input
                            type="password"
                            name="password"
                            value={credentials.password}
                            onChange={handleInputChange}
                            className="login-input"
                            required
                        />
                    </div>

                    <div className="login-remember-group">
                        <label className="login-remember-label">
                            <input type="checkbox" />
                            Lembre-se
                        </label>
                        <a href="#forgot" className="login-forgot-link">Esqueceu a Senha ?</a>
                    </div>

                    <button
                        type="submit"
                        className="login-button"
                        disabled={loading}
                    >
                        {loading ? 'Acessando...' : 'Acessar'}
                    </button>
                </form>

                <p className="login-signup-link">
                    Nova Conta ? <a href="#signup" className="login-signup-anchor">Crie a Conta</a>
                </p>
            </div>
        </div>
    );
};

export default Login;