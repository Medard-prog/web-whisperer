
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

export interface BentoItem {
  id: string;
  title: string;
  description: string;
  image: string;
  category?: string;
  detailedDescription?: string;
  gallery?: string[];
  technologies?: string[];
  link?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

interface BentoProps {
  className?: string;
  items: BentoItem[];
}

const BentoBox: React.FC<BentoProps> = ({ className, items }) => {
  const [selectedItem, setSelectedItem] = useState<BentoItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleItemClick = (item: BentoItem) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full", className)}>
      {items.map((item) => (
        <motion.div
          key={item.id}
          onClick={() => handleItemClick(item)}
          className={cn(
            "group relative overflow-hidden rounded-xl bg-neutral-50 dark:bg-neutral-900 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer",
            {
              "col-span-1 row-span-1": item.size === "sm" || !item.size,
              "col-span-1 md:col-span-2 row-span-1": item.size === "md",
              "col-span-1 row-span-2": item.size === "lg",
              "col-span-1 md:col-span-2 row-span-2": item.size === "xl",
            }
          )}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ 
            duration: 0.3,
            delay: Math.random() * 0.3 
          }}
          whileHover={{ y: -5 }}
        >
          <div className="absolute inset-0">
            <img
              src={item.image}
              alt={item.title}
              className="h-full w-full object-cover transition-all duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          </div>

          <div className="relative z-10 flex h-full flex-col justify-end p-6">
            {item.category && (
              <span className="mb-2 inline-block rounded-full bg-purple-500 px-3 py-1 text-xs text-white">
                {item.category}
              </span>
            )}
            <h3 className="text-xl font-bold text-white">{item.title}</h3>
            <p className="mt-2 text-sm text-white/80">{item.description}</p>
          </div>

          <div className="absolute bottom-0 left-0 right-0 z-10 h-0 overflow-hidden transition-all duration-300 group-hover:h-12 bg-purple-500/80 flex items-center justify-center">
            <p className="text-white font-medium">Vezi detalii</p>
          </div>
        </motion.div>
      ))}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl">{selectedItem?.title}</DialogTitle>
              <button
                onClick={closeDialog}
                className="rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <DialogDescription className="text-sm text-gray-500 dark:text-gray-400">
              {selectedItem?.category && (
                <span className="mr-2 inline-block rounded-full bg-purple-500 px-3 py-1 text-xs text-white">
                  {selectedItem.category}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-6">
            {selectedItem?.gallery && selectedItem.gallery.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedItem.gallery.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${selectedItem.title} - Image ${index + 1}`}
                    className="rounded-lg object-cover w-full aspect-video"
                  />
                ))}
              </div>
            ) : (
              <img
                src={selectedItem?.image}
                alt={selectedItem?.title}
                className="rounded-lg object-cover w-full aspect-video"
              />
            )}

            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Descriere</h3>
              <p className="text-gray-700 dark:text-gray-300">
                {selectedItem?.detailedDescription || selectedItem?.description}
              </p>
            </div>

            {selectedItem?.technologies && selectedItem.technologies.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Tehnologii</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedItem.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="rounded-full bg-gray-100 dark:bg-gray-800 px-3 py-1 text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {selectedItem?.link && (
              <div className="pt-4">
                <a
                  href={selectedItem.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block rounded-lg bg-purple-500 px-4 py-2 text-white transition-colors hover:bg-purple-600"
                >
                  Vizitează website
                </a>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BentoBox;
