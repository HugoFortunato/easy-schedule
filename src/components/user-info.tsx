import React from "react";

export default function UserInfo({
  loggedUser,
}: {
  loggedUser: { email?: string };
}) {
  return (
    <>
      <h1 className="text-xl font-bold">Dashboard</h1>
      <p>Usuário logado: {loggedUser.email}</p>
    </>
  );
}
