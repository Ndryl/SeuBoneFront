"use client";
import { app } from "@/auth/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getFirestore,
} from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from "firebase/storage";
import { CloudDownload, Upload } from "lucide-react";
import { useRef, useState } from "react";

interface imageProps {
  setImageUrl: (url: string | null) => void;
  imageUrl: string | null;
  setPreviewFile: (file: File | null) => void;
  previewFile: File | null;
}

export default function ImageInput({
  imageUrl,
  setImageUrl,
  previewFile,
  setPreviewFile,
}: imageProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [docId, setDocId] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const storage = getStorage(app);
  const firestore = getFirestore(app);

  const uploadImage = async (file: File) => {
    const imageRef = ref(storage, `images/${file.name}`);
    await uploadBytes(imageRef, file);
    const downloadURL = await getDownloadURL(imageRef);

    // Armazena metadados no Firestore
    const docRef = await addDoc(collection(firestore, "images"), {
      url: downloadURL,
      name: file.name,
      createdAt: new Date(),
    });

    return { downloadURL, docId: docRef.id };
  };
  const deleteImage = async (fileName: string, docId: string) => {
    const imageRef = ref(storage, `images/${fileName}`);
    await deleteObject(imageRef); // remove do Storage
    await deleteDoc(doc(firestore, "images", docId)); // remove do Firestore
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  };
  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file.");
      return;
    }

    setIsUploading(true);
    const { downloadURL, docId } = await uploadImage(file);
    setImageUrl(downloadURL);
    setPreviewFile(file);
    setDocId(docId);
    setFileName(file.name);
    setIsUploading(false);
  };

  const handleDelete = async () => {
    if (fileName && docId) {
      await deleteImage(fileName, docId);
      setImageUrl(null);
      setPreviewFile(null);
      setDocId(null);
      setFileName(null);
    }
  };

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div
        className={`flex flex-col items-center justify-center gap-2 p-8 w-3xs h-40 mx-auto mt-6 mb-10 rounded-md shadow-sm border-2 border-dashed border-[#D1D1D6]`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
      >
        {imageUrl ? (
          // Mostra a imagem quando houver uma URL
          <div className="relative w-96 h-96">
            <img
              src={imageUrl}
              alt="Uploaded preview"
              className="max-w-full max-h-[250px] object-contain mx-auto"
            />
            <button
              onClick={handleDelete}
              className="absolute top-0 right-0  rounded-full w-6 h-6 flex items-center justify-center"
            >
              ×
            </button>
          </div>
        ) : (
          // Mostra o conteúdo padrão quando não houver imagem
          <>
            <div className="flex justify-center  ">
              <CloudDownload className="text-[#8E8E93]" />
            </div>
            <div className="text-center">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="absolute right-[9999px]"
                disabled={isUploading}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleFile(file);
                  }
                }}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-[#8E8E93] font-semibold hover:underline cursor-pointer"
                disabled={isUploading}
              >
                {isUploading ? "Uploading..." : "Carregue um arquivo"}
              </button>
              <p className="text-gray-700 font-medium">
                Escolha um arquivo ou arraste aqui
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
