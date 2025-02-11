"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { DatePicker } from "zaman";
import { useGetUserData } from "@/services/queries";
import { useUpdateUserInfo } from "@/services/mutations";
import { personalInfoSchema } from "@/schema/index";
import { SplitDate } from "@/utils/helper";
import { e2p } from "@/utils/replaceNumber";
import ModalContainer from "@/modal/ModalContainer";
import Edit from "@icons/edit.svg";
import styles from "@/template/profilePage/styles.module.css";

export default function PersonalInfo() {
  const { data: { data: userData } = {} } = useGetUserData();
  const { mutate, isPending } = useUpdateUserInfo();
  const [isOpen, setIsOpen] = useState(false);

  const toggleAuthModal = () => {
    setIsOpen((prev) => !prev);
  };

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(personalInfoSchema),
  });

  const submitHandler = (data) => {
    if (isPending) return;

    mutate(data, {
      onSuccess: (data) => {
        toast.success(data?.data.message);
        setIsOpen(false);
      },
      onError: (error) => {
        toast.error(`message: ${error?.data.message} - Code: ${error?.status}`);
        console.log(error);
      },
    });
  };

  return (
    <div className={styles.form__container} style={{ margin: "24px auto" }}>
      <div className={styles.infoHeader}>
        <h2>اطلاعات شخصی</h2>
        <div className={styles.submit}>
          <Edit />
          <button onClick={toggleAuthModal}>{"ویرایش اطلاعات"}</button>
        </div>
      </div>
      <div className={styles.infoGrid}>
        <div className={styles.row}>
          <span className={styles.label}>نام و نام خانوادگی</span>
          <span className={styles.value}>
            {userData?.firstName || "ثبت نشده است"} {userData?.lastName}
          </span>
          <span className={styles.label}>کدملی</span>
          <span className={styles.value}>{e2p(userData?.nationalCode) || "ثبت نشده است"}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>جنسیت</span>
          <span className={styles.value}>{userData?.gender === "male" ? "مرد" : userData?.gender === "female" ? "زن" : "ثبت نشده است"}</span>
          <span className={styles.label}>تاریخ تولد</span>
          <span className={styles.value}>
            {userData?.birthDate
              ? new Date(userData.birthDate).toLocaleDateString("fa-IR", { day: "2-digit", month: "long", year: "numeric" })
              : "ثبت نشده است"}
          </span>
        </div>
      </div>

      <ModalContainer setIsOpen={setIsOpen} isOpen={isOpen}>
        <form className={styles.form__edit} onSubmit={handleSubmit(submitHandler)}>
          <div className={styles.form__inputs}>
            <label>نام</label>
            <input type="text" defaultValue={userData?.firstName} {...register("firstName")} />
            <p className={styles.error}>{errors.firstName?.message || "‎"}</p>

            <label>نام خانوادگی</label>
            <input type="text" defaultValue={userData?.lastName} {...register("lastName")} />
            <p className={styles.error}>{errors.lastName?.message || "‎"}</p>

            <label>کدملی</label>
            <input type="number" defaultValue={userData?.nationalCode} {...register("nationalCode", { valueAsNumber: true })} />
            <p className={styles.error}>{errors.nationalCode?.message || "‎"}</p>

            <div className={styles.form__selects}>
              <label>جنسیت</label>
              <select {...register("gender")} defaultValue={userData?.gender}>
                <option value="female">زن</option>
                <option value="male">مرد</option>
              </select>

              <label>تاریخ تولد</label>
              <Controller
                control={control}
                name="birthDate"
                render={({ field: { onChange } }) => (
                  <DatePicker
                    accentColor="#28a745"
                    position="center"
                    defaultValue={userData?.birthDate}
                    round="x2"
                    inputClass={styles.datePicker}
                    onChange={(e) => onChange(SplitDate(e.value))}
                  />
                )}
              />
            </div>
            <p className={styles.error}>{errors.birthDate?.message || "‎"}</p>

            <div className={styles.buttons}>
              <button type="submit">تایید</button>
              <button type="button" onClick={() => setIsOpen(false)}>
                انصراف
              </button>
            </div>
          </div>
        </form>
      </ModalContainer>
    </div>
  );
}
