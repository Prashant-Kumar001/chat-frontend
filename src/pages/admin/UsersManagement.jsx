import React, { useState, useEffect } from "react";
import Table from "../../shared/Table";
import { Avatar, Skeleton, Stack } from "@mui/material";
import AvatarCard from "../../shared/AvatarCard";
import { useGetAllUsersQuery } from "../../redux/api/api.js";
import { useError } from "../../hooks/hook.jsx";
import { transformFile } from "../../lib/features.js";
import NewLoader from "../../components/NewLoader.jsx";
const UsersManagement = () => {
  const { data: users, isLoading, isError, error } = useGetAllUsersQuery();
  const errors = [
    {
      isError: isError,
      error: Error,
    },
  ];
  useError(errors);


  const columns = [
    {
      field: "id",
      headerName: "ID",
      headerClassName: "table-header",
      width: 250,
    },
    {
      field: "avatar",
      headerName: "Avatar",
      headerClassName: "table-header",
      display: "flex",
      renderCell: (params) => (
        <Avatar alt={params.row.name} src={params.row.avatar} />
      ),
    },

    {
      field: "name",
      headerName: "Name",
      headerClassName: "table-header",
      width: 150,
    },

    {
      field: "username",
      headerName: "username",
      headerClassName: "table-header",
      width: 120,
    },
    {
      field: "groups",
      headerName: "Groups",
      headerClassName: "table-header",
      width: 120,
    },
    {
      field: "friends",
      headerName: "Friends",
      headerClassName: "table-header",
      width: 120,
    },
    {
      field: "role",
      headerName: "Role",
      headerClassName: "table-header",
      width: 120,
    },

  ];

  const [rows, setRows] = useState([]);
  useEffect(() => {
    setRows(
      users?.data?.allUsers?.map((user) => ({
        ...user,
        id: user._id,
        avatar: transformFile(user.avatar, 100)
      }))
    )
  }, [users]);

  return isLoading ? (
    <NewLoader/>
  ) : (
    <Table heading={"All Users"} columns={columns} rows={rows} />
  );
};

export default UsersManagement;
