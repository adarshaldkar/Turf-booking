import './App.css';
import { Routes, Route } from 'react-router-dom';

// User
import Home from './pages/Home/Home';
import Signup from './pages/Signup/Signup';
import Login from './pages/Login/Login';
import Contact from './pages/Contact/Contact';
import Turfs from './pages/Turfs/Turfs';
import BookingPage from './pages/Booking/Booking';
import PageNotFound from './pages/PageNotFound/PageNotFound';
import Account from './pages/Account/Account';
import Booked from './pages/Booked/Booked';
//admin
import AdminLogin from './pages/Admin/Login/Login';
import AccountInfo from './pages/Admin/AccountInfo/AccountInfo';
import AddTurf from './pages/Admin/AddTurf/AddTurf';
import Bookings from './pages/Admin/Bookings/Bookkings';
import AdminTurfsPage from './pages/Admin/Turfs/Turfs';
import EditTurf from './pages/Admin/EditTurf/EditTurf';
import Users from './pages/Admin/Users/Users';
import PrivateRoute from './components/Private-Route';

const App = () => {
  return (
    <>
      {/* <Navbar /> */}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* user */}
        {/* checking token and access */}
        <Route path="/" element={<PrivateRoute />}>
          {/* user routes */}
          <Route path="/turfs" element={<Turfs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/booking/:id" element={<BookingPage />} />
          <Route path="/booked" element={<Booked />} />
          <Route path="/account" element={<Account />} />

          {/* admin routes */}
          <Route path="/admin/account-info" element={<AccountInfo />} />
          <Route path="/admin/add-turf" element={<AddTurf />} />
          <Route path="/admin/bookings" element={<Bookings />} />
          <Route path="/admin/turfs" element={<AdminTurfsPage />} />
          <Route path="/admin/users" element={<Users />} />
          <Route path="/admin/edit-turf/:id" element={<EditTurf />} />

          {/* if no routes mathes */}
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>

      {/* <Footer /> */}
    </>
  );
};

export default App;