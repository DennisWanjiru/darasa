"use client";
import React, { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import Add from "@/assets/add.svg";

import { Database } from "@/lib/schema";

type Profile = Database["public"]["Tables"]["profile"]["Row"];

export default function Avatar({
  uid,
  url,
  onUpload,
}: {
  uid: string;
  url: Profile["avatar_url"];
  onUpload: (url: string) => void;
}) {
  const supabase = createClientComponentClient<Database>();
  const [avatarUrl, setAvatarUrl] = useState<Profile["avatar_url"]>(url);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    async function downloadImage(path: string) {
      try {
        const { data, error } = await supabase.storage
          .from("avatars")
          .download(path);

        if (error) {
          throw error;
        }

        const avatarUrl = URL.createObjectURL(data);
        setAvatarUrl(avatarUrl);
      } catch (error) {
        console.log("Error downloading image: ", error);
      }
    }

    if (url) downloadImage(url);
  }, [url, supabase]);

  const uploadAvatar: React.ChangeEventHandler<HTMLInputElement> = async (
    event
  ) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const filePath = `${uid}-${Math.random()}.${fileExt}`;

      let { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      onUpload(filePath);
    } catch (error) {
      alert("Error uploading avatar!");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative">
      {avatarUrl ? (
        <Image
          width={96}
          height={96}
          src={avatarUrl}
          alt="Avatar"
          className="h-24 rounded-[20px] object-cover"
        />
      ) : (
        <div className="h-24 w-24 bg-gray-100 rounded-[20px]" />
      )}

      <div className="absolute -right-2 -bottom-1">
        <label htmlFor="avatar" className="cursor-pointer">
          <Image src={Add} alt="add button" />
        </label>
        <input
          style={{
            visibility: "hidden",
            position: "absolute",
          }}
          type="file"
          id="avatar"
          accept="image/*"
          onChange={uploadAvatar}
          disabled={uploading}
        />
      </div>
    </div>
  );
}
