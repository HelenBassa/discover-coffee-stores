import Link from "next/link";
import Image from "next/image";
import cls from "classnames";

import styles from "./Card.module.css";

const Card = (props) => {
  return (
    <Link href={props.href} className={styles.cardLink}>
      <div className={cls("glass", styles.container)}>
        <div className={styles.cardHeaderWrapper}>
          <h2 className={styles.cardHeader}>{props.name}</h2>
        </div>
        <div className={styles.cardImageWrapper}>
          <Image
            className={styles.cardImage}
            src={props.imgUrl}
            alt={props.alt}
            fill
          />
        </div>
      </div>
    </Link>
  );
};

export default Card;
