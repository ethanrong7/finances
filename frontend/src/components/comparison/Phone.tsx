import React, { useEffect, useState } from "react";
import { Box, Heading } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import request from "../../util/api";
import SortedTable from "../ui/SortedTable";
import { useLocation } from "react-router-dom";
import Constants from "@/constants";
import ProductOverview from "./ProductOverview";

export interface ExpenseItem {
  id: string;
  category: string;
  amount: number;
  frequency: number;
}

const Internet: React.FC = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const pageNumber = parseInt(params.get("pageNumber") || "1", 10);
  const pageSize = 5;

  const telephoneFinances = useSelector((state: RootState) =>
    state.global.financials.expenses.find(
      (item: ExpenseItem) => item.category === "Telephone"
    )
  );

  const [phoneData, setPhoneData] = useState([]);
  const [phoneDataLength, setPhoneDataLength] = useState(0);

  // Fetch phone data from backend
  useEffect(() => {
    request(
      `${
        import.meta.env.VITE_BACKEND_URL
      }/financials/phone?page=${pageNumber}&pageSize=${pageSize}`,
      "GET"
    ).then((res: any) => {
      setPhoneData(res.data.productData);
      setPhoneDataLength(res.data.productDataLength);
      console.log(phoneData);
    });
  }, [pageNumber]);

  return (
    <Box display="flex" p={7} flexDirection="row" width="100%">
      <Box display="flex" p={7} flexDirection="column">
        <Heading as="h5" size="lg">
          Overview
        </Heading>
          <ProductOverview productData = {telephoneFinances} />
      </Box>
      <Box display="flex" p={7} flexDirection="column" flex="1">
        <Heading as="h5" size="lg">
          Available plans
        </Heading>
        <Box bg="white" p={4} borderRadius="md" mt={4} border="1px solid #ccc">
          <SortedTable
            tableData={phoneData}
            tablePgSize={pageSize}
            tableDataLength={phoneDataLength}
            tableType={Constants.TABLE_TYPE.PHONE}
            tableHeaders={Constants.PHONE_TABLE_HEADERS}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Internet;
