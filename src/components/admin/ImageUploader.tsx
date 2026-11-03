'use client';

import { useState, type ChangeEvent } from 'react';
import { Upload, Trash2 } from 'lucide-react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { validateImageUpload } from '@/lib/validations/catalog';
import styles from './AdminUI.module.scss';

interface ImageUploaderProps {
  coverImagePath: string;
  galleryPaths: string[];
  onChangeCover: (path: string) => void;
  onChangeGallery: (paths: string[]) => void;
}

const PRESET_IMAGES = [
  '/images/services/ps-plus-cover.svg',
  '/images/services/football-game-cover.svg',
  '/images/services/game-pass-cover.svg',
  '/images/services/music-sub-cover.svg',
  '/images/services/cinema-stream-cover.svg',
];

export function ImageUploader({
  coverImagePath,
  galleryPaths,
  onChangeCover,
  onChangeGallery,
}: ImageUploaderProps) {
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [galleryInput, setGalleryInput] = useState('');

  async function handleFileSelect(e: ChangeEvent<HTMLInputElement>) {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImageUpload({
      name: file.name,
      type: file.type,
      size: file.size,
    });

    if (!validation.valid) {
      setUploadError(validation.error ?? 'Invalid image file.');
      return;
    }

    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      setUploadError(
        'Supabase Storage is not configured in .env.local. You can enter a public path or select a preset image below.'
      );
      return;
    }

    setUploading(true);
    try {
      const ext = file.name.split('.').pop()?.toLowerCase() || 'webp';
      const safeFolder = 'services';
      const uniqueName = `${safeFolder}/${Date.now()}-${crypto.randomUUID()}.${ext}`;

      const { error } = await supabase.storage
        .from('service-images')
        .upload(uniqueName, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type,
        });

      if (error) {
        setUploadError(error.message);
        return;
      }

      const { data: pubUrl } = supabase.storage
        .from('service-images')
        .getPublicUrl(uniqueName);

      if (pubUrl?.publicUrl) {
        onChangeCover(pubUrl.publicUrl);
        if (!galleryPaths.includes(pubUrl.publicUrl)) {
          onChangeGallery([...galleryPaths, pubUrl.publicUrl]);
        }
      }
    } finally {
      setUploading(false);
    }
  }

  function handleAddGalleryPath() {
    const trimmed = galleryInput.trim();
    if (!trimmed) return;
    if (!galleryPaths.includes(trimmed)) {
      onChangeGallery([...galleryPaths, trimmed]);
    }
    setGalleryInput('');
  }

  return (
    <div className={styles.panelCard}>
      <div className={styles.panelHeader}>
        <h3 className={styles.panelTitle}>Images &amp; Supabase Storage</h3>
      </div>

      <div className={styles.formGrid}>
        <div className={styles.field}>
          <label className={styles.label}>Cover Image Path or URL</label>
          <input
            type="text"
            value={coverImagePath}
            onChange={(e) => onChangeCover(e.target.value)}
            placeholder="/images/services/ps-plus-cover.svg"
            className={styles.input}
          />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.35rem' }}>
            {PRESET_IMAGES.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => onChangeCover(preset)}
                className={styles.secondaryBtn}
                style={{ minHeight: '1.9rem', padding: '0.2rem 0.55rem', fontSize: '0.75rem' }}
              >
                {preset.split('/').pop()}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>
            Upload to Bucket (<code>service-images</code> — WebP, AVIF, PNG, JPEG ≤ 5MB)
          </label>
          <label className={styles.secondaryBtn} style={{ width: 'fit-content' }}>
            <Upload size={16} />
            <span>{uploading ? 'Uploading...' : 'Choose Image File'}</span>
            <input
              type="file"
              accept="image/webp,image/avif,image/png,image/jpeg"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
              disabled={uploading}
            />
          </label>
          {uploadError && (
            <span style={{ color: '#f87171', fontSize: '0.82rem' }}>
              {uploadError}
            </span>
          )}
        </div>

        <div className={styles.fieldFull}>
          <label className={styles.label}>Gallery Images</label>
          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <input
              type="text"
              value={galleryInput}
              onChange={(e) => setGalleryInput(e.target.value)}
              placeholder="Add gallery image URL or path..."
              className={styles.input}
            />
            <button
              type="button"
              onClick={handleAddGalleryPath}
              className={styles.secondaryBtn}
            >
              Add
            </button>
          </div>

          {galleryPaths.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '0.75rem' }}>
              {galleryPaths.map((path, idx) => (
                <div
                  key={path + idx}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.35rem 0.65rem',
                    borderRadius: '0.5rem',
                    background: '#070b14',
                    border: '1px solid rgba(148,163,184,0.2)',
                    fontSize: '0.8rem',
                  }}
                >
                  <span>{path}</span>
                  <button
                    type="button"
                    onClick={() =>
                      onChangeGallery(galleryPaths.filter((_, i) => i !== idx))
                    }
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#f87171',
                      cursor: 'pointer',
                    }}
                    aria-label="Remove gallery image"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

