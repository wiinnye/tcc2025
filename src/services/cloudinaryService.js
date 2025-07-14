export async function uploadVideoToCloudinary(file) {
  const url = `https://api.cloudinary.com/v1_1/dykmzybz5/video/upload`;
  const formData = new FormData();

  formData.append("file", file);
  formData.append("upload_preset", "funtlibra");
  formData.append("resource_type", "video");

  try {
    const res = await fetch(url, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    const videoUrl = data.secure_url;
    const thumbnailUrl = videoUrl
    .replace("/upload/", "/upload/so_5/") // so_5 = start offset 5s
    .replace(".mp4", ".jpg");

    return { videoUrl, thumbnailUrl };
  } catch (error) {
    console.error("❌ Erro ao enviar para Cloudinary:", error);
    throw error;
  }
}
