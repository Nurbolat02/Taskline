import styles from "../auth-page.module.css";
import { RegisterForm } from "@/features/auth/register-form";

export default function RegisterPage() {
  return (
    <div className={styles.page}>
      <div className={styles.heading}>
        <h1 className={styles.title}>Sign up</h1>
        <p className={styles.subtitle}>Create an account to get started</p>
      </div>
      <RegisterForm />
    </div>
  );
}
