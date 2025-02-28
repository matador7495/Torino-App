"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGetUserData } from "@/services/queries";
import AuthForm from "@/template/authForm";
import ProfileDropdown from "@/element/ProfileDropdown";
import Profile from "@icons/profile.svg";
import styles from "@/layout/Header.module.css";

export default function Header() {
  const { data } = useGetUserData();
  const [isOpen, setIsOpen] = useState(false);

  const toggleAuthModal = () => setIsOpen((prev) => !prev);

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Image src={"/images/Logo.png"} alt="logo" width={144} height={44} priority />
        <div className={styles.nav__list}>
          <ul>
            <li>
              <Link href="/" className={styles.active}>
                صفحه اصلی
              </Link>
            </li>
            <li>
              <Link href="#">خدمات گردشگری</Link>
            </li>
            <li>
              <Link href="#">درباره ما</Link>
            </li>
            <li>
              <Link href="#">تماس با ما</Link>
            </li>
          </ul>
        </div>

        {data?.data ? (
          <ProfileDropdown user={data?.data} />
        ) : (
          <button className={styles.nav__profile} onClick={toggleAuthModal}>
            <Profile /> ورود | ثبت نام
          </button>
        )}

        <AuthForm isOpen={isOpen} setIsOpen={setIsOpen} />
      </nav>
    </header>
  );
}
