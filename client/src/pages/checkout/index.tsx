import { useContext } from "react";
import { useGetProducts } from "../../hooks/useGetProducts";
import { IProduct } from "../../models/interfaces";
import { IShopContext, ShopContext } from "../../context/shop-context";
import { CartItem } from "./cart-item";
import "./style.css";
import { useNavigate } from "react-router-dom";

export const CheckOutPage=() => {
    const {getCartItemCount,getTotalCartAmount,checkout} = useContext<IShopContext>(ShopContext)
    const {products}=useGetProducts()
    const totalAmount=getTotalCartAmount();
    const navigate=useNavigate()
    return (
    <div className="cart">
        <div>
          <h1>Your Cart Items</h1>
        </div>
        <div className="cart">
          {products.map((product : IProduct) => {
            if(getCartItemCount(product._id) !==0){
               return  <CartItem key={product._id} product={product}/>;
            }
            return null;
         })}
        </div>
        {Object.keys(products).length>0 ? (
        <div className="checkout">
          <p>Subtotal: Rs {totalAmount}</p>
          <button onClick={() => navigate("/")}>Continue Shopping</button>
          <button onClick={checkout}>CheckOut</button>
        </div>
      ) : (
        <h1>Your Shopping Cart is Empty</h1>
      )}
    </div>
  );
}