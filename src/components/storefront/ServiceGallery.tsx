'use client';

import { useState } from 'react';
import styles from './ServiceDetailClient.module.scss';

interface ServiceGalleryProps {
  coverImagePath: string | null;
  galleryPaths: string[];
  imageAlt: string;
}

export function ServiceGallery({
  coverImagePath,
  galleryPaths,
  imageAlt,
}: ServiceGalleryProps) {
  const images = Array.from(
    new Set(
      [coverImagePath, ...(galleryPaths ?? [])].filter((p): p is string =>
        Boolean(p)
      )
    )
  );
  const fallback = '/images/services/ps-plus-cover.svg';
  const list = images.length > 0 ? images : [fallback];
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className={styles.galleryWrapper}>
      <div className={styles.mainImageBox}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={list[activeIndex] ?? fallback}
          alt={imageAlt}
          className={styles.mainImage}
        />
      </div>

      {list.length > 1 && (
        <div className={styles.thumbRow}>
          {list.map((src, idx) => (
            <button
              key={src + idx}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={`${styles.thumbBtn} ${
                idx === activeIndex ? styles.thumbActive : ''
              }`}
              aria-label={`${imageAlt} ${idx + 1}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className={styles.thumbImg} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

