import { factories } from '@strapi/strapi';

function getBearerToken(authorizationHeader?: string) {
  if (!authorizationHeader) {
    return null;
  }

  const parts = authorizationHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }

  return parts[1];
}

export default factories.createCoreController('api::wishlist.wishlist', ({ strapi }) => ({
  async me(ctx) {
    const token = getBearerToken(ctx.request.header.authorization);

    if (!token) {
      return ctx.unauthorized('Lipseste token-ul de autentificare.');
    }

    let authPayload: { id?: number };

    try {
      authPayload = await strapi.plugin('users-permissions').service('jwt').verify(token);
    } catch {
      return ctx.unauthorized('Token invalid.');
    }

    if (!authPayload.id) {
      return ctx.unauthorized('Token invalid.');
    }

    const entries = await strapi.entityService.findMany('api::wishlist.wishlist', {
      filters: {
        userId: authPayload.id,
      },
      sort: ['id:desc'],
    });

    const productIds = [...new Set(entries.map((entry) => entry.productId).filter(Boolean))];
    const products = productIds.length
      ? await strapi.db.query('api::product.product').findMany({
          where: {
            id: {
              $in: productIds,
            },
          },
          populate: {
            category: true,
            images: true,
          },
        })
      : [];

    const productsMap = new Map(products.map((product) => [product.id, product]));

    ctx.body = {
      data: entries
        .map((entry) => ({
          ...entry,
          product: productsMap.get(entry.productId) || null,
        }))
        .filter((entry) => Boolean(entry.product)),
    };
  },

  async toggle(ctx) {
    const token = getBearerToken(ctx.request.header.authorization);

    if (!token) {
      return ctx.unauthorized('Lipseste token-ul de autentificare.');
    }

    let authPayload: { id?: number };

    try {
      authPayload = await strapi.plugin('users-permissions').service('jwt').verify(token);
    } catch {
      return ctx.unauthorized('Token invalid.');
    }

    if (!authPayload.id) {
      return ctx.unauthorized('Token invalid.');
    }

    const productId = Number((ctx.request.body as { productId?: number }).productId);
    if (!productId) {
      return ctx.badRequest('productId lipseste sau este invalid.');
    }

    const product = await strapi.entityService.findOne('api::product.product', productId, {
      fields: ['id'],
    });

    if (!product) {
      return ctx.badRequest('Produs inexistent.');
    }

    const existing = await strapi.entityService.findMany('api::wishlist.wishlist', {
      filters: {
        userId: authPayload.id,
        productId,
      },
      fields: ['id'],
      pagination: {
        pageSize: 1,
      },
    });

    if (existing.length > 0) {
      await strapi.entityService.delete('api::wishlist.wishlist', existing[0].id);
      ctx.body = { data: { active: false } };
      return;
    }

    await strapi.entityService.create('api::wishlist.wishlist', {
      data: {
        userId: authPayload.id,
        productId,
      },
    });

    ctx.body = { data: { active: true } };
  },
}));
