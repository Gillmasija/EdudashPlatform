import { ChangeEvent, forwardRef } from "react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  accept?: string;
  onChange?: (file: File) => void;
  children?: React.ReactNode;
  className?: string;
}

export const FileUpload = forwardRef<HTMLInputElement, FileUploadProps>(
  ({ accept, onChange, children, className }, ref) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && onChange) {
        onChange(file);
      }
    };

    return (
      <div className={cn("flex items-center gap-2", className)}>
        <input
          type="file"
          accept={accept}
          onChange={handleChange}
          ref={ref}
          className="hidden"
          id="file-upload"
        />
        <label htmlFor="file-upload">
          {children || (
            <Button type="button" variant="outline">
              Choose File
            </Button>
          )}
        </label>
      </div>
    );
  }
);

FileUpload.displayName = "FileUpload";
