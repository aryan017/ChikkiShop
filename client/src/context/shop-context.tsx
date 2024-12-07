import { createContext, useState,useEffect } from "react";
import { IProduct } from "../models/interfaces";
import { useGetProducts } from "../hooks/useGetProducts";
import axios from "axios";
import { useGetToken } from "../hooks/useGetToken";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { ProductErrors } from "../models/errors";

export interface IShopContext{
  addToCart : (itemId : string) => void;
  removeFromCart : (itemId : string) => void;
  updateCartItemCount : (newAmount : number,itemId : string) => void;
  getCartItemCount : (itemId : string) => number;
  getTotalCartAmount : () => number;
  checkout: () => void;
  availableMoney:number;
  purchasedItems:IProduct[];
  isAuthenticated:boolean;
  setIsAuthenticated:(isAuthenticated : boolean) => void;
}


const defaultVal : IShopContext={
    addToCart : () => null,
    removeFromCart : () => null,
    updateCartItemCount : () => null ,
    getCartItemCount : () => 0,
    getTotalCartAmount : () => 0,
    checkout: () => null,
    availableMoney:0,
    purchasedItems:[],
    isAuthenticated:false,
    setIsAuthenticated:() => null,
}
        
    export const ShopContext=createContext<IShopContext>(defaultVal)
    export const ShopContextProvider=(props) => {

    const [cookies,setCookies] =useCookies(["access_token"])
    const [cartItems,setCartItems]=useState<{string : number} | {}>({});
    const [availableMoney,setAvailableMoney] =useState<number>(0);
    const [purchasedItems,setPurchasedItems]=useState<IProduct[]>([]);
    const [isAuthenticated,setIsAuthenticated]=useState<boolean>(cookies.access_token !== null);
    const {headers} =useGetToken();
    const navigate=useNavigate()
    const {products}= useGetProducts()

    const fetchAvailableMoney=async() => {
        try{
        const res=await axios.get(`http://localhost:3000/user/available-money/${localStorage.getItem("userID")}`,
        {headers});

        setAvailableMoney(res.data.availableMoney);
      }catch(error){
        alert("ERROR : Something went wrong.")
      }
    }

    const fetchPurchasedItems=async() => {
        try{
        const res=await axios.get(`http://localhost:3000/product/purchased-items/${localStorage.getItem("userID")}`,
        {headers});

        setPurchasedItems(res.data.purchasedItems);
      }catch(error){
        alert("ERROR : Something went wrong.")
      }
    }

    const getCartItemCount=(itemId: string) : number => {
        if(itemId in cartItems){
            return cartItems[itemId];
        }
        return 0;
    }

    const addToCart=(itemId : string) => {
        if(!cartItems[itemId]){
            setCartItems((prev) => ({...prev,[itemId] : 1 }));
        }else{
            setCartItems((prev) => ({...prev,[itemId] : prev[itemId]+1}));
        }
    }

    const removeFromCart=(itemId : string) => {
       if(!cartItems[itemId]) return;
       if(cartItems[itemId] == 0) return;
       setCartItems((prev) => ({...prev,[itemId] : prev[itemId]-1}));
    }

    const updateCartItemCount=(newAmount : number,itemId : string) => {
        if(newAmount < 0 ) return ;
        setCartItems((prev) => ({...prev,[itemId] : newAmount}))
    }

    const getTotalCartAmount = () => {
      if (products.length === 0) return 0;
  
      let totalAmount = 0;
      for (const item in cartItems) {
        if (cartItems[item] > 0) {
          let itemInfo: IProduct = products.find(
            (product) => product._id === item
          );
  
          totalAmount += cartItems[item] * itemInfo.price;
        }
      }
      return Number(totalAmount.toFixed(2));
    };
  

  /**   useEffect(() => {
      console.log("Products:", products);
      console.log("Cart Items:", cartItems);
  }, [products, cartItems]);
  

  useEffect(() => {
    if (products?.length && Object.keys(cartItems).length) {
        const total = getTotalCartAmount();
        console.log("Calculated Total Amount: ", total);
    }
}, [products, cartItems]); */


    const checkout = async() => {
        const body={customerID: localStorage.getItem("userID"),cartItems}
        try{
          await axios.post("http://localhost:3000/product/checkout",body,{headers})
          setCartItems({});
          fetchAvailableMoney();
          fetchPurchasedItems();
          navigate("/");
        }catch(err){
            let errorMessage: string = "";
            switch (err.response.data.type) {
              case ProductErrors.NO_PRODUCT_FOUND:
                errorMessage = "No product found";
                break;
              case ProductErrors.NO_AVAILABLE_MONEY:
                errorMessage = "Not enough money";
                break;
              case ProductErrors.NOT_ENOUGH_STOCK:
                errorMessage = "Not enough stock";
                break;
              default:
                errorMessage = "Something went wrong";
            }
      
            alert("ERROR: " + errorMessage);
        }
    }

    useEffect(() => {
        if(isAuthenticated){
        fetchAvailableMoney();
        fetchPurchasedItems();
        }
    },[isAuthenticated])

    useEffect(() => {
        if(!isAuthenticated){
            localStorage.clear();
            setCookies("access_token",null);
        }
    },[isAuthenticated])

    const contextValue : IShopContext={
        addToCart,
        removeFromCart,
        updateCartItemCount,
        getCartItemCount,
        getTotalCartAmount,
        checkout,
        availableMoney,
        purchasedItems,
        isAuthenticated,
        setIsAuthenticated,
    }

    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    );

}