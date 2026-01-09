import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import { paths } from '../../routes/paths';
import { Button } from '../../components/ui/Button';
import { Header } from '../../components/layout/Header';
import { Sidebar, type SidebarItem } from '../../components/layout/Sidebar';
import { HiUser } from 'react-icons/hi';
import './Home.css';

const Home = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  // Sidebar items with dynamic active state
  const sidebarItems: SidebarItem[] = [
    {
      id: 'home',
      label: 'Início',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 7l7-5 7 5v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
          <path d="M7 17V10h6v7" />
        </svg>
      ),
      active: activeSection === 'home',
      onClick: () => {
        setActiveSection('home');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
    },
    {
      id: 'gallery',
      label: 'Galeria',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="2" width="16" height="16" rx="2" />
          <circle cx="7" cy="7" r="2" />
          <path d="M18 12l-4-4-6 6" />
        </svg>
      ),
      active: false,
      onClick: () => {
        if (user) {
          navigate(paths.gallery);
        } else {
          navigate(paths.register);
        }
      },
    },
    {
      id: 'profile',
      label: 'Perfil',
      icon: <HiUser size={20} />,
      active: activeSection === 'profile',
      onClick: () => {
        if (user) {
          setActiveSection('profile');
          navigate(paths.profile);
        } else {
          navigate(paths.login);
        }
      },
    },
    {
      id: 'pricing',
      label: 'Planos',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="14" height="14" rx="2" />
          <path d="M7 10h6M10 7v6" />
        </svg>
      ),
      active: activeSection === 'pricing',
      onClick: () => {
        setActiveSection('pricing');
        const element = document.querySelector('.home__pricing');
        element?.scrollIntoView({ behavior: 'smooth' });
      },
    },
  ];

  // Logo para o header
  const logo = (
    <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
      <rect width="48" height="48" rx="12" fill="url(#logoGradientHeader)"/>
      <path d="M24 12L32 20H28V28H20V20H16L24 12Z" fill="white"/>
      <path d="M12 28V36H36V28" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      <defs>
        <linearGradient id="logoGradientHeader" x1="0" y1="0" x2="48" y2="48">
          <stop offset="0%" stopColor="#646cff"/>
          <stop offset="100%" stopColor="#535bf2"/>
        </linearGradient>
      </defs>
    </svg>
  );

  return (
    <div className="home">
      <div className="home__background"></div>

      {/* Sidebar */}
      <Sidebar
        items={sidebarItems}
        isCollapsed={sidebarCollapsed}
      />

      {/* Header */}
      <Header
        title="RR Silva Arts"
        logo={logo}
        showUserMenu={true}
        onMenuClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        isSidebarOpen={!sidebarCollapsed}
      />

      {/* Main Content */}
      <main className={`home__main ${sidebarCollapsed ? 'home__main--sidebar-collapsed' : ''}`}>
        {/* Hero Section */}
        <section className="home__hero">
          <div className="home__hero-content">
            <div className="home__hero-badge">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="2"/>
                <circle cx="8" cy="8" r="3" fill="currentColor"/>
              </svg>
              <span>Nova coleção disponível</span>
            </div>
            <h1 className="home__hero-title">
              Artes Profissionais <br />
              <span className="home__hero-title-gradient">Prontas para Você</span>
            </h1>
            <p className="home__hero-subtitle">
              Acesse milhares de artes profissionais, personalize no navegador e baixe para uso comercial. 
              Assinatura mensal com downloads ilimitados.
            </p>
            <div className="home__hero-actions">
              <Link to={user ? paths.dashboard : paths.register}>
                <Button variant="primary" size="lg">
                  {user ? 'Ir para Dashboard' : 'Começar Agora'}
                </Button>
              </Link>
              <a href="#pricing">
                <Button variant="outline" size="lg">
                  Ver Planos
                </Button>
              </a>
            </div>

            <div className="home__hero-stats">
              <div className="home__stat">
                <span className="home__stat-value">5.000+</span>
                <span className="home__stat-label">Artes Disponíveis</span>
              </div>
              <div className="home__stat">
                <span className="home__stat-value">1.200+</span>
                <span className="home__stat-label">Clientes Ativos</span>
              </div>
              <div className="home__stat">
                <span className="home__stat-value">∞</span>
                <span className="home__stat-label">Downloads</span>
              </div>
            </div>
          </div>
        </section>

        {/* Gallery Preview */}
        <section className="home__gallery">
          <div className="home__section-header">
            <h2 className="home__section-title">Artes em Destaque</h2>
            <p className="home__section-subtitle">
              Explore nossa coleção premium de artes profissionais
            </p>
          </div>

          <div className="home__gallery-grid">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="home__gallery-item">
                <div className="home__gallery-item-image">
                  <div className="home__gallery-item-placeholder">
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                      <rect width="48" height="48" rx="8" fill="rgba(100, 108, 255, 0.2)"/>
                      <path d="M14 34L20 28L26 34L34 26V34H14Z" fill="rgba(100, 108, 255, 0.3)"/>
                      <circle cx="19" cy="17" r="3" fill="rgba(100, 108, 255, 0.4)"/>
                    </svg>
                  </div>
                </div>
                <div className="home__gallery-item-info">
                  <h3 className="home__gallery-item-title">Arte #{item}</h3>
                  <span className="home__gallery-item-category">Digital Art</span>
                </div>
              </div>
            ))}
          </div>

          <div className="home__gallery-cta">
            <Link to={user ? paths.dashboard : paths.register}>
              <Button variant="primary" size="lg">
                {user ? 'Acessar Galeria' : 'Ver Toda Galeria'}
              </Button>
            </Link>
          </div>
        </section>

        {/* Features */}
        <section className="home__features">
          <div className="home__section-header">
            <h2 className="home__section-title">Por que escolher RR Silva Arts?</h2>
            <p className="home__section-subtitle">
              Tudo que você precisa em uma única plataforma
            </p>
          </div>

          <div className="home__features-grid">
            <div className="home__feature-card">
              <div className="home__feature-icon">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M16 4L20.09 11.26L28 12.27L22 18.14L23.18 26.02L16 22.77L8.82 26.02L10 18.14L4 12.27L11.91 11.26L16 4Z" fill="currentColor"/>
                </svg>
              </div>
              <h3 className="home__feature-title">Galeria Premium</h3>
              <p className="home__feature-description">
                Acesso ilimitado a milhares de artes profissionais de alta qualidade prontas para uso comercial.
              </p>
            </div>

            <div className="home__feature-card">
              <div className="home__feature-icon">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <rect x="4" y="8" width="24" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M8 8V6C8 4.89543 8.89543 4 10 4H22C23.1046 4 24 4.89543 24 6V8" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="16" cy="17" r="3" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <h3 className="home__feature-title">Editor Visual</h3>
              <p className="home__feature-description">
                Personalize artes diretamente no navegador de forma simples e intuitiva. Sem software adicional.
              </p>
            </div>

            <div className="home__feature-card">
              <div className="home__feature-icon">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M16 6V16L22 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="16" cy="16" r="11" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <h3 className="home__feature-title">Downloads Ilimitados</h3>
              <p className="home__feature-description">
                Baixe quantas artes precisar durante sua assinatura. Sem limites, sem restrições.
              </p>
            </div>

            <div className="home__feature-card">
              <div className="home__feature-icon">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M16 2L4 8V16C4 22.6 9.4 28.8 16 30C22.6 28.8 28 22.6 28 16V8L16 2Z" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 16L14 18L20 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="home__feature-title">Uso Comercial</h3>
              <p className="home__feature-description">
                Todas as artes incluem licença para uso comercial. Use em seus projetos com segurança.
              </p>
            </div>

            <div className="home__feature-card">
              <div className="home__feature-icon">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M6 16L12 22L26 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="home__feature-title">Qualidade Garantida</h3>
              <p className="home__feature-description">
                Todas as artes são criadas por profissionais e revisadas pela nossa equipe de qualidade.
              </p>
            </div>

            <div className="home__feature-card">
              <div className="home__feature-icon">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="10" r="4" stroke="currentColor" strokeWidth="2"/>
                  <path d="M6 28C6 22.4772 10.4772 18 16 18C21.5228 18 26 22.4772 26 28" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 className="home__feature-title">Suporte Dedicado</h3>
              <p className="home__feature-description">
                Equipe de suporte disponível para ajudar você em qualquer momento que precisar.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="home__pricing" id="pricing">
          <div className="home__section-header">
            <h2 className="home__section-title">Planos e Preços</h2>
            <p className="home__section-subtitle">
              Escolha o plano ideal para suas necessidades
            </p>
          </div>

          <div className="home__pricing-grid">
            <div className="home__pricing-card">
              <div className="home__pricing-header">
                <h3 className="home__pricing-title">Mensal</h3>
                <div className="home__pricing-price">
                  <span className="home__pricing-currency">R$</span>
                  <span className="home__pricing-value">99</span>
                  <span className="home__pricing-period">/mês</span>
                </div>
              </div>
              <ul className="home__pricing-features">
                <li>✓ Acesso a toda galeria</li>
                <li>✓ Downloads ilimitados</li>
                <li>✓ Editor visual</li>
                <li>✓ Uso comercial</li>
                <li>✓ Suporte por email</li>
              </ul>
              <Link to={user ? paths.dashboard : paths.register}>
                <Button variant="outline" size="lg" fullWidth>
                  {user ? 'Gerenciar Plano' : 'Começar Agora'}
                </Button>
              </Link>
            </div>

            <div className="home__pricing-card home__pricing-card--featured">
              <div className="home__pricing-badge">Mais Popular</div>
              <div className="home__pricing-header">
                <h3 className="home__pricing-title">Anual</h3>
                <div className="home__pricing-price">
                  <span className="home__pricing-currency">R$</span>
                  <span className="home__pricing-value">79</span>
                  <span className="home__pricing-period">/mês</span>
                </div>
                <span className="home__pricing-discount">Economize 20%</span>
              </div>
              <ul className="home__pricing-features">
                <li>✓ Tudo do plano Mensal</li>
                <li>✓ Artes exclusivas</li>
                <li>✓ Acesso antecipado</li>
                <li>✓ Suporte prioritário</li>
                <li>✓ Recursos beta</li>
              </ul>
              <Link to={user ? paths.dashboard : paths.register}>
                <Button variant="primary" size="lg" fullWidth>
                  {user ? 'Gerenciar Plano' : 'Assinar Agora'}
                </Button>
              </Link>
            </div>

            <div className="home__pricing-card">
              <div className="home__pricing-header">
                <h3 className="home__pricing-title">Empresarial</h3>
                <div className="home__pricing-price">
                  <span className="home__pricing-value">Personalizado</span>
                </div>
              </div>
              <ul className="home__pricing-features">
                <li>✓ Tudo do plano Anual</li>
                <li>✓ Múltiplos usuários</li>
                <li>✓ API personalizada</li>
                <li>✓ Gerente de conta</li>
                <li>✓ SLA garantido</li>
              </ul>
              <Button variant="secondary" size="lg" fullWidth>
                Falar com Vendas
              </Button>
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="home__cta">
          <div className="home__cta-content">
            <h2 className="home__cta-title">Pronto para começar?</h2>
            <p className="home__cta-subtitle">
              Junte-se a milhares de profissionais que já usam RR Silva Arts
            </p>
            <div className="home__cta-actions">
              <Link to={user ? paths.dashboard : paths.register}>
                <Button variant="primary" size="lg">
                  {user ? 'Acessar Dashboard' : 'Criar Conta Grátis'}
                </Button>
              </Link>
              {!user && (
                <Link to={paths.login}>
                  <Button variant="ghost" size="lg">
                    Já tenho conta
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="home__footer">
          <div className="home__footer-content">
            <div className="home__footer-brand">
              <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
                <rect width="48" height="48" rx="12" fill="url(#logoGradientFooter)"/>
                <path d="M24 12L32 20H28V28H20V20H16L24 12Z" fill="white"/>
                <path d="M12 28V36H36V28" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                <defs>
                  <linearGradient id="logoGradientFooter" x1="0" y1="0" x2="48" y2="48">
                    <stop offset="0%" stopColor="#646cff"/>
                    <stop offset="100%" stopColor="#535bf2"/>
                  </linearGradient>
                </defs>
              </svg>
              <span className="home__footer-brand-text">RR Silva Arts</span>
            </div>
            <p className="home__footer-copyright">
              © 2025 RR Silva Arts. Todos os direitos reservados.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Home;
