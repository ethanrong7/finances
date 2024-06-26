import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import ProductOverview from "./ProductOverview";
import { Box, Heading } from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import SortedTable from "../ui/SortedTable/SortedTable";
import request from "@/util/api";
import { useLocation } from "react-router-dom";
import Constants from "@/constants";
import SearchBox from "./SearchBox/SearchBox";
import { searchBoxParams } from "@/reduxFeatures/comparisonSlice";
import TotalExpense from "./TotalExpenseBox/TotalExpense";

/**
 * Component: ProductComparison.tsx
 * Parent: Comparison.tsx
 * Description: This is the container for the Overview, Filter results and Available plans table
 *              for the Comparison Layout. A customer will use this to determine what their current
 *              expenditure is for the specific financial product, and a list of available products
 *              on the market in table form
 * Props:
 *   - ProductType: Obtained from constants folder, can be either gas/mortgage/electricity/phone
 */

type ProductComparisonProps = {
  ProductType: string;
};

const ProductComparison: React.FC<ProductComparisonProps> = ({
  ProductType,
}) => {
  const dispatch = useDispatch();
  const financeInput = useSelector((state: RootState) =>
    state.global.financials.expenses.find(
      (item: { category: string }) => item.category === ProductType
    )
  );

  const isSearching = useSelector((state: RootState) => {
    return state.global.comparison.search.isSearching;
  });

  const searchParams = useSelector((state: RootState) => {
    const comparisonMap = {
      [Constants.TABLE_TYPE.ELECTRICITY]: state.global.comparison.electricity,
      [Constants.TABLE_TYPE.MORTGAGE]: state.global.comparison.mortgage,
      [Constants.TABLE_TYPE.PHONE]: state.global.comparison.phone,
      [Constants.TABLE_TYPE.GAS]: state.global.comparison.gas,
      [Constants.TABLE_TYPE.INTERNET]: state.global.comparison.internet,
    };

    return comparisonMap[ProductType];
  });

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const pageNumber = parseInt(params.get("pageNumber") || "1", 10);
  const pageSize = 10;
  const [tableHeader, setTableHeader] = useState<string[]>([]);

  // Comment out cacheTime and staleTime if testing API's as the data will be cached and lagged
  const { data, isLoading, isError } = useQuery(
    [`financeData${ProductType}`, isSearching],
    () => {
      const params = new URLSearchParams({
        productType: ProductType.toLowerCase(),
        page: pageNumber.toString(),
        pageSize: pageSize.toString(),
        ...(searchParams !== null
          ? { params: JSON.stringify(searchParams) }
          : {}),
      });
      return request(
        `${import.meta.env.VITE_BACKEND_URL}/financials/comparison?${params}`,
        "GET"
      );
    },
    {
      cacheTime: 60000,
      onSettled: () => {
        dispatch(searchBoxParams(false));
      },
    }
  );

  useEffect(() => {
    const tableHeadersMap = {
      [Constants.TABLE_TYPE.MORTGAGE]: Constants.MORTGAGE_TABLE_HEADERS,
      [Constants.TABLE_TYPE.PHONE]: Constants.PHONE_TABLE_HEADERS,
      [Constants.TABLE_TYPE.ELECTRICITY]: Constants.ELECTRICITY_TABLE_HEADERS,
      [Constants.TABLE_TYPE.GAS]: Constants.GAS_TABLE_HEADERS,
      [Constants.TABLE_TYPE.INTERNET]: Constants.INTERNET_TABLE_HEADERS,
    };
    if (tableHeadersMap.hasOwnProperty(ProductType)) {
      setTableHeader(tableHeadersMap[ProductType]);
    }
  }, [ProductType]);

  return (
    <Box display="flex" p={7} flexDirection="row" width="100%">
      <Box display="flex" p={7} flexDirection="column" width="20%">
        <>
          <Heading as="h5" size="lg">
            Overview
          </Heading>
          <ProductOverview productData={financeInput} />
          <SearchBox ProductType={ProductType} />
        </>
      </Box>

      <Box display="flex" p={7} flexDirection="column" width="50%">
        <Heading as="h5" size="lg">
          Available plans
        </Heading>
        <Box bg="white" p={4} borderRadius="md" mt={4} border="1px solid #ccc">
          {isLoading ? (
            <div>Loading...</div>
          ) : isError ? (
            <div>Error</div>
          ) : (
            <SortedTable
              tableData={data?.data?.productData}
              tableType={ProductType}
              tablePgSize={pageSize}
              tableDataLength={data?.data?.productDataLength}
              tableHeaders={tableHeader}
            />
          )}
        </Box>
      </Box>

      <Box
        display="flex"
        p={7}
        flexDirection="column"
        width="30%"
        border="1px solid"
        borderColor="gray.200"
        bg="cyan.50"
        alignSelf="flex-start"
      >
        <TotalExpense />
      </Box>
    </Box>
  );
};

export default ProductComparison;
