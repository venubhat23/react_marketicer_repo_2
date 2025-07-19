/**
 * Simplified routes configuration for role-based sidebar demonstration
 */

import React from "react";
import Dashboard from "./layouts/dashboard";
import Calendar from "./layouts/calendar";
import Media from "./layouts/media";
import Explore from "./layouts/explore";
import Analytics from "./layouts/analytics";
import Reporting from "./layouts/reporting";
import Invoice from "./layouts/invoice";

// @mui icons
import Icon from "@mui/material/Icon";
import ProtectedRoute from "./components/ProctedRoute";

const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <ProtectedRoute><Dashboard /></ProtectedRoute>,
    roles: ["admin", "influencer", "brand"]
  },
  {
    type: "collapse",
    name: "Calendar",
    key: "calendar",
    icon: <Icon fontSize="small">calendar_today</Icon>,
    route: "/calendar",
    component: <ProtectedRoute><Calendar /></ProtectedRoute>,
    roles: ["admin", "influencer"]
  },
  {
    type: "collapse",
    name: "Media",
    key: "media",
    icon: <Icon fontSize="small">perm_media</Icon>,
    route: "/media",
    component: <ProtectedRoute><Media /></ProtectedRoute>,
    roles: ["admin", "influencer"]
  },
  {
    type: "collapse",
    name: "Explore",
    key: "explore",
    icon: <Icon fontSize="small">explore</Icon>,
    route: "/explore",
    component: <ProtectedRoute><Explore /></ProtectedRoute>,
    roles: ["brand", "admin"]
  },
  {
    type: "collapse",
    name: "Analytics",
    key: "analytics",
    icon: <Icon fontSize="small">analytics</Icon>,
    route: "/analytics",
    component: <ProtectedRoute><Analytics /></ProtectedRoute>,
    roles: ["brand", "admin", "influencer"]
  },
  {
    type: "collapse",
    name: "Reports",
    key: "reporting",
    icon: <Icon fontSize="small">summarize</Icon>,
    route: "/reporting",
    component: <ProtectedRoute><Reporting /></ProtectedRoute>,
    roles: ["admin", "influencer"]
  },
  {
    type: "collapse",
    name: "Invoice",
    key: "invoice",
    icon: <Icon fontSize="small">receipt</Icon>,
    route: "/invoice",
    component: <ProtectedRoute><Invoice /></ProtectedRoute>,
    roles: ["admin", "influencer", "brand"]
  }
];

export default routes;