import { useLocation } from "react-router-dom";
import ProductsList from "../Components/ProductsList";
import axios from "axios";

const Catalog = () => {
    const location = useLocation();
    var {userToken, from} = location.state || {};
    console.log(from);

    const getProducts = async () => {
      console.log("In get products");
      try {
        const response = await axios(
        `http://localhost:9080/api/products/getCustomerProducts`,
        {
            method: "GET",
            headers: {
            'Authorization': `Bearer ${userToken}`,
            },
        }
        );
        const products: Product[] = response.data;
        console.log(products)
        return products;
      } catch (error) {
        console.log("Error:", error);
        const products: Product[] = [];
        return products;
      }
    };

    return (
        <ProductsList
            userToken = {userToken}
            isAdmin = {false}
            getProducts = {getProducts}
            addProduct = {function (): void {
                throw new Error("Function not implemented.");
            } }
            removeProduct = {function (): void {
                throw new Error("Function not implemented.");
            } }
            updateProduct = {function (): void {
                throw new Error("Function not implemented.");
            } }            
        />
    );
}

export default Catalog;