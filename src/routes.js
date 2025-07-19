import React from "react";
import Dashboard from "./layouts/dashboard";
import Calendar from "./layouts/calendar";
import Media from "./layouts/media";
import Explore from "./layouts/explore";
import Analytics from "./layouts/analytics";
import Reporting from "./layouts/reporting";
import Invoice from "@/layouts/invoice";
import Social from "@/layouts/social";
import AddSocialPages from "@/layouts/addSocialPages";
import Members from "@/layouts/members";
import HelpCenter from "@/layouts/helpcenter";
import Chat from "@/layouts/chat";
import RTL from "@/layouts/rtl";
import Notifications from "@/layouts/notifications";
import Profile from "@/layouts/profile";
import SignIn from "@/layouts/authentication/sign-in";
import SignUp from "@/layouts/authentication/sign-up";
import DataDeletion from "@/layouts/dataDeletion";
import PrivacyPolicy from "@/layouts/privacyPolicy";
import TermsAndConditions from "@/layouts/TermsAndConditions";
import Home from "@/layouts/home";
import PurchaseOrders from "@/layouts/purchaseOrder"

// @mui icons
import Icon from "@mui/material/Icon";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PermMediaIcon from "@mui/icons-material/PermMedia";
import ProtectedRoute from "@/ProtectedRoute";
import ExploreIcon from "@mui/icons-material/Explore";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import CreatePost from "@/layouts/createPost"

// Sample isAuthenticated value (replace with actual authentication check)
// const isAuthenticated = false; // Set this to true or false based on user auth state

