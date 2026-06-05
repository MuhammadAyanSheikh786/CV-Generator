"use client";

import { useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Modal } from "./modal";
import { Button } from "./button";

interface PhotoUploadProps {
  value: string;
  onChange: (dataUrl: string) => void;
}

export function PhotoUpload({ value, onChange }: PhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [showCrop, setShowCrop] = useState(false);
  const [cropX, setCropX] = useState(0);
  const [cropY, setCropY] = useState(0);
  const [cropSize, setCropSize] = useState(150);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0 });
  const [resizeInitSize, setResizeInitSize] = useState(150);
  const [imgNatural, setImgNatural] = useState({ w: 0, h: 0 });

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        imageRef.current = img;
        setImgNatural({ w: img.naturalWidth, h: img.naturalHeight });
        setCropX(0);
        setCropY(0);
        setCropSize(Math.min(img.naturalWidth, img.naturalHeight, 300));
        setShowCrop(true);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  }, []);

  const applyCrop = useCallback(() => {
    const img = imageRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const displaySize = 400;
    canvas.width = displaySize;
    canvas.height = displaySize;

    const scaleX = img.naturalWidth / 400;
    const scaleY = img.naturalHeight / 400;
    const sx = cropX * scaleX;
    const sy = cropY * scaleY;
    const sSize = cropSize * scaleX;

    ctx.clearRect(0, 0, displaySize, displaySize);

    const clipR = displaySize / 2;
    ctx.beginPath();
    ctx.arc(clipR, clipR, clipR, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    ctx.drawImage(img, sx, sy, sSize, sSize, 0, 0, displaySize, displaySize);

    onChange(canvas.toDataURL("image/jpeg", 0.92));
    setShowCrop(false);
  }, [cropX, cropY, cropSize, onChange]);

  const handleDelete = () => {
    onChange("");
    imageRef.current = null;
  };

  const handleReplace = () => {
    inputRef.current?.click();
  };

  const handleCropMouseDown = (e: React.MouseEvent, type: "move" | "resize") => {
    e.preventDefault();
    if (type === "move") {
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
    } else {
      setIsResizing(true);
      setResizeStart({ x: e.clientX, y: e.clientY });
      setResizeInitSize(cropSize);
    }
  };

  const handleCropMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;
      setCropX((prev) => Math.max(0, Math.min(400 - cropSize, prev + dx)));
      setCropY((prev) => Math.max(0, Math.min(400 - cropSize, prev + dy)));
      setDragStart({ x: e.clientX, y: e.clientY });
    }
    if (isResizing) {
      const dx = e.clientX - resizeStart.x;
      const newSize = Math.max(50, Math.min(400, resizeInitSize + dx));
      setCropSize(newSize);
    }
  };

  const handleCropMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = "";
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-1.5"
      >
        <label className="block text-xs font-medium text-dark-500 dark:text-dark-400 uppercase tracking-wider">
          Profile Photo
        </label>

        <div className="flex items-center gap-4">
          {/* Preview */}
          <div className="relative shrink-0">
            {value ? (
              <div className="relative group">
                <div className="w-20 h-20 rounded-full overflow-hidden ring-2 ring-lightning-500/30 ring-offset-2 ring-offset-dark-950">
                  <img
                    src={value}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                  <button
                    onClick={handleReplace}
                    className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                    title="Replace"
                  >
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                  <button
                    onClick={handleDelete}
                    className="p-1.5 rounded-full bg-red-500/50 hover:bg-red-500/70 transition-colors"
                    title="Delete"
                  >
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => inputRef.current?.click()}
                className="w-20 h-20 rounded-full border-2 border-dashed border-dark-300 dark:border-dark-600 flex items-center justify-center hover:border-lightning-500/50 hover:bg-lightning-500/5 transition-all group"
              >
                <svg className="w-6 h-6 text-dark-400 dark:text-dark-500 group-hover:text-lightning-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </button>
            )}
          </div>

          <div className="text-xs text-dark-400 dark:text-dark-500">
            {value ? (
              <button
                onClick={() => inputRef.current?.click()}
                className="text-lightning-500 hover:underline"
              >
                Click to replace
              </button>
            ) : (
              <>
                <p>Upload a profile photo</p>
                <p className="mt-0.5">Optional - JPG or PNG, square preferred</p>
              </>
            )}
          </div>
        </div>
      </motion.div>

      {/* Crop Modal */}
      <Modal isOpen={showCrop} onClose={() => setShowCrop(false)} title="Crop Photo">
        <div
          className="relative w-full max-w-[400px] mx-auto"
          onMouseMove={handleCropMouseMove}
          onMouseUp={handleCropMouseUp}
          onMouseLeave={handleCropMouseUp}
        >
          {imageRef.current && (
            <div className="relative">
              <canvas
                ref={canvasRef}
                width={400}
                height={400}
                className="hidden"
              />
              <div className="relative w-[400px] h-[400px] max-w-full mx-auto overflow-hidden rounded-xl bg-dark-100 dark:bg-dark-800">
                <img
                  src={imageRef.current.src}
                  alt="Crop preview"
                  className="w-[400px] h-[400px] object-cover max-w-none"
                  style={{
                    objectPosition: `${-cropX}px ${-cropY}px`,
                    objectFit: "none",
                    width: 400,
                    height: 400,
                  }}
                  draggable={false}
                />
                {/* Dark overlay */}
                <div
                  className="absolute inset-0 bg-black/50"
                  style={{
                    clipPath: `polygon(
                      0% 0%, 100% 0%, 100% 100%, 0% 100%,
                      0% ${cropY}px, 100% ${cropY}px, 100% ${cropY + cropSize}px, 0% ${cropY + cropSize}px,
                      ${cropX}px ${cropY}px, ${cropX + cropSize}px ${cropY}px, ${cropX + cropSize}px ${cropY + cropSize}px, ${cropX}px ${cropY + cropSize}px
                    )`,
                  }}
                />
                {/* Crop circle */}
                <div
                  className="absolute border-2 border-white cursor-move"
                  style={{
                    left: cropX,
                    top: cropY,
                    width: cropSize,
                    height: cropSize,
                    borderRadius: "50%",
                    boxShadow: "0 0 0 9999px rgba(0,0,0,0.5)",
                  }}
                  onMouseDown={(e) => handleCropMouseDown(e, "move")}
                >
                  <div
                    className="absolute -bottom-1.5 -right-1.5 w-5 h-5 bg-white rounded-full border-2 border-lightning-500 cursor-nw-resize shadow-lg"
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      handleCropMouseDown(e, "resize");
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mt-4">
            <p className="text-xs text-dark-400">Drag circle to adjust, corner to resize</p>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => setShowCrop(false)}>
                Cancel
              </Button>
              <Button variant="lightning" size="sm" onClick={applyCrop}>
                Apply
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
