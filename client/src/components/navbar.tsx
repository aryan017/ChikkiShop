import React, { useContext } from 'react'
import {Link} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faShoppingCart} from '@fortawesome/free-solid-svg-icons'
import { IShopContext, ShopContext } from '../context/shop-context';
import { useCookies } from 'react-cookie';

export const Navbar=() => {
   const {availableMoney,setIsAuthenticated,isAuthenticated} =useContext<IShopContext>(ShopContext);
   const [_,setCookies] =useCookies(["access_token"])
   const logout=() => {
      setIsAuthenticated(false)
   }
    return (
        <div className='navbar'>
          <div className='navbar-title'>
             <h1>ChikkiShop</h1>
          </div>

          <div className='navbar-links'>
            {isAuthenticated && (
               <>
             <Link to='/'>Shop</Link>
             <Link to='/purchased-items'>Purchases</Link>
             <Link to='/checkout'>
                <FontAwesomeIcon icon={faShoppingCart} />
             </Link>
             <Link to="/auth" onClick={logout}>LogOut</Link>
             <span>Rs{availableMoney}</span>
             </>
            )}
          </div>
        </div>
    )
}