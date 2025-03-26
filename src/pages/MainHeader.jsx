import React, { useState, useContext } from "react";
import logo from "../assets/images/logo.png";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import LoginModal from "./LoginModal";
import { AuthContext } from "../context/AuthContext";

const MainHeader = () => {
  const [expanded, setExpanded] = useState(false);
  const [loginModalshow, setLoginModalshow] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, isTokenExpired } = useContext(AuthContext);

  const handleScrollToSection = (path, sectionId) => {
    navigate(path);
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        const offset = window.innerWidth <= 768 ? 380 : 100;
        const elementPosition =
          element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    }, 100);
    setExpanded(false);
  };
  const loginmodalpen = () => {
    setLoginModalshow(true);
    setExpanded(false);
  };
  return (
    <>
      {/* sticky="top" */}
      <Navbar
        variant="light"
        bg="white"
        expand="lg"
        sticky="top"
        className="Headermain"
        expanded={expanded}
        style={{
          padding: "0 5rem"
        }}
      >
        <Container fluid>
          <Navbar.Brand as={Link} to="/">
            <div className="tagline-container">
              <img src={logo} alt="Logo" width={"200px"} />
              <p className="tagline-main">A Virya Wildlife Tours Resort</p>
              <p className="tagline-sub">Earthy Nature Stay with Luxe</p>
            </div>
          </Navbar.Brand>
          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            onClick={() => setExpanded(expanded ? false : true)}
          />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto mainmenu">
              <Nav.Link onClick={() => handleScrollToSection("/", "about")}>
                About us
              </Nav.Link>
              <Nav.Link onClick={() => handleScrollToSection("/", "rooms")}>
                Rooms
              </Nav.Link>
              <Nav.Link
                onClick={() => handleScrollToSection("/", "facilities")}
              >
                Facilities
              </Nav.Link>
              <Nav.Link onClick={() => handleScrollToSection("/", "reach")}>
                How to reach?
              </Nav.Link>
              <Nav.Link
                onClick={() => handleScrollToSection("/", "testimonial")}
              >
                Reviews
              </Nav.Link>
              <Nav.Link onClick={() => handleScrollToSection("/", "contact")}>
                Contact
              </Nav.Link>
              <Nav.Link
                onClick={() => handleScrollToSection("/book-your-stay", "")}
                className="menu-btn"
              >
                Book your stay
              </Nav.Link>
              {!isAuthenticated || isTokenExpired() ? (
                <Nav.Link
                  as={Link}
                  onClick={loginmodalpen}
                  className="menu-btn"
                >
                  Login
                </Nav.Link>
              ) : (
                <Nav.Link as={Link} to="/dashboard" className="menu-btn">
                  <i className="bi bi-person-fill  me-1"></i> Profile
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <LoginModal
        setLoginModalshow={setLoginModalshow}
        loginModalshow={loginModalshow}
      />
    </>
  );
};

export default MainHeader;
