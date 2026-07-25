"use client";

import { useState } from "react";
import styles from "./page.module.css";

export default function FollowButton() {
  const [following, setFollowing] = useState(false);

  return (
    <button
      className={styles.followButton}
      type="button"
      aria-pressed={following}
      onClick={() => setFollowing((current) => !current)}
    >
      {following ? "Following" : "Follow"}
    </button>
  );
}
