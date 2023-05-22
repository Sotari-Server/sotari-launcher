import ButtonSquare from '../Button/ButtonSquare';
import './NavBar.scss';
import { MdOutlineSettings } from 'react-icons/md';
import { AiOutlineUser } from 'react-icons/ai';
import { BiParty } from 'react-icons/bi';
// import home icon
import { BsFillPlayFill } from 'react-icons/bs';
import { NavLink } from 'react-router-dom';
import { useContext } from 'react';
import { userContext } from '../../context/UserContext';
const NavBar = () => {
  const { currentUser } = useContext(userContext);
  return (
    <nav>
      <NavLink to={currentUser ? '/private/profile' : '/sign-in'}>
        <ButtonSquare>
          {currentUser ? (
            currentUser.photoURL ? (
              <img src={currentUser.photoURL} />
            ) : (
              <AiOutlineUser />
            )
          ) : (
            <AiOutlineUser />
          )}
        </ButtonSquare>
      </NavLink>

      <div className="link">
        <NavLink to={'/'}>
          <ButtonSquare>
            <BsFillPlayFill />
            <div className="dot"></div>
          </ButtonSquare>
        </NavLink>
        <NavLink to={'/news'}>
          <ButtonSquare>
            <BiParty />
            <div className="dot"></div>
          </ButtonSquare>
        </NavLink>
      </div>
      <NavLink to={'/settings'}>
        <ButtonSquare>
          <MdOutlineSettings />
          <div className="dot"></div>
        </ButtonSquare>
      </NavLink>
    </nav>
  );
};

export default NavBar;
