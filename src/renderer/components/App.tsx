import React, { useState, useRef, useCallback } from "react";
import {
  ImageIcon,
  UploadCloudIcon,
  Trash2Icon,
  DownloadIcon,
  FolderOpenIcon,
  ZapIcon,
  CheckCircle2Icon,
  XCircleIcon,
  FileImageIcon,
  SettingsIcon,
  DownloadCloudIcon,
} from "lucide-react";

import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { Progress } from "./ui/progress";
import { Switch } from "./ui/switch";
import { Separator } from "./ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "./ui/empty";
import { cn } from "@/src/renderer/lib/utils";

type CompressionStatus = "idle" | "compressing" | "done" | "error";

interface ImageFile {
  id: string;
  name: string;
  originalSize: number;
  compressedSize: number | null;
  preview: string;
  status: CompressionStatus;
  progress: number;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function savings(original: number, compressed: number): string {
  const pct = ((original - compressed) / original) * 100;
  return `${pct.toFixed(0)}%`;
}

function StatusBadge({ status }: { status: CompressionStatus }) {
  if (status === "idle")
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
        Queued
      </span>
    );
  if (status === "compressing")
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
        <ZapIcon className="size-3 animate-pulse" />
        Compressing
      </span>
    );
  if (status === "done")
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
        <CheckCircle2Icon className="size-3" />
        Done
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900/30 dark:text-red-400">
      <XCircleIcon className="size-3" />
      Error
    </span>
  );
}

