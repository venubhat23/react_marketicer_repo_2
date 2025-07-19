import React from "react";
import Dashboard from "./pages/Dashboard";
import CreatePost from "./pages/CreatePost/CreatePost";
import ContractPage from "./pages/Contract/ContractPage";
import SocialMedia from "./pages/SocialMedia";
import ProtectedRoute from "./components/ProctedRoute";

// @mui icons
import Icon from "@mui/material/Icon";

const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <ProtectedRoute element={<Dashboard />} />,
    roles: ["admin", "influencer", "brand"]
  },
  {
    type: "collapse",
    name: "Create Post",
    key: "create_post",
    icon: <Icon fontSize="small">post_add</Icon>,
    route: "/create-post",
    component: <ProtectedRoute element={<CreatePost />} />,
    roles: ["admin", "influencer"]
  },
  {
    type: "collapse",
    name: "Contract",
    key: "contract",
    icon: <Icon fontSize="small">description</Icon>,
    route: "/contracts",
    component: <ProtectedRoute element={<ContractPage />} />,
    roles: ["admin", "brand"]
  },
  {
    type: "collapse",
    name: "Analytics",
    key: "analytics",
    icon: <Icon fontSize="small">analytics</Icon>,
    route: "/analytics",
    component: <ProtectedRoute element={<Dashboard />} />, // Using Dashboard as placeholder
    roles: ["admin", "brand"]
  },
  {
    type: "collapse",
    name: "Social Media",
    key: "social_media",
    icon: <Icon fontSize="small">share</Icon>,
    route: "/social-media",
    component: <ProtectedRoute element={<SocialMedia />} />,
    roles: ["admin", "influencer"]
  },
];

export default routes;