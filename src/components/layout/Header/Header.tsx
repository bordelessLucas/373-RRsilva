import { type ReactNode } from 'react';
import { HiOutlineMenu, HiOutlineX } from 'react-icons/hi';
import { useAuthContext } from '../../../contexts/AuthContext';
import { Button } from '../../ui/Button';
import './Header.css';

export interface HeaderProps {
  title?: string;
  logo?: ReactNode;
  children?: ReactNode;
  showUserMenu?: boolean;
  onMenuClick?: () => void;
  isSidebarOpen?: boolean;
}

export const Header = ({
  title = 'RR Silva',
  logo,
  children,
  showUserMenu = true,
  onMenuClick,
  isSidebarOpen = false,
}: HeaderProps) => {
  const { user, logout } = useAuthContext();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <header className="header">
      <div className="header__container">
        <div className="header__left">
          {onMenuClick && (
            <button
              className="header__menu-button"
              onClick={onMenuClick}
              aria-label="Toggle menu"
              title={isSidebarOpen ? 'Fechar menu' : 'Abrir menu'}
            >
              {isSidebarOpen ? (
                <HiOutlineX size={28} />
              ) : (
                <HiOutlineMenu size={28} />
              )}
            </button>
          )}
          
          {logo && <div className="header__logo">{logo}</div>}
          <h1 className="header__title">{title}</h1>
        </div>

        <div className="header__center">
          {children}
        </div>

        <div className="header__right">
          {showUserMenu && user && (
            <div className="header__user-menu">
              <div className="header__user-info">
                <span className="header__user-name">
                  {user.displayName || user.email}
                </span>
                {user.photoURL && (
                  <img
                    src={user.photoURL}
                    alt="Avatar"
                    className="header__avatar"
                  />
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
              >
                Sair
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
