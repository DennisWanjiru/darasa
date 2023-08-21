"use client";

export default function ViewProfileLink() {
  return (
    // @ts-ignore
    <li onClick={() => window.profile.showModal()}>
      <a>View Profile</a>
    </li>
  );
}
