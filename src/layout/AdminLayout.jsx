import React, { Suspense, useState } from "react";
import SideBar from "../pages/SideBar";
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import NewLoader from "../components/NewLoader";
import { Button, Drawer, Grid2, IconButton} from "@mui/material";
import { Navigate, Outlet } from "react-router-dom";

const AdminLayout = () => {
  const [isOpen, setOpen] = useState(false)


  return (
    <>

      <Drawer open={isOpen} onClose={() => setOpen(false)} >
        <SideBar />
      </Drawer>

      <Grid2
        sx={{
          display: { xs: "block", md: "none" },
          position: "fixed",
          right: 0,
          zIndex: 100

        }}
      >
        <IconButton onClick={() => setOpen(true)}>
          {isOpen ? <CloseIcon /> : <MenuIcon />}
        </IconButton>
      </Grid2>
      <Grid2 container
        className="flex-1 overflow-hidden"
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "350px 1fr",
          },
          gap: 1,
        }}>
        <Grid2 sx={{
          display: { xs: "none", md: "block" },
        }} >
          <SideBar />
        </Grid2>
        <Suspense fallback={<NewLoader />}>
          <Grid2
            sx={{
              height: "100%",
            }}
          >
            <Outlet />
          </Grid2>
        </Suspense>
      </Grid2>
    </>
  );
};

export default AdminLayout;