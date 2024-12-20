import { isbot } from 'isbot';

export const empty = () => '';
export const userAgent = (request: Request) =>
  (request.headers.get('user-agent') || empty()) as string;
export const isBot = (request: Request) => isbot(userAgent(request));
export const ABORT_DELAY: number = 5000;