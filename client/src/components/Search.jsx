import { useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";
import { FaArrowLeft } from "react-icons/fa";
import useMobile from "../hooks/useMobile";

const Search = () => {
  const navigate = useNavigate();
  const location = useLocation(); //check currently in which URL(searchPage or not)
  const [isSearchPage, setIsSearchPage] = useState(false); //by default its false because currently not inside search page
  const [isMobile] = useMobile();
  const params = useLocation()
  const searchText = params.search.split(3)

  useEffect(() => {
    const isSearch = location.pathname === "/search";
    setIsSearchPage(isSearch);
  }, [location]);

  const handleOnChange = (e) => {
    const value = e.target.value
    const url = `/search?q=${value}`
    navigate(url)
    //console.log(value)
  }

  //console.log("search", isSearchPage)
  //console.log("location", location)

  const redirectToSearchPage = () => {
    navigate("/search");
  };
  
  return (
    <div
      className="w-full min-w-[300px] lg:min-w-[420px] h-11 lg:h-12 rounded-lg border overflow-hidden flex items-center text-neutral-500 bg-slate-50
    group focus-within:border-primary-200"
    >
      <div>
        {
          (isMobile && isSearchPage) ? (
          <Link to={"/"} className="flex justify-center items-center h-full p-2 m-1 group-focus-within:text-primary-200 bg-white rounded-full shadow-md">
            <FaArrowLeft size={25} />
          </Link>
        ) : (
          <button className="flex justify-center items-center h-full p-3 group-focus-within:text-primary-200">
            <IoSearch size={25} />
          </button>
        )}
      </div>
      <div className="w-full h-full">
        {!isSearchPage ? (
          //not in search page
          <div
            onClick={redirectToSearchPage}
            className="w-full h-full flex items-center"
          >
            <TypeAnimation
              sequence={[
                // Same substring at the start will only be typed out once, initially
                'Search "milk"',
                1000, // wait 1s before replacing "milk" with "bread" for 1 second
                'Search "bread"',
                1000,
                'Search "sugar"',
                1000,
                'Search "panner"',
                1000,
                'Search "chocolate"',
                1000,
                'Search "curd"',
                1000,
                'Search "rice"',
                1000,
                'Search "egg"',
                1000,
                'Search "chips"',
                1000,
              ]}
              wrapper="span"
              speed={50}
              repeat={Infinity}
            />
          </div>
        ) : (
          //when in search page
          <div className="w-full h-full">
            <input
              type="text"
              placeholder="Search for atta dhal and more"
              autoFocus={true}
              className="bg-transparent w-full h-full outline-none"
              onChange={handleOnChange}
              defaultValue={searchText}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
