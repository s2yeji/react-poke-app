import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth';
import app from '../firebase';

const initialUserData = localStorage.getItem('userData')
  ? JSON.parse(localStorage.getItem('userData'))
  : {};

const NavBar = () => {
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();
  const [show, setShow] = useState(false);
  // console.log(show);
  const [userData, setUserData] = useState(initialUserData);
  const { pathname } = useLocation();
  // console.log(pathname);

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // console.log(user);
      if (!user) {
        navigate('/login');
      } else if (user && pathname === '/login') {
        navigate('/');
      }
    });

    // 컴포넌트가 더 이상 사용되지 않을 때, 어떠한 것을 제거해줄 때 아래에서 해주면 된다.
    return () => {
      unsubscribe();
    };
  }, [pathname]);

  const handleAuth = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        setUserData(result.user);
        localStorage.setItem('userData', JSON.stringify(result.user));
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const listener = () => {
    if (window.scrollY > 50) {
      setShow(true);
    } else {
      setShow(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', listener);

    return () => {
      window.removeEventListener('scroll', listener);
    };
  }, []);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        setUserData({});
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <NavWrapper show={show}>
      <Logo>
        <Image
          alt="Poke logo"
          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png"
          onClick={() => (window.location.href = '/')}
        />
      </Logo>
      {pathname === '/login' ? (
        <Login onClick={handleAuth}>로그인</Login>
      ) : (
        <SignOut>
          <UserImg src={userData.photoURL} alt={userData.displayName} />
          <Dropdown>
            <span onClick={handleLogout}>Sign out</span>
          </Dropdown>
        </SignOut>
      )}
    </NavWrapper>
  );
};

const UserImg = styled.img`
  border-radius: 50%;
  width: 100%;
  height: 100%;
`;

const Dropdown = styled.div`
  position: absolute;
  top: 50px;
  right: 0;
  background: rgba(19, 19, 19);
  border: 1px solid rgba(151, 151, 151, 0.34);
  border-radius: 4px;
  box-shadow: rgba(0 0 0 / 50%) 0px 0px 18px 0px;
  padding: 10px;
  font-size: 14px;
  color: #fff;
  letter-spacing: 0;
  width: 100px;
  opacity: 0;
`;

const SignOut = styled.div`
  position: relative;
  width: 48px;
  height: 48px;
  display: flex;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  letter-spacing: 0;
  &:hover {
    ${Dropdown} {
      opacity: 1;
      transition-duration: 1s;
    }
  }
`;

const Login = styled.a`
  background-color: rgba(0, 0, 0, 0.6);
  padding: 8px 16px;
  text-transform: uppercase;
  letter-spacing: 0;
  font-size: 14px;
  color: #fff;
  border: 1px solid #f9f9f9;
  border-radius: 4px;
  transition: all 0.2s ease 0s;
  cursor: pointer;
  &:hover {
    background-color: #f9f9f9;
    color: #222;
    border-color: transparent;
  }
`;

const Image = styled.img`
  cursor: pointer;
  img {
    width: 100%;
  }
`;

const Logo = styled.a`
  padding: 0;
  width: 50px;
  margin-top: 4px;
`;

const NavWrapper = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 70px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 36px;
  letter-spacing: 16px;
  background-color: ${(props) =>
    props.show ? 'rgba(9, 11, 19, 60%)' : 'transparent'};
  z-index: 100;
`;
export default NavBar;
