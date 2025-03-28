import { useState, useEffect } from 'react';
import './Header.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store';
import { handleLogout, useFio } from '../../slices/userSlice';
import User from '../User/User';


const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const firstName = useAppSelector((state) => state.user.first_name);
  const lastName = useAppSelector((state) => state.user.last_name);
  
  // Создаем fio (полное имя) из first_name и last_name
  const fio = firstName && lastName ? `${firstName} ${lastName}` : '';
  // Функция для переключения состояния меню
  const toggleMenu = () => {
    setIsMenuOpen(prevState => !prevState);
  };

  // Функция для закрытия меню
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.user.is_authenticated);
  const isStaff= useAppSelector((state) => state.user.is_staff);
  const username = useAppSelector((state) => state.user.username);
  const navigate = useNavigate();

  const logout = async (e: React.MouseEvent) => {
    e.preventDefault();
    await dispatch(handleLogout());
    navigate('/');
  };

  useEffect(() => {
    const body = document.body;
    const burger = document.querySelector('.header__burger');
    const menu = document.querySelector('.header__menu');

    if (isMenuOpen) {
      body.classList.add('lock');
      burger?.classList.add('active');
      menu?.classList.add('active');
    } else {
      body.classList.remove('lock');
      burger?.classList.remove('active');
      menu?.classList.remove('active');
    }
  }, [isMenuOpen]);
  console.log('fio', fio)

  return (
    <header className="header">
      <div className="header__container _container">
        <Link to="/" className="header__logo">flexwork</Link>

        <div className="user-info-container">
        {isAuthenticated ? (
         <div className="user-info-container">
           <div className="user-info">
            <span>{fio}</span> 
          </div>
          <Link to="/profile" className="menu__link menu__link_active">
            <User/>
          </Link>
         </div>

        ) : null}

        {/* Бургер-меню для мобильных экранов */}
        <div className="header__burger" onClick={toggleMenu}>
          <span></span>
        </div>
        </div>

        <nav className={`header__menu menu ${isMenuOpen ? 'active' : ''}`}>
          <ul
            className="menu__list"
            onClick={(e) => {
              const target = e.target as HTMLElement;
              if (target.classList.contains('menu__link')) {
                closeMenu();
              }
            }}
          >
            {isStaff && (
            <li className="menu__item">
              <Link to="/edit-activities" className="menu__link menu__link_active">
                Все Деятельности
              </Link>
            </li>)}

                <li className="menu__item">
               <Link to="/activities" className="menu__link menu__link_active">
                 Деятельности
               </Link>
             </li>

            

            {/* Дополнительные ссылки */}
            {isAuthenticated ? (
              <>
              <li className="menu__item">
              <Link to="/self-employed" className="menu__link menu__link_active">
                Самозанятые
              </Link>
            </li>
                <li className="menu__item">
                  <Link
                    to="#"
                    onClick={logout}
                    className="menu__link menu__link_active"
                  >
                    Выйти
                  </Link>
                </li>
              </>
            ) : (
              <li className="menu__item">
                <Link
                  to="/login"
                  className="menu__link menu__link_active"
                >
                  Войти
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
