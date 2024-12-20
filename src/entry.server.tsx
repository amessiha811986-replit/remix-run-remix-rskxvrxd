import { Remix, renderOnServer, isBot, ABORT_DELAY } from './components/Remix';
import type { EntryContext } from '@remix-run/node';

export const handlers = renderOnServer(({ request, remixContext }) => (
  <Remix 
    type="Server" 
    serverOptions={{
      context: remixContext,
      url: request.url,
      abortDelay: ABORT_DELAY
    }}
  />
));

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  const { handleBotRequest, handleBrowserRequest } = handlers;
  return isBot(request)
    ? handleBotRequest(
        request,
        responseStatusCode,
        responseHeaders,
        remixContext
      )
    : handleBrowserRequest(
        request,
        responseStatusCode,
        responseHeaders,
        remixContext
      );
}