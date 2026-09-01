"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  RotateCw,
  RefreshCw,
  X,
  Move,
  Crop,
  Circle,
  Square,
  Sparkles,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ASPECT_RATIOS = [
  { label: "1:1 Logo", value: "1:1", ratio: 1, maskWidth: 260, maskHeight: 260, outW: 600, outH: 600 },
  { label: "16:9 Banner", value: "16:9", ratio: 16 / 9, maskWidth: 440, maskHeight: 247.5, outW: 1280, outH: 720 },
  { label: "4:3 Card", value: "4:3", ratio: 4 / 3, maskWidth: 320, maskHeight: 240, outW: 1024, outH: 768 },
  { label: "Free", value: "free", ratio: 1, maskWidth: 280, maskHeight: 280, outW: 800, outH: 800 },
];

export default function ImageCropModal({
  isOpen,
  onClose,
  imageSrc,
  onCropComplete,
  isUploading = false,
  title = "Crop & Edit Image",
  defaultAspect = "1:1", // '1:1' | '16:9' | '4:3' | 'free'
  defaultShape = "square", // 'circle' | 'square'
}) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [aspect, setAspect] = useState(defaultAspect);
  const [shape, setShape] = useState(defaultShape);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isProcessing, setIsProcessing] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({ naturalW: 0, naturalH: 0, renderedW: 0, renderedH: 0 });

  const containerRef = useRef(null);
  const imageRef = useRef(null);

  const activeAspect = ASPECT_RATIOS.find((a) => a.value === aspect) || ASPECT_RATIOS[0];

  // Auto-fit function: scales image to fit mask frame cleanly
  const fitToFrame = useCallback(() => {
    if (!imageRef.current || !imageRef.current.naturalWidth) {
      setZoom(1);
      setPosition({ x: 0, y: 0 });
      return;
    }
    const nw = imageRef.current.naturalWidth;
    const nh = imageRef.current.naturalHeight;
    const rw = imageRef.current.clientWidth || 360;
    const rh = imageRef.current.clientHeight || 270;

    setImageDimensions({ naturalW: nw, naturalH: nh, renderedW: rw, renderedH: rh });

    // Calculate zoom needed so image spans at least the mask box
    const scaleX = activeAspect.maskWidth / rw;
    const scaleY = activeAspect.maskHeight / rh;
    const idealZoom = Math.max(scaleX, scaleY, 0.5);

    setZoom(parseFloat(idealZoom.toFixed(2)));
    setPosition({ x: 0, y: 0 });
  }, [activeAspect]);

  // Reset state when modal opens or aspect changes
  useEffect(() => {
    if (isOpen) {
      setRotation(0);
      setAspect(defaultAspect);
      setShape(defaultAspect === "1:1" && defaultShape === "circle" ? "circle" : "square");
      // Fit to frame after render
      setTimeout(() => fitToFrame(), 50);
    }
  }, [isOpen, imageSrc, defaultAspect, defaultShape, fitToFrame]);

  // Handle Mouse / Touch Dragging
  const handlePointerDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    setDragStart({ x: clientX - position.x, y: clientY - position.y });
  };

  const handlePointerMove = useCallback(
    (e) => {
      if (!isDragging) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      setPosition({
        x: clientX - dragStart.x,
        y: clientY - dragStart.y,
      });
    },
    [isDragging, dragStart]
  );

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handlePointerMove);
      window.addEventListener("mouseup", handlePointerUp);
      window.addEventListener("touchmove", handlePointerMove);
      window.addEventListener("touchend", handlePointerUp);
    }
    return () => {
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("mouseup", handlePointerUp);
      window.removeEventListener("touchmove", handlePointerMove);
      window.removeEventListener("touchend", handlePointerUp);
    };
  }, [isDragging, handlePointerMove, handlePointerUp]);

  // Mouse Wheel Zoom
  const handleWheel = (e) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 0.08 : -0.08;
    setZoom((prev) => Math.min(Math.max(prev + zoomFactor, 0.2), 4.5));
  };

  const rotateLeft = () => setRotation((prev) => (prev - 90) % 360);
  const rotateRight = () => setRotation((prev) => (prev + 90) % 360);
  const handleReset = () => {
    setRotation(0);
    fitToFrame();
  };

  // Generate Cropped File using HTML5 Canvas with precise scale matching
  const handleApplyCrop = async () => {
    if (!imageSrc || isProcessing || isUploading) return;
    setIsProcessing(true);

    try {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = imageSrc;

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const canvas = document.createElement("canvas");
      canvas.width = activeAspect.outW;
      canvas.height = activeAspect.outH;

      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Could not get 2d context");

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();

      // If circle mask is selected (1:1 logo mode)
      if (aspect === "1:1" && shape === "circle") {
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
      }

      // Center context
      ctx.translate(canvas.width / 2, canvas.height / 2);

      // Rendered dimensions vs Natural dimensions scale factor
      const renderedW = imageRef.current?.clientWidth || 360;
      const renderedH = imageRef.current?.clientHeight || 270;

      const scaleRatioX = canvas.width / activeAspect.maskWidth;
      const scaleRatioY = canvas.height / activeAspect.maskHeight;

      ctx.translate(position.x * scaleRatioX, position.y * scaleRatioY);
      ctx.rotate((rotation * Math.PI) / 180);

      // Correct zoom transform relative to natural vs canvas size
      const drawScaleX = (zoom * canvas.width) / (renderedW * scaleRatioX);
      const drawScaleY = (zoom * canvas.height) / (renderedH * scaleRatioY);

      ctx.scale(drawScaleX, drawScaleY);

      ctx.drawImage(
        img,
        -img.naturalWidth / 2,
        -img.naturalHeight / 2,
        img.naturalWidth,
        img.naturalHeight
      );

      ctx.restore();

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            setIsProcessing(false);
            return;
          }
          const croppedFile = new File([blob], `cropped_banner_${Date.now()}.png`, {
            type: "image/png",
          });
          setIsProcessing(false);
          onCropComplete(croppedFile);
        },
        "image/png",
        0.95
      );
    } catch (err) {
      console.error("Error cropping image:", err);
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-md overflow-y-auto font-body">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className={`relative w-full ${
            aspect === "16:9" ? "max-w-3xl" : "max-w-2xl"
          } bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-4`}
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/90">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-600/20">
                <Crop className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 leading-snug">{title}</h3>
                <p className="text-xs text-slate-500 font-medium">
                  Drag to align, scale zoom slider, rotate or fit banner content cleanly
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              disabled={isUploading || isProcessing}
              className="p-2 rounded-xl text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition cursor-pointer disabled:opacity-50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Editor Body */}
          <div className="p-5 sm:p-6 space-y-5">
            {/* Aspect Ratio Selector Pills */}
            <div className="flex items-center justify-between gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200/80 overflow-x-auto">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider px-2 shrink-0">
                Crop Preset:
              </span>
              <div className="flex items-center gap-1.5 overflow-x-auto">
                {ASPECT_RATIOS.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => {
                      setAspect(item.value);
                      if (item.value !== "1:1") setShape("square");
                      setTimeout(() => fitToFrame(), 50);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                      aspect === item.value
                        ? "bg-indigo-600 text-white shadow-xs"
                        : "text-slate-600 hover:bg-slate-200/80"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Image View Container */}
            <div
              ref={containerRef}
              onWheel={handleWheel}
              onMouseDown={handlePointerDown}
              onTouchStart={handlePointerDown}
              style={{ height: aspect === "16:9" ? "340px" : "320px" }}
              className="relative w-full mx-auto rounded-3xl bg-slate-950 overflow-hidden shadow-inner flex items-center justify-center cursor-grab active:cursor-grabbing select-none border-2 border-dashed border-indigo-400/40"
            >
              {/* Image Preview Transformation Container */}
              <div
                className="absolute inset-0 flex items-center justify-center transition-transform duration-75"
                style={{
                  transform: `translate(${position.x}px, ${position.y}px) rotate(${rotation}deg) scale(${zoom})`,
                  transformOrigin: "center center",
                }}
              >
                {imageSrc && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    ref={imageRef}
                    src={imageSrc}
                    alt="Upload Preview"
                    onLoad={fitToFrame}
                    draggable={false}
                    className="max-w-none max-h-none pointer-events-none object-contain"
                    style={{
                      maxHeight: aspect === "16:9" ? "320px" : "300px",
                      maxWidth: aspect === "16:9" ? "560px" : "400px",
                    }}
                  />
                )}
              </div>

              {/* Dynamic Aspect Ratio Crop Mask Overlay */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div
                  style={{
                    width: `${activeAspect.maskWidth}px`,
                    height: `${activeAspect.maskHeight}px`,
                  }}
                  className={`border-2 border-white shadow-[0_0_0_9999px_rgba(15,23,42,0.7)] transition-all duration-300 ${
                    aspect === "1:1" && shape === "circle" ? "rounded-full" : "rounded-2xl"
                  }`}
                />
              </div>

              {/* Drag Hint Badge */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3.5 py-1 bg-slate-900/90 backdrop-blur-xs text-white text-[10px] font-bold rounded-full pointer-events-none flex items-center gap-1.5 border border-white/10 shadow-md">
                <Move className="w-3 h-3 text-indigo-400" /> Click & Drag to reposition banner
              </div>
            </div>

            {/* Editing Controls Toolbar */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-4">
              {/* Zoom Control Slider */}
              <div className="flex items-center gap-3">
                <ZoomOut className="w-4 h-4 text-slate-500 shrink-0" />
                <input
                  type="range"
                  min="0.2"
                  max="4.0"
                  step="0.05"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <ZoomIn className="w-4 h-4 text-slate-500 shrink-0" />
                <span className="text-xs font-bold text-slate-700 w-12 text-right">
                  {Math.round(zoom * 100)}%
                </span>
              </div>

              {/* Action Buttons Row */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-200/60">
                {/* Rotate & Fit Buttons */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={fitToFrame}
                    title="Fit whole image into crop frame"
                    className="px-3 py-2 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 transition text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Maximize2 className="w-3.5 h-3.5" /> Auto Fit Frame
                  </button>
                  <button
                    type="button"
                    onClick={rotateLeft}
                    title="Rotate 90° Left"
                    className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-indigo-600 transition text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={rotateRight}
                    title="Rotate 90° Right"
                    className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-indigo-600 transition text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCw className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    title="Reset position & zoom"
                    className="px-2.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 transition text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Reset
                  </button>
                </div>

                {/* Shape Mask Switcher (for 1:1) */}
                {aspect === "1:1" && (
                  <div className="flex items-center bg-slate-200/70 p-1 rounded-xl gap-1">
                    <button
                      type="button"
                      onClick={() => setShape("circle")}
                      title="Circular DP shape"
                      className={`p-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                        shape === "circle"
                          ? "bg-white text-indigo-600 shadow-xs"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      <Circle className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setShape("square")}
                      title="Square / Rounded Logo shape"
                      className={`p-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                        shape === "square"
                          ? "bg-white text-indigo-600 shadow-xs"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      <Square className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isUploading || isProcessing}
              className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold transition cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApplyCrop}
              disabled={isUploading || isProcessing}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/25 transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isUploading || isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Processing & Uploading...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Crop & Save Photo</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
