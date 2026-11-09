type PublishState = { isPublished: boolean; publishedAt: Date | null }

/**
 * Значение `publishedAt` для записи при сохранении.
 *
 * - `undefined` — поле менять не нужно (флаг не передан или статья уже опубликована:
 *   дата первой публикации не должна «прыгать» при каждой правке);
 * - `Date` — публикуем впервые (или повторно после снятия с публикации);
 * - `null` — снимаем с публикации.
 */
export function resolvePublishedAt(
  nextIsPublished: boolean | undefined,
  current: PublishState | null = null,
  now: Date = new Date(),
): Date | null | undefined {
  if (nextIsPublished === undefined) return undefined
  if (!nextIsPublished) return null
  if (current?.isPublished && current.publishedAt) return undefined
  return now
}
