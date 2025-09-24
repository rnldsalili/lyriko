/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAuth } from '@/api/lib/auth';

import type { Env } from '@/api/index';
import type { Context } from 'hono';

/**
 * Merges the main application OpenAPI schema with Better Auth's OpenAPI schema
 */
export async function getMergedOpenAPISchema(c: Context<Env>, mainSchema: any) {
  try {
    // Get Better Auth OpenAPI schema
    const auth = createAuth(c);
    const authSchema = await auth.api.generateOpenAPISchema();

    // Rename "Default" tag to "Auth" in Better Auth schema
    if (authSchema.tags) {
      authSchema.tags = authSchema.tags.map((tag: any) =>
        tag.name === 'Default'
          ? {
              ...tag,
              name: 'Auth',
              description: 'Authentication endpoints provided by Better Auth',
            }
          : tag,
      );
    }

    // Filter and prefix auth schema paths - only include email/password and Google auth endpoints
    const allowedAuthPaths = [
      '/sign-in/email', // Email/password sign in
      '/sign-up/email', // Email/password sign up
      '/sign-out', // Sign out
      '/get-session', // Get current session
      '/sign-in/social', // Social (Google) sign in
    ];

    const prefixedAuthPaths: any = {};
    if (authSchema.paths) {
      Object.keys(authSchema.paths).forEach((path) => {
        console.log(path);
        // Only include allowed authentication paths
        if (allowedAuthPaths.includes(path)) {
          const prefixedPath = `/api/auth${path}`;
          const pathObj = (authSchema.paths as any)[path];

          // Update operation tags from "Default" to "Auth"
          Object.keys(pathObj).forEach((method) => {
            const operation = (pathObj as any)[method];
            if (operation.tags && operation.tags.includes('Default')) {
              operation.tags = operation.tags.map((tag: string) =>
                tag === 'Default' ? 'Auth' : tag,
              );
            }
          });

          prefixedAuthPaths[prefixedPath] = pathObj;
        }
      });
    }

    // Update authSchema to use prefixed paths
    authSchema.paths = prefixedAuthPaths;

    // Manual merge to avoid path modification issues
    const mergedSchema = {
      ...mainSchema,
      paths: {
        ...mainSchema.paths,
        ...authSchema.paths,
      },
      tags: [...(mainSchema.tags || []), ...(authSchema.tags || [])],
      components: {
        ...(mainSchema.components || {}),
        ...(authSchema.components || {}),
        schemas: {
          ...(mainSchema.components?.schemas || {}),
          ...(authSchema.components?.schemas || {}),
        },
      },
    };
    mergedSchema.info = {
      ...mergedSchema.info,
      title: 'Lyriko API',
      description:
        'A comprehensive music lyrics platform API with authentication, built with Hono and OpenAPI',
    };

    return mergedSchema;
  } catch (error) {
    console.error('Error merging OpenAPI schemas:', error);
    // Return main schema as fallback
    return mainSchema;
  }
}

/**
 * Get Better Auth OpenAPI schema only (for debugging)
 */
export async function getBetterAuthSchema(c: Context<Env>) {
  try {
    const auth = createAuth(c);
    return await auth.api.generateOpenAPISchema();
  } catch (error) {
    console.error('Error generating Better Auth schema:', error);
    return null;
  }
}
