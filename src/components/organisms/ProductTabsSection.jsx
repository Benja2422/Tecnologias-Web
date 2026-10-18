import { useState } from 'react';
import { Box, Link, Typography } from '@mui/material';
import TabBar from '../molecules/TabBar';
import QuestionForm from '../molecules/QuestionForm';
import QuestionItem from '../molecules/QuestionItem';
import ReviewItem from '../molecules/ReviewItem';
import RatingSummary from '../molecules/RatingSummary';
import { colors } from '../../utils/theme';

const PREVIEW_COUNT = 2;

const showMoreSx = { mt: 2, fontSize: 16, fontWeight: 600, fontFamily: 'inherit', color: colors.primary, textAlign: 'left' };

function ShowMore({ total, expanded, onToggle, noun }) {
  if (total <= PREVIEW_COUNT) return null;
  return (
    <Link component="button" type="button" underline="hover" onClick={onToggle} sx={showMoreSx}>
      {expanded ? `Mostrar menos ${noun}` : `Mostrar todas las ${noun}`}
    </Link>
  );
}

function DescriptionPanel({ product }) {
  return (
    <Box>
      <Typography sx={{ fontSize: 15, lineHeight: 1.6, color: '#555' }}>{product.description}</Typography>
      {product.features?.length > 0 && (
        <>
          <Typography sx={{ mt: 3, mb: 1.5, fontSize: 16, fontWeight: 600, color: colors.ink }}>Características principales:</Typography>
          <Box component="ul" sx={{ m: 0, p: 0, listStyle: 'none', display: 'grid', gap: 1.5 }}>
            {product.features.map((feature) => (
              <Box
                component="li"
                key={feature}
                sx={{
                  position: 'relative', pl: 1.9, fontSize: 15, color: '#555',
                  '&::before': { content: '""', position: 'absolute', left: 1, top: '0.65em', width: 4, height: 4, borderRadius: '50%', bgcolor: colors.primary },
                }}
              >
                {feature}
              </Box>
            ))}
          </Box>
        </>
      )}
    </Box>
  );
}

function QuestionsPanel({ questions, onAskQuestion }) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? questions : questions.slice(0, PREVIEW_COUNT);
  return (
    <Box>
      <QuestionForm onSubmit={onAskQuestion} />
      <Box sx={{ mt: 2 }}>
        {visible.length === 0 && (
          <Typography sx={{ py: 2, fontSize: 14, color: colors.muted }}>Aún no hay preguntas. ¡Sé el primero en preguntar!</Typography>
        )}
        {visible.map((q, i) => (
          <QuestionItem key={q.id} question={q.question} answer={q.answer} last={i === visible.length - 1} />
        ))}
      </Box>
      <ShowMore total={questions.length} expanded={expanded} onToggle={() => setExpanded((v) => !v)} noun="preguntas" />
    </Box>
  );
}

function ReviewsPanel({ reviews, rating, count }) {
  const [expanded, setExpanded] = useState(false);
  if (reviews.length === 0) {
    return <Typography sx={{ py: 1, fontSize: 14, color: colors.muted }}>Este producto aún no tiene reseñas.</Typography>;
  }
  const distribution = reviews.reduce((acc, r) => ({ ...acc, [r.rating]: (acc[r.rating] ?? 0) + 1 }), {});
  const visible = expanded ? reviews : reviews.slice(0, PREVIEW_COUNT);
  return (
    <Box sx={{ display: 'grid', gap: { xs: 4, md: 8 }, gridTemplateColumns: { xs: '1fr', md: 'minmax(260px, 320px) 1fr' }, alignItems: 'start' }}>
      <RatingSummary rating={rating} count={count} distribution={distribution} />
      <Box>
        {visible.map((review, i) => (
          <ReviewItem key={review.id} review={review} last={i === visible.length - 1} />
        ))}
        <ShowMore total={reviews.length} expanded={expanded} onToggle={() => setExpanded((v) => !v)} noun="reseñas" />
      </Box>
    </Box>
  );
}

/** Pestañas Descripción / Preguntas y respuestas / Reseñas. */
export default function ProductTabsSection({ product, questions, onAskQuestion, rating, reviewCount }) {
  const [tab, setTab] = useState('description');
  const tabs = [
    { id: 'description', label: 'Descripción' },
    { id: 'questions', label: 'Preguntas y respuestas' },
    { id: 'reviews', label: `Reseñas (${reviewCount})` },
  ];

  return (
    <Box component="section" aria-label="Detalles del producto">
      <TabBar tabs={tabs} value={tab} onChange={setTab} />
      <Box role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`} sx={{ pt: 4 }}>
        {tab === 'description' && <DescriptionPanel product={product} />}
        {tab === 'questions' && <QuestionsPanel questions={questions} onAskQuestion={onAskQuestion} />}
        {tab === 'reviews' && <ReviewsPanel reviews={product.reviews ?? []} rating={rating} count={reviewCount} />}
      </Box>
    </Box>
  );
}
