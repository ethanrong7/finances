import React, { useEffect } from "react";
import { Box, Text } from "@chakra-ui/react";

function ProductOverview({productData}) {

    useEffect(() => {
        console.log("Received productData:", productData?.category);
        // You can add other debugging statements here if needed
    }, [productData]); 

     const monthlyBill = ((productData?.amount * productData?.frequency) / 12).toFixed(2);

    return(<Box bg="white" p={4} borderRadius="md" mt={4} border="1px solid #ccc">
        <Text>
        Your current {productData?.category} bill: $
        {monthlyBill}{" "}
        / month
        </Text>
    </Box>);
}

export default ProductOverview;