const App: React.FC = () => {
  const [files, setFiles] = useState<ImageFile[]>([]);
  const [quality, setQuality] = useState(80);
  const [outputFormat, setOutputFormat] = useState("original");
  const [stripMeta, setStripMeta] = useState(true);
  const [resizeEnabled, setResizeEnabled] = useState(false);
  const [maxWidth, setMaxWidth] = useState("1920");
  const [isDragOver, setIsDragOver] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const compressButtonRef = useRef<HTMLButtonElement>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => setIsDragOver(false), []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selected = e.target.files;
      if (!selected || selected.length === 0) return;

      const newItems: ImageFile[] = Array.from(selected)
        .filter((file) => file.type.startsWith("image/"))
        .map((file) => ({
          id: `${file.name}-${file.size}-${file.lastModified}-${crypto.randomUUID()}`,
          name: file.name,
          originalSize: file.size,
          compressedSize: null,
          preview: URL.createObjectURL(file),
          status: "idle",
          progress: 0,
        }));

      setFiles((prev) => [...prev, ...newItems]);

      e.target.value = "";
    },
    [],
  );

  const removeFile = (id: string) =>
    setFiles((prev) => prev.filter((f) => f.id !== id));

  const doneFiles = files.filter((f) => f.status === "done");
  const totalOriginal = files.reduce((s, f) => s + f.originalSize, 0);
  const totalCompressed = doneFiles.reduce(
    (s, f) => s + (f.compressedSize ?? 0),
    0,
  );
  const overallProgress =
    files.length === 0
      ? 0
      : Math.round(files.reduce((s, f) => s + f.progress, 0) / files.length);

  return (
    <TooltipProvider>
      <div className="flex h-screen flex-col overflow-hidden bg-background text-foreground">
        <header className="flex h-12 shrink-0 items-center justify-between border-b px-4">
          <div className="flex items-center gap-2">
            <ImageIcon className="size-5 text-primary" />
            <span className="text-sm font-semibold tracking-tight">
              ImagePress
            </span>
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
              BETA
            </span>
          </div>
          <div className="flex items-center gap-2">
            {doneFiles.length > 0 && (
              <Button size="sm" variant="default" className="gap-1.5">
                <DownloadCloudIcon className="size-3.5" />
                Export All ({doneFiles.length})
              </Button>
            )}
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          <main className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
            <div
              ref={dropRef}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={cn(
                "rounded-lg border-2 border-dashed transition-colors",
                isDragOver
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50",
              )}
            >
              <Empty className="py-8">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <UploadCloudIcon className="size-5" />
                  </EmptyMedia>
                  <EmptyTitle>Drop images here</EmptyTitle>
                  <EmptyDescription>
                    PNG, JPG, WEBP or AVIF — up to 50 MB each
                  </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  <form>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      ref={fileInputRef}
                      id="file-input"
                      onChange={handleFileSelect}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="gap-1.5"
                      onClick={() => {
                        fileInputRef.current?.click();
                      }}
                    >
                      <FolderOpenIcon className="size-3.5" />
                      Browse Files
                    </Button>
                  </form>
                </EmptyContent>
              </Empty>
            </div>

            {files.length > 0 && (
              <div className="shrink-0 flex flex-wrap items-center gap-4 rounded-lg border bg-muted/30 px-4 py-2.5 text-sm">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Files
                  </span>
                  <span className="font-semibold">{files.length}</span>
                </div>
                <Separator orientation="vertical" className="h-8" />
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Original
                  </span>
                  <span className="font-semibold">
                    {formatBytes(totalOriginal)}
                  </span>
                </div>
                <Separator orientation="vertical" className="h-8" />
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Compressed
                  </span>
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    {totalCompressed > 0 ? formatBytes(totalCompressed) : "—"}
                  </span>
                </div>
                {totalCompressed > 0 && (
                  <>
                    <Separator orientation="vertical" className="h-8" />
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        Saved
                      </span>
                      <span className="font-semibold text-primary">
                        {savings(totalOriginal, totalCompressed)} smaller
                      </span>
                    </div>
                  </>
                )}
                <div className="ml-auto flex flex-1 flex-col gap-1 min-w-32">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Overall</span>
                    <span>{overallProgress}%</span>
                  </div>
                  <Progress value={overallProgress} className="h-1.5" />
                </div>
              </div>
            )}

            {files.length > 0 && (
              <div className="flex flex-col gap-2">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center gap-3 rounded-lg border bg-card px-3 py-2.5 shadow-sm"
                  >
                    <div className="size-10 shrink-0 overflow-hidden rounded-md border bg-muted">
                      <img
                        src={file.preview}
                        alt={file.name}
                        className="size-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    </div>

                    <div className="flex flex-1 flex-col gap-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate text-sm font-medium">
                          {file.name}
                        </span>
                        <StatusBadge status={file.status} />
                      </div>
                      <div className="flex items-center gap-2">
                        {file.status === "compressing" ? (
                          <Progress
                            value={file.progress}
                            className="h-1 flex-1"
                          />
                        ) : (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{formatBytes(file.originalSize)}</span>
                            {file.compressedSize && (
                              <>
                                <span>→</span>
                                <span className="text-green-600 dark:text-green-400 font-medium">
                                  {formatBytes(file.compressedSize)}
                                </span>
                                <span className="text-primary font-medium">
                                  (
                                  {savings(
                                    file.originalSize,
                                    file.compressedSize,
                                  )}{" "}
                                  saved)
                                </span>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-1">
                      {file.status === "done" && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="size-7"
                            >
                              <DownloadIcon className="size-3.5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Download</TooltipContent>
                        </Tooltip>
                      )}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="size-7 text-muted-foreground hover:text-destructive"
                            onClick={() => removeFile(file.id)}
                          >
                            <Trash2Icon className="size-3.5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Remove</TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {files.length === 0 && (
              <div className="flex flex-1 items-center justify-center">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <FileImageIcon className="size-10 opacity-20" />
                  <p className="text-sm">No images added yet</p>
                </div>
              </div>
            )}
          </main>

          <aside className="flex w-64 shrink-0 flex-col gap-0 overflow-y-auto border-l">
            <div className="flex items-center gap-2 border-b px-4 py-3">
              <SettingsIcon className="size-4 text-muted-foreground" />
              <span className="text-sm font-semibold">Settings</span>
            </div>

            <div className="flex flex-col gap-5 px-4 py-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Output Format
                </label>
                <Select value={outputFormat} onValueChange={setOutputFormat}>
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="original">Same as original</SelectItem>
                    <SelectItem value="jpeg">JPEG</SelectItem>
                    <SelectItem value="png">PNG</SelectItem>
                    <SelectItem value="webp">WebP</SelectItem>
                    <SelectItem value="avif">AVIF</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Quality
                  </label>
                  <span className="text-sm font-semibold tabular-nums">
                    {quality}%
                  </span>
                </div>
                <Slider
                  min={10}
                  max={100}
                  step={1}
                  value={[quality]}
                  onValueChange={([v]) => setQuality(v)}
                  className="w-full"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>Smaller file</span>
                  <span>Better quality</span>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium">Strip metadata</span>
                  <span className="text-xs text-muted-foreground">
                    Remove EXIF, GPS, etc.
                  </span>
                </div>
                <Switch checked={stripMeta} onCheckedChange={setStripMeta} />
              </div>

              <Separator />

              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium">Resize</span>
                    <span className="text-xs text-muted-foreground">
                      Limit max width
                    </span>
                  </div>
                  <Switch
                    checked={resizeEnabled}
                    onCheckedChange={setResizeEnabled}
                  />
                </div>
                {resizeEnabled && (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={maxWidth}
                      onChange={(e) => setMaxWidth(e.target.value)}
                      className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      placeholder="1920"
                    />
                    <span className="shrink-0 text-sm text-muted-foreground">
                      px
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-auto border-t p-4">
              <Button
                className="w-full gap-2"
                disabled={files.length === 0}
                size="default"
              >
                <ZapIcon className="size-4" />
                Compress{" "}
                {files.length > 0
                  ? `${files.length} image${files.length > 1 ? "s" : ""}`
                  : "Images"}
              </Button>
              {files.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-1.5 w-full text-muted-foreground"
                  onClick={() => setFiles([])}
                >
                  Clear all
                </Button>
              )}
            </div>
          </aside>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default App;
