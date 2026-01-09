import { useAuthContext } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/Button';
import './EditProfile.css';

export const EditProfile = () => {
  const { user, logout } = useAuthContext();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <div className="edit-profile-page">
      <div className="edit-profile-page__container">
        <h1 className="edit-profile-page__title">Editar Perfil</h1>
        {user && (
          <div className="edit-profile-page__content">
            <p>Email: {user.email}</p>
            <p>Nome: {user.displayName || 'Não informado'}</p>
            <Button onClick={handleLogout} variant="danger">
              Sair
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

