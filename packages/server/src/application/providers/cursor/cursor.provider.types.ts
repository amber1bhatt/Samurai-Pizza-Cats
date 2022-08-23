import { Pizza } from '../pizzas/pizzas.provider.types';

export interface Cursor {
  results: Pizza[];
  totalCount: number;
  hasNextPage: boolean;
  cursor: string;
}

export interface CursorInput {
  cursor: string;
  limit: number;
}
