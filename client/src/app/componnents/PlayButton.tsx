import styles from "./playbutton.module.css";

const PlayButton = () => {
  return (
    <div className={styles.circle}>
      <span className={styles.circle__btn}></span>
      <span className={styles.circle__back1}></span>
      <span className={styles.circle__back2}></span>
    </div>
  );
};

export default PlayButton;
