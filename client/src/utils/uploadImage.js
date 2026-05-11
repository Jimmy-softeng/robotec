import { supabase } from "../supabase";

export const uploadImage = async (file) => {
  if (!file) throw new Error("No file selected");

  const fileName = `${Date.now()}-${file.name}`;

  const { error } = await supabase.storage
    .from("products")
    .upload(fileName, file);

  if (error) {
    console.error(error);
    throw new Error("Upload failed");
  }

  const { data } = supabase.storage
    .from("products")
    .getPublicUrl(fileName);

  return data.publicUrl;
};