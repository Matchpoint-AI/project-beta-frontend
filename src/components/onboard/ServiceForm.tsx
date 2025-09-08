/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
   ChangeEventHandler,
   FormEventHandler,
   useContext,
   useEffect,
   useRef,
   useState,
} from "react";
import Dropdown from "../shared/Dropdown";
import { CampaignContext } from "../../context/CampaignContext";
import { BrandContext } from "../../context/BrandContext";
import FormsContainer from "../shared/FormsContainer";
import WebsiteOwnership from "../WebsiteOwnership";
import NextButton from "../shared/Buttons/NextButton";
import BackButton from "../shared/Buttons/BackButton";
import KeyFeatures from "../onboard/KeyFeatures";
import FormInputBox from "../shared/FormInputBox";
import { SparklesMessage } from "../shared/SparklesMessage";
import ErrorToast from "../shared/ErrorToast";
import { CircularProgress } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import scrapeProductDefault from "./scrapeProduct";

import posthog from "../../helpers/posthog";

interface CampaignContextType {
   campaignInfo: {
      product?: string;
      productDescription?: string;
      newProduct?: boolean;
      productLink?: string;
   };
   setCampaignInfo: (
      value: React.SetStateAction<CampaignContextType["campaignInfo"]>
   ) => void;
}

interface ServiceFormProps {
   handleNext?: any;
   handleBack?: any;
   review?: boolean;
   setService: React.Dispatch<React.SetStateAction<string>>;
}

type Product = {
   name: string;
   description?: string;
};

