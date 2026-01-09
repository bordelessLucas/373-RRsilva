import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/Button';
import { paths } from '../../routes/paths';
import './Register.css';

export const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuthContext();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setIsLoading(true);

    try {
      await register(email, password, name);
      navigate(paths.dashboard);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Erro ao criar conta. Tente novamente.');
      } else {
        setError('Erro ao criar conta. Tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-page__background"></div>

      <div className="auth-page__container">
        <div className="auth-card">
          <div className="auth-card__header">
            <div className="auth-card__logo">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <rect width="48" height="48" rx="12" fill="url(#logoGradient)"/>
                <path d="M24 12L32 20H28V28H20V20H16L24 12Z" fill="white"/>
                <path d="M12 28V36H36V28" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                <defs>
                  <linearGradient id="logoGradient" x1="0" y1="0" x2="48" y2="48">
                    <stop offset="0%" stopColor="#646cff"/>
                    <stop offset="100%" stopColor="#535bf2"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <h1 className="auth-card__title">Criar sua conta</h1>
            <p className="auth-card__subtitle">
              Comece a explorar nossa galeria de artes profissionais
            </p>
          </div>

          <form className="auth-card__form" onSubmit={handleSubmit}>
            {error && (
              <div className="auth-card__error">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="2"/>
                  <path d="M10 6V10M10 14H10.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <span>{error}</span>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Nome completo
              </label>
              <div className="form-input-wrapper">
                <svg className="form-input-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 10C12.7614 10 15 7.76142 15 5C15 2.23858 12.7614 0 10 0C7.23858 0 5 2.23858 5 5C5 7.76142 7.23858 10 10 10Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M0 18.3333C0 14.6519 2.98477 11.6667 6.66667 11.6667H13.3333C17.0152 11.6667 20 14.6519 20 18.3333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <input
                  id="name"
                  type="text"
                  className="form-input"
                  placeholder="Seu nome completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="name"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                E-mail
              </label>
              <div className="form-input-wrapper">
                <svg className="form-input-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M2.5 6.66667L10 11.6667L17.5 6.66667M3.33333 15H16.6667C17.5871 15 18.3333 14.2538 18.3333 13.3333V6.66667C18.3333 5.74619 17.5871 5 16.6667 5H3.33333C2.41286 5 1.66667 5.74619 1.66667 6.66667V13.3333C1.66667 14.2538 2.41286 15 3.33333 15Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <input
                  id="email"
                  type="email"
                  className="form-input"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Senha
              </label>
              <div className="form-input-wrapper">
                <svg className="form-input-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M15.8333 9.16667H4.16667C3.24619 9.16667 2.5 9.91286 2.5 10.8333V15.8333C2.5 16.7538 3.24619 17.5 4.16667 17.5H15.8333C16.7538 17.5 17.5 16.7538 17.5 15.8333V10.8333C17.5 9.91286 16.7538 9.16667 15.8333 9.16667Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M5.83333 9.16667V5.83333C5.83333 4.72876 6.27281 3.66895 7.05372 2.88805C7.83462 2.10714 8.89443 1.66667 9.99999 1.66667C11.1056 1.66667 12.1654 2.10714 12.9463 2.88805C13.7272 3.66895 14.1667 4.72876 14.1667 5.83333V9.16667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <input
                  id="password"
                  type="password"
                  className="form-input"
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                Confirmar senha
              </label>
              <div className="form-input-wrapper">
                <svg className="form-input-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M15.8333 9.16667H4.16667C3.24619 9.16667 2.5 9.91286 2.5 10.8333V15.8333C2.5 16.7538 3.24619 17.5 4.16667 17.5H15.8333C16.7538 17.5 17.5 16.7538 17.5 15.8333V10.8333C17.5 9.91286 16.7538 9.16667 15.8333 9.16667Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M5.83333 9.16667V5.83333C5.83333 4.72876 6.27281 3.66895 7.05372 2.88805C7.83462 2.10714 8.89443 1.66667 9.99999 1.66667C11.1056 1.66667 12.1654 2.10714 12.9463 2.88805C13.7272 3.66895 14.1667 4.72876 14.1667 5.83333V9.16667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <input
                  id="confirmPassword"
                  type="password"
                  className="form-input"
                  placeholder="Digite a senha novamente"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-checkbox">
                <input type="checkbox" required />
                <span>
                  Concordo com os{' '}
                  <Link to="#" className="form-link--inline">
                    Termos de Serviço
                  </Link>
                  {' '}e{' '}
                  <Link to="#" className="form-link--inline">
                    Política de Privacidade
                  </Link>
                </span>
              </label>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isLoading}
            >
              Criar conta
            </Button>

            <Link to={paths.home} style={{ width: '100%' }}>
              <Button
                type="button"
                variant="ghost"
                size="lg"
                fullWidth
                className="explore-button"
              >
                Explorar sem login
              </Button>
            </Link>
          </form>

          <div className="auth-card__footer">
            <p className="auth-card__footer-text">
              Já tem uma conta?{' '}
              <Link to={paths.login} className="auth-card__footer-link">
                Fazer login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

