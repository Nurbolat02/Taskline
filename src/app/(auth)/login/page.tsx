import { LoginForm } from "@/features/auth/login-form";
import styles from "../auth-page.module.css";

export default function LoginPage() {
  return (
    <div className={styles.page}>
      <div className={styles.heading}>
        <h1 className={styles.title}>Вход</h1>
        <p className={styles.subtitle}>Введите email и пароль</p>
      </div>
      <LoginForm />
    </div>
  );
}
