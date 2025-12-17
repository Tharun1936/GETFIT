import React, { useState } from "react";
import styled from "styled-components";
import { Link, NavLink } from "react-router-dom";
import LogoImage from "../utils/Images/logo.png";
import { MenuRounded } from "@mui/icons-material";
import Avatar from "@mui/material/Avatar";
import { useDispatch } from "react-redux";
import { logout } from "../redux/reducers/userSlice";

// NEW: wrapper that is sticky
const NavWrapper = styled.div`
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: ${({ theme }) => theme.bg};
  border-bottom: 1px solid ${({ theme }) => theme.text_secondary + 20};
`;

// only the top bar now, no sticky / no fixed height issues
const Nav = styled.div`
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  color: white;
`;

const NavContainer = styled.div`
  width: 100%;
  max-width: 1400px;
  padding: 0 24px;
  display: flex;
  gap: 14px;
  align-items: center;
  justify-content: space-between;
  font-size: 1rem;
`;

const NavLogo = styled(Link)`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 6px;
  font-weight: 600;
  font-size: 18px;
  text-decoration: none;
  color: ${({ theme }) => theme.black};
`;

const Logo = styled.img`
  height: 42px;
  width: auto;
  display: block;
  object-fit: contain;
`;

const Mobileicon = styled.div`
  color: ${({ theme }) => theme.text_primary};
  display: none;

  @media screen and (max-width: 768px) {
    display: flex;
    align-items: center;
    cursor: pointer;
  }
`;

const NavItems = styled.ul`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 32px;
  padding: 0 6px;
  list-style: none;

  @media screen and (max-width: 768px) {
    display: none;
  }
`;

const Navlink = styled(NavLink)`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.text_primary};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.text_primary};
  }

  &.active {
    color: ${({ theme }) => theme.primary};
    border-bottom: 1.8px solid ${({ theme }) => theme.primary};
  }
`;

const UserContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  gap: 16px;
  align-items: center;
  padding: 0 6px;
  color: ${({ theme }) => theme.primary};
`;

const TextButton = styled.div`
  text-align: end;
  color: ${({ theme }) => theme.secondary};
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s ease;
  font-weight: 600;

  &:hover {
    color: ${({ theme }) => theme.text_primary};
  }
`;

// FIXED: no absolute, no transform; this is in normal layout
const MobileMenu = styled.ul`
  display: none;

  @media screen and (max-width: 768px) {
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
    list-style: none;
    padding: 12px 24px 16px 24px;
    display: ${({ $isOpen }) => ($isOpen ? "flex" : "none")};
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    background: ${({ theme }) => theme.card_light + 90};
    border-radius: 0 0 20px 20px;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
  }
`;

const Navbar = ({ currentUser }) => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <NavWrapper>
      <Nav>
        <NavContainer>
          <Mobileicon onClick={() => setIsOpen((prev) => !prev)}>
            <MenuRounded sx={{ color: "inherit" }} />
          </Mobileicon>

          <NavLogo to="/">
            <Logo src={LogoImage} alt="logo" />
            GETFIT
          </NavLogo>

          <NavItems>
            <Navlink to="/">Dashboard</Navlink>
            <Navlink to="/workouts">Workouts</Navlink>
            <Navlink to="/tutorials">Tutorilas</Navlink>
            <Navlink to="/blogs">Blogs</Navlink>
            <Navlink to="/contact">Contact</Navlink>
          </NavItems>

          <UserContainer>
            <Avatar src={currentUser?.img}>
              {currentUser?.name?.[0] ?? ""}
            </Avatar>
            <TextButton onClick={() => dispatch(logout())}>Logout</TextButton>
          </UserContainer>
        </NavContainer>
      </Nav>

      {/* this renders BELOW the bar and pushes the page content down */}
      <MobileMenu $isOpen={isOpen}>
        <Navlink to="/" onClick={() => setIsOpen(false)}>
          Dashboard
        </Navlink>
        <Navlink to="/workouts" onClick={() => setIsOpen(false)}>
          Workouts
        </Navlink>
        <Navlink to="/tutorials" onClick={() => setIsOpen(false)}>
          Tutorilas
        </Navlink>
        <Navlink to="/blogs" onClick={() => setIsOpen(false)}>
          Blogs
        </Navlink>
        <Navlink to="/contact" onClick={() => setIsOpen(false)}>
          Contact
        </Navlink>
      </MobileMenu>
    </NavWrapper>
  );
};

export default Navbar;
