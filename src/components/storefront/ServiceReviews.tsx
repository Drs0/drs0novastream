'use client';

import { useState, type FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import { Star } from 'lucide-react';
import type { Locale, ServiceReviewRow } from '@/types/database';
import { submitServiceReviewAction } from '@/app/(storefront)/services/[slug]/actions';
import styles from './ServiceReviews.module.scss';

interface ServiceReviewsProps {
  serviceId: string;
  serviceSlug: string;
  initialReviews: ServiceReviewRow[];
  locale: Locale;
}

export function ServiceReviews({
  serviceId,
  serviceSlug,
  initialReviews,
  locale,
}: ServiceReviewsProps) {
  const t = useTranslations('serviceDetail');
  const [reviews, setReviews] = useState<ServiceReviewRow[]>(initialReviews);
  const [name, setName] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState('');
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const totalCount = reviews.length;
  const averageRating =
    totalCount > 0
      ? Number(
          (
            reviews.reduce((sum, item) => sum + item.rating, 0) / totalCount
          ).toFixed(1)
        )
      : 0;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const trimmedName = name.trim();
    const trimmedComment = comment.trim();
    if (!trimmedName || trimmedComment.length < 2 || rating < 1 || rating > 5) {
      setErrorMsg(t('reviewErrorRequired'));
      return;
    }

    setSubmitting(true);
    try {
      const result = await submitServiceReviewAction({
        service_id: serviceId,
        slug: serviceSlug,
        reviewer_name: trimmedName,
        rating,
        comment: trimmedComment,
      });

      if (!result.ok || !result.review) {
        setErrorMsg(result.error ?? t('reviewErrorRequired'));
        return;
      }

      setReviews((prev) => [result.review!, ...prev]);
      setName('');
      setRating(5);
      setComment('');
      setSuccessMsg(t('reviewSubmittedToast'));
    } finally {
      setSubmitting(false);
    }
  }

  function formatReviewDate(isoDate: string): string {
    try {
      const date = new Date(isoDate);
      const localeTag =
        locale === 'ar' ? 'ar-MA' : locale === 'fr' ? 'fr-MA' : 'en-US';
      return new Intl.DateTimeFormat(localeTag, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }).format(date);
    } catch {
      return '';
    }
  }

  const displayedStars = hoverRating ?? rating;

  return (
    <section className={styles.reviewsSection} aria-labelledby="reviews-heading">
      <div className={styles.headerRow}>
        <h2 id="reviews-heading" className={styles.sectionTitle}>
          {t('reviewsHeading')}
        </h2>

        {totalCount > 0 && (
          <div className={styles.summaryBadge}>
            <span className={styles.avgNumber}>{averageRating.toFixed(1)}</span>
            <span className={styles.starsInline} aria-hidden="true">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={16}
                  className={
                    star <= Math.round(averageRating)
                      ? styles.starFilled
                      : styles.starEmpty
                  }
                />
              ))}
            </span>
            <span className={styles.countText}>
              ({t('reviewsCount', { count: totalCount })})
            </span>
          </div>
        )}
      </div>

      <div className={styles.reviewsLayout}>
        <form onSubmit={handleSubmit} className={styles.formCard} noValidate>
          <h3 className={styles.formTitle}>{t('writeReviewTitle')}</h3>

          <div className={styles.fieldGroup}>
            <label htmlFor="reviewer-name-input" className={styles.fieldLabel}>
              {t('yourNameLabel')}
            </label>
            <input
              id="reviewer-name-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('yourNamePlaceholder')}
              maxLength={80}
              required
              className={styles.textInput}
            />
          </div>

          <div className={styles.fieldGroup}>
            <span className={styles.fieldLabel}>{t('yourRatingLabel')}</span>
            <div
              className={styles.starPicker}
              role="radiogroup"
              aria-label={t('yourRatingLabel')}
              onMouseLeave={() => setHoverRating(null)}
            >
              {[1, 2, 3, 4, 5].map((star) => {
                const isActive = star <= displayedStars;
                return (
                  <button
                    key={star}
                    type="button"
                    role="radio"
                    aria-checked={rating === star}
                    aria-label={`${star} / 5`}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    className={`${styles.starBtn} ${
                      isActive ? styles.starBtnActive : ''
                    }`}
                  >
                    <Star
                      size={20}
                      className={
                        isActive ? styles.starFilled : styles.starEmpty
                      }
                    />
                  </button>
                );
              })}
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="reviewer-comment-input" className={styles.fieldLabel}>
              {t('yourMessageLabel')}
            </label>
            <textarea
              id="reviewer-comment-input"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={t('yourMessagePlaceholder')}
              maxLength={600}
              rows={3}
              required
              className={styles.textareaInput}
            />
          </div>

          {errorMsg && <p className={styles.feedbackError}>{errorMsg}</p>}
          {successMsg && <p className={styles.feedbackSuccess}>{successMsg}</p>}

          <button
            type="submit"
            disabled={submitting}
            className={styles.submitBtn}
          >
            {submitting ? t('submittingReview') : t('submitReviewBtn')}
          </button>
        </form>

        <div>
          {reviews.length === 0 ? (
            <div className={styles.emptyReviews}>{t('noReviewsYet')}</div>
          ) : (
            <div className={styles.reviewsGrid}>
              {reviews.map((rev) => {
                const initial =
                  rev.reviewer_name.trim().charAt(0).toUpperCase() || '★';
                return (
                  <article key={rev.id} className={styles.reviewCard}>
                    <div className={styles.reviewTopRow}>
                      <div className={styles.reviewerInfo}>
                        <span className={styles.avatarCircle} aria-hidden="true">
                          {initial}
                        </span>
                        <div className={styles.reviewerMeta}>
                          <span className={styles.reviewerName}>
                            {rev.reviewer_name}
                          </span>
                          <span className={styles.reviewDate}>
                            {formatReviewDate(rev.created_at)}
                          </span>
                        </div>
                      </div>

                      <div
                        className={styles.starsInline}
                        aria-label={`${rev.rating} / 5`}
                      >
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={15}
                            className={
                              star <= rev.rating
                                ? styles.starFilled
                                : styles.starEmpty
                            }
                          />
                        ))}
                      </div>
                    </div>

                    {rev.comment && (
                      <p className={styles.reviewComment}>{rev.comment}</p>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
