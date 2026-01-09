import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  HiColorSwatch, 
  HiDesktopComputer, 
  HiPencilAlt, 
  HiRefresh, 
  HiUser 
} from 'react-icons/hi';
import { paths } from '../../routes/paths';
import { Button } from '../../components/ui/Button';
import { Header } from '../../components/layout/Header';
import { Sidebar, type SidebarItem } from '../../components/layout/Sidebar';
import './Gallery.css';

interface ArtItem {
  id: string;
  title: string;
  category: string;
  imageUrl?: string;
  downloads: number;
  likes: number;
  premium: boolean;
}

const Gallery = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Mock data - Futuramente virá do backend
  const mockArts: ArtItem[] = Array.from({ length: 24 }, (_, i) => ({
    id: `art-${i + 1}`,
    title: `Arte Profissional ${i + 1}`,
    category: ['digital', 'illustration', 'abstract', 'portrait'][i % 4],
    downloads: Math.floor(Math.random() * 1000),
    likes: Math.floor(Math.random() * 500),
    premium: i % 3 === 0,
  }));

  const categories = [
    { id: 'all', label: 'Todas', icon: <HiColorSwatch /> },
    { id: 'digital', label: 'Digital Art', icon: <HiDesktopComputer /> },
    { id: 'illustration', label: 'Ilustração', icon: <HiPencilAlt /> },
    { id: 'abstract', label: 'Abstrato', icon: <HiRefresh /> },
    { id: 'portrait', label: 'Retrato', icon: <HiUser /> },
  ];

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
      active: false,
      onClick: () => navigate(paths.home),
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
      active: true,
      onClick: () => navigate(paths.gallery),
    },
    {
      id: 'profile',
      label: 'Perfil',
      icon: <HiUser size={20} />,
      active: false,
      onClick: () => navigate(paths.profile),
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
      active: false,
      onClick: () => navigate(paths.home),
    },
  ];

  const logo = (
    <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
      <rect width="48" height="48" rx="12" fill="url(#logoGradientGallery)"/>
      <path d="M24 12L32 20H28V28H20V20H16L24 12Z" fill="white"/>
      <path d="M12 28V36H36V28" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      <defs>
        <linearGradient id="logoGradientGallery" x1="0" y1="0" x2="48" y2="48">
          <stop offset="0%" stopColor="#646cff"/>
          <stop offset="100%" stopColor="#535bf2"/>
        </linearGradient>
      </defs>
    </svg>
  );

  const filteredArts = mockArts.filter((art) => {
    const matchesCategory = selectedCategory === 'all' || art.category === selectedCategory;
    const matchesSearch = art.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleDownload = (artId: string) => {
    // Implementar lógica de download
    console.log('Downloading art:', artId);
    alert('Download iniciado! (Funcionalidade a ser implementada)');
  };

  const handleEdit = (artId: string) => {
    // Implementar navegação para editor
    console.log('Editing art:', artId);
    alert('Abrindo editor... (Funcionalidade a ser implementada)');
  };

  const handleLike = (artId: string) => {
    // Implementar lógica de curtir
    console.log('Liking art:', artId);
  };

  return (
    <div className="gallery-page">
      <div className="gallery-page__background"></div>

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
      <main className={`gallery-page__main ${sidebarCollapsed ? 'gallery-page__main--sidebar-collapsed' : ''}`}>
        <div className="gallery-page__container">
          {/* Header Section */}
          <div className="gallery-header">
            <div className="gallery-header__content">
              <h1 className="gallery-header__title">Galeria de Artes</h1>
              <p className="gallery-header__subtitle">
                Explore nossa coleção premium de artes profissionais prontas para uso comercial
              </p>
            </div>
            <div className="gallery-header__stats">
              <div className="gallery-stat">
                <span className="gallery-stat__value">{mockArts.length}</span>
                <span className="gallery-stat__label">Artes</span>
              </div>
              <div className="gallery-stat">
                <span className="gallery-stat__value">∞</span>
                <span className="gallery-stat__label">Downloads</span>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="gallery-controls">
            <div className="gallery-search">
              <svg className="gallery-search__icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="2"/>
                <path d="M14 14L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <input
                type="text"
                placeholder="Buscar artes..."
                className="gallery-search__input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="gallery-view-toggle">
              <button
                className={`gallery-view-button ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Visualização em grade"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <rect x="2" y="2" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
                  <rect x="11" y="2" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
                  <rect x="2" y="11" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
                  <rect x="11" y="11" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </button>
              <button
                className={`gallery-view-button ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                title="Visualização em lista"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M2 5H18M2 10H18M2 15H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Categories */}
          <div className="gallery-categories">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`gallery-category ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <span className="gallery-category__icon">{category.icon}</span>
                <span className="gallery-category__label">{category.label}</span>
              </button>
            ))}
          </div>

          {/* Gallery Grid */}
          <div className={`gallery-grid ${viewMode === 'list' ? 'gallery-grid--list' : ''}`}>
            {filteredArts.map((art) => (
              <div key={art.id} className="gallery-art-card">
                {art.premium && (
                  <div className="gallery-art-card__badge">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 2L10.09 6.26L15 7.27L11 11.14L12.18 16.02L8 13.77L3.82 16.02L5 11.14L1 7.27L5.91 6.26L8 2Z" fill="currentColor"/>
                    </svg>
                    Premium
                  </div>
                )}
                
                <div className="gallery-art-card__image">
                  <div className="gallery-art-card__placeholder">
                    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                      <rect width="64" height="64" rx="12" fill="rgba(100, 108, 255, 0.2)"/>
                      <path d="M16 48L24 40L32 48L48 32V48H16Z" fill="rgba(100, 108, 255, 0.3)"/>
                      <circle cx="24" cy="20" r="4" fill="rgba(100, 108, 255, 0.4)"/>
                    </svg>
                  </div>
                  
                  <div className="gallery-art-card__overlay">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleEdit(art.id)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(art.id)}
                    >
                      Baixar
                    </Button>
                  </div>
                </div>

                <div className="gallery-art-card__content">
                  <h3 className="gallery-art-card__title">{art.title}</h3>
                  <span className="gallery-art-card__category">{art.category}</span>
                  
                  <div className="gallery-art-card__footer">
                    <button
                      className="gallery-art-card__action"
                      onClick={() => handleLike(art.id)}
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M8 14L7.18 13.29C3.6 10.09 1.5 8.22 1.5 5.95C1.5 4.08 3 2.5 4.8 2.5C5.9 2.5 7 3.04 8 3.93C9 3.04 10.1 2.5 11.2 2.5C13 2.5 14.5 4.08 14.5 5.95C14.5 8.22 12.4 10.09 8.82 13.29L8 14Z" stroke="currentColor" strokeWidth="1.5"/>
                      </svg>
                      {art.likes}
                    </button>
                    <button className="gallery-art-card__action">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M8 2V14M14 8H2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                      {art.downloads}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More */}
          <div className="gallery-load-more">
            <Button variant="secondary" size="lg">
              Carregar Mais Artes
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Gallery;

