import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../lib/firebase';
import { db } from '../../lib/firebase';
import { useAuthContext } from '../../contexts/AuthContext';
import { paths } from '../../routes/paths';
import { Button } from '../../components/ui/Button';
import { Header } from '../../components/layout/Header';
import { Sidebar, type SidebarItem } from '../../components/layout/Sidebar';
import { HiUser } from 'react-icons/hi';
import './Profile.css';

interface UserProfile {
  companyName: string;
  commercialWhatsApp: string;
  personalWhatsApp: string;
  instagram: string;
  facebook: string;
  website: string;
  logoUrl: string;
  plan: 'free' | 'monthly' | 'annual' | 'enterprise';
  planStartDate: string;
  planEndDate: string;
  downloadsUsed: number;
  downloadsLimit: number;
}

const Profile = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [profile, setProfile] = useState<UserProfile>({
    companyName: '',
    commercialWhatsApp: '',
    personalWhatsApp: '',
    instagram: '',
    facebook: '',
    website: '',
    logoUrl: '',
    plan: 'free',
    planStartDate: '',
    planEndDate: '',
    downloadsUsed: 0,
    downloadsLimit: 0,
  });

  // Sidebar items
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
        navigate(paths.home);
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
      active: activeSection === 'gallery',
      onClick: () => {
        setActiveSection('gallery');
        navigate(paths.gallery);
      },
    },
    {
      id: 'profile',
      label: 'Perfil',
      icon: <HiUser size={20} />,
      active: activeSection === 'profile',
      onClick: () => {
        setActiveSection('profile');
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
        navigate(paths.home);
      },
    },
  ];

  const logo = (
    <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
      <rect width="48" height="48" rx="12" fill="url(#logoGradientProfile)"/>
      <path d="M24 12L32 20H28V28H20V20H16L24 12Z" fill="white"/>
      <path d="M12 28V36H36V28" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      <defs>
        <linearGradient id="logoGradientProfile" x1="0" y1="0" x2="48" y2="48">
          <stop offset="0%" stopColor="#646cff"/>
          <stop offset="100%" stopColor="#535bf2"/>
        </linearGradient>
      </defs>
    </svg>
  );

  // Load user profile
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;

      try {
        setIsLoadingProfile(true);
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data() as UserProfile;
          setProfile(data);
          if (data.logoUrl) {
            setLogoPreview(data.logoUrl);
          }
        } else {
          // Set default values for new user
          const defaultProfile: UserProfile = {
            companyName: user.displayName || '',
            commercialWhatsApp: '',
            personalWhatsApp: '',
            instagram: '',
            facebook: '',
            website: '',
            logoUrl: '',
            plan: 'free',
            planStartDate: new Date().toISOString(),
            planEndDate: '',
            downloadsUsed: 0,
            downloadsLimit: 0,
          };
          setProfile(defaultProfile);
        }
      } catch (error) {
        console.error('Erro ao carregar perfil:', error);
        setErrorMessage('Erro ao carregar dados do perfil');
      } finally {
        setIsLoadingProfile(false);
      }
    };

    loadProfile();
  }, [user]);

  // Format WhatsApp number
  const formatWhatsApp = (value: string): string => {
    // Remove all non-numeric characters
    const cleaned = value.replace(/\D/g, '');
    
    // Apply mask: (00) 00000-0000 or (00) 0000-0000
    if (cleaned.length <= 10) {
      return cleaned
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4})(\d)/, '$1-$2');
    } else {
      return cleaned
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .slice(0, 15); // (00) 00000-0000
    }
  };

  // Format Instagram handle
  const formatInstagram = (value: string): string => {
    // Remove @ if exists and add it back
    let cleaned = value.replace('@', '');
    // Keep only alphanumeric, underscore and dots
    cleaned = cleaned.replace(/[^a-zA-Z0-9._]/g, '');
    return cleaned ? `@${cleaned}` : '';
  };

  // Validate URL
  const isValidURL = (url: string): boolean => {
    if (!url) return true; // Empty is valid (optional field)
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Handle logo file selection
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrorMessage('Por favor, selecione uma imagem válida');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage('A imagem deve ter no máximo 5MB');
        return;
      }

      setLogoFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setErrorMessage('');
    }
  };

  // Handle input changes with formatting
  const handleWhatsAppChange = (field: 'commercialWhatsApp' | 'personalWhatsApp', value: string) => {
    const formatted = formatWhatsApp(value);
    setProfile({ ...profile, [field]: formatted });
  };

  const handleInstagramChange = (value: string) => {
    const formatted = formatInstagram(value);
    setProfile({ ...profile, instagram: formatted });
  };

  const handleWebsiteChange = (value: string) => {
    setProfile({ ...profile, website: value });
    // Validate URL on blur, not on every keystroke
  };

  // Upload logo to Firebase Storage
  const uploadLogo = async (): Promise<string> => {
    if (!logoFile || !user) return profile.logoUrl;

    try {
      const storageRef = ref(storage, `logos/${user.uid}/${Date.now()}_${logoFile.name}`);
      await uploadBytes(storageRef, logoFile);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error('Erro ao fazer upload do logo:', error);
      throw new Error('Falha ao fazer upload da imagem');
    }
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    // Validate required fields
    if (!profile.companyName.trim()) {
      setErrorMessage('Nome da empresa é obrigatório');
      return;
    }

    if (!profile.commercialWhatsApp.trim()) {
      setErrorMessage('WhatsApp comercial é obrigatório');
      return;
    }

    // Validate WhatsApp format
    const whatsappRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
    if (!whatsappRegex.test(profile.commercialWhatsApp)) {
      setErrorMessage('WhatsApp comercial inválido. Use o formato: (00) 00000-0000');
      return;
    }

    if (profile.personalWhatsApp && !whatsappRegex.test(profile.personalWhatsApp)) {
      setErrorMessage('WhatsApp pessoal inválido. Use o formato: (00) 00000-0000');
      return;
    }

    // Validate Instagram format
    if (profile.instagram && !profile.instagram.startsWith('@')) {
      setErrorMessage('Instagram deve começar com @');
      return;
    }

    // Validate website URL
    if (profile.website && !isValidURL(profile.website)) {
      setErrorMessage('Website inválido. Use o formato: https://seusite.com.br');
      return;
    }

    // Validate Facebook URL
    if (profile.facebook && profile.facebook.includes('http') && !isValidURL(profile.facebook)) {
      setErrorMessage('URL do Facebook inválida');
      return;
    }

    setIsSaving(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      let logoUrl = profile.logoUrl;

      // Upload logo if changed
      if (logoFile) {
        logoUrl = await uploadLogo();
      }

      const updatedProfile: UserProfile = {
        ...profile,
        logoUrl,
      };

      // Save to Firestore
      const docRef = doc(db, 'users', user.uid);
      await setDoc(docRef, updatedProfile, { merge: true });

      setProfile(updatedProfile);
      setLogoFile(null);
      setSuccessMessage('Perfil atualizado com sucesso!');

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      setErrorMessage('Erro ao salvar perfil. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  // Get plan info
  const getPlanInfo = () => {
    switch (profile.plan) {
      case 'monthly':
        return { name: 'Mensal', price: 'R$ 99/mês', color: '#646cff' };
      case 'annual':
        return { name: 'Anual', price: 'R$ 79/mês', color: '#22c55e' };
      case 'enterprise':
        return { name: 'Empresarial', price: 'Personalizado', color: '#f59e0b' };
      default:
        return { name: 'Gratuito', price: 'R$ 0/mês', color: '#6b7280' };
    }
  };

  const planInfo = getPlanInfo();

  // Calculate days remaining
  const getDaysRemaining = () => {
    if (!profile.planEndDate) return null;
    const endDate = new Date(profile.planEndDate);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const daysRemaining = getDaysRemaining();

  return (
    <div className="profile">
      <div className="profile__background"></div>

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
      <main className={`profile__main ${sidebarCollapsed ? 'profile__main--sidebar-collapsed' : ''}`}>
        {isLoadingProfile ? (
          <div className="profile__loading">
            <div className="profile__spinner"></div>
            <p>Carregando perfil...</p>
          </div>
        ) : (
          <div className="profile__container">
            <div className="profile__content">
              {/* Left Column - Profile Info */}
              <div className="profile__info-card">
                <div className="profile__info-header">
                  <h2>Informações da Conta</h2>
                </div>

                <div className="profile__avatar-section">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo" className="profile__avatar" />
                  ) : (
                    <div className="profile__avatar-placeholder">
                      <HiUser size={48} />
                    </div>
                  )}
                  <div className="profile__user-info">
                    <h3>{profile.companyName || user?.displayName || 'Usuário'}</h3>
                    <p>{user?.email}</p>
                  </div>
                </div>

                <div className="profile__plan-section">
                  <div className="profile__plan-badge" style={{ borderColor: planInfo.color }}>
                    <div className="profile__plan-icon" style={{ background: planInfo.color }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="white"/>
                      </svg>
                    </div>
                    <div className="profile__plan-info">
                      <span className="profile__plan-name">Plano {planInfo.name}</span>
                      <span className="profile__plan-price">{planInfo.price}</span>
                    </div>
                  </div>

                  {daysRemaining !== null && (
                    <div className="profile__plan-details">
                      <div className="profile__detail-item">
                        <span className="profile__detail-label">Dias restantes</span>
                        <span className="profile__detail-value">{daysRemaining} dias</span>
                      </div>
                    </div>
                  )}

                  <div className="profile__downloads-section">
                    <div className="profile__downloads-header">
                      <span>Downloads</span>
                      <span>{profile.downloadsUsed} / {profile.downloadsLimit || '∞'}</span>
                    </div>
                    <div className="profile__downloads-bar">
                      <div 
                        className="profile__downloads-progress"
                        style={{ 
                          width: profile.downloadsLimit 
                            ? `${(profile.downloadsUsed / profile.downloadsLimit) * 100}%` 
                            : '0%' 
                        }}
                      ></div>
                    </div>
                  </div>

                  <Button
                    variant="primary"
                    size="md"
                    fullWidth
                    onClick={() => navigate(paths.home)}
                  >
                    Gerenciar Plano
                  </Button>
                </div>
              </div>

              {/* Right Column - Edit Form */}
              <div className="profile__form-card">
                <div className="profile__form-header">
                  <h2>Editar Perfil</h2>
                  <p>Mantenha suas informações sempre atualizadas</p>
                </div>

                {successMessage && (
                  <div className="profile__message profile__message--success">
                    {successMessage}
                  </div>
                )}

                {errorMessage && (
                  <div className="profile__message profile__message--error">
                    {errorMessage}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="profile__form">
                  {/* Logo Upload */}
                  <div className="profile__form-group">
                    <label className="profile__label">Logotipo da Empresa</label>
                    <div className="profile__logo-upload">
                      {logoPreview && (
                        <div className="profile__logo-preview">
                          <img src={logoPreview} alt="Preview" />
                        </div>
                      )}
                      <div className="profile__upload-input">
                        <input
                          type="file"
                          id="logo"
                          accept="image/*"
                          onChange={handleLogoChange}
                          className="profile__file-input"
                        />
                        <label htmlFor="logo" className="profile__upload-button">
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 17V14M3 14L10 7L13 10L17 6M3 14H6M17 6H14M17 6V9" />
                            <path d="M10 3V17M10 3L7 6M10 3L13 6" />
                          </svg>
                          {logoFile ? 'Trocar imagem' : 'Escolher imagem'}
                        </label>
                        <span className="profile__upload-hint">PNG, JPG até 5MB</span>
                      </div>
                    </div>
                  </div>

                  {/* Company Name */}
                  <div className="profile__form-group">
                    <label htmlFor="companyName" className="profile__label">
                      Nome da Empresa *
                    </label>
                    <input
                      type="text"
                      id="companyName"
                      value={profile.companyName}
                      onChange={(e) => setProfile({ ...profile, companyName: e.target.value })}
                      className="profile__input"
                      required
                    />
                  </div>

                  {/* WhatsApp */}
                  <div className="profile__form-row">
                    <div className="profile__form-group">
                      <label htmlFor="commercialWhatsApp" className="profile__label">
                        WhatsApp Comercial *
                      </label>
                      <input
                        type="tel"
                        id="commercialWhatsApp"
                        value={profile.commercialWhatsApp}
                        onChange={(e) => handleWhatsAppChange('commercialWhatsApp', e.target.value)}
                        className="profile__input"
                        placeholder="(00) 00000-0000"
                        maxLength={15}
                        required
                      />
                    </div>

                    <div className="profile__form-group">
                      <label htmlFor="personalWhatsApp" className="profile__label">
                        WhatsApp Pessoal
                      </label>
                      <input
                        type="tel"
                        id="personalWhatsApp"
                        value={profile.personalWhatsApp}
                        onChange={(e) => handleWhatsAppChange('personalWhatsApp', e.target.value)}
                        className="profile__input"
                        placeholder="(00) 00000-0000"
                        maxLength={15}
                      />
                    </div>
                  </div>

                  {/* Social Media */}
                  <div className="profile__form-row">
                    <div className="profile__form-group">
                      <label htmlFor="instagram" className="profile__label">
                        Instagram
                      </label>
                      <input
                        type="text"
                        id="instagram"
                        value={profile.instagram}
                        onChange={(e) => handleInstagramChange(e.target.value)}
                        className="profile__input"
                        placeholder="@seuinstagram"
                        maxLength={31}
                      />
                    </div>

                    <div className="profile__form-group">
                      <label htmlFor="facebook" className="profile__label">
                        Facebook
                      </label>
                      <input
                        type="text"
                        id="facebook"
                        value={profile.facebook}
                        onChange={(e) => setProfile({ ...profile, facebook: e.target.value })}
                        className="profile__input"
                        placeholder="@seuperfil ou facebook.com/seuperfil"
                      />
                    </div>
                  </div>

                  {/* Website */}
                  <div className="profile__form-group">
                    <label htmlFor="website" className="profile__label">
                      Website
                    </label>
                    <input
                      type="url"
                      id="website"
                      value={profile.website}
                      onChange={(e) => handleWebsiteChange(e.target.value)}
                      className="profile__input"
                      placeholder="https://seusite.com.br"
                      onBlur={(e) => {
                        if (e.target.value && !isValidURL(e.target.value)) {
                          setErrorMessage('URL inválida. Use o formato: https://seusite.com.br');
                        } else {
                          setErrorMessage('');
                        }
                      }}
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="profile__form-actions">
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      fullWidth
                      isLoading={isSaving}
                    >
                      Salvar Alterações
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Profile;

