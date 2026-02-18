"use client";

import { useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, GripVertical, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import Image from "next/image";

const MAX_IMAGES = 10;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export interface UploadedImage {
  id: string;
  url: string;
  key: string;
  name: string;
  order: number;
}

interface ImageUploadProps {
  images: UploadedImage[];
  onImagesChange: (images: UploadedImage[]) => void;
  listingId?: string;
  className?: string;
}

export function ImageUpload({ images, onImagesChange, listingId, className }: ImageUploadProps) {
  const t = useTranslations("ImageUpload");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(async (file: File): Promise<UploadedImage | null> => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError(t("invalidType"));
      return null;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError(t("fileTooLarge"));
      return null;
    }

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          listingId: listingId || "temp",
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Upload failed");
      }

      const { presignedUrl, key } = await res.json();

      const uploadRes = await fetch(presignedUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });

      if (!uploadRes.ok) {
        throw new Error("Failed to upload to storage");
      }

      const publicUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL
        ? `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${key}`
        : key;

      return {
        id: crypto.randomUUID(),
        url: publicUrl,
        key,
        name: file.name,
        order: images.length,
      };
    } catch (err) {
      console.error("Upload error:", err);
      setError(err instanceof Error ? err.message : t("uploadError"));
      return null;
    }
  }, [images.length, listingId, t]);

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const remaining = MAX_IMAGES - images.length;

    if (remaining <= 0) {
      setError(t("maxImagesReached", { max: MAX_IMAGES }));
      return;
    }

    const filesToUpload = fileArray.slice(0, remaining);
    setUploading(true);
    setError(null);

    const results = await Promise.all(filesToUpload.map(uploadFile));
    const uploaded = results.filter((r): r is UploadedImage => r !== null);

    if (uploaded.length > 0) {
      onImagesChange([...images, ...uploaded]);
    }

    setUploading(false);
  }, [images, onImagesChange, uploadFile, t]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const handleRemove = useCallback((id: string) => {
    const updated = images.filter((img) => img.id !== id).map((img, i) => ({ ...img, order: i }));
    onImagesChange(updated);
  }, [images, onImagesChange]);

  const handleReorder = useCallback((fromIndex: number, toIndex: number) => {
    const updated = [...images];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    onImagesChange(updated.map((img, i) => ({ ...img, order: i })));
  }, [images, onImagesChange]);

  const handleDragStart = (index: number) => {
    setDragIndex(index);
  };

  const handleDragOverItem = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragIndex !== null && dragIndex !== index) {
      handleReorder(dragIndex, index);
      setDragIndex(index);
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-center transition-colors cursor-pointer",
          dragOver ? "border-primary bg-primary/5" : "border-border/50 bg-surface-2/20 hover:border-border",
          uploading && "opacity-50 pointer-events-none"
        )}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="h-8 w-8 text-muted-foreground mb-3" />
        <p className="text-sm text-muted-foreground mb-1">
          {uploading ? t("uploading") : t("dragDrop")}
        </p>
        <p className="text-xs text-muted-foreground">
          {t("formats")} · {t("maxSize")} · {t("maxCount", { max: MAX_IMAGES })}
        </p>
        <Button variant="secondary" className="mt-4" type="button" disabled={uploading}>
          {t("selectFiles")}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {images.map((img, index) => (
            <div
              key={img.id}
              className="group relative aspect-square rounded-lg overflow-hidden border bg-surface-2/30"
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOverItem(e, index)}
              onDragEnd={() => setDragIndex(null)}
            >
              <Image
                src={img.url}
                alt={img.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
              />
              {index === 0 && (
                <div className="absolute top-1 left-1 bg-primary text-primary-foreground text-[10px] font-medium px-1.5 py-0.5 rounded">
                  {t("cover")}
                </div>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
              <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleRemove(img.id); }}
                  className="p-1 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="absolute bottom-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab">
                <GripVertical className="h-4 w-4 text-white drop-shadow" />
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        {t("imageCount", { count: images.length, max: MAX_IMAGES })}
        {images.length > 0 && ` · ${t("dragToReorder")}`}
      </p>
    </div>
  );
}
