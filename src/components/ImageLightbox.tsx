import { useEffect } from 'react'
import { X } from 'lucide-react'
import './ImageLightbox.css'

interface ImageLightboxProps {
    imageUrl: string | null
    altText?: string
    onClose: () => void
}

export default function ImageLightbox({ imageUrl, altText, onClose }: ImageLightboxProps) {
    // Prevent body scroll when lightbox is open
    useEffect(() => {
        if (imageUrl) {
            document.body.style.overflow = 'hidden'

            const handleEscape = (e: KeyboardEvent) => {
                if (e.key === 'Escape') onClose()
            }
            window.addEventListener('keydown', handleEscape)
            return () => window.removeEventListener('keydown', handleEscape)
        } else {
            document.body.style.overflow = 'auto'
        }

        return () => {
            document.body.style.overflow = 'auto'
        }
    }, [imageUrl, onClose])

    if (!imageUrl) return null

    return (
        <div className="lightbox-overlay" onClick={onClose}>
            <button className="lightbox-close" onClick={onClose} aria-label="Fechar">
                <X size={24} />
            </button>
            <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
                <img src={imageUrl} alt={altText || 'Imagem ampliada'} className="lightbox-image" />
            </div>
        </div>
    )
}
