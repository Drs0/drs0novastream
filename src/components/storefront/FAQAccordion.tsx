'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronDown, ChevronUp } from 'lucide-react';
import styles from './FAQAccordion.module.scss';

export function FAQAccordion() {
  const homeT = useTranslations('home');
  const faqT = useTranslations('faq');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const items = [
    { q: faqT('q1'), a: faqT('a1') },
    { q: faqT('q2'), a: faqT('a2') },
    { q: faqT('q3'), a: faqT('a3') },
    { q: faqT('q4'), a: faqT('a4') },
  ];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>{homeT('faqTitle')}</h2>
          <p className={styles.subtitle}>{homeT('faqSubtitle')}</p>
        </div>

        <div className={styles.list}>
          {items.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx} className={styles.item}>
                <button
                  type="button"
                  className={styles.trigger}
                  aria-expanded={isOpen}
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                >
                  <span>{item.q}</span>
                  {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {isOpen && <div className={styles.answer}>{item.a}</div>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

