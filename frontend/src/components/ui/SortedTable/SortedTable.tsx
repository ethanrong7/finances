import React, { useState, useEffect } from "react";
import {
  TableContainer,
  Table,
  TableCaption,
  Thead,
  Tr,
  Tbody,
  Button,
  Text,
  Box,
  Checkbox,
  Flex,
} from "@chakra-ui/react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { isEqual } from "lodash";
import Constants from "@/constants";
import { StyledTd, StyledTr, StyledTh } from "./SortedTable.styles";
import { selectElectricity, selectGas, selectMortgage, selectPhone } from "@/reduxFeatures/comparisonSlice";

interface InternetData {
  company: string;
  information: string;
  stats: string;
  monthlyCost: string;
  CTA: string;
}

interface PhoneData {
  company: string;
  data: any[];
  title: string;
  link: string;
  CTA: string;
}

interface MortgageData {
  company: string;
  information: string;
  comparisonRate: string;
  interestRate: string;
  monthlyRepayment: string;
  CTA: string;
}

interface ElectricityData {
  company: string;
  information: string;
  referencePrice: string;
  estimatedCost: string;
  CTA: string;
}

interface GasData {
  company: string;
  information: string;
  supplyCharge: string;
  usageCharge: string;
  totalCost: string;
  CTA: string;
}

interface SortedTableProps {
  tableData: any;
  tablePgSize: number;
  tableDataLength: number;
  tableType: string;
  tableHeaders: string[];
}

