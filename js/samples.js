/**
 * Sample JSON payloads for TypeForge Studio
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.TypeSamples = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const SAMPLES = {
    ecommerceOrder: {
      name: 'E-Commerce Order API',
      data: {
        orderId: 'ord_984128574',
        orderNumber: '#US-88219',
        status: 'fulfilled',
        createdAt: '2026-10-22T14:32:00Z',
        currency: 'USD',
        isGift: false,
        customer: {
          id: 'cust_4821',
          name: 'Sarah Connor',
          email: 'sarah.connor@cyberdyne.org',
          loyaltyTier: 'platinum',
          totalOrders: 14
        },
        shippingAddress: {
          street: '100 Sunset Blvd',
          city: 'Los Angeles',
          state: 'CA',
          postalCode: '90028',
          country: 'US'
        },
        items: [
          {
            sku: 'PRO-HEADSET-01',
            title: 'Wireless Studio Headphones',
            unitPrice: 199.99,
            quantity: 1,
            taxable: true,
            tags: ['audio', 'bluetooth', 'pro']
          },
          {
            sku: 'CABLE-TYPEC-2M',
            title: 'Braided USB-C Cable (2m)',
            unitPrice: 14.50,
            quantity: 2,
            taxable: true,
            tags: ['accessories']
          }
        ],
        pricingSummary: {
          subtotal: 228.99,
          shippingCost: 0.00,
          discountAmount: 20.00,
          taxAmount: 18.81,
          total: 227.80
        }
      }
    },
    githubRepo: {
      name: 'GitHub Repository API',
      data: {
        id: 72948102,
        node_id: 'MDEwOlJlcG9zaXRvcnk3Mjk0ODEwMg==',
        name: 'super-engine',
        full_name: 'acme-corp/super-engine',
        private: false,
        owner: {
          login: 'acme-corp',
          id: 12048,
          avatar_url: 'https://avatars.githubusercontent.com/u/12048',
          type: 'Organization',
          site_admin: false
        },
        html_url: 'https://github.com/acme-corp/super-engine',
        description: 'Next-generation high-performance computing runtime',
        fork: false,
        stargazers_count: 14250,
        watchers_count: 320,
        language: 'Rust',
        has_issues: true,
        has_projects: true,
        has_wiki: false,
        topics: ['rust', 'runtime', 'async', 'distributed-systems'],
        license: {
          key: 'mit',
          name: 'MIT License',
          spdx_id: 'MIT'
        }
      }
    },
    stripePayment: {
      name: 'Stripe Payment Intent',
      data: {
        id: 'pi_3MtwBwLkdIwHu7ix28a3tqPa',
        object: 'payment_intent',
        amount: 10999,
        amount_received: 10999,
        capture_method: 'automatic',
        client_secret: 'pi_3MtwBwLkdIwHu7ix28a3tqPa_secret_test',
        currency: 'usd',
        livemode: false,
        status: 'succeeded',
        payment_method: 'pm_1MtwBwLkdIwHu7ix308K39',
        metadata: {
          cart_id: 'cart_098213',
          internal_user_id: 'usr_8820'
        },
        charges: {
          total_count: 1,
          has_more: false,
          data: [
            {
              id: 'ch_3MtwBwLkdIwHu7ix28a3tqPa',
              amount: 10999,
              paid: true,
              receipt_url: 'https://pay.stripe.com/receipts/acct_1032/ch_3Mtw/rcpt_test'
            }
          ]
        }
      }
    }
  };

  return {
    SAMPLES,
    getDefaultSample: () => JSON.parse(JSON.stringify(SAMPLES.ecommerceOrder.data))
  };
});
