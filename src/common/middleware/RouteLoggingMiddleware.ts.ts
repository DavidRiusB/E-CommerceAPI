import { NextFunction, Request, Response } from 'express';

export function RouteLoggingMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const date = new Date().toLocaleString(); // Format the date for logging

  // Log the request method and URL path
  console.log(
    `Executed method ${req.method} for route ${req.originalUrl} at ${date}`,
  );

  next(); // Ensure to call next() to pass control to the next middleware or route handler
}