const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    // component: <Dashboard />,
    component: <ProtectedRoute element={<Dashboard />} />, // Protected
    // component: <Dashboard />,
    roles: ["admin", "influencer", "brand"]
  },
  {
    type: "collapse",
    name: "Calendar",
    key: "calendar",
    // icon: <CalendarTodayIcon />,
    icon: <Icon fontSize="small">calendar_today</Icon>,
    route: "/calendar",
    // component: <Calendar />,
    component: <ProtectedRoute element={<Calendar />} />, // Protected
    roles: ["admin", "influencer"]
  },
  {
    type: "collapse",
    name: "Media",
    key: "media",
    icon: <Icon fontSize="small">perm_media</Icon>,
    route: "/media",
    component: <ProtectedRoute element={<Media />} />, // Protected
    roles: ["admin", "influencer"]
  },
  {
    type: "collapse",
    name: "Explore",
    key: "explore",
    icon: <Icon fontSize="small">explore</Icon>,
    route: "/explore",
    // component: <Explore />,
    component: <ProtectedRoute element={<Explore />} />, // Protected
    roles: ["brand", "admin"]
  },
  {
    type: "collapse",
    name: "Analytics",
    key: "analytics",
    icon: <Icon fontSize="small">analytics</Icon>,
    route: "/analytics",
    // component: <Analytics />,
    component: <ProtectedRoute element={<Analytics />} />, // Protected
    roles: ["brand", "admin", "influencer" ]
  },
  {
    type: "collapse",
    name: "Contract",
    key: "contract",
    icon: <Icon fontSize="small">analytics</Icon>,
    route: "/contracts",
    // component: <Analytics />,
    component: <ProtectedRoute element={<Analytics />} />, // Protected
    roles: ["brand", "admin", "influencer"]
  },
  {
    type: "collapse",
    name: "Leads",
    key: "leads",
    icon: <Icon fontSize="small">summarize</Icon>,
    route: "/leads",
    // component: <Analytics />,
    component: <ProtectedRoute element={<Reporting />} />, // Protected
    roles: ["brand", "admin"]
  },
  {
    type: "collapse",
    name: "Lead Generator",
    key: "lead_generator",
    icon: <Icon fontSize="small">analytics</Icon>,
    route: "/lead_generator",
    // component: <Analytics />,
    component: <ProtectedRoute element={<Analytics />} />, // Protected
    roles: ["brand", "admin"]
  },
  {
    type: "collapse",
    name: "Posts",
    key: "posts",
    icon: <Icon fontSize="small">analytics</Icon>,
    route: "/posts",
    // component: <Analytics />,
    component: <ProtectedRoute element={<CreatePost />} />, // Protected
    roles: ["brand", "admin", "influencer"]
  },
  {
    type: "collapse",
    name: "Purchase Order",
    key: "purchase_order",
    icon: <Icon fontSize="small">analytics</Icon>,
    route: "/purchase-order",
    // component: <Analytics />,
    component: <ProtectedRoute element={<PurchaseOrders />} />, // Protected
    roles: ["brand", "admin"]
  },
  {
    type: "collapse",
    name: "Reports",
    key: "reporting",
    icon: <Icon fontSize="small">summarize</Icon>,
    route: "/reporting",
    // component: <Analytics />,
    component: <ProtectedRoute element={<Reporting />} />, // Protected
    roles: ["admin", "influencer"]
  },
  {
    type: "collapse",
    name: "Invoice",
    key: "invoice",
    icon: <Icon fontSize="small">sell</Icon>,
    route: "/invoice",
    // component: <Analytics />,
    component: <ProtectedRoute element={<Invoice />} />, // Protected
    roles: ["admin", "influencer", "brand"]
  },
  {
    type: "collapse",
    name: "Social Accounts",
    key: "social_accounts",
    icon: <Icon fontSize="small">connect_without_contact</Icon>,
    route: "/social-pages",
    // component: <Analytics />,
    component: <ProtectedRoute element={<Social />} />, // Protected
    roles: ["admin", "influencer"]
  },
  {
    type: "collapse",
    name: "Add Social Accounts",
    key: "add_social_accounts",
    icon: <Icon fontSize="small">connect_without_contact</Icon>,
    route: "/social",
    // component: <Analytics />,
    component: <ProtectedRoute element={<AddSocialPages />} />, // Protected
    roles: ["admin", "influencer"]
  },
  {
    type: "collapse",
    name: "Members",
    key: "members",
    icon: <Icon fontSize="small">people</Icon>,
    route: "/people",
    // component: <Analytics />,
    component: <ProtectedRoute element={<Members />} />, // Protected
    roles: ["admin", "influencer"]
  },
  {
    type: "collapse",
    name: "Chat",
    key: "chat",
    icon: <Icon fontSize="small">chat</Icon>,
    route: "/chat",
    // component: <Analytics />,
    component: <ProtectedRoute element={<Chat />} />, // Protected
    roles: ["admin", "influencer"]
  },
  {
    type: "collapse",
    name: "Help Center",
    key: "help_center",
    icon: <Icon fontSize="small">help</Icon>,
    route: "/help",
    // component: <Analytics />,
    component: <ProtectedRoute element={<HelpCenter />} />, // Protected
    roles: ["admin", "influencer"]
  },
  {
    // type: "collapse",
    name: "Profile",
    key: "profile",
    // icon: <Icon fontSize="small">person</Icon>,
    route: "/profile",
    // component: <Profile />,
    component: <ProtectedRoute element={<Profile />} />, // Protected
  },
  {
    // type: "collapse",
    name: "Sign In",
    key: "sign-in",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/sign-in",
    component: <SignIn />,
  },
  {
    // type: "collapse",
    name: "Sign Up",
    key: "sign-up",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/sign-up",
    component: <SignUp />,
  },
  {
     // type: "collapse",
     name: "DataDeletion",
     key: "data-deletion",
     icon: <Icon fontSize="small">DataDeletion</Icon>,
     route: "/data-deletion",
     component: <DataDeletion />,
   },
   {
     // type: "collapse",
     name: "Privacy Policy",
     key: "privacy-policy",
     icon: <Icon fontSize="small">Privacy Policy</Icon>,
     route: "/privacy-policy",
     component: <PrivacyPolicy />,
   },
   {
     // type: "collapse",
     name: "Terms And Conditions",
     key: "terms-and-conditions",
     icon: <Icon fontSize="small">Terms And Conditions</Icon>,
     route: "/terms-and-conditions",
     component: <TermsAndConditions />,
   },
  {
    name: "Home",
    key: "home",
    route: "/",
    component: <Home />,
  },

];

export default routes;