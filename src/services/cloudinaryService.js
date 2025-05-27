export async function uploadVideoToCloudinary(file) {
  const url = `https://api.cloudinary.com/v1_1/dykmzybz5/video/upload`;
  const formData = new FormData();

  formData.append("file", file);
  formData.append("upload_preset", "funtlibra");

  try {
    const res = await fetch(url, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    return data.secure_url;
  } catch (error) {
    console.error("❌ Erro ao enviar para Cloudinary:", error);
    throw error;
  }
}
