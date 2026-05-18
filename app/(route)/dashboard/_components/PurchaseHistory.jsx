import axios from "axios"
import { useEffect, useState } from "react";
import DisplayProductList from '../../../../app/_components/DisplayProductList';


function PurchaseHistory(){

    const [productList,setProductList]=useState([]);
    
    useEffect(()=>{
        getPurchaseHistory();
    },[])
    const getPurchaseHistory=async()=>{
        const result=await axios.get('/api/order');
        setProductList(result.data);
    }

    return(
        <div>
            <h2 className="font-bold text-3xl mt-5">Purchase History</h2>

            <DisplayProductList productList={productList}
                purchase={true}
                 />
        </div>
    )
}

export default PurchaseHistory