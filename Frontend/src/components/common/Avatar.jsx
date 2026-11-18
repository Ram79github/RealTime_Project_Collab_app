import React from "react";
import { people } from "../../data/mockData.js";

export function Avatar({ person, size = "" }) {
  const member = typeof person === "number" ? people[person] : person;
  return <span className={`avatar ${member?.color || "lilac"} ${size}`} title={member?.name}>{member?.initials || "?"}</span>;
}

export function AvatarStack({ ids = [], limit = 4 }) {
  return <div className="avatar-stack">{ids.slice(0, limit).map((id) => <Avatar key={typeof id === "object" ? id.id || id.name : id} person={id} />)}{ids.length > limit && <span className="avatar extra">+{ids.length - limit}</span>}</div>;
}
