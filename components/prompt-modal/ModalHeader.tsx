import React from 'react';
import { Heart, X } from 'lucide-react';

interface ModalHeaderProps {
  category: string;
  title: string;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onClose: () => void;
}

const ModalHeader: React.FC<ModalHeaderProps> = ({ category, title, isFavorite, onToggleFavorite, onClose }) => {
  return (
    <div className="flex justify-between items-start mb-6">
      <div>
        <span className="text-xs uppercase tracking-widest text-stone-500 dark:text-stone-400 font-bold bg-stone-100 dark:bg-stone-800 px-3 py-1 rounded-full">
          {category}
        </span>
        <h2 className="serif text-4xl md:text-5xl font-medium text-stone-900 dark:text-stone-100 mt-4 leading-tight">
          {title}
        </h2>
      </div>
      <div className="flex items-center gap-1 shrink-0 ml-4">
        <button
          type="button"
          onClick={onToggleFavorite}
          className="p-3 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart
            size={22}
            className={isFavorite ? 'fill-red-500 text-red-500' : 'text-stone-400 dark:text-stone-500'}
          />
        </button>
        <button
          type="button"
          onClick={onClose}
          className="p-3 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
          aria-label="Close prompt modal"
        >
          <X size={24} />
        </button>
      </div>
    </div>
  );
};

export default React.memo(ModalHeader);
