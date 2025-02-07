import { useSelector } from "react-redux"
import  NoData from "../components/NoData.jsx"



const MyOrders = () => {
  const orders = useSelector(state => state.orders.order)

  //console.log("orderItems" ,orders)

  return (
    <div>
        <div>
            <h1 className="bg-white shadow-xl p-3 font-semibold">Orders</h1>
        </div>
        {
           !orders[0] && (
              <NoData/>
           )
        }
        {
          orders.map((order,index) => {
            return (
              <div key={order._id+index+"order"} className="border rounded p-4 text-sm">
                  <p>Order No: {order?.orderId}</p>
                  <div className="flex gap-3">
                    <img src={order.product_details.image[0]} className="w-14 h-14" />
                    <p className="font-semibold">{order.product_details.name} </p>
                  </div>
                  
              </div>
            )
          })
        }
    </div>
  )
}

export default MyOrders