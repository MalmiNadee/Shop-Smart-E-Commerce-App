/* eslint-disable no-unused-vars */
import { Outlet } from "react-router-dom"
import UserMenu from "../components/UserMenu"
import { useSelector } from "react-redux"


const Dashboard = () => {
  const user = useSelector(state => state.user)

  //console.log("user dashboard", user)
  return (
    <section className="bg-white">
       <div className="container mx-auto p-3 lg:grid grid-cols-[250px,1fr]">
          {/* left side for menu */}
          <div className="py-4 sticky top-24 max-h-[calc(100vh-96px)] overflow-y-auto hidden lg:block border-r">
            <UserMenu/>
          </div>


          {/* right side for content */}
          <div className="bg-white min-h-[78vh]">
              <Outlet/> 
          </div>

       </div>

    </section>
  )
}

export default Dashboard

//mx-auto => automatically adjust margin left and right both sides
// sticky top-24 for not scroll the menu
// p-4 => padding from all directions
// outlet =>  to render nested routes within a parent route's component, enabling the display of child components dynamically.