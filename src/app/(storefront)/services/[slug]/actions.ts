'use server';

import { revalidatePath } from 'next/cache';
import { createPublicServiceReview } from '@/lib/catalog/repository';
import { serviceReviewInputSchema } from '@/lib/validations/catalog';
import type { ServiceReviewRow } from '@/types/database';

export async function submitServiceReviewAction(input: {
  service_id: string;
  slug: string;
  reviewer_name: string;
  rating: number;
  comment: string;
}): Promise<{ ok: boolean; review?: ServiceReviewRow; error?: string }> {
  const parsed = serviceReviewInputSchema.safeParse({
    service_id: input.service_id,
    reviewer_name: input.reviewer_name,
    rating: input.rating,
    comment: input.comment,
  });

  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return {
      ok: false,
      error: firstIssue?.message ?? 'Invalid review input.',
    };
  }

  try {
    const review = await createPublicServiceReview(parsed.data);
    revalidatePath(`/services/${input.slug}`);
    return { ok: true, review };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Could not submit review.',
    };
  }
}

