import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/images/logo-1.png";
import "../styles/models.css"; // Assuming your CSS file for styling
import axios from "axios";

const Header = ({ isUserLogged, onLogout }) => {
  const darkRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();
  const token =
    location.state?.user || JSON.parse(localStorage.getItem("userInfo"));
  const [myuser, setMyuser] = useState({});
  const [isDark, setIsDark] = useState(false);
  const count = 2;
  const [userInfo, setUserInfo] = useState({
    token: JSON.parse(localStorage.getItem("userInfo"))?.token,
    isUserLoggedIn: JSON.parse(localStorage.getItem("userInfo"))
      ?.isUserLoggedIn,
  });
  useEffect(() => {}, [count]);
  const getUserInfo = async () => {
    if (JSON.parse(localStorage.getItem("userInfo")).isUserLoggedIn || token) {
      try {
        const response = await axios
          .get("https://gadetguru.mgheit.com/api/profile", {
            headers: {
              Authorization: `Bearer ${token.token}`,
              Accept: "application/json",
            },
          })
            const result = response.data.data;
            setMyuser(result);
      } catch (error) {
        console.log(error);
      }
    }
  };
  useEffect(() => {
    getUserInfo();
  }, [userInfo]);   
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const handleNavigation = (path, sectionId) => {
    if (location.pathname === path) {
      // Scroll within the current page
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      // Navigate to another page with hash
      navigate(`${path}#${sectionId}`);
    }
  };
  // State to toggle navigation and user menu
  const [showNav, setShowNav] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Toggle nav menu
  const toggleNav = () => {
    setShowNav((prev) => !prev);
    if (showUserMenu) setShowUserMenu(false); // Close user menu if open
  };

  // Toggle user menu
  const toggleUserMenu = () => {
    setShowUserMenu((prev) => !prev);
    if (showNav) setShowNav(false); // Close nav menu if open
  };

  // Close menus when clicking outside
  const closeMenus = (e) => {
    if (
      !e.target.closest(".fa-bars") &&
      !e.target.closest(".fa-user") &&
      !e.target.closest("#navLinks") &&
      !e.target.closest("#userData")
    ) {
      setShowNav(false);
      setShowUserMenu(false);
    }
  };

  // Add event listener to close menus on click outside
  React.useEffect(() => {
    document.addEventListener("click", closeMenus);
    return () => document.removeEventListener("click", closeMenus);
  }, []);
  React.useEffect(() => {
    document.addEventListener("click", closeUserMenus);
    return () => document.removeEventListener("click", closeMenus);
  }, []);

  useEffect(() => {
    // Select all sections and nav links
    const sections = document.querySelectorAll(
      "main  > section:not(:nth-child(4))"
    );
    const navLinks = document.querySelectorAll(".navbar .link a");
    // Function to remove 'active' class from all nav links
    const removeActiveClasses = () => {
      navLinks.forEach((link) => link.classList.remove("active"));
    };

    // Function to add 'active' class to the current nav link
    const addActiveClass = (id) => {
      const activeLink = document.querySelector(
        `.navbar .link a[name="${id}"]`
      );
      if (activeLink) activeLink.classList.add("active");
    };

    // Event listener for scrolling
    const onScroll = () => {
      let currentSection = "";

      // Iterate over each section and check if it is in the viewport
      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        const pageOffset = window.scrollY;

        // Check if section is within the current scroll position
        if (pageOffset >= sectionTop - sectionHeight / 3) {
          currentSection = section.getAttribute("id");
        }
      });

      // Remove previous active classes and set the new one
      removeActiveClasses();
      if (currentSection) {
        addActiveClass(currentSection);
      }
    };

    // Attach the scroll event listener
    window.addEventListener("scroll", onScroll);

    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  });
  const handlelogout = async () => {
    // sending token  to api endpoint
    try {
      const response = await fetch("https://gadetguru.mgheit.com/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token?.token} `,
        },
      });
      console.log(response);

      if (!response.ok) {
        throw new Error("Logout failed.");
      }
      const result = await response.json();
      console.log("Success:", result);

      // set the user login status to false
      setUserInfo({
        token: "",
        isUserLoggedIn: false,
      }); // redirect to login page
      setMyuser({
        ...myuser,
        is_verified: false,
        token: "",
      });
      onLogout();
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    if (userInfo) {
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
    }
  }, [userInfo]);
  const handleUserMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const closeUserMenus = (e) => {
    if (
      !e.target.closest(".fa-user") &&
      !e.target.closest(".fa-circle-user") &&
      !e.target.closest(".user-control")
    ) {
      setIsMenuOpen(false);
    }
  };
  const handleDarkMode = () => {
    if (darkRef.current.checked) {
      setIsDark(true);
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
      setIsDark(false);
    }
  };
  if (myuser?.is_verified || isUserLogged) {
    return (
      <header className="header">
        <div className="container">
          {/* Logo */}
          <div className="logo">
            <img src={logo} alt="logo" className="logo" />
          </div>

          {/* Navbar */}
          <nav className="navbar">
            <ul className={`nav-links ${showNav ? "show" : ""}`} id="navLinks">
              <li className="link">
                <a
                  className="active"
                  onClick={() => handleNavigation("/home", "home-Section")}
                  name="home-Section"
                >
                  Home
                </a>
              </li>
              <li className="link">
                <a
                  onClick={() => handleNavigation("/home", "about-us")}
                  name="about-us"
                >
                  About US
                </a>
              </li>
              <li className="link">
                <a
                  onClick={() => handleNavigation("/home", "ic-id")}
                  name="ic-id"
                >
                  Services
                </a>
              </li>
              <li className="link">
                <a
                  onClick={() => handleNavigation("/home", "contactUS")}
                  name="contactUS"
                >
                  Contact Us
                </a>
              </li>
            </ul>

            {/* Search */}
            <div className="search">
              <a
                onClick={() => handleNavigation("/home", "ic-id")}
                name="ic-id"
              >
                <Link
                  to={{ hash: "#searching" }}
                  style={{
                    padding: "0",
                    border: "none",
                    textDecoration: "none",
                  }}
                >
                  search
                </Link>
                <i className="fa-solid fa-magnifying-glass"></i>
              </a>
              {/* <input type="text" name="search" id="search" placeholder="search" /> */}
            </div>
          </nav>

          {/* User Actions */}
          <div className={`user ${showUserMenu ? "show" : ""}`} id="userData">
            <ul className="user-actions">
              <li className="icon icon-1 sp">
                <span className="count">{count}</span>
                <i className="fa-regular fa-bookmark"></i>
              </li>
              <li className="icon icon-1 dropdown">
                <i className="fa-solid fa-circle-user" onClick={handleUserMenu}></i>
                {/* user control  */}
                <div
                  className={`user-control ${
                    isMenuOpen ? "user-control shown" : "user-control"
                  }`}
                >
                  <div className="username">
                    <div className="icon">
                      <i className="fa-solid fa-circle-user"></i>
                    </div>
                    <div className="user-detailes">
                      <span className="name">
                        {myuser.first_name
                          ? myuser.first_name + " " + myuser.last_name
                          : "username"}
                      </span>
                      <span className="email">{myuser?.email}</span>
                    </div>
                  </div>
                  <ul className="items">
                    <li className="item">
                      <div className="icon-2">
                        <i className="fa-solid fa-user-large"></i>
                      </div>
                      <Link className="uc-link" to="/profile">
                        account
                      </Link>
                    </li>
                    <li className="item">
                      <div className="icon-2">
                        <i className="fa-regular fa-bookmark"></i>
                      </div>
                      <Link className="uc-link" to="/saved">
                        saved ICs
                      </Link>
                    </li>
                    <li className="item">
                      <div className="icon-2">
                        <i className="fa-solid fa-gear"></i>
                      </div>
                      <Link className="uc-link" to="/settings">
                        settings
                      </Link>
                    </li>
                    <li className="item">
                      <div className="icon-2">
                        <i className="fa-regular fa-circle-question"></i>
                      </div>
                      <Link className="uc-link" to="/tersms-and-conditions">
                        help center{" "}
                      </Link>
                    </li>
                  </ul>
                  <div className="dark-mode">
                    <div className="info">
                      <div className="icon-2">
                        <i
                          class={`${
                            isDark ? "fa-solid fa-moon" : "fa-regular fa-sun "
                          }`}
                        ></i>
                      </div>
                      dark mode
                    </div>
                    <label className="switch">
                      <input
                        type="checkbox"
                        ref={darkRef}
                        onChange={handleDarkMode}
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                  <div className="log-out" onClick={handlelogout}>
                    <div className="icon-2">
                      <i className="fa-solid fa-right-from-bracket"></i>
                    </div>
                    log out
                  </div>
                </div>
              </li>
              <span>{myuser?.first_name || "username"}</span>
            </ul>
          </div>

          {/* Icons */}
          <i className="fa fa-user" onClick={toggleUserMenu}></i>
          <i className="fa fa-bars" onClick={toggleNav}></i>
        </div>
      </header>
    );
  } else {
    return (
      <>
        <header className="header">
          <div className="container">
            {/* Logo */}
            <div className="logo">
              <img src={logo} alt="logo" className="logo" />
            </div>

            {/* Navbar */}
            <nav className="navbar">
              <ul
                className={`nav-links ${showNav ? "show" : ""}`}
                id="navLinks"
              >
                <li className="link">
                  <a
                    className="active"
                    onClick={() => handleNavigation("/home", "home-Section")}
                    name="home-Section"
                  >
                    Home
                  </a>
                </li>
                <li className="link">
                  <a
                    onClick={() => handleNavigation("/home", "about-us")}
                    name="about-us"
                  >
                    About US
                  </a>
                </li>
                <li className="link">
                  <a
                    onClick={() => handleNavigation("/home", "ic-id")}
                    name="ic-id"
                  >
                    Services
                  </a>
                </li>
                <li className="link">
                  <a
                    onClick={() => handleNavigation("/home", "contactUS")}
                    name="contactUS"
                  >
                    Contact Us
                  </a>
                </li>
              </ul>

              {/* Search */}
              <div className="search">
                <a
                  onClick={() => handleNavigation("/home", "ic-id")}
                  name="ic-id"
                >
                  <Link
                    to={{ hash: "#searching" }}
                    style={{
                      padding: "0",
                      border: "none",
                      textDecoration: "none",
                    }}
                  >
                    search
                  </Link>
                  <i className="fa-solid fa-magnifying-glass"></i>
                </a>
                {/* <input type="text" name="search" id="search" placeholder="search" /> */}
              </div>
            </nav>

            {/* User Actions */}
            <div className={`user ${showUserMenu ? "show" : ""}`} id="userData">
              <Link to="/login" className="signin" id="signIn">
                Sign In
              </Link>
              <Link to="/register" className="register" id="Reg">
                Sign Up
              </Link>
            </div>

            {/* Icons */}
            <i className="fa fa-user" onClick={toggleUserMenu}></i>
            <i className="fa fa-bars" onClick={toggleNav}></i>
          </div>
        </header>{" "}
      </>
    );
  }
};

export default Header;
