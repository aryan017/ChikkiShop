import { useContext, useEffect,useState } from "react";
import axios from "axios";
import { useGetToken } from "./useGetToken";
import { IProduct } from "../models/interfaces";
import { IShopContext, ShopContext } from "../context/shop-context";


export const useGetProducts=() =>{
    const [products,setProducts]=useState<IProduct[]>([])
    const {headers}=useGetToken();
    const {isAuthenticated}= useContext<IShopContext>(ShopContext)

    const fetchProducts=async () => {
        try {
            const fetchedProducts = await axios.get("http://localhost:3000/product", { headers });
            console.log("Fetched Products:", fetchedProducts.data);  // Log response data
            setProducts(fetchedProducts.data.products);
        } catch (error) {
            alert("ERROR: Something went wrong");
            console.error("Error fetching products:", error);
        }
    }

    useEffect(() => {
        
          fetchProducts();
        
    },[])

    return {products};
}