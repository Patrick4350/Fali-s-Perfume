'use client'

import { useRef, useState, useTransition } from 'react'
import Image from 'next/image'
import { Trash2, Upload } from 'lucide-react'
import { uploadProductMedia } from '@/lib/actions/products'
import { createClient } from '@/lib/supabase/client'

interface Media {
  id: string
  url: string
  type: 'image' | 'video'
  sort_order: number
}

interface MediaManagerProps {
  productId: string
  media: Media[]
}

export function MediaManager({ productId, media: initialMedia }: MediaManagerProps) {
  const [media, setMedia] = useState(initialMedia)
  const [uploading, startUpload] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return

    startUpload(async () => {
      setError(null)
      for (const file of files) {
        const fd = new FormData()
        fd.append('file', file)
        fd.append('product_id', productId)
        fd.append('position', String(media.length))
        const result = await uploadProductMedia(fd)
        if (result?.error) {
          setError(result.error)
          break
        }
        if (result?.url) {
          setMedia((prev) => [
            ...prev,
            {
              id: String(Date.now()),
              url: result.url!,
              type: (file.type.startsWith('video') ? 'video' : 'image') as 'image' | 'video',
              sort_order: prev.length,
            },
          ])
        }
      }
      if (inputRef.current) inputRef.current.value = ''
    })
  }

  const handleDelete = async (mediaId: string, storagePath?: string) => {
    const supabase = createClient()
    await supabase.from('product_media').delete().eq('id', mediaId)
    if (storagePath) await supabase.storage.from('product-media').remove([storagePath])
    setMedia((prev) => prev.filter((m) => m.id !== mediaId))
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
        {media
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((item) => (
            <div
              key={item.id}
              className="group relative aspect-square overflow-hidden rounded-md bg-[var(--muted)]"
            >
              {item.type === 'image' ? (
                <Image src={item.url} alt="" fill className="object-cover" sizes="120px" />
              ) : (
                <video src={item.url} className="h-full w-full object-cover" />
              )}
              <button
                onClick={() => handleDelete(item.id)}
                className="absolute top-1 right-1 hidden rounded bg-black/60 p-1 text-white transition-colors group-hover:flex hover:bg-red-600"
                aria-label="Remove media"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex aspect-square flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-[var(--border)] text-[var(--muted-foreground)] transition-colors hover:border-[var(--foreground)] hover:text-[var(--foreground)]"
          aria-label="Upload media"
        >
          <Upload className="h-5 w-5" />
          <span className="text-xs">{uploading ? 'Uploading…' : 'Upload'}</span>
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        className="hidden"
        onChange={handleUpload}
      />

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}
