/*!

=========================================================
* Argon Dashboard React - v1.2.3
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
// import Index from "views/Index.js";
// import Profile from "views/pages/Profile.js";
// import Maps from "views/pages/Maps.js";
// import Tables from "views/pages/Tables.js";
// import Icons from "views/pages/Icons.js";
// import DevicesPage from "views/pages/Devices";
// import HomeManagement from "views/pages/Homes";
import RobotManagement from "views/pages/RobotsPage";
import Register from "views/pages/Register.js";
import Login from "views/pages/Login.js";

import RobotDetail from "views/pages/RobotsPage/components/RobotDetail";
import HomePage from "views/pages/HomePage";
import FundDetail from "views/pages/FundDetail";
import ProjectList from "views/pages/ProjectList";
var routes = [
  // {
  //   path: "/index",
  //   name: "Dashboard",
  //   icon: "ni ni-tv-2 text-primary",
  //   component: <Index />,
  //   layout: "/admin",
  // },

  // {
  //   path: "/home-management",
  //   name: "Home",
  //   icon: "bi bi-house",
  //   component: <HomeManagement />,
  //   layout: "/admin",
  // },
  {
    path: "robot-management",
    name: "Robot Management",
    icon: "ni ni-controller",
    childPath: ":robotId",
    childComponent: <RobotDetail />,
    component: <RobotManagement />,
    layout: "/admin",
  },
  // {
  //   path: "/icons",
  //   name: "Icons",
  //   icon: "ni ni-planet text-blue",
  //   component: <Icons />,
  //   layout: "/admin",
  // },
  // {
  //   path: "/maps",
  //   name: "Maps",
  //   icon: "ni ni-pin-3 text-orange",
  //   component: <Maps />,
  //   layout: "/admin",
  // },
  // {
  //   path: "/user-profile",
  //   name: "User Profile",
  //   icon: "ni ni-single-02 text-yellow",
  //   component: <Profile />,
  //   layout: "/admin",
  // },
  // Route cho trang hiển thị danh sách dự án
  {
    path: "/du-an",
    name: "ProjectList",
    component: <ProjectList />, // Component này sẽ hiển thị danh sách các dự án
    layout: "/auth",
  },
  {
    path: "/du-an/:fundName",
    name: "FundDetail",
    //icon: "ni ni-bullet-list-67 text-red",
    component: <FundDetail />,
    layout: "/auth",
  },
  {
    path: "/",
    name: "HomePage",
    //icon: "ni ni-bullet-list-67 text-red",
    component: <HomePage />,
    layout: "/auth",
  },
  {
    path: "login",
    name: "Login",
    icon: "ni ni-key-25 text-info",
    component: <Login />,
    layout: "/auth",
  },
  {
    path: "register",
    name: "Register",
    icon: "ni ni-circle-08 text-pink",
    component: <Register />,
    layout: "/auth",
  },
];
export default routes;
