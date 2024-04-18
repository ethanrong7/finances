const Financials = require("../models/financials.model");
const phoneData = require("../data/phone.json");
const mortgageData = require("../data/mortgage.json");
const {
  PhoneModel,
  MortgageModel,
} = require("../models/financialProducts.model");
const Constant = require("../helpers/constants");

const uploadFinancesToDB = async (request) => {
  await Financials.findOneAndUpdate(
    { _id: request.user._id },
    { ...request.body.data },
    { upsert: true }
  );
};

const getFinancesData = async (request) => {
  const finances = await Financials.findOne({ _id: request.user._id });
  return finances;
};

// To:do Implement sorting algorithm
const getFinancialProductData = (page, pageSize, productType) => {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  let productModel;
  let productDataLength;

  if (productType === Constant.FINANCIAL_PRODUCTS.PHONE) {
    productModel = phoneData.data.table.products
      .slice(start, end)
      .map((phoneProduct) => {
        return new PhoneModel(
          phoneProduct.logo,
          phoneProduct.title,
          phoneProduct.callsToAction.map((action) => action.text),
          phoneProduct.properties.values,
          phoneProduct.callsToAction.find(
            (action) => action.type === "costBreakDown"
          ).text,
          phoneProduct.link
        );
      });
    productDataLength = phoneData.data.table.products.length;
  } else if (productType === Constant.FINANCIAL_PRODUCTS.MORTGAGE) {
    // productModel = mortgageData.data.table.products
    //   .slice(start, end)
    //   .map((mortgageProduct) => {
    //     return new MortgageModel(
    //       mortgageProduct.logo,
    //       mortgageProduct.title,
    //       mortgageProduct.callsToAction.map((action) => action.text),
    //       mortgageProduct.properties.values,
    //       mortgageProduct.callsToAction.find(
    //         (action) => action.type === "costBreakDown"
    //       ).text,
    //       mortgageProduct.link
    //     );
    //   });
  }

  return {
    productData: productModel,
    productDataLength: productDataLength,
  };
};

module.exports = {
  uploadFinancesToDB,
  getFinancesData,
  getFinancialProductData,
};