const SortedTable: React.FC<SortedTableProps> = ({
  tableData,
  tablePgSize,
  tableDataLength,
  tableType,
  tableHeaders,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const params = new URLSearchParams(location.search);
  const pageSize = 10;
  const pageNumber = parseInt(params.get("pageNumber") || "1", 10);
  const start = (pageNumber - 1) * pageSize;

  const handleNextClick = () => {
    const params = new URLSearchParams({ pageNumber: String(pageNumber + 1) });
    navigate(`${location.pathname}?${params.toString()}`);
  };

  const handlePreviousClick = () => {
    if (pageNumber > 1) {
      const params = new URLSearchParams({
        pageNumber: String(pageNumber - 1),
      });
      navigate(`${location.pathname}?${params.toString()}`);
    }
  };

  // Initialize state to keep track of checked rows
  const [selectedProduct, setSelectedProduct] = useState<MortgageData | PhoneData | ElectricityData | GasData>();

  useEffect(() => {
    const selectedMortgage = localStorage.getItem("selectedMortgage");
    if (selectedMortgage) {
      const parsedMortgage = JSON.parse(selectedMortgage);
      dispatch(selectMortgage(parsedMortgage));
      setSelectedProduct(parsedMortgage);
    }
  
    const selectedElectricity = localStorage.getItem("selectedElectricity");
    if (selectedElectricity) {
      const parsedElectricity = JSON.parse(selectedElectricity);
      dispatch(selectElectricity(parsedElectricity));
      setSelectedProduct(parsedElectricity);
    }
  
    const selectedPhone = localStorage.getItem("selectedPhone");
    if (selectedPhone) {
      const parsedPhone = JSON.parse(selectedPhone);
      dispatch(selectPhone(parsedPhone));
      setSelectedProduct(parsedPhone);
    }
  }, [dispatch]);
  

  // Handle checkbox change
  const handleCheckboxChange = (data: MortgageData | PhoneData | ElectricityData | GasData, productType: string) => {
    if (data && productType === Constants.TABLE_TYPE.MORTGAGE) {
      localStorage.setItem("selectedMortgage", JSON.stringify(data));
      dispatch(selectMortgage(data));
      setSelectedProduct(data);
    }

    if (data && productType === Constants.TABLE_TYPE.PHONE) {
      localStorage.setItem("selectedPhone", JSON.stringify(data));
      dispatch(selectPhone(data));
      setSelectedProduct(data);
    }

    if (data && productType === Constants.TABLE_TYPE.ELECTRICITY) {
      localStorage.setItem("selectedElectricity", JSON.stringify(data));
      dispatch(selectElectricity(data));
      setSelectedProduct(data);
    }

    if (data && productType === Constants.TABLE_TYPE.GAS) {
      localStorage.setItem("selectedGas", JSON.stringify(data));
      dispatch(selectGas(data));
      setSelectedProduct(data);
    }
  };

  const InternetData = () => {
    return tableData
      .slice(start, start + pageSize)
      .map((data: InternetData, index: number) => (
        <StyledTr key={index}>
          <StyledTd></StyledTd>
          <StyledTd>Company Logo</StyledTd>
          <StyledTd>Title</StyledTd>
          <StyledTd>Data / Speed Stats</StyledTd>
          <StyledTd>Cost</StyledTd>
          <StyledTd>
            <Button
              as="a"
              colorScheme="whatsapp"
              variant={data?.company != null ? "outline" : "hidden"}
            >
              "Go to site"
            </Button>
          </StyledTd>
        </StyledTr>
      ));
  };

  const renderPhoneData = () => {
    return tableData
      .slice(start, start + pageSize)
      .map((data: PhoneData, index: number) => (
        <StyledTr
          key={index}
          className={`cursor-pointer ${
            selectedProduct && isEqual(selectedProduct, data)
              ? "bg-green-100"
              : "hover:bg-green-50"
          }`}
          onClick={() => handleCheckboxChange(data, Constants.TABLE_TYPE.PHONE)}
          bg={
            selectedProduct && isEqual(selectedProduct, data)
              ? "green.100"
              : "transparent"
          }
        >
          <StyledTd>
            <Flex justify="center" align="center">
              <Checkbox
                onChange={() => handleCheckboxChange(data, Constants.TABLE_TYPE.PHONE)}
                isChecked={selectedProduct && isEqual(selectedProduct, data)}
                colorScheme="green"
              />
            </Flex>
          </StyledTd>
          <StyledTd>
            <img src={data?.company} alt="Company Logo" />
          </StyledTd>
          <StyledTd>{data?.title}</StyledTd>
          <StyledTd>{data?.data[3]?.value}</StyledTd>
          <StyledTd>{data?.data[4]?.value}</StyledTd>
          <StyledTd>
            <Button
              as="a"
              href={data?.link}
              target="_blank"
              colorScheme="whatsapp"
              variant={data?.link != null ? "outline" : "hidden"}
            >
              {data?.link != null ? "Go to site" : ""}
            </Button>
          </StyledTd>
        </StyledTr>
      ));
  };

  const renderMortgageData = () => {
    return tableData
      .slice(start, start + pageSize)
      .map((data: MortgageData, index: number) => (
        <StyledTr
          key={index}
          className={`cursor-pointer ${
            selectedProduct && isEqual(selectedProduct, data)
              ? "bg-green-100"
              : "hover:bg-green-50"
          }`}
          onClick={() => handleCheckboxChange(data, Constants.TABLE_TYPE.MORTGAGE)}
          bg={
            selectedProduct && isEqual(selectedProduct, data)
              ? "green.100"
              : "transparent"
          }
        >
          <StyledTd>
            <Flex justify="center" align="center">
              <Checkbox
                onChange={() => handleCheckboxChange(data, Constants.TABLE_TYPE.MORTGAGE)}
                isChecked={selectedProduct && isEqual(selectedProduct, data)}
                colorScheme="green"
              />
            </Flex>
          </StyledTd>
          <StyledTd>
            <img src={data.company} alt="Company Logo" />
          </StyledTd>
          <StyledTd>{data.information}</StyledTd>
          <StyledTd>{data.comparisonRate}</StyledTd>
          <StyledTd>{data.interestRate}</StyledTd>
          <StyledTd>{data.monthlyRepayment}</StyledTd>
          <StyledTd>
            <Button
              as="a"
              href={data.CTA}
              target="_blank"
              colorScheme="whatsapp"
              variant={data.CTA ? "outline" : "hidden"}
            >
              {data.CTA ? "Go to site" : ""}
            </Button>
          </StyledTd>
        </StyledTr>
      ));
  };
  const renderElectricityData = () => {
    return tableData
      .slice(start, start + pageSize)
      .map((data: ElectricityData, index: number) => (
        <StyledTr
          key={index}
          className={`cursor-pointer ${
            selectedProduct && isEqual(selectedProduct, data)
              ? "bg-green-100"
              : "hover:bg-green-50"
          }`}
          onClick={() => handleCheckboxChange(data, Constants.TABLE_TYPE.ELECTRICITY)}
          bg={
            selectedProduct && isEqual(selectedProduct, data)
              ? "green.100"
              : "transparent"
          }
        >
          <StyledTd>
            <Flex justify="center" align="center">
              <Checkbox
                onChange={() => handleCheckboxChange(data, Constants.TABLE_TYPE.ELECTRICITY)}
                isChecked={selectedProduct && isEqual(selectedProduct, data)}
                colorScheme="green"
              />
            </Flex>
          </StyledTd>
          <StyledTd>
            <img src={data?.company} alt="Company Logo" />
          </StyledTd>
          <StyledTd className="whitespace-normal sm:whitespace-nowrap md:whitespace-normal lg:whitespace-nowrap xl:whitespace-normal">
            {data?.information}
          </StyledTd>
          <StyledTd>{data?.referencePrice}</StyledTd>
          <StyledTd>{data?.estimatedCost}</StyledTd>
          <StyledTd>
            <Button
              as="a"
              href={data?.CTA}
              target="_blank"
              colorScheme="whatsapp"
              variant={data?.CTA != null ? "outline" : "hidden"}
            >
              {data?.CTA != null ? "Go to site" : ""}
            </Button>
          </StyledTd>
        </StyledTr>
      ));
  };

  const renderGasData = () => {
    return tableData
      .slice(start, start + pageSize)
      .map((data: GasData, index: number) => (
        <StyledTr
          key={index}
          className={`cursor-pointer ${
            selectedProduct && isEqual(selectedProduct, data)
              ? "bg-green-100"
              : "hover:bg-green-50"
          }`}
          onClick={() => handleCheckboxChange(data, Constants.TABLE_TYPE.GAS)}
          bg={
            selectedProduct && isEqual(selectedProduct, data)
              ? "green.100"
              : "transparent"
          }
        >
          <StyledTd>
            <Flex justify="center" align="center">
              <Checkbox
                onChange={() => handleCheckboxChange(data, Constants.TABLE_TYPE.ELECTRICITY)}
                isChecked={selectedProduct && isEqual(selectedProduct, data)}
                colorScheme="green"
              />
            </Flex>
          </StyledTd>
          <StyledTd>
            <img src={data?.company} alt="Company Logo" />
          </StyledTd>
          <StyledTd className="whitespace-normal sm:whitespace-nowrap md:whitespace-normal lg:whitespace-nowrap xl:whitespace-normal">
            {data?.information}
          </StyledTd>
          <StyledTd>{data?.supplyCharge}</StyledTd>
          <StyledTd>{data?.usageCharge}</StyledTd>
          <StyledTd>{data?.totalCost}</StyledTd>
          <StyledTd>
            <Button
              as="a"
              href={data?.CTA}
              target="_blank"
              colorScheme="whatsapp"
              variant={data?.CTA != null ? "outline" : "hidden"}
            >
              {data?.CTA != null ? "Go to site" : ""}
            </Button>
          </StyledTd>
        </StyledTr>
      ));
  };

  return (
    <Box display="flex" overflowX="auto">
      <TableContainer width="100%">
        <Table width="100%" variant="simple">
          <TableCaption position="relative">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={handlePreviousClick}
                    page={pageNumber}
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink>{pageNumber}</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    onClick={handleNextClick}
                    page={pageNumber}
                    dataLength={tableDataLength}
                    pageSize={tablePgSize}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
            <Box position="absolute" right={0} bottom={0}>
              <Text>
                Showing {pageNumber * tablePgSize} of {tableDataLength} results
              </Text>
            </Box>
          </TableCaption>
          <Thead>
            <StyledTr>
              {tableHeaders.map((header, index) => (
                <StyledTh key={index}>{header}</StyledTh>
              ))}
            </StyledTr>
          </Thead>
          {tableData && tableData.length > 0 && (
            <Tbody>
              {tableType === Constants.TABLE_TYPE.PHONE && renderPhoneData()}
              {tableType === Constants.TABLE_TYPE.MORTGAGE &&
                renderMortgageData()}
              {tableType === Constants.TABLE_TYPE.ELECTRICITY && (
                renderElectricityData()
              )}
              {tableType === Constants.TABLE_TYPE.GAS && renderGasData()}
              {tableType === Constants.TABLE_TYPE.INTERNET && <InternetData />}
            </Tbody>
          )}
        </Table>
      </TableContainer>
    </Box>
  );
};

export default SortedTable;
