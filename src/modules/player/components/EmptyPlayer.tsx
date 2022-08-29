import React from "react";
import styles from "../../../../styles/Home.module.css";

export const EmptyPlayer = (props: any) => {
  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <h1 className="font80">{props.message}</h1>
      </div>
    </div>
  );
};
