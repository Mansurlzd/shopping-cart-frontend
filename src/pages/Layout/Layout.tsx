import React from 'react'
import Navbar from "../../components/Navbar/Navbar";
import Home from "../Home/Home";

export default function Layout({children}) {
    return (
        <>
      <Navbar />
      <Home />
      {children}
    </>
    )
}
