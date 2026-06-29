export const uploadFile = (
  fileUploadInput,
  fileNamer,
  returnAsBase64 = true,
  preview = null
) => {
  return new Promise((resolve, reject) => {
    const fileInput = document.getElementById(fileUploadInput);
    const fileNameInput = document.getElementById(fileNamer);
    const previewImage = preview ? document.getElementById(preview) : null;

    fileInput.click();

    // Listen for the file input change event
    fileInput.addEventListener("change", function () {
      const filePath = this.value;
      // Set the filename into the fileNameInput
      fileNameInput.value = filePath.replace(/C:\\fakepath\\/i, "");

      // If there's a file, load it using FileReader
      if (this.files && this.files[0]) {
        const reader = new FileReader();

        // Listen for the file load event (when the file is read)
        reader.onload = function (e) {
          if (previewImage) {
            previewImage.src = e.target.result;
          }
          if (returnAsBase64) resolve(e.target.result.split(",")[1]);
          else resolve(fileInput.files[0]);
        };

        // If an error occurs during reading
        reader.onerror = function (err) {
          reject(err);
        };

        // Convert the file to Data URL
        reader.readAsDataURL(this.files[0]);
      } else {
        reject(new Error("No file selected"));
      }
    });
  });
};

export const closePreview = (fileInputId, previewImageId) => {
  // Get the hidden input field and image elements by their IDs
  const fileInput = document.getElementById(fileInputId);
  const previewImage = document.getElementById(previewImageId);

  if (fileInput) {
    fileInput.value = "";
  }

  // Remove the src attribute from the image (or set it to an empty string)
  if (previewImage) {
    previewImage.src = "";
    previewImage.alt = "Imagem removida"; // Optionally update the alt text
  }
};

export const combineBase64 = async (
  file1,
  file2,
  mimeType = "application/octet-stream"
) => {
  // Decode base64 strings to binary data
  const binaryData1 = Uint8Array.from(atob(file1), (c) => c.charCodeAt(0));
  const binaryData2 = Uint8Array.from(atob(file2), (c) => c.charCodeAt(0));

  // Combine both binary arrays into one
  const combinedBinaryData = new Uint8Array(
    binaryData1.length + binaryData2.length
  );

  combinedBinaryData.set(binaryData1);
  combinedBinaryData.set(binaryData2, binaryData1.length);

  // Create a new Blob from combined binary data with the specified MIME type
  return new Blob([combinedBinaryData], { type: mimeType });
};

export const combine2Base64 = async (
  file1,
  file2,
  mimeType = "application/octet-stream"
) => {
  // Decode base64 strings to binary data
  const binaryData1 = Uint8Array.from(atob(file1), (c) => c.charCodeAt(0));
  const binaryData2 = Uint8Array.from(atob(file2), (c) => c.charCodeAt(0));

  // Combine both binary arrays into one
  const combinedBinaryData = new Uint8Array(
    binaryData1.length + binaryData2.length
  );
  combinedBinaryData.set(binaryData1);
  combinedBinaryData.set(binaryData2, binaryData1.length);

  // Create a new Blob from combined binary data with the specified MIME type
  const combinedBlob = new Blob([combinedBinaryData], { type: mimeType });

  // Convert the Blob to a Base64 URL
  return await new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(combinedBlob);
  });
};
