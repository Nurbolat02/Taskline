import { LoginForm } from "@/features/auth/login-form";
import styles from "../auth-page.module.css";

export default function LoginPage() {
  return (
    <div className={styles.page}>
      <div className={styles.heading}>
        <h1 className={styles.title}>Log in</h1>
        <p className={styles.subtitle}>Enter your email and password</p>
      </div>
      <LoginForm />
    </div>
  );
}
