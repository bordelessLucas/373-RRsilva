import { type ReactNode } from 'react';
import './Sidebar.css';

export interface SidebarItem {
  id: string;
  label: string;
  icon?: ReactNode;
  onClick?: () => void;
  href?: string;
  active?: boolean;
  badge?: string | number;
}

export interface SidebarProps {
  items: SidebarItem[];
  isCollapsed?: boolean;
  onToggleCollapse?: (collapsed: boolean) => void;
  header?: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export const Sidebar = ({
  items,
  isCollapsed: controlledCollapsed,
  header,
  footer,
  className = '',
}: SidebarProps) => {
  const isCollapsed = controlledCollapsed ?? false;

  const handleItemClick = (item: SidebarItem) => {
    if (item.onClick) {
      item.onClick();
    }
    if (item.href) {
      window.location.href = item.href;
    }
  };

  return (
    <aside className={`sidebar ${isCollapsed ? 'sidebar--collapsed' : ''} ${className}`}>
      {header && (
        <div className="sidebar__header">
          {header}
        </div>
      )}

      <nav className="sidebar__nav">
        <ul className="sidebar__list">
          {items.map((item) => (
            <li key={item.id} className="sidebar__item">
              <button
                className={`sidebar__link ${item.active ? 'sidebar__link--active' : ''}`}
                onClick={() => handleItemClick(item)}
                title={isCollapsed ? item.label : undefined}
              >
                {item.icon && (
                  <span className="sidebar__icon">{item.icon}</span>
                )}
                {!isCollapsed && (
                  <>
                    <span className="sidebar__label">{item.label}</span>
                    {item.badge !== undefined && (
                      <span className="sidebar__badge">{item.badge}</span>
                    )}
                  </>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {footer && (
        <div className="sidebar__footer">
          {footer}
        </div>
      )}
    </aside>
  );
};

export default Sidebar;

