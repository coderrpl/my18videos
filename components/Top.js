import React from "react";
import Link from "next/link";
import style from "../styles/component/Top.module.css";

function Top() {
  return (
    <div className={style.content}>
      <Link href="/">
        <a>
          <img src="/logo.svg" alt="my18videos" />
        </a>
      </Link>
    </div>
  );
}

export default Top;
