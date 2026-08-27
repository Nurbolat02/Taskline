import styles from "../auth-page.module.css";
import { RegisterForm } from "@/features/auth/register-form";

export default function RegisterPage() {
  return (
    <div className={styles.page}>
      <div className={styles.heading}>
        <h1 className={styles.title}>Регистрация</h1>
        <p className={styles.subtitle}>Создайте аккаунт, чтобы начать</p>
      </div>
      <RegisterForm />
    </div>
  );
}
