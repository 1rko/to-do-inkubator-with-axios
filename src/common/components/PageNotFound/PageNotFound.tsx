import styles from "./PageNotFound.module.css"
import { NavLink } from "react-router"
import { Path } from "@/common/routing"

export const PageNotFound = () => (
  <>
    <h1 className={styles.title}>404</h1>
    <h2 className={styles.subtitle}>page not found</h2>
    <NavLink to={Path.Main} className={styles.buttonClass}>На главную</NavLink>
  </>
)