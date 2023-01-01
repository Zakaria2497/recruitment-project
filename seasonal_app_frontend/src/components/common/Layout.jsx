/**
 * Layout component - Header with navigation
 */
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { Button } from '../ui';
import { logout } from '../../store/slices/authSlice';

const LayoutContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  background-color: ${({ theme }) => theme.colors.bgPrimary};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const Logo = styled(Link)`
  font-size: ${({ theme }) => theme.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const NavLink = styled(Link)`
  color: ${({ theme }) => theme.colors.textPrimary};
  text-decoration: none;
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  transition: color 0.2s ease;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
  
  ${({ active, theme }) => active && `
    color: ${theme.colors.primary};
  `}
`;

const UserMenu = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-right: ${({ theme }) => theme.spacing.md};
`;

const UserName = styled.span`
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const UserEmail = styled.span`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const Main = styled.main`
  flex: 1;
  width: 100%;
`;

const Layout = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const currentPath = window.location.pathname;

  const handleLogout = () => {
    dispatch(logout());
    setTimeout(() => {
      window.location.href = '/login';
    }, 100);
  };

  return (
    <LayoutContainer>
      <Header>
        <Logo to="/">Seasonal App</Logo>
        <Nav>
          <NavLink to="/" active={currentPath === '/'}>
            Dashboard
          </NavLink>
          <NavLink to="/profile" active={currentPath === '/profile'}>
            Profile
          </NavLink>
        </Nav>
        <UserMenu>
          {user && (
            <UserInfo>
              <UserName>{user.email || user.phone || 'User'}</UserName>
              {user.email && user.phone && (
                <UserEmail>{user.phone}</UserEmail>
              )}
            </UserInfo>
          )}
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </UserMenu>
      </Header>
      <Main>{children}</Main>
    </LayoutContainer>
  );
};

export default Layout;

