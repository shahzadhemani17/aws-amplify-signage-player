import styles from "../../../../styles/Home.module.css";
import { labels } from "./labels";

export const SplashScreen = () => {
  return (
    <div style={{ backgroundColor: "#1e1e2c" }} className={styles.container}>
      <div className={styles.main}>
        {/* {screenId && <h3 style={{ padding: 42 }}>{screenId}</h3> } */}
        <h2 className={styles.welcomeText}>{labels.welcomeToSkoopSignage}</h2>
        <div className={styles.inlineDisplay}>
          <h3 className="textLeft">{labels.nextSteps}</h3>
          <div className={styles.flexGrid24}>
            <h4 className={styles.step}>{labels.step1}</h4>
            <h4 className={styles.textPadding}>{labels.goTopPlaylistPage}</h4>
          </div>
          <div className={styles.flexGrid24}>
            <h4 style={{ color: "#00b7af", paddingTop: 8 }}>{labels.step2}</h4>
            <h4 className={styles.textPadding}>{labels.goToScreenPage}</h4>
          </div>
        </div>
      </div>
    </div>
  );
};
