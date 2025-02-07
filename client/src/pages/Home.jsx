import banner from '../assets/banner.jpg';
import bannerMobile from '../assets/banner-mobile.jpg';
import { useSelector } from 'react-redux';
import {validateURLConvert} from '../utils/validateURLConvert.jsx'
import {  useNavigate } from 'react-router-dom';
import CategoryWiseProductDisplay from '../components/CategoryWiseProductDisplay.jsx';

const Home = () => {
  const loadingCategory = useSelector((state) => state.product.loadingCategory);
  const categoryData = useSelector((state) => state.product.allCategory);
  const subCategoryData = useSelector((state) => state.product.allSubCategory);
  const navigate = useNavigate()

  const handleRedirectProductListPage = (id,cat) => {
      console.log(id,cat)
      const subCategory = subCategoryData.find(sub  => {
        const filterData = sub.category.some(c => {
          return c._id == id
        })
          return filterData ? true : null
      // console.log(sub)
        
      })
      const url = `/${validateURLConvert(cat)}-${id}/${validateURLConvert(subCategory.name)}-${subCategory._id}`
      navigate(url)
       console.log(url)
  }

  return (
    <section className="bg-white">
      <div className="container mx-auto">
        {/* Banner Section */}
        <div className={`w-full h-full min-h-48 bg-blue-100 rounded ${!banner && 'animate-pulse'} my-2`}>
          <img
            src={banner}
            alt="banner"
            className="w-full h-full hidden lg:block"
          />
          <img
            src={bannerMobile}
            alt="banner-mobile"
            className="w-full h-full lg:hidden"
          />
        </div>
      </div>

      {/*Display Categories Section */}
      <div className="container mx-auto px-4 my-4 grid grid-cols-3 md:grid-cols-6 lg:grid-cols-10 gap-4">
        {loadingCategory ? (
          new Array(12).fill(null).map((cat, index) => (
            <div
              key={cat +index + "loadingCategory"}
              className="bg-white rounded p-4 min-h-36 grid gap-2 shadow animate-pulse">
              <div className="bg-blue-100 min-h-24 rounded"></div>
              <div className="bg-blue-100 h-8 rounded"></div>
            </div>
          ))
        ) : (
          categoryData.map((cat, index) => (
             <div key={cat._id +index +"displayCategory"} className='w-full h-full "bg-white rounded shadow overflow-hidden"' 
             onClick={()=>handleRedirectProductListPage(cat._id,cat.name)}>
              <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 p-4">
                <img
                   src={cat.image}
                   alt={cat.name} className="object-scale-down w-full h-full mb-2" />
               <p className="text-center text-sm font-medium">{cat.name}</p>
             </div>

            </div>
          ))
        )}
      </div>

      {/*Display category product Section */}
      {
        categoryData.map((c,index) => {
          return (
            <CategoryWiseProductDisplay key={c?._id+index+"CategorywiseProduct"} id={c?._id} name={c?.name}/>
          )
        })
      }

    </section>
  );
};

export default Home;
