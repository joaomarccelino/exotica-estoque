import { Button, Container, Nav, Navbar, Offcanvas } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/AuthContext';
import styles from './styles.module.css';

const viewsConfig = [
  {
    name: 'Procurar items',
    route: '/'
  },
  {
    name: 'Transações',
    route: '/transacoes'
  }
];



const Header = () => {
  const { handleLogout } = useAuth();

  function logout () {
    handleLogout();
    alert("Voce saiu!");
  }

  const renderRoutesLink = () => {
    return viewsConfig?.map((link) => (
      <Nav.Item key={link.name}>
        <Link className="nav-link" to={link.route}>
          {link.name}
        </Link>
      </Nav.Item>
    ));
  };
  return (
    <>
      <Navbar bg="dark" variant="dark" expand={false} className="mb-3">
        <Container>
          <Navbar.Brand>
            <Link to="/">
              <h1 className={styles.title}>E<span>x</span>ótica</h1>
            </Link>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls={`offcanvasNavbar-expand`} bsPrefix="" />
          <Navbar.Offcanvas
            id={`offcanvasNavbar-expand`}
            aria-labelledby={`offcanvasNavbarLabel-expand`}
            placement="end"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title>Menu</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="justify-content-end flex-grow-1 pe-3">
                {renderRoutesLink()}
                <Button onClick={logout} variant="danger">Sair</Button>
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    </>
  )
}

export default Header;