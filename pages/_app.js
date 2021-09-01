import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/globals.css";
import Top from "../components/Top";
import Menu from "../components/Menu";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }) {
  const [menu, menuChange] = useState([]);
  const router = useRouter();

  useEffect(async () => {
    let menuData = [];
    const menu = await axios.get(`${process.env.HOST}/categories`);
    menu.data.forEach((v) => {
      menuData.push({
        name: v.name,
        count: v.count,
        url: v.url,
      });
    });
    menuChange(menuData);
  }, []);
  return (
    <div className="App">
      <Top />
      <div className="App_content">
        {router.pathname !== "/admin" && <Menu menuProps={menu} />}

        <Component {...pageProps} />
      </div>
    </div>
  );
}

export default MyApp;