const ServiceForm = ({
   handleNext,
   handleBack,
   review = false,
   setService,
}: ServiceFormProps) => {
   const { businessInfo, setBusinessInfo }: any = useContext(BrandContext);
   const { campaignInfo, setCampaignInfo }: any = useContext(CampaignContext);
   const [product, setProduct] = useState<Product | null>(null);
   const [productName, setProductName] = useState("");
   const [productDescription, setProductDescription] = useState<
      string | undefined
   >("");
   const [newProduct, setNewProduct] = useState(false);
   const [productLink, setProductLink] = useState("");
   const isMounted = useRef(false);
   const [error, setError] = useState(false);
   const [nameError, setnameError] = useState(false);
   const [loading, setLoading] = useState(false);
   const [features, setFeatures] = useState<string[]>([]);
   const { profile } = useAuth();

   // Add validation state for the Next button
   const [isFormValid, setIsFormValid] = useState(false);
   const [scrapeSuccess, setScrapeSuccess] = useState(false);

   let scrapeProduct: any;
   if (typeof window !== 'undefined' && (window as any).__mockScrapeProduct) {
     scrapeProduct = (window as any).__mockScrapeProduct;
   } else {
     scrapeProduct = scrapeProductDefault;
   }

   useEffect(() => {
      if (businessInfo.products === undefined) {
         setBusinessInfo({
            ...businessInfo,
            products: [],
         });
         return;
      }

      // Set default product description if product is already selected in campaignInfo
      const selectedProduct = businessInfo.products.find(
         (product: any) => product.name === campaignInfo.product
      );
      if (selectedProduct) {
         console.log("Selected product:", selectedProduct);
         setProductDescription(selectedProduct.description);
         setCampaignInfo((prev: CampaignContextType["campaignInfo"]) => ({
            ...prev,
            productDescription: selectedProduct.description,
         }));
      }

      // Log product features
      console.log("Current product features:", businessInfo.product_features);
      console.log("Current key features:", businessInfo.key_features);
   }, []);

   // Add validation effect
   useEffect(() => {
      // Form is valid if we have a product name (either from scraping or manual entry)
      // OR if we have a product link that could be scraped
      const hasProductName = Boolean(productName && productName.trim() !== "");
      const hasProductLink = Boolean(productLink && productLink.trim() !== "");
      const isValid = hasProductName || hasProductLink;
      setIsFormValid(isValid);
   }, [productName, productLink]);

   const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
      e.preventDefault();
      
      // Additional validation before submission
      if (!productName || productName.trim() === "") {
         setnameError(true);
         return;
      }

      setCampaignInfo((prev: CampaignContextType["campaignInfo"]) => ({
         ...prev,
         product: productName,
         productDescription,
         productLink: productLink,
      }));
      
      if (posthog.__loaded) {
         posthog.capture("Campaign Step Completed", {
            distinct_id: profile?.id,
            step: 2,
         });
      }
      handleNext();
   };

   const handleProductScrape = async () => {
      if (!productLink) {
         setError(true);
         return;
      }

      setLoading(true);
      setError(false);
      setScrapeSuccess(false);
      try {
         console.log("Scraping product from URL:", productLink);
         const scrapedProduct = await scrapeProduct(productLink);
         console.log("Scraped product data:", scrapedProduct);

         if (scrapedProduct && scrapedProduct.name) {
            setProductName(scrapedProduct.name);
            setProductDescription(scrapedProduct.description || "");
            setFeatures(scrapedProduct.product_features || []);

            // Update business info with new product features
            setBusinessInfo((prev: any) => {
               console.log(
                  "Updating business info with new product features:",
                  scrapedProduct.product_features
               );
               return {
                  ...prev,
                  product_features: scrapedProduct.product_features || [],
                  key_features: scrapedProduct.product_features || [],
               };
            });

            setCampaignInfo((prev: CampaignContextType["campaignInfo"]) => ({
               ...prev,
               product: scrapedProduct.name,
               productDescription: scrapedProduct.description || "",
               productLink: productLink,
            }));

            // Show success feedback
            setScrapeSuccess(true);
            console.log("Product scraping completed successfully");
         } else {
            // Handle case where scraping succeeded but no product name was found
            console.warn("Scraping succeeded but no product name found");
            setError(true);
            setProductName("");
            setProductDescription("");
            setFeatures([]);
         }
      } catch (error) {
         console.error("Error scraping product:", error);
         setError(true);
         // Reset form state on error
         setProductName("");
         setProductDescription("");
         setFeatures([]);
      } finally {
         setLoading(false);
      }
   };

   const nameChangeHandler: ChangeEventHandler<HTMLInputElement> = (e) => {
      const { value } = e.target;
      setnameError(!value);
      setProductName(value);
   };

   const productChangeHandler = (value: string, index: number) => {
      console.log("Product change handler - value:", value, "index:", index);
      console.log("Selected product:", businessInfo?.products[index - 1]);

      if (value !== "Add Product or Service") {
         const selectedProduct = businessInfo?.products[index - 1];
         setProductName(value);
         setProductDescription(selectedProduct?.description);
         setProduct(selectedProduct);
         setService(value);
         setNewProduct(false);
         setCampaignInfo({ ...campaignInfo, newProduct: false });

         // Try both field names to ensure we get the features
         const features =
            selectedProduct?.product_features ??
            selectedProduct?.key_features ??
            [];
         console.log("Setting features from selected product:", features);
         setFeatures(features);
      } else {
         setNewProduct(true);
         setProductDescription("");
         setProductName("");
         setCampaignInfo({ ...campaignInfo, newProduct: true });
         setFeatures([]);
      }
   };

   useEffect(() => {
      if (isMounted.current) return;
      console.log("ServiceForm - Initial mount - businessInfo:", businessInfo);
      console.log("ServiceForm - Initial mount - campaignInfo:", campaignInfo);

      if (campaignInfo?.product || campaignInfo?.productDescription) {
         setProductName(campaignInfo?.product ?? "");
         setProductDescription(campaignInfo?.productDescription ?? "");
      } else if (businessInfo?.products && businessInfo?.products.length > 0) {
         productChangeHandler(businessInfo?.products[0]?.name, 1);
      }

      // Set features from campaignInfo if available, otherwise from businessInfo
      if (campaignInfo?.product_features?.length > 0) {
         console.log(
            "Setting features from campaignInfo:",
            campaignInfo.product_features
         );
         setFeatures(campaignInfo.product_features);
      } else if (businessInfo?.products?.[0]) {
         const firstProduct = businessInfo.products[0];
         const features =
            firstProduct.product_features ?? firstProduct.key_features ?? [];
         console.log("Setting features from first product:", features);
         setFeatures(features);
      }

      if (campaignInfo.newProduct !== undefined) {
         setNewProduct(campaignInfo.newProduct);
      } else if (!businessInfo.products || businessInfo.products.length === 0) {
         setNewProduct(true);
      }

      if (campaignInfo?.productLink) {
         setProductLink(campaignInfo?.productLink);
      }

      isMounted.current = true;
   }, [businessInfo, campaignInfo]);

   // Add debug logging for features changes
   useEffect(() => {
      console.log("ServiceForm - features updated:", features);
   }, [features]);

   return (
      <>
         <FormsContainer>
            <form id="service_form" onSubmit={handleSubmit}>
               {businessInfo?.products && businessInfo?.products.length > 0 && (
                  <>
                     <div className="mb-5">
                        <label
                           title=""
                           className="block mb-2 text-base sm:text-xl font-medium text-gray-900">
                           Which service or product are you featuring?
                        </label>
                        <div className="mb-2">
                           <SparklesMessage>
                              Matchpoint will detect and store your
                              business&apos;s services and products
                           </SparklesMessage>
                        </div>

                        <Dropdown
                           // type="options"
                           options={[
                              "Add Product or Service",
                              ...(businessInfo && businessInfo.products
                                 ? businessInfo.products.map((p: any) => p.name)
                                 : []),
                           ]}
                           currentValue={
                              newProduct
                                 ? "Add Product or Service"
                                 : productName
                           }
                           onUpdateContext={productChangeHandler}
                           className="w-full"
                        />
                     </div>
                  </>
               )}

               <div className="my-5">
                  <label
                     title=""
                     className="block mb-2 text-base sm:text-xl font-medium text-gray-900">
                     If you have it, please provide a link to your product or
                     service
                  </label>
                  <FormInputBox
                     styles={{ backgroundColor: "white" }}
                     color={"#6B7280"}>
                     <input
                        value={productLink}
                        type="text"
                        placeholder="Link to Product/Service"
                        onChange={(e) => setProductLink(e.target.value)}
                        className="text-sm w-full bg-transparent outline-none text-[#111827]"
                     />
                  </FormInputBox>
                  <button
                     type="button"
                     className="bg-[#5145CD] hover:bg-[#6875F5] text-white text-sm h-10 w-[100px] mt-2 rounded-lg font-bold flex items-center disabled:cursor-not-allowed justify-center"
                     onClick={handleProductScrape}
                     disabled={loading || !productLink}>
                     {loading ? (
                        <CircularProgress
                           sx={{ color: "#ffffff" }}
                           size={25}
                           thickness={5}
                        />
                     ) : (
                        "Generate"
                     )}
                  </button>
                  {scrapeSuccess && (
                     <p className="text-[#0E9F6E] text-sm font-medium mt-2">
                        ✓ Product information successfully extracted!
                     </p>
                  )}
                  {productLink && !productName && !loading && !scrapeSuccess && (
                     <p className="text-[#6B7280] text-sm mt-2">
                        Click "Generate" to extract product information from the URL
                     </p>
                  )}
               </div>
               {newProduct && (
                  <div>
                     <div className="my-5">
                        <label className="block mb-2 text-base sm:text-xl font-medium text-gray-900">
                           What is the service or product called?
                        </label>
                        <FormInputBox
                           styles={{ backgroundColor: "white" }}
                           color={"#6B7280"}>
                           <input
                              value={productName}
                              type="text"
                              placeholder="Name the new Product/Service"
                              onChange={nameChangeHandler}
                              // onBlur={saveValue}
                              className="text-sm w-full bg- outline-none text-[#111827]"
                           />
                        </FormInputBox>
                        {nameError && (
                           <p className="text-[#F05252] text-sm font-medium mt-1">
                              Please at least provide a name of your product
                           </p>
                        )}
                     </div>
                  </div>
               )}

               <div className="my-8">
                  <label
                     title=""
                     className="block mb-2 text-xl font-medium text-gray-900">
                     Service or Product description
                  </label>
                  <SparklesMessage>
                     Matchpoint will try to provide a description through
                     detection or the link above.
                  </SparklesMessage>
                  {(newProduct ||
                     !businessInfo?.products ||
                     !product?.description) && (
                     <textarea
                        className="outline-none border border-[#6B7280] py-3 px-5 w-full h-[100px] resize-none rounded-lg mt-3 text-sm"
                        placeholder="Please provide a product description here."
                        value={productDescription}
                        onChange={(e) => setProductDescription(e.target.value)}
                     />
                  )}
                  {product?.description && !newProduct && (
                     <div className="bg-[#EBF5FF] p-6 mt-2 rounded-md text-[#6B7280] text-xs border-[0.3px] border-[#1C64F2]">
                        <p>{product?.description}</p>
                     </div>
                  )}
               </div>
               <KeyFeatures pros={features} />
            </form>
         </FormsContainer>
         <WebsiteOwnership />
         {!review && (
            <div className="flex justify-between mb-10 w-[95%] md:w-full">
               <BackButton onClick={() => handleBack()} />
               <NextButton 
                  text={isFormValid ? "Next" : "Enter product details to continue"} 
                  formId="service_form" 
                  disabled={!isFormValid || loading}
               />
            </div>
         )}
         <ErrorToast
            open={error}
            onClose={() => setError(false)}
            message="Unable to extract product information from the provided URL. Please check the link and try again, or manually enter the product details below."
         />
      </>
   );
};

export default ServiceForm;
