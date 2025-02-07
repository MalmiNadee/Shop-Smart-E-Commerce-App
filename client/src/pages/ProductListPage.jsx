/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import AxiosToastError from "./../utils/AxiosToastError";
import Axios from "./../utils/Axios";
import SummaryAPI from "../common/SummaryAPI";
import LoadingSpinner from "../components/LoadingSpinner";
import CardProduct from "./../components/CardProduct";
import { useSelector } from "react-redux";
import { validateURLConvert } from "../utils/validateURLConvert";

const ProductListPage = () => {
  const params = useParams(); // Retrieve URL parameters
  const [data, setData] = useState([]); // Store product data
  const [page, setPage] = useState(1); // Pagination control
  const [loading, setLoading] = useState(false); // Loading state
  const [totalPage, setTotalPage] = useState(1); // Total pages for products
  const allSubCategory = useSelector((state) => state.product.allSubCategory); // Fetch all subcategories from Redux
  const [DisplaySubCategory, setDisplaySubCategory] = useState([]); // Filtered subcategories to display

  const subCategory = params.subCategory.split("-"); // Split subcategory URL parameter
  const subCategoryName = subCategory
    ?.slice(0, subCategory?.length - 1)
    ?.join(" "); // Extract subcategory name from URL

  const categoryId = params.category.split("-").slice(-1)[0]; // Extract category ID
  const subCategoryId = params.subCategory.split("-").slice(-1)[0]; // Extract subcategory ID

  // Fetch product data based on category and subcategory
  const fetchProductData = async () => {
    try {
      setLoading(true); // Set loading state to true
      const response = await Axios({
        ...SummaryAPI.getProductByCategoryAndSubCategory,
        data: {
          categoryId: categoryId,
          subCategoryId: subCategoryId,
          page: page,
          limit: 8, // Limit products per page
        },
      });
      const { data: responseData } = response;

      if (responseData.success) {
        if (responseData.page === 1) {
          setData(responseData.data); // Set data for the first page
        } else {
          setData([...data, ...responseData.data]); // Append data for subsequent pages
        }
        setTotalPage(responseData.totalCount); // Update total pages
      }
    } catch (error) {
      AxiosToastError(error); // Handle error with toast notification
    } finally {
      setLoading(false); // Set loading state to false
    }
  };

  useEffect(() => {
    fetchProductData(); // Fetch product data when params change
  }, [params]);

  // Filter subcategories based on category ID
  useEffect(() => {
    const sub = allSubCategory.filter((s) => {
      const filterData = s.category.some((el) => el._id === categoryId);
      return filterData ? filterData : null;
    });
    setDisplaySubCategory(sub); // Set filtered subcategories
  }, [params, allSubCategory]);

  return (
    <section className="sticky top-24 lg:top-20">
      <div className="container mx-auto grid grid-cols-[90px,1fr] md:grid-cols-[200px,1fr] lg:grid-cols-[280px,1fr] gap-4">
        {/* Sub Category Sidebar */}
        <aside className="min-h-[88vh] max-h-[88vh] overflow-y-auto scrollbarCustom grid gap-2 shadow-md bg-white py-4 px-2 rounded-md">
          {DisplaySubCategory.map((s, index) => {
            const link = `/${validateURLConvert(s?.category[0]?.name)}-${s?.category[0]?._id}/${validateURLConvert(s?.name)}-${s?._id}`;
            return (
              <Link
                to={link}
                key={s._id + "displaySubCategory" + index}
                className={`w-full lg:w-full lg:h-full box-border border-b 
                hover:bg-green-100 cursor-pointer rounded-md
                ${subCategoryId === s._id ? "bg-green-200" : ""}`}
              >
                <div className="w-fit max-w-[112px] mx-auto lg:mx-0 bg-white rounded-md">
                  <img
                    src={s.image}
                    alt="subCategory"
                    className="w-14 h-14 object-contain rounded-md"
                  />
                </div>
                {/* Display subcategory name */}
                <p className="mt-2 text-xs text-center lg:text-left lg:text-sm font-medium">
                  {s.name}
                </p>
              </Link>
            );
          })}
        </aside>

        {/* Products Section */}
        <main className="sticky top-20">
          {/* Sub Category Name */}
          <div className="bg-white shadow-md p-4 rounded-md mb-4">
            <h3 className="font-semibold text-lg">{subCategoryName}</h3>
          </div>

          {/* Products Grid */}
          <div className="min-h-[80vh] max-h-[80vh] overflow-y-auto relative">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
              {data.map((p, index) => (
                <CardProduct
                  data={p}
                  key={p._id + "productSubCategory" + index}
                />
              ))}
            </div>

            {/* Loading Spinner */}
            {loading && <LoadingSpinner />}
          </div>
        </main>
      </div>
    </section>
  );
};

export default ProductListPage;
