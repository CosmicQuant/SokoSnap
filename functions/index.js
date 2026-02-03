const { onRequest } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

exports.shareLink = onRequest({ region: "us-central1" }, async (req, res) => {
    // Path format: /store/shopSlug/productSlug
    // Example: /store/my-shop/super-sneakers

    const parts = req.path.split('/').filter(Boolean);
    // parts[0] is 'store'
    // parts[1] is shopSlug
    // parts[2] is productSlug (optional)

    const shopSlug = parts[1];
    const productSlug = parts[2];
    const projectID = process.env.GCLOUD_PROJECT || "sokosnap-7416e";

    try {
        // 1. Fetch the hosted index.html to use as a template
        // This allows us to serve the full React app while modifying just the HEAD
        const indexResponse = await fetch(`https://${projectID}.web.app/index.html`);
        let html = await indexResponse.text();

        if (!productSlug) {
            // --- STORE VIEW ---
            // TODO: Look up shop/user by slug if possible. 
            // For now, serve generic store metadata or fallback.
            // If we had 'users' collection with 'shopSlug' field, we'd query it here.

            // Just return the app as is for store root, or customize title
            html = html.replace(
                /<title>.*<\/title>/,
                `<title>${shopSlug ? shopSlug + ' Store' : 'SokoSnap Store'}</title>`
            );
            res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
            res.send(html);
            return;
        }

        // --- PRODUCT VIEW ---
        // 2. Query Firestore for the product data using the slug
        // Note: This requires the 'slug' field to be indexed/present on the product document.
        const q = await db.collection('products')
            .where('slug', '==', productSlug)
            .limit(1)
            .get();

        if (q.empty) {
            console.log(`Product not found for slug: ${productSlug}`);
            // Serve the app anyway, maybe the client router can handle 404 or verify
            res.send(html);
            return;
        }

        const data = q.docs[0].data();
        const productName = data.name || 'Exclusive Deal';
        const sellerName = data.sellerName || 'Verified Seller';
        const price = data.price ? `KES ${data.price.toLocaleString()}` : '';
        const rawDesc = data.description || 'Check out this amazing product.';
        const image = data.img || data.mediaUrl || '';

        // --- PRO CONVERSION OPTIMIZATION ---
        // 1. Title: Front-load value. Price + Product + Social Proof (Seller)
        // Format: "KES 4,500 | Air Jordan 1 by Eastleigh Kicks"
        // This allows users to see the price instantly in the preview card without clicking.
        const metaTitle = price
            ? `${price} | ${productName} by ${sellerName}`
            : `${productName} by ${sellerName}`;

        // 2. Description: Add Trust & CTA
        // Highlight M-Pesa Escrow (Trust) + Urgency or functionality
        const shortDesc = rawDesc.length > 120 ? rawDesc.substring(0, 117) + '...' : rawDesc;
        const metaDescription = `🛒 Buy securely with M-Pesa. ${shortDesc}`;

        // Replace Title
        html = html.replace(/<title>.*<\/title>/, `<title>${metaTitle}</title>`);

        // Replace OG Title (Facebook/WhatsApp/LinkedIn)
        html = html.replace(
            /<meta property="og:title" content="[^"]*" \/>/,
            `<meta property="og:title" content="${metaTitle}" />`
        );

        // Replace OG Description
        html = html.replace(
            /<meta property="og:description" content="[^"]*" \/>/,
            `<meta property="og:description" content="${metaDescription}" />`
        );

        // Replace OG Image
        if (html.includes('<meta property="og:image"')) {
            html = html.replace(
                /<meta property="og:image" content="[^"]*" \/>/,
                `<meta property="og:image" content="${image}" />`
            );
        } else {
            html = html.replace('</head>', `<meta property="og:image" content="${image}" />\n</head>`);
        }

        // Twitter Card support
        html = html.replace(
            /<meta name="twitter:title" content="[^"]*" \/>/,
            `<meta name="twitter:title" content="${metaTitle}" />`
        );
        html = html.replace(
            /<meta name="twitter:description" content="[^"]*" \/>/,
            `<meta name="twitter:description" content="${metaDescription}" />`
        );

        // Inject Twitter Image
        html = html.replace('</head>', `<meta name="twitter:image" content="${image}" />\n</head>`);

        res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
        res.send(html);

    } catch (error) {
        console.error("SSR Error:", error);
        // On error, serve the default app (CSR fallback)
        res.send("Error loading preview.");
    }
});
