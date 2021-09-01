import React from "react";
import Link from "next/link";
import style from "../styles/component/Menu.module.css";

function Menu({ menuProps }) {
  return (
    <div className={style.content}>
      {menuProps.map((m, index) => (
        <Link key={index} href={`/category/${m.url}`}>
          <a className={style.item}>
            <span>{m.name}</span>
            <span>{m.count}</span>
          </a>
        </Link>
      ))}
    </div>
  );
}

export default Menu;
