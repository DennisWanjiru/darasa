"use client";

import { CurrentUser } from "@/lib/types";
import ProfileModal from "./modals/ProfileModal";
import { useState } from "react";

export default function ViewProfileLink({ user }: { user: CurrentUser }) {
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <li
        onClick={() => {
          setOpenModal(true);
        }}
      >
        <a>View Profile</a>
      </li>
      {user && openModal ? (
        <ProfileModal user={user} onClose={() => setOpenModal(false)} />
      ) : null}
    </>
  );
}
