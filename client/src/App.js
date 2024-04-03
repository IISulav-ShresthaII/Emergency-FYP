import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Signup from "./Components/Signup";
import Login from "./Components/Login";
import LostItems from "./Components/LostItems";
import FoundItems from "./Components/FoundItems";
import Home from "./Components/Home";
import ItemPage from "./Components/ItemPage";
import LostItem from "./Components/Lost_item";
import MyListings from "./Components/MyListings";
import MySupplies from "./Components/mySupplies";
import Supplies from "./Components/Supplies";
import Manual from "./Components/Manual";
import ViewManual from "./Components/ViewManual";
import Map from "./Components/NearbyHospitals";
import PoliceStation from "./Components/NearbyStations";
import Preparedness from "./Components/Preparedness";
import GetPreparedness from "./Components/GetPreparedness";
import Layout from "./layout";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/log-in" element={<Login />} />
          <Route path="/sign-up" element={<Signup />} />
          <Route path="/lostitems" element={<LostItems />} />
          <Route path="/founditems" element={<FoundItems />} />
          <Route path="/manual" element={<Manual />} />
          <Route path="/viewmanual" element={<ViewManual />} />
          <Route path="/postitem" element={<LostItem />} />
          <Route path="/Supplies" element={<Supplies />} />
          <Route path="/NearbyHospitals" element={<Map />} />
          <Route path="/NearbyStations" element={<PoliceStation />} />
          <Route path="/mylistings" element={<MyListings />} />
          <Route path="/mysupplies" element={<MySupplies />} />
          <Route path="/GetPreparedness" element={<GetPreparedness />} />
          <Route path="/Preparedness" element={<Preparedness />} />
          <Route path="/:item" element={<ItemPage />} />

          <Route path="/*" element={<Home />} />
        </Routes>
        <ToastContainer />
      </Layout>
    </BrowserRouter>
  );
}

export default App;
