
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";

export interface BentoItemProps {
  id: string | number;
  title: string;
  description: string;
  image: string;
  category: string;
  fullDescription?: string;
  technologies?: string[];
  galleryImages?: string[];
  link?: string;
}

interface BentoBoxProps {
  items: BentoItemProps[];
  className?: string;
}

const BentoBox: React.FC<BentoBoxProps> = ({ items, className = "" }) => {
  const [selectedItem, setSelectedItem] = useState<BentoItemProps | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Handle the dialog opening
  const handleItemClick = (item: BentoItemProps) => {
    setSelectedItem(item);
    setCurrentImageIndex(0);
  };

  // Handle gallery navigation
  const nextImage = () => {
    if (!selectedItem?.galleryImages) return;
    setCurrentImageIndex((prev) => 
      prev === selectedItem.galleryImages!.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    if (!selectedItem?.galleryImages) return;
    setCurrentImageIndex((prev) => 
      prev === 0 ? selectedItem.galleryImages!.length - 1 : prev - 1
    );
  };

  // Define column spans for different items to create an interesting layout
  const getSpan = (index: number) => {
    // First item spans 2 columns and 2 rows
    if (index === 0) return "md:col-span-2 md:row-span-2";
    // Every 3rd item (after the first) spans 2 columns
    if ((index - 1) % 3 === 0) return "md:col-span-2";
    // Every 5th item spans 2 rows
    if ((index) % 5 === 0) return "md:row-span-2";
    // Default is 1 column, 1 row
    return "";
  };

  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${className}`}>
      {items.map((item, index) => (
        <motion.div
          key={item.id}
          className={`group overflow-hidden rounded-xl ${getSpan(index)} relative cursor-pointer bg-white shadow-md hover:shadow-xl transition-all duration-300`}
          onClick={() => handleItemClick(item)}
          whileHover={{ y: -5 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <div className="aspect-video w-full h-full overflow-hidden">
            <img 
              src={item.image} 
              alt={item.title} 
              className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
              <h3 className="text-white text-lg md:text-xl font-bold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{item.title}</h3>
              <p className="text-white/80 text-sm md:text-base mt-2 line-clamp-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">{item.description}</p>
            </div>
          </div>
        </motion.div>
      ))}

      {/* Project Details Dialog */}
      <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selectedItem?.title}</DialogTitle>
            <DialogDescription className="text-brand-600">
              {selectedItem?.category.charAt(0).toUpperCase() + selectedItem?.category.slice(1)}
            </DialogDescription>
          </DialogHeader>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>

          {/* Image Gallery */}
          {selectedItem?.galleryImages && selectedItem.galleryImages.length > 0 ? (
            <div className="relative aspect-video overflow-hidden rounded-lg mb-4">
              <img
                src={selectedItem.galleryImages[currentImageIndex] || selectedItem.image}
                alt={`${selectedItem.title} gallery image ${currentImageIndex + 1}`}
                className="w-full h-full object-cover object-center"
              />
              
              {selectedItem.galleryImages.length > 1 && (
                <>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 rounded-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      prevImage();
                    }}
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 rounded-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      nextImage();
                    }}
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                  
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
                    {selectedItem.galleryImages.map((_, idx) => (
                      <span 
                        key={idx} 
                        className={`w-2 h-2 rounded-full ${idx === currentImageIndex ? 'bg-white' : 'bg-white/50'}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="aspect-video rounded-lg overflow-hidden mb-4">
              <img 
                src={selectedItem?.image} 
                alt={selectedItem?.title} 
                className="w-full h-full object-cover object-center"
              />
            </div>
          )}

          {/* Project Details */}
          <div className="space-y-4">
            {selectedItem?.fullDescription && (
              <div>
                <h4 className="text-lg font-semibold mb-2">Descriere</h4>
                <p className="text-gray-700">{selectedItem.fullDescription}</p>
              </div>
            )}
            
            {selectedItem?.technologies && selectedItem.technologies.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold mb-2">Tehnologii</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedItem.technologies.map((tech, idx) => (
                    <span 
                      key={idx} 
                      className="inline-block px-3 py-1 rounded-full bg-brand-100 text-brand-700 text-sm font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* External Link */}
          {selectedItem?.link && (
            <div className="mt-4 flex justify-end">
              <Button 
                variant="outline"
                onClick={() => window.open(selectedItem.link, '_blank')}
                className="flex items-center gap-2"
              >
                Vizitează site-ul <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BentoBox;
export type { BentoItemProps };
