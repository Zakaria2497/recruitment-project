/**
 * Dashboard page
 */
import styled from 'styled-components';
import { Card, Button } from '../components/ui';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const DashboardContainer = styled.div`
  min-height: 100vh;
  padding: ${({ theme }) => theme.spacing.xl};
  background-color: ${({ theme }) => theme.colors.bgSecondary};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSize['3xl']};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const Content = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
`;

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <DashboardContainer>
      <Header>
        <Title>Dashboard</Title>
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </Header>
      
      <Content>
        <Card>
          <h2>Welcome, {user?.email || user?.phone || 'User'}!</h2>
          <p>Your profile management dashboard.</p>
          <Button 
            fullWidth 
            onClick={() => navigate('/profile')}
            style={{ marginTop: '1rem' }}
          >
            Go to Profile
          </Button>
        </Card>
      </Content>
    </DashboardContainer>
  );
};

export default Dashboard;